import { requireUser } from "@/lib/auth";
import { json, parseId } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const listingId = parseId(rawId);
  if (!listingId) return json({ error: "Invalid id" }, 400);

  try {
    const { user } = await requireUser(request);
    await prisma.favorite.upsert({
      where: { userId_listingId: { userId: user.id, listingId } },
      create: { userId: user.id, listingId },
      update: {},
    });
    return json({ favorite: true });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const listingId = parseId(rawId);
  if (!listingId) return json({ error: "Invalid id" }, 400);

  try {
    const { user } = await requireUser(request);
    await prisma.favorite.deleteMany({ where: { userId: user.id, listingId } });
    return json({ favorite: false });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}