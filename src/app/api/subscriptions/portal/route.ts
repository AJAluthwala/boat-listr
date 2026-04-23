import { requireUser } from "@/lib/auth";
import { json } from "@/lib/api";
import { createSubscriptionPortalUrl } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { user } = await requireUser(request);
    const url = await createSubscriptionPortalUrl(user.stripeCustomerId ?? String(user.id));
    return json({ url });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}