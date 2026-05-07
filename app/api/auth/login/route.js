import { setcookies } from "@/libs/cookies";
import { ConnectDB } from "@/libs/db";
import { signtoken } from "@/libs/jwt";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { NextResponse } from "next/server";
export async function POST(req) {
  await ConnectDB();
  const { email, password } = await req.json();
  const isuser = await User.findOne({ email });
  if (!isuser) {
    return NextResponse.json({ message: "user not found" }, { status: 404 });
  }
  const ismatch = await bcrypt.compare(password, isuser.password);
  if (!ismatch) {
    return NextResponse.json(
      { message: "incorrect password" },
      { status: 401 },
    );
  }
  const token = await signtoken({
    username: isuser.username,
    userid: isuser._id.toString(),
    email: isuser.email,
  });
  const response = NextResponse.json(
    { message: "sucessfully login" },
    { status: 200 },
  );
  await setcookies(token, response);
  return response;
}
