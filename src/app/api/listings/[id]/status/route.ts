import { requireUser } from "@/lib/auth";
import { json, parseId, readJson } from "@/lib/api";
import { canManageResource } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const listingId = parseId(rawId);
  if (!listingId) return json({ error: "Invalid id" }, 400);

  try {
    const { user } = await requireUser(request);
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return json({ error: "Not found" }, 404);
    if (!canManageResource(user.role, listing.userId, user.id)) return json({ error: "Forbidden" }, 403);

    const body = await readJson<{ status?: string }>(request);
    if (!body.status) return json({ error: "status is required" }, 400);

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const next = await tx.listing.update({
        where: { id: listingId },
        data: { status: String(body.status).toUpperCase() as any },
      });

      await tx.listingStatusHistory.create({
        data: { listingId, from: listing.status, to: String(body.status).toUpperCase() as any },
      });

      return next;
    });

    return json({ listing: updated });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Failed to update status" }, 400);
  }
}