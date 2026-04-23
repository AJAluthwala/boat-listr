import { requireUser } from "@/lib/auth";
import { json, parseId } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const listingId = parseId(rawId);
  if (!listingId) return json({ error: "Invalid id" }, 400);

  try {
    const { user } = await requireUser(request);
    const conversations = await prisma.conversation.findMany({
      where: {
        listingId,
        participants: { some: { userId: user.id } },
      },
      include: { participants: { include: { user: { select: { id: true, name: true, email: true } } } }, messages: { orderBy: { createdAt: "desc" }, take: 20 } },
      orderBy: { updatedAt: "desc" },
    });
    return json({ conversations });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const listingId = parseId(rawId);
  if (!listingId) return json({ error: "Invalid id" }, 400);

  try {
    const { user } = await requireUser(request);
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return json({ error: "Not found" }, 404);

    const existing = await prisma.conversation.findFirst({ where: { listingId, participants: { some: { userId: user.id } } } });
    if (existing) return json({ conversation: existing });

    const conversation = await prisma.conversation.create({
      data: {
        listingId,
        participants: { create: [{ userId: user.id }, { userId: listing.userId }] },
      },
      include: { participants: true },
    });

    return json({ conversation }, 201);
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}