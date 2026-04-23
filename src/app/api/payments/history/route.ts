import { requireUser } from "@/lib/auth";
import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { user } = await requireUser(request);
    const payments = await prisma.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    return json({ payments });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}