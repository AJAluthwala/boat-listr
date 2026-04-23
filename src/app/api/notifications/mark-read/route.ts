import { requireUser } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const { user } = await requireUser(request);
    const body = await readJson<{ notificationId?: number }>(request);

    if (body.notificationId) {
      await prisma.notification.updateMany({ where: { id: body.notificationId, userId: user.id }, data: { read: true } });
    } else {
      await prisma.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } });
    }

    return json({ message: "Marked as read" });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}