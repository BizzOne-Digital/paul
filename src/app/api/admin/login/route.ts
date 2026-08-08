import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import {
  checkLoginThrottle,
  clearLoginFailures,
  createSessionToken,
  recordLoginFailure,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (checkLoginThrottle(ip)) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.parse(body);
    await connectMongo();

    const user = await AdminUser.findOne({ email: parsed.email.toLowerCase() });
    if (!user) {
      recordLoginFailure(ip);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const valid = await verifyPassword(parsed.password, user.passwordHash);
    if (!valid) {
      recordLoginFailure(ip);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    clearLoginFailures(ip);
    user.lastLogin = new Date();
    await user.save();

    const token = await createSessionToken({
      sub: String(user._id),
      email: user.email,
      role: user.role || "admin",
      name: user.name,
    });

    const response = NextResponse.json({
      ok: true,
      user: { id: String(user._id), email: user.email, name: user.name },
    });
    return setSessionCookie(response, token);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to sign in";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
