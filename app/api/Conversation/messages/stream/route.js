import { ConnectDB } from "@/libs/db";
import Messages from "@/models/Messages";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ---------------------------------------------------------------------------
// POST /api/Conversation/messages/stream
// Saves the user message, loads history, streams the assistant reply via SSE,
// then persists the full assistant message once the stream is complete.
// ---------------------------------------------------------------------------
export async function POST(req) {
  // Validate environment early
  if (!process.env.OPENAI_API_KEY) {
    console.error("[stream] OPENAI_API_KEY not configured");
    return NextResponse.json(
      { error: "AI service not configured" },
      { status: 500 },
    );
  }

  let conversation_id;
  let content;

  try {
    const body = await req.json();
    ({ conversation_id, content } = body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!conversation_id?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "conversation_id and content are required" },
      { status: 400 },
    );
  }

  try {
    await ConnectDB();
  } catch (err) {
    console.error("[stream] DB connection failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // 1. Save user message
  await Messages.create({
    conversation_id,
    role: "user",
    content: content.trim(),
  });

  // 2. Load conversation history (oldest → newest, capped at 20 turns)
  const history = await Messages.find({ conversation_id })
    .sort({ created_at: 1 })
    .limit(20)
    .lean();

  const formattedHistory = history.map(({ role, content }) => ({
    role,
    content,
  }));

  // 3. Build the SSE stream
  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      const send = (payload) =>
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
        );

      let assistantText = "";

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-5.4-mini", // ← correct model name
          messages: [
            {
              role: "system",
              content:
                "You are Blox, a helpful and friendly AI assistant. Respond clearly and concisely. Use markdown for code blocks and structured content.",
            },
            ...formattedHistory,
          ],
          stream: true,
          // IMPORTANT: GPT‑5.x models use max_completion_tokens, not max_tokens
          max_completion_tokens: 2048,
          temperature: 0.7,
        });

        for await (const chunk of completion) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (!delta) continue;
          assistantText += delta;
          send({ delta });
        }

        if (!assistantText.trim()) {
          throw new Error("Empty response from AI");
        }

        // 4. Persist assistant message
        const assistant = await Messages.create({
          conversation_id,
          role: "assistant",
          content: assistantText.trim(),
        });

        send({ done: true, assistant: { _id: assistant._id } });
        controller.close();
      } catch (err) {
        console.error("[stream] Error during streaming:", err);

        const isKnown = err?.message === "Empty response from AI";
        send({
          error: "stream_failed",
          message: isKnown
            ? "AI returned an empty response. Please try again."
            : "Failed to generate a response. Please try again.",
        });
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // disable Nginx buffering if behind a proxy
    },
  });
}
