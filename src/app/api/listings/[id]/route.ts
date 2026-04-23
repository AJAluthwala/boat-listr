import { requireUser } from "@/lib/auth";
import { json, parseId, readJson } from "@/lib/api";
import { signListingMediaUrls } from "@/lib/media";
import { canManageResource } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const include: any = {
  user: { select: { id: true, name: true, email: true, role: true } },
  media: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }] },
  favorites: true,
  conversations: true,
  statusHistory: { orderBy: { changedAt: "desc" } },
};

function parseOptionalNumber(value: unknown, field: string, allowZero = false): number | undefined {
  if (value == null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || (!allowZero && parsed <= 0) || (allowZero && parsed < 0)) {
    throw new Error(`${field} has an invalid numeric value`);
  }

  return parsed;
}

function parseOptionalInt(value: unknown, field: string, allowZero = false): number | undefined {
  if (value == null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || (!allowZero && parsed <= 0) || (allowZero && parsed < 0)) {
    throw new Error(`${field} has an invalid numeric value`);
  }

  return parsed;
}

function parseOptionalDate(value: unknown, field: string): Date | undefined {
  if (value == null || value === "") {
    return undefined;
  }

  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${field} must be a valid date`);
  }

  return parsed;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return json({ error: "Invalid id" }, 400);

  const listing = await prisma.listing.findUnique({ where: { id }, include });
  if (!listing) return json({ error: "Not found" }, 404);
  return json({ listing: await signListingMediaUrls(listing) });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return json({ error: "Invalid id" }, 400);

  try {
    const { user } = await requireUser(request);
    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) return json({ error: "Not found" }, 404);
    if (!canManageResource(user.role, existing.userId, user.id)) return json({ error: "Forbidden" }, 403);

    const body = await readJson<Record<string, unknown>>(request);
    const listing = await prisma.listing.update({
      where: { id },
      data: {
        title: body.title == null ? undefined : String(body.title).trim(),
        category: body.category == null ? undefined : String(body.category).trim(),
        manufacturedYear: parseOptionalInt(body.manufacturedYear, "manufacturedYear"),
        lengthFt: parseOptionalInt(body.lengthFt, "lengthFt"),
        shortDescription: body.shortDescription == null ? undefined : String(body.shortDescription).trim(),
        mainDescription: body.mainDescription == null ? undefined : String(body.mainDescription),
        location: body.location == null ? undefined : String(body.location).trim(),
        valueUSD: parseOptionalNumber(body.valueUSD, "valueUSD"),
        status: body.status == null ? undefined : (String(body.status).toUpperCase() as any),
        freeEndsAt: parseOptionalDate(body.freeEndsAt, "freeEndsAt"),
        paidEndsAt: parseOptionalDate(body.paidEndsAt, "paidEndsAt"),
        engine: body.engine == null ? undefined : body.engine === "" ? null : String(body.engine),
        totalPowerHP: parseOptionalInt(body.totalPowerHP, "totalPowerHP", true),
        brand: body.brand == null ? undefined : body.brand === "" ? null : String(body.brand),
        capacity: parseOptionalInt(body.capacity, "capacity", true),
      },
      include,
    });

    return json({ listing: await signListingMediaUrls(listing) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Failed to update listing" }, 400);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return json({ error: "Invalid id" }, 400);

  try {
    const { user } = await requireUser(request);
    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) return json({ error: "Not found" }, 404);
    if (!canManageResource(user.role, existing.userId, user.id)) return json({ error: "Forbidden" }, 403);

    await prisma.listing.delete({ where: { id } });
    return json({ message: "Deleted" });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}