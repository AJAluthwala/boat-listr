import { requireUser } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { createPaymentIntent } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { user } = await requireUser(request);
    const body = await readJson<{ amountUSD?: number; description?: string; paymentIntentId?: string; metadata?: Record<string, unknown> }>(request);
    if (!body.amountUSD || body.amountUSD <= 0) return json({ error: "amountUSD is required" }, 400);

    const intent = await createPaymentIntent(body.amountUSD, Object.fromEntries(Object.entries(body.metadata ?? {}).map(([k, v]) => [k, String(v)])));
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amountUSD: body.amountUSD,
        currency: "usd",
        stripePaymentId: intent.id,
        paymentIntentId: intent.id,
        status: "pending",
        description: body.description ?? null,
        metadata: (body.metadata ?? undefined) as any,
      },
    });

    return json({ payment, clientSecret: intent.clientSecret }, 201);
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}