import { requireUser } from "@/lib/auth";
import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { token } = await requireUser(request);
    await prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } });
    return json({ message: "Logged out" });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}