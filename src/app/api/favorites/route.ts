import { requireUser } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { signListingMediaUrls } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { user } = await requireUser(request);
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: { listing: { include: { media: true, user: { select: { id: true, name: true, email: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    return json({ favorites: await Promise.all(favorites.map(async (favorite) => ({ ...favorite, listing: favorite.listing ? await signListingMediaUrls(favorite.listing) : favorite.listing }))) });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireUser(request);
    const body = await readJson<{ listingId?: number }>(request);
    if (!body.listingId) return json({ error: "listingId is required" }, 400);

    const favorite = await prisma.favorite.upsert({
      where: { userId_listingId: { userId: user.id, listingId: body.listingId } },
      create: { userId: user.id, listingId: body.listingId },
      update: {},
    });

    return json({ favorite }, 201);
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}

export async function DELETE(request: Request) {
  try {
    const { user } = await requireUser(request);
    const body = await readJson<{ listingId?: number }>(request);
    if (!body.listingId) return json({ error: "listingId is required" }, 400);

    await prisma.favorite.delete({ where: { userId_listingId: { userId: user.id, listingId: body.listingId } } });
    return json({ message: "Removed" });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}