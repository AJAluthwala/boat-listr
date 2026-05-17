import { requireUser } from "@/lib/auth";
import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
	try {
		const { user } = await requireUser(request);

		const subscription = await prisma.subscription.findFirst({
			where: {
				userId: user.id,
				status: { in: ["ACTIVE", "TRIALING"] },
			},
			orderBy: { createdAt: "desc" },
		});

		const isPremium = Boolean(subscription);

		return json({
			plan: isPremium ? "premium" : "free",
			subscription: subscription
				? {
					id: subscription.id,
					status: subscription.status,
					currentPeriodEnd: subscription.currentPeriodEnd,
					cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
				}
				: null,
		});
	} catch {
		return json({ error: "Unauthorized" }, 401);
	}
}
