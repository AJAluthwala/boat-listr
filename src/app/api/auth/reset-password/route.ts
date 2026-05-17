import { hashPassword, normalizeEmail } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { hashOtpToken } from "@/lib/otp";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		const body = await readJson<{ email?: string; otp?: string; password?: string }>(request);
		const email = normalizeEmail(body.email);
		const otp = (body.otp ?? "").trim();
		const password = body.password ?? "";

		if (!email) return json({ error: "Email is required" }, 400);
		if (!/^\d{5}$/.test(otp)) return json({ error: "Enter the 5-digit code" }, 400);
		if (password.length < 8) {
			return json({ error: "Password must be at least 8 characters" }, 400);
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return json({ error: "Invalid code or expired" }, 400);

		const expectedToken = hashOtpToken(user.id, email, otp);
		const record = await prisma.refreshToken.findUnique({ where: { token: expectedToken } });

		if (!record || record.userId !== user.id || record.revoked || record.expiresAt <= new Date()) {
			return json({ error: "Invalid code or expired" }, 400);
		}

		await prisma.$transaction([
			prisma.user.update({
				where: { id: user.id },
				data: { passwordHash: hashPassword(password) },
			}),
			prisma.refreshToken.update({
				where: { token: expectedToken },
				data: { revoked: true },
			}),
		]);

		return json({ message: "Password updated. You can now sign in." });
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : "Reset failed" },
			400,
		);
	}
}
