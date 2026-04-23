import { requireUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/permissions";
import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { user } = await requireUser(request);
    if (!canAccessAdmin(user.role)) return json({ error: "Forbidden" }, 403);

    const [listingStatuses, monthlyListings, monthlyPayments] = await Promise.all([
      prisma.listing.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.listing.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.payment.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

    return json({ listingStatuses, monthlyListings, monthlyPayments });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}