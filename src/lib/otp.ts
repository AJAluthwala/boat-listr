import { createHash, randomInt } from "node:crypto";

export const OTP_TTL_MINUTES = 10;

export function generateOtp(): string {
	return String(randomInt(10000, 100000));
}

export function hashOtpToken(userId: number, email: string, otp: string): string {
	const hash = createHash("sha256")
		.update(`${userId}:${email}:${otp}`)
		.digest("hex");
	return `otp_${hash}`;
}
