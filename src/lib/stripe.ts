import { createHmac, timingSafeEqual } from "node:crypto";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
	if (stripeClient) return stripeClient;
	const key = process.env.STRIPE_SECRET_KEY;
	if (!key) {
		throw new Error("STRIPE_SECRET_KEY is not set");
	}
	stripeClient = new Stripe(key);
	return stripeClient;
}

export function getAppUrl(): string {
	return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export type StripeSubscriptionStatus = Stripe.Subscription.Status;

// ============================================
// Legacy stub helpers — kept so existing
// /api/payments/* routes don't break. These
// remain placeholders until those routes are
// migrated to real Stripe.
// ============================================

export async function createPaymentIntent(amountUSD: number, metadata: Record<string, string> = {}) {
	return {
		id: `pi_${Date.now()}`,
		clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).slice(2)}`,
		amountUSD,
		metadata,
	};
}

export async function createSubscriptionPortalUrl(customerId: string) {
	return `https://billing.example.local/portal/${encodeURIComponent(customerId)}`;
}

export async function readWebhookJson<T>(request: Request): Promise<{ payload: string; body: T }> {
	const payload = await request.text();
	if (!payload.trim()) {
		throw new Error("Missing webhook payload");
	}

	try {
		return { payload, body: JSON.parse(payload) as T };
	} catch {
		throw new Error("Invalid webhook payload");
	}
}

export function verifyWebhookSignature(payload: string, signature: string | null, secret: string | undefined): boolean {
	if (!secret) {
		return true;
	}

	if (!signature) {
		return false;
	}

	const expected = createHmac("sha256", secret).update(payload, "utf8").digest("hex");
	if (expected.length !== signature.length) {
		return false;
	}

	return timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(signature, "utf8"));
}
