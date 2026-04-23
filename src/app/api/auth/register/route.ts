import { hashPassword, issueSession, normalizeEmail, validatePassword } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ name?: string; email?: string; password?: string; address?: string; contactNumber?: string; role?: string }>(request);
    const name = body.name?.trim();
    const email = normalizeEmail(body.email);
    const password = body.password ?? "";

    if (!name || !email || !validatePassword(password)) {
      return json({ error: "name, valid email, and password (8+ chars) are required" }, 400);
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return json({ error: "Email already registered" }, 409);
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        address: body.address?.trim() || null,
        contactNumber: body.contactNumber?.trim() || null,
        role: body.role?.trim() || "SELLER",
      },
    });

    const session = await issueSession(user.id);

    return json({
      user: { ...user, passwordHash: undefined },
      token: session.token,
      expiresAt: session.expiresAt,
    }, 201);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Registration failed" }, 400);
  }
}