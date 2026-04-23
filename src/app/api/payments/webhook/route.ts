import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { readWebhookJson, verifyWebhookSignature } from "@/lib/stripe";
import { Prisma } from "@prisma/client";

type PaymentWebhookBody = {
  type?: string;
  data?: {
    object?: Record<string, unknown>;
  };
};

export async function POST(request: Request) {
  try {
    const { payload, body } = await readWebhookJson<PaymentWebhookBody>(request);
    const signature = request.headers.get("x-webhook-signature");
    const verified = verifyWebhookSignature(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
    if (!verified) {
      return json({ error: "Invalid webhook signature" }, 401);
    }

    const object = (body.data?.object ?? {}) as Record<string, unknown>;
    const stripePaymentId = String(object.id ?? "");
    const rawUserId = Number((object.metadata as Record<string, unknown> | undefined)?.userId);
    const amountCents = Number(object.amount);
    const currency = String(object.currency ?? "usd");
    const metadata = (object.metadata ?? undefined) as Prisma.InputJsonValue | undefined;
    if (!stripePaymentId) return json({ error: "Missing payment id" }, 400);
    if (!Number.isInteger(rawUserId) || rawUserId <= 0) return json({ error: "Invalid user id" }, 400);
    if (!Number.isFinite(amountCents) || amountCents <= 0) return json({ error: "Invalid amount" }, 400);

    await prisma.payment.upsert({
      where: { stripePaymentId },
      create: {
        userId: rawUserId,
        amountUSD: amountCents / 100,
        currency,
        stripePaymentId,
        paymentIntentId: String(object.payment_intent ?? stripePaymentId),
        status: String(object.status ?? body.type ?? "succeeded"),
        description: String(object.description ?? ""),
        metadata,
      },
      update: {
        status: String(object.status ?? body.type ?? "succeeded"),
        metadata,
      },
    });

    return json({ received: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Webhook failed" }, 400);
  }
}