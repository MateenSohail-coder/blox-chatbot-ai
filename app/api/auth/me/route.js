import { gettoken, setcookies } from "@/libs/cookies";
import { ConnectDB } from "@/libs/db";
import { updatetoken, verifytoken } from "@/libs/jwt";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = await gettoken(req);
  if (!token) {
    return NextResponse.json({ message: "token not found" }, { status: 401 });
  }
  const data = await verifytoken(token);
  if (!data) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  return NextResponse.json({
    username: data.username,
    userId: data.userid,
    userEmail: data.email,
  });
}
export async function PUT(req) {
  const token = await gettoken(req);

  await ConnectDB();
  const { _id, username } = await req.json();

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { username },
    { new: true }, // returns the modified document
  );

  if (!updatedUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const newToken = await updatetoken(token, { username });

  const res = NextResponse.json(
    {
      message: "Username updated successfully",
      conversation: updatedUser,
    },
    { status: 200 },
  );

  await setcookies(newToken, res);

  return res;
}
