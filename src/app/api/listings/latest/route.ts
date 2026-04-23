import { json, parsePage } from "@/lib/api";
import { signListingsMediaUrls } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { page, pageSize, skip } = parsePage(request, 1, 12);
  const [total, items] = await Promise.all([
    prisma.listing.count({ where: { status: "ACTIVE" as any } }),
    prisma.listing.findMany({
      where: { status: "ACTIVE" as any },
      include: { media: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);
  return json({ items: await signListingsMediaUrls(items), page, pageSize, total });
}