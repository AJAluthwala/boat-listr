import { requireUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/permissions";
import { json, parseId } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
	const { id: rawId } = await context.params;
	const id = parseId(rawId);
	if (!id) return json({ error: "Invalid id" }, 400);

	try {
		const { user } = await requireUser(request);
		if (!canAccessAdmin(user.role)) return json({ error: "Forbidden" }, 403);

		const existing = await prisma.listing.findUnique({ where: { id } });
		if (!existing) return json({ error: "Not found" }, 404);

		await prisma.listing.delete({ where: { id } });
		return json({ ok: true });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to delete listing";
		const status = message === "Unauthorized" ? 401 : 500;
		return json({ error: message }, status);
	}
}
