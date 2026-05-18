import { requireUser } from "@/lib/auth";
import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
	try {
		const { user } = await requireUser(request);

		const subscription = await prisma.subscription.findFirst({
			where: {
				userId: user.id,
				status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
			},
			orderBy: { createdAt: "desc" },
		});

		if (!subscription) {
			return json({ error: "No active subscription to cancel" }, 404);
		}

		const stripe = getStripe();

		// Cancel at period end so the user keeps premium access until renewal date
		const updated = await stripe.subscriptions.update(subscription.stripeSubId, {
			cancel_at_period_end: true,
		});

		// Reflect immediately in DB so UI updates without waiting for webhook
		await prisma.subscription.update({
			where: { id: subscription.id },
			data: { cancelAtPeriodEnd: true },
		});

		return json({
			ok: true,
			cancelAtPeriodEnd: updated.cancel_at_period_end,
			currentPeriodEnd: updated.items.data[0]?.current_period_end ?? null,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to cancel subscription";
		const status = message === "Unauthorized" ? 401 : 500;
		return json({ error: message }, status);
	}
}
