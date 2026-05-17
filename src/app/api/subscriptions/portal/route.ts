import { requireUser } from "@/lib/auth";
import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getAppUrl, getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
	try {
		const { user } = await requireUser(request);

		const subscription = await prisma.subscription.findFirst({
			where: { userId: user.id },
			orderBy: { createdAt: "desc" },
		});

		if (!subscription) {
			return json({ error: "No subscription found" }, 404);
		}

		const stripe = getStripe();
		const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubId);
		const customerId =
			typeof stripeSub.customer === "string" ? stripeSub.customer : stripeSub.customer.id;

		const session = await stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: `${getAppUrl()}/dashboard/subscriptions`,
		});

		return json({ url: session.url });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to open portal";
		return json({ error: message }, 500);
	}
}
