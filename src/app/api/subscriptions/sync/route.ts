import type Stripe from "stripe";
import { requireUser } from "@/lib/auth";
import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

type SubStatus =
	| "ACTIVE"
	| "PAST_DUE"
	| "CANCELED"
	| "INCOMPLETE"
	| "INCOMPLETE_EXPIRED"
	| "TRIALING"
	| "UNPAID";

function mapStripeStatus(status: Stripe.Subscription.Status): SubStatus {
	switch (status) {
		case "active":
			return "ACTIVE";
		case "past_due":
			return "PAST_DUE";
		case "canceled":
			return "CANCELED";
		case "incomplete":
			return "INCOMPLETE";
		case "incomplete_expired":
			return "INCOMPLETE_EXPIRED";
		case "trialing":
			return "TRIALING";
		case "unpaid":
			return "UNPAID";
		default:
			return "INCOMPLETE";
	}
}

async function upsertSubscription(sub: Stripe.Subscription, userId: number) {
	const firstItem = sub.items.data[0];
	const priceId = firstItem?.price?.id ?? null;
	const currentPeriodStart = firstItem?.current_period_start
		? new Date(firstItem.current_period_start * 1000)
		: null;
	const currentPeriodEnd = firstItem?.current_period_end
		? new Date(firstItem.current_period_end * 1000)
		: null;

	await prisma.subscription.upsert({
		where: { stripeSubId: sub.id },
		create: {
			userId,
			stripeSubId: sub.id,
			stripePriceId: priceId,
			status: mapStripeStatus(sub.status),
			currentPeriodStart,
			currentPeriodEnd,
			cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
		},
		update: {
			userId,
			stripePriceId: priceId ?? undefined,
			status: mapStripeStatus(sub.status),
			currentPeriodStart: currentPeriodStart ?? undefined,
			currentPeriodEnd: currentPeriodEnd ?? undefined,
			cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
		},
	});
}

/**
 * Recovery endpoint: looks up the user's Stripe customer(s) by email and
 * syncs their current subscriptions into our DB. Useful when a webhook was
 * missed (e.g. `stripe listen` wasn't running during checkout).
 */
export async function POST(request: Request) {
	try {
		const { user } = await requireUser(request);
		const stripe = getStripe();

		const customers = await stripe.customers.list({
			email: user.email,
			limit: 5,
		});

		if (customers.data.length === 0) {
			return json(
				{ error: "No Stripe customer found for your email", synced: 0 },
				404,
			);
		}

		let synced = 0;
		const statuses: string[] = [];

		for (const customer of customers.data) {
			const subs = await stripe.subscriptions.list({
				customer: customer.id,
				status: "all",
				limit: 20,
			});

			for (const sub of subs.data) {
				// Only sync subs that are or were active — ignore incomplete drafts
				if (
					sub.status === "active" ||
					sub.status === "trialing" ||
					sub.status === "past_due" ||
					sub.status === "canceled"
				) {
					await upsertSubscription(sub, user.id);
					synced++;
					statuses.push(sub.status);
				}
			}
		}

		return json({
			synced,
			statuses,
			message:
				synced === 0
					? "No active subscriptions found in Stripe for your email."
					: `Synced ${synced} subscription${synced === 1 ? "" : "s"} from Stripe.`,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to sync subscription";
		const status = message === "Unauthorized" ? 401 : 500;
		return json({ error: message }, status);
	}
}
