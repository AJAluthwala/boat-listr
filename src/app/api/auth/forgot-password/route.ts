import { normalizeEmail } from "@/lib/auth";
import { json, readJson } from "@/lib/api";
import { renderOtpEmail, sendMail } from "@/lib/mail";
import { generateOtp, hashOtpToken, OTP_TTL_MINUTES } from "@/lib/otp";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		const body = await readJson<{ email?: string }>(request);
		const email = normalizeEmail(body.email);
		if (!email) {
			return json({ error: "Email is required" }, 400);
		}

		const user = await prisma.user.findUnique({ where: { email } });

		// Always return success to avoid leaking which emails are registered
		const genericResponse = json({
			message: "If the email exists, a 5-digit code has been sent.",
		});

		if (!user) {
			return genericResponse;
		}

		const otp = generateOtp();
		const token = hashOtpToken(user.id, email, otp);
		const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

		// Invalidate any previous OTPs for this user
		await prisma.refreshToken.deleteMany({
			where: {
				userId: user.id,
				token: { startsWith: "otp_" },
			},
		});

		await prisma.refreshToken.create({
			data: { token, userId: user.id, expiresAt },
		});

		const { text, html } = renderOtpEmail(otp, OTP_TTL_MINUTES);
		await sendMail(email, "Your BoatListr password reset code", text, { html });

		return genericResponse;
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : "Reset request failed" },
			400,
		);
	}
}
