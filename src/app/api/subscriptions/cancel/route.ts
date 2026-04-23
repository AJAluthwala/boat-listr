import { requireUser } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { user } = await requireUser(request);
    const body = await readJson<{ stripeSubId?: string }>(request);
    if (!body.stripeSubId) return json({ error: "stripeSubId is required" }, 400);

    const subscription = await prisma.subscription.updateMany({ where: { stripeSubId: body.stripeSubId, userId: user.id }, data: { status: "CANCELED", cancelAtPeriodEnd: true } });
    return json({ subscription });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}