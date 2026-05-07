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
export async function GET(req) {
  try {
    await ConnectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("conversation_id");
    if (!id) {
      return NextResponse.json(
        { error: "conversation Id is required" },
        { status: 400 },
      );
    }
    const messages = await Messages.find({ conversation_id: id });
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(req) {
  try {
    await ConnectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("conversaton_id");
    if (!id) {
      return NextResponse.json(
        { error: "conversation Id is required" },
        { status: 400 },
      );
    }
    await Messages.deleteMany({ conversation_id: id });
    return NextResponse.json(
      { message: "messages deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
