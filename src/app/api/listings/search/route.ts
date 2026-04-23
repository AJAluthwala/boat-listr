import { json, parsePage, getQuery } from "@/lib/api";
import { signListingsMediaUrls } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { page, pageSize, skip } = parsePage(request, 1, 20);
  const q = getQuery(request, "q")?.trim() ?? getQuery(request, "search")?.trim();

  const where: any = q
    ? {
        status: "ACTIVE" as any,
        OR: [
          { title: { contains: q } },
          { shortDescription: { contains: q } },
          { mainDescription: { contains: q } },
          { location: { contains: q } },
          { category: { contains: q } },
          { brand: { contains: q } },
        ],
      }
    : { status: "ACTIVE" as any };

  const [total, items] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({ where, include: { media: true, user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
  ]);

  return json({ items: await signListingsMediaUrls(items), page, pageSize, total });
}