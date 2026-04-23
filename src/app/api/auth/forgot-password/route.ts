import { issueResetToken, normalizeEmail } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ email?: string }>(request);
    const email = normalizeEmail(body.email);
    if (!email) {
      return json({ error: "email is required" }, 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return json({ message: "If the email exists, a reset token was generated" });
    }

    const reset = await issueResetToken(user.id);
    await sendMail(email, "Boat Listr password reset", `Use this reset token: ${reset.token}`);

    return json({ message: "If the email exists, a reset email has been sent" });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Reset request failed" }, 400);
  }
}