import { requireUser } from "@/lib/auth";
import { json, parseId } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return json({ error: "Invalid id" }, 400);

  try {
    const { user } = await requireUser(request);
    const conversation = await prisma.conversation.findFirst({
      where: { id, participants: { some: { userId: user.id } } },
      include: { listing: true, participants: { include: { user: { select: { id: true, name: true, email: true } } } }, messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!conversation) return json({ error: "Not found" }, 404);
    return json({ conversation });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return json({ error: "Invalid id" }, 400);

  try {
    const { user } = await requireUser(request);
    const conversation = await prisma.conversation.findFirst({ where: { id, participants: { some: { userId: user.id } } } });
    if (!conversation) return json({ error: "Not found" }, 404);
    await prisma.conversation.delete({ where: { id } });
    return json({ message: "Deleted" });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}