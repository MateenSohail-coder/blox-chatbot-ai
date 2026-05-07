import { jwtVerify, SignJWT } from "jose";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
export async function signtoken(paylaod) {
  return await new SignJWT(paylaod)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10d")
    .sign(secret);
}
export async function verifytoken(token) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
