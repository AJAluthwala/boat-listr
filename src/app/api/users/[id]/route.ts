import { requireUser } from "@/lib/auth";
import { json, parseId, readJson } from "@/lib/api";
import { canAccessAdmin, canManageResource } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return json({ error: "Invalid id" }, 400);

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, address: true, contactNumber: true, role: true, stripeCustomerId: true, createdAt: true, updatedAt: true },
  });

  if (!user) return json({ error: "Not found" }, 404);
  return json({ user });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return json({ error: "Invalid id" }, 400);

  try {
    const { user: currentUser } = await requireUser(request);
    if (!canManageResource(currentUser.role, id, currentUser.id)) {
      return json({ error: "Forbidden" }, 403);
    }

    const body = await readJson<{ name?: string; address?: string; contactNumber?: string; role?: string }>(request);
    const isAdmin = canAccessAdmin(currentUser.role);
    if (body.role != null && !isAdmin) {
      return json({ error: "Forbidden" }, 403);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: body.name?.trim() || undefined,
        address: body.address?.trim() ?? undefined,
        contactNumber: body.contactNumber?.trim() ?? undefined,
        role: isAdmin ? body.role?.trim() || undefined : undefined,
      },
    });

    return json({ user: updated });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return json({ error: "Invalid id" }, 400);

  try {
    const { user: currentUser } = await requireUser(request);
    if (!canManageResource(currentUser.role, id, currentUser.id)) {
      return json({ error: "Forbidden" }, 403);
    }

    await prisma.user.delete({ where: { id } });
    return json({ message: "Deleted" });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}