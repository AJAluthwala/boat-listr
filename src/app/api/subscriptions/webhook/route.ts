import type Stripe from "stripe";
import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

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

async function syncSubscription(sub: Stripe.Subscription, fallbackUserId?: number) {
	const metadataUserId = Number(sub.metadata?.userId);
	const userId = Number.isInteger(metadataUserId) && metadataUserId > 0 ? metadataUserId : fallbackUserId;
	if (!userId) return;

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
			stripePriceId: priceId ?? undefined,
			status: mapStripeStatus(sub.status),
			currentPeriodStart: currentPeriodStart ?? undefined,
			currentPeriodEnd: currentPeriodEnd ?? undefined,
			cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
		},
	});
}

export async function POST(request: Request) {
	const signature = request.headers.get("stripe-signature");
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

	if (!signature || !webhookSecret) {
		return json({ error: "Missing signature or webhook secret" }, 400);
	}

	const payload = await request.text();
	const stripe = getStripe();

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Invalid signature";
		return json({ error: `Webhook signature verification failed: ${message}` }, 400);
	}

	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session;
				if (session.mode === "subscription" && session.subscription) {
					const fallbackUserId = Number(session.metadata?.userId ?? session.client_reference_id);
					const sub = await stripe.subscriptions.retrieve(String(session.subscription));
					await syncSubscription(sub, Number.isFinite(fallbackUserId) ? fallbackUserId : undefined);
				}
				break;
			}

			case "customer.subscription.created":
			case "customer.subscription.updated":
			case "customer.subscription.deleted": {
				const sub = event.data.object as Stripe.Subscription;
				await syncSubscription(sub);
				break;
			}

			default:
				break;
		}

		return json({ received: true });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Webhook handler failed";
		return json({ error: message }, 500);
	}
}
