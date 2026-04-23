import { requireUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/permissions";
import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { user } = await requireUser(request);
    if (!canAccessAdmin(user.role)) return json({ error: "Forbidden" }, 403);

    const [users, listings, payments, notifications] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.payment.count(),
      prisma.notification.count(),
    ]);

    return json({ users, listings, payments, notifications });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}