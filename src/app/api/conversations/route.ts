import { requireUser } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { user } = await requireUser(request);
    const conversations = await prisma.conversation.findMany({
      where: { participants: { some: { userId: user.id } } },
      include: { listing: true, participants: { include: { user: { select: { id: true, name: true, email: true } } } }, messages: { orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { updatedAt: "desc" },
    });
    return json({ conversations });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireUser(request);
    const body = await readJson<{ listingId?: number }>(request);
    if (!body.listingId) return json({ error: "listingId is required" }, 400);

    const listing = await prisma.listing.findUnique({ where: { id: body.listingId } });
    if (!listing) return json({ error: "Listing not found" }, 404);
    if (listing.userId === user.id) return json({ error: "Cannot create conversation with your own listing" }, 400);

    const existing = await prisma.conversation.findFirst({
      where: { listingId: body.listingId, participants: { some: { userId: user.id } } },
      include: { participants: true },
    });

    if (existing) {
      return json({ conversation: existing });
    }

    const conversation = await prisma.conversation.create({
      data: {
        listingId: body.listingId,
        participants: { create: [{ userId: user.id }, { userId: listing.userId }] },
      },
      include: { participants: true },
    });

    return json({ conversation }, 201);
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}