import { requireUser } from "@/lib/auth";
import { json, parseId, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return json({ error: "Invalid id" }, 400);

  try {
    const { user } = await requireUser(request);
    const conversation = await prisma.conversation.findFirst({ where: { id, participants: { some: { userId: user.id } } } });
    if (!conversation) return json({ error: "Not found" }, 404);

    const messages = await prisma.message.findMany({ where: { conversationId: id }, include: { sender: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "asc" } });
    return json({ messages });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return json({ error: "Invalid id" }, 400);

  try {
    const { user } = await requireUser(request);
    const conversation = await prisma.conversation.findFirst({ where: { id, participants: { some: { userId: user.id } } } });
    if (!conversation) return json({ error: "Not found" }, 404);

    const body = await readJson<{ body?: string }>(request);
    const text = body.body?.trim();
    if (!text) return json({ error: "body is required" }, 400);

    const message = await prisma.message.create({
      data: { conversationId: id, senderId: user.id, body: text },
      include: { sender: { select: { id: true, name: true, email: true } } },
    });

    await prisma.conversation.update({ where: { id }, data: { updatedAt: new Date() } });
    return json({ message }, 201);
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}