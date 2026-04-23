import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { readWebhookJson, verifyWebhookSignature } from "@/lib/stripe";

type SubscriptionWebhookBody = {
  data?: {
    object?: Record<string, unknown>;
  };
};

export async function POST(request: Request) {
  try {
    const { payload, body } = await readWebhookJson<SubscriptionWebhookBody>(request);
    const signature = request.headers.get("x-webhook-signature");
    const verified = verifyWebhookSignature(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
    if (!verified) {
      return json({ error: "Invalid webhook signature" }, 401);
    }

    const object = (body.data?.object ?? {}) as Record<string, unknown>;
    const stripeSubId = String(object.id ?? "");
    const rawUserId = Number((object.metadata as Record<string, unknown> | undefined)?.userId);
    const stripePriceId = String((((object.items as { data?: Array<{ price?: { id?: string } }> } | undefined)?.data ?? [])[0]?.price?.id) ?? "");
    if (!stripeSubId) return json({ error: "Missing subscription id" }, 400);
    if (!Number.isInteger(rawUserId) || rawUserId <= 0) return json({ error: "Invalid user id" }, 400);

    await prisma.subscription.upsert({
      where: { stripeSubId },
      create: {
        userId: rawUserId,
        stripeSubId,
        stripePriceId,
        status: String(object.status ?? "ACTIVE").toUpperCase() as any,
        currentPeriodStart: object.current_period_start ? new Date(Number(object.current_period_start) * 1000) : null,
        currentPeriodEnd: object.current_period_end ? new Date(Number(object.current_period_end) * 1000) : null,
        cancelAtPeriodEnd: Boolean(object.cancel_at_period_end),
      },
      update: {
        stripePriceId: stripePriceId || undefined,
        status: String(object.status ?? "ACTIVE").toUpperCase() as any,
        currentPeriodStart: object.current_period_start ? new Date(Number(object.current_period_start) * 1000) : undefined,
        currentPeriodEnd: object.current_period_end ? new Date(Number(object.current_period_end) * 1000) : undefined,
        cancelAtPeriodEnd: Boolean(object.cancel_at_period_end),
      },
    });

    return json({ received: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Webhook failed" }, 400);
  }
}