import { ConnectDB } from "@/libs/db";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function POST(req) {
  await ConnectDB();
  const { user_id, title } = await req.json();

  const conversation = await Conversation.create({ user_id, title });
  return NextResponse.json(
    { message: "conversation created successfully", conversation },
    { status: 200 },
  );
}
export async function GET(req) {
  try {
    await ConnectDB();
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("userId");

    if (!user_id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const conversations = await Conversation.find({ user_id: user_id })
      .sort({ created_at: -1 }) // ← latest pehle ✅
      .lean();

    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(req) {
  try {
    await ConnectDB();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conId");
    if (!conversationId) {
      return NextResponse.json({ error: "Conv ID required" }, { status: 400 });
    }
    await Conversation.deleteOne({ _id: conversationId });
    return NextResponse.json(
      { message: "successfully deleted" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
