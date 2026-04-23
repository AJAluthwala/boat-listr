import { requireUser } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { user } = await requireUser(request);
    const notifications = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    return json({ notifications });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireUser(request);
    const body = await readJson<{ type?: string; title?: string; body?: string }>(request);
    if (!body.type || !body.title || !body.body) return json({ error: "type, title, and body are required" }, 400);

    const notification = await prisma.notification.create({ data: { userId: user.id, type: body.type, title: body.title, body: body.body } });
    return json({ notification }, 201);
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}