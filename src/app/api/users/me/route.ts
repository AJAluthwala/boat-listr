import { getBearerToken, requireUser } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { user } = await requireUser(request);
    return json({ user });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}

export async function PATCH(request: Request) {
  try {
    const { user } = await requireUser(request);
    const body = await readJson<{ name?: string; address?: string; contactNumber?: string }>(request);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name?.trim() || undefined,
        address: body.address?.trim() ?? undefined,
        contactNumber: body.contactNumber?.trim() ?? undefined,
      },
    });

    return json({ user: updated });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}