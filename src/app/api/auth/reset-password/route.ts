import { hashPassword, isPrefixedToken } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ token?: string; password?: string }>(request);
    const token = body.token ?? "";
    const password = body.password ?? "";

    if (!token || !isPrefixedToken(token, "reset") || password.length < 8) {
      return json({ error: "Valid reset token and password (8+ chars) are required" }, 400);
    }

    const resetToken = await prisma.refreshToken.findUnique({ where: { token }, include: { user: true } });
    if (!resetToken || resetToken.revoked || resetToken.expiresAt <= new Date()) {
      return json({ error: "Invalid or expired reset token" }, 400);
    }

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash: hashPassword(password) },
    });

    await prisma.refreshToken.update({ where: { token }, data: { revoked: true } });
    return json({ message: "Password updated" });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Reset failed" }, 400);
  }
}