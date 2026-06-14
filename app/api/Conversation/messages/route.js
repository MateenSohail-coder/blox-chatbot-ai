import { ConnectDB } from "@/libs/db";
import Messages from "@/models/Messages";
import { NextResponse } from "next/server";
import OpenAI from "openai";
export async function POST(req) {
  await ConnectDB();
  const { conversation_id, role, content } = await req.json();

  const usermessage = await Messages.create({ conversation_id, role, content });
  const history = await Messages.find({ conversation_id })
    .sort({ created_at: -1 })
    .limit(10)
    .lean();
  history.reverse();
  const formattedHistory = history.map((mes) => ({
    role: mes.role,
    content: mes.content,
  }));
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.responses.create({
    model: "gpt-5.4-mini",
    input: [
      ...formattedHistory, // ← poori history array
    ],
    store: true,
  });

  const output = response.output_text;

  const assistant = await Messages.create({
    conversation_id,
    role: "assistant",
    content: output,
  });
  return NextResponse.json(
    { message: "message created successfully", usermessage, assistant },
    { status: 200 },
  );
}
// ---------------------------------------------------------------------------
// GET /api/Conversation/messages?conversation_id=<id>
// Returns all messages for a conversation, ordered oldest → newest.
// ---------------------------------------------------------------------------
export async function GET(req) {
  try {
    await ConnectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("conversation_id");

    if (!id?.trim()) {
      return NextResponse.json(
        { error: "conversation_id is required" },
        { status: 400 },
      );
    }

    const messages = await Messages.find({ conversation_id: id })
      .sort({ created_at: 1 })
      .lean();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (err) {
    console.error("[GET /messages]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/Conversation/messages?conversation_id=<id>
// Deletes all messages belonging to a conversation.
// ---------------------------------------------------------------------------
export async function DELETE(req) {
  try {
    await ConnectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("conversation_id");

    if (!id?.trim()) {
      return NextResponse.json(
        { error: "conversation_id is required" },
        { status: 400 },
      );
    }

    const result = await Messages.deleteMany({ conversation_id: id });

    return NextResponse.json(
      { message: "Messages deleted", deleted: result.deletedCount },
      { status: 200 },
    );
  } catch (err) {
    console.error("[DELETE /messages]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
