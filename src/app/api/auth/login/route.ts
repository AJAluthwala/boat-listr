import { issueSession, normalizeEmail, verifyPassword } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ email?: string; password?: string }>(request);
    const email = normalizeEmail(body.email);
    const password = body.password ?? "";

    if (!email || !password) {
      return json({ error: "email and password are required" }, 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return json({ error: "Invalid credentials" }, 401);
    }

    const session = await issueSession(user.id);

    return json({
      user: { ...user, passwordHash: undefined },
      token: session.token,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Login failed" }, 400);
  }
}