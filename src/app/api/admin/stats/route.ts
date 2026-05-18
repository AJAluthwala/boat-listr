import { requireUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/permissions";
import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
	try {
		const { user } = await requireUser(request);
		if (!canAccessAdmin(user.role)) return json({ error: "Forbidden" }, 403);

		const [
			totalUsers,
			totalListings,
			activeListings,
			pendingListings,
			soldListings,
			activeSubscriptions,
			totalSubscriptions,
			listingStatusBreakdown,
		] = await Promise.all([
			prisma.user.count(),
			prisma.listing.count(),
			prisma.listing.count({ where: { status: "ACTIVE" } }),
			prisma.listing.count({ where: { status: "PENDING" } }),
			prisma.listing.count({ where: { status: "SOLD" } }),
			prisma.subscription.count({ where: { status: { in: ["ACTIVE", "TRIALING"] } } }),
			prisma.subscription.count(),
			prisma.listing.groupBy({ by: ["status"], _count: { _all: true } }),
		]);

		return json({
			totalUsers,
			totalListings,
			activeListings,
			pendingListings,
			soldListings,
			activeSubscriptions,
			totalSubscriptions,
			listingStatusBreakdown,
		});
	} catch {
		return json({ error: "Unauthorized" }, 401);
	}
}
