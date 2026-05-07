import { setcookies } from "@/libs/cookies";
import { ConnectDB } from "@/libs/db";
import { signtoken } from "@/libs/jwt";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { NextResponse } from "next/server";
export async function POST(req) {
  await ConnectDB();
  const { username, email, password } = await req.json();
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { message: "user already exist !" },
      { status: 401 },
    );
  }
  const hashpassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashpassword });
  const token = await signtoken({
    username: user.username,
    userid: user._id.toString(),
    email: user.email,
  });
  const response = NextResponse.json(
    { message: "sucessfully signup" },
    { status: 200 },
  );
  await setcookies(token, response);
  return response;
}
