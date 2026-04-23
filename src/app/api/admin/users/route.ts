import { requireUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/permissions";
import { json, parsePage, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { user } = await requireUser(request);
    if (!canAccessAdmin(user.role)) return json({ error: "Forbidden" }, 403);
    const { page, pageSize, skip } = parsePage(request, 1, 20);
    const [total, items] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, skip, take: pageSize, select: { id: true, name: true, email: true, address: true, contactNumber: true, role: true, stripeCustomerId: true, createdAt: true, updatedAt: true } }),
    ]);
    return json({ items, page, pageSize, total });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}

export async function PATCH(request: Request) {
  try {
    const { user } = await requireUser(request);
    if (!canAccessAdmin(user.role)) return json({ error: "Forbidden" }, 403);
    const body = await readJson<{ userId?: number; role?: string }>(request);
    if (!body.userId || !body.role) return json({ error: "userId and role are required" }, 400);
    const updated = await prisma.user.update({ where: { id: body.userId }, data: { role: body.role } });
    return json({ user: updated });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}