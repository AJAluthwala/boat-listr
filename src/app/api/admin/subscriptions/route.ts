import { requireUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/permissions";
import { json, parsePage } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
	try {
		const { user } = await requireUser(request);
		if (!canAccessAdmin(user.role)) return json({ error: "Forbidden" }, 403);

		const { page, pageSize, skip } = parsePage(request, 1, 20);
		const [total, items] = await Promise.all([
			prisma.subscription.count(),
			prisma.subscription.findMany({
				include: {
					user: {
						select: { id: true, name: true, email: true },
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: pageSize,
			}),
		]);

		return json({ items, page, pageSize, total });
	} catch {
		return json({ error: "Unauthorized" }, 401);
	}
}
