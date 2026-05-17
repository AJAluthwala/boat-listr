import { requireUser } from "@/lib/auth";
import { json } from "@/lib/api";
import { getAppUrl, getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
	try {
		const { user } = await requireUser(request);

		const priceId = process.env.STRIPE_PRICE_PREMIUM_LISTING;
		if (!priceId) {
			return json({ error: "Premium price is not configured" }, 500);
		}

		const stripe = getStripe();
		const appUrl = getAppUrl();

		const session = await stripe.checkout.sessions.create({
			mode: "subscription",
			payment_method_types: ["card"],
			line_items: [{ price: priceId, quantity: 1 }],
			customer_email: user.email,
			client_reference_id: String(user.id),
			subscription_data: {
				metadata: { userId: String(user.id) },
			},
			metadata: { userId: String(user.id) },
			success_url: `${appUrl}/dashboard/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${appUrl}/dashboard/subscriptions/cancel`,
			allow_promotion_codes: true,
		});

		if (!session.url) {
			return json({ error: "Stripe did not return a checkout URL" }, 500);
		}

		return json({ url: session.url });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to start checkout";
		const status = message === "Unauthorized" ? 401 : 500;
		return json({ error: message }, status);
	}
}
