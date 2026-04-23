import { requireUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/permissions";
import { json, parsePage, readJson } from "@/lib/api";
import { signListingsMediaUrls } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { user } = await requireUser(request);
    if (!canAccessAdmin(user.role)) return json({ error: "Forbidden" }, 403);
    const { page, pageSize, skip } = parsePage(request, 1, 20);
    const [total, items] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.findMany({ include: { user: { select: { id: true, name: true, email: true } }, media: true }, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
    ]);
    return json({ items: await signListingsMediaUrls(items), page, pageSize, total });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}

export async function PATCH(request: Request) {
  try {
    const { user } = await requireUser(request);
    if (!canAccessAdmin(user.role)) return json({ error: "Forbidden" }, 403);
    const body = await readJson<{ listingId?: number; status?: string }>(request);
    if (!body.listingId || !body.status) return json({ error: "listingId and status are required" }, 400);

    const listing = await prisma.listing.findUnique({ where: { id: body.listingId } });
    if (!listing) return json({ error: "Not found" }, 404);

    const nextStatus = String(body.status).toUpperCase() as any;
    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const next = await tx.listing.update({ where: { id: body.listingId }, data: { status: nextStatus } });
      await tx.listingStatusHistory.create({
        data: {
          listingId: body.listingId as number,
          from: listing.status,
          to: nextStatus,
        },
      });
      return next;
    });

    return json({ listing: updated });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}