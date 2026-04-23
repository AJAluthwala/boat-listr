import { requireUser } from "@/lib/auth";
import { json, parseId, readJson } from "@/lib/api";
import { signMediaUrls } from "@/lib/media";
import { canManageResource } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const listingId = parseId(rawId);
  if (!listingId) return json({ error: "Invalid id" }, 400);

  const media = await prisma.media.findMany({ where: { listingId }, orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }] });
  return json({ media: await signMediaUrls(media) });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const listingId = parseId(rawId);
  if (!listingId) return json({ error: "Invalid id" }, 400);

  try {
    const { user } = await requireUser(request);
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return json({ error: "Not found" }, 404);
    if (!canManageResource(user.role, listing.userId, user.id)) return json({ error: "Forbidden" }, 403);

    const body = await readJson<{ url?: string; type?: string; kind?: "IMAGE" | "VIDEO"; s3Key?: string; bucket?: string; mimeType?: string; sizeBytes?: number; isPrimary?: boolean; sortOrder?: number }>(request);
    if (!body.url || !body.type) return json({ error: "url and type are required" }, 400);

    const media = await prisma.media.create({
      data: {
        listingId,
        url: body.url,
        type: body.type,
        kind: body.kind ?? (body.type.toLowerCase().startsWith("video") ? "VIDEO" : "IMAGE"),
        s3Key: body.s3Key ?? null,
        bucket: body.bucket ?? null,
        mimeType: body.mimeType ?? null,
        sizeBytes: body.sizeBytes ?? null,
        isPrimary: Boolean(body.isPrimary),
        sortOrder: body.sortOrder ?? 0,
      },
    });

    return json({ media }, 201);
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
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return json({ error: "Not found" }, 404);
    if (!canManageResource(user.role, listing.userId, user.id)) return json({ error: "Forbidden" }, 403);

    const body = await readJson<{ mediaId?: number; s3Key?: string }>(request);
    if (body.mediaId) {
      await prisma.media.delete({ where: { id: body.mediaId } });
    } else if (body.s3Key) {
      await prisma.media.deleteMany({ where: { listingId, s3Key: body.s3Key } });
    } else {
      return json({ error: "mediaId or s3Key is required" }, 400);
    }

    return json({ message: "Deleted" });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}