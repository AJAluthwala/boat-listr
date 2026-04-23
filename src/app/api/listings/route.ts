import { requireUser } from "@/lib/auth";
import { json, parsePage, readJson, getQuery } from "@/lib/api";
import { signListingMediaUrls, signListingsMediaUrls } from "@/lib/media";
import { prisma } from "@/lib/prisma";

const listingInclude: any = {
  user: { select: { id: true, name: true, email: true, role: true } },
  media: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }] },
  favorites: true,
  conversations: true,
  statusHistory: { orderBy: { changedAt: "desc" } },
};

function parseRequiredNumber(value: unknown, field: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${field} must be a positive number`);
  }

  return parsed;
}

function parseRequiredInt(value: unknown, field: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${field} must be a positive integer`);
  }

  return parsed;
}

function parseOptionalInt(value: unknown, field: string): number | null {
  if (value == null || value === "") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${field} must be a non-negative integer`);
  }

  return parsed;
}

function parseOptionalDate(value: unknown, field: string): Date | null {
  if (value == null || value === "") {
    return null;
  }

  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${field} must be a valid date`);
  }

  return parsed;
}

export async function GET(request: Request) {
  const { page, pageSize, skip } = parsePage(request, 1, 20);
  const search = getQuery(request, "search")?.trim();
  const status = getQuery(request, "status")?.trim();
  const category = getQuery(request, "category")?.trim();
  const location = getQuery(request, "location")?.trim();
  const userId = getQuery(request, "userId");

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { shortDescription: { contains: search } },
      { mainDescription: { contains: search } },
      { location: { contains: search } },
      { brand: { contains: search } },
      { engine: { contains: search } },
    ];
  }
  if (status) where.status = status.toUpperCase() as any;
  if (category) where.category = category;
  if (location) where.location = { contains: location };
  if (userId) where.userId = Number(userId);

  const [total, items] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({ where, include: listingInclude, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
  ]);

  return json({ items: await signListingsMediaUrls(items), page, pageSize, total });
}

export async function POST(request: Request) {
  try {
    const { user } = await requireUser(request);
    const body = await readJson<Record<string, unknown>>(request);

    const title = String(body.title ?? "").trim();
    const category = String(body.category ?? "").trim();
    const shortDescription = String(body.shortDescription ?? "").trim();
    const location = String(body.location ?? "").trim();
    if (!title || !category || !shortDescription || !location) {
      return json({ error: "title, category, shortDescription and location are required" }, 400);
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        category,
        manufacturedYear: parseRequiredInt(body.manufacturedYear, "manufacturedYear"),
        lengthFt: parseRequiredInt(body.lengthFt, "lengthFt"),
        shortDescription,
        mainDescription: body.mainDescription ? String(body.mainDescription) : null,
        location,
        valueUSD: parseRequiredNumber(body.valueUSD, "valueUSD"),
        status: (body.status ? String(body.status).toUpperCase() : "PENDING") as any,
        freeEndsAt: parseOptionalDate(body.freeEndsAt, "freeEndsAt"),
        paidEndsAt: parseOptionalDate(body.paidEndsAt, "paidEndsAt"),
        engine: body.engine ? String(body.engine) : null,
        totalPowerHP: parseOptionalInt(body.totalPowerHP, "totalPowerHP"),
        brand: body.brand ? String(body.brand) : null,
        capacity: parseOptionalInt(body.capacity, "capacity"),
        userId: user.id,
      },
      include: listingInclude,
    });

    return json({ listing: await signListingMediaUrls(listing) }, 201);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Failed to create listing" }, 400);
  }
}