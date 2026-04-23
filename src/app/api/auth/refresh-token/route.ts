import { getBearerToken, issueSession, findUserBySessionToken } from "@/lib/auth";
import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const token = getBearerToken(request);
  const user = await findUserBySessionToken(token);
  if (!user || !token) {
    return json({ error: "Unauthorized" }, 401);
  }

  await prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } });
  const session = await issueSession(user.id);

  return json({ token: session.token, expiresAt: session.expiresAt, user });
}