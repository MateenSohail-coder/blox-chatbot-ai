export async function setcookies(token, response) {
  response.cookies.set("practice", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 10,
    path: "/",
  });
}
export async function gettoken(req) {
  return req.cookies.get("practice")?.value || null;
}
