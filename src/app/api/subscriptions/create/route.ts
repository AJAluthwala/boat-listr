import { requireUser } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { user } = await requireUser(request);
    const body = await readJson<{ stripeSubId?: string; stripePriceId?: string; status?: string; currentPeriodStart?: string; currentPeriodEnd?: string; cancelAtPeriodEnd?: boolean }>(request);
    if (!body.stripeSubId) return json({ error: "stripeSubId is required" }, 400);

    const subscription = await prisma.subscription.upsert({
      where: { stripeSubId: body.stripeSubId },
      create: {
        userId: user.id,
        stripeSubId: body.stripeSubId,
        stripePriceId: body.stripePriceId ?? null,
        status: (body.status ? String(body.status).toUpperCase() : "ACTIVE") as any,
        currentPeriodStart: body.currentPeriodStart ? new Date(body.currentPeriodStart) : null,
        currentPeriodEnd: body.currentPeriodEnd ? new Date(body.currentPeriodEnd) : null,
        cancelAtPeriodEnd: Boolean(body.cancelAtPeriodEnd),
      },
      update: {
        stripePriceId: body.stripePriceId ?? undefined,
        status: body.status ? (String(body.status).toUpperCase() as any) : undefined,
        currentPeriodStart: body.currentPeriodStart ? new Date(body.currentPeriodStart) : undefined,
        currentPeriodEnd: body.currentPeriodEnd ? new Date(body.currentPeriodEnd) : undefined,
        cancelAtPeriodEnd: body.cancelAtPeriodEnd ?? undefined,
      },
    });

    return json({ subscription }, 201);
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}