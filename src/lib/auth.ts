import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken, isPrefixedToken } from "@/lib/jwt";
export { normalizeEmail, validatePassword } from "@/lib/validations/auth";
export { isPrefixedToken } from "@/lib/jwt";

const PASSWORD_KEYLEN = 64;
const SESSION_PREFIX = "session";
const RESET_PREFIX = "reset";
const DEFAULT_SESSION_DAYS = 30;

export type AuthUser = Awaited<ReturnType<typeof findUserBySessionToken>>;

export function hashPassword(password: string): string {
	const salt = randomBytes(16).toString("hex");
	const derived = scryptSync(password, salt, PASSWORD_KEYLEN).toString("hex");
	return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
	const [salt, expectedHex] = storedHash.split(":");
	if (!salt || !expectedHex) {
		return false;
	}

	const actualHex = scryptSync(password, salt, PASSWORD_KEYLEN).toString("hex");
	return timingSafeEqual(Buffer.from(actualHex, "hex"), Buffer.from(expectedHex, "hex"));
}

export function getBearerToken(request: NextRequest | Request): string | null {
	const authorization = request.headers.get("authorization");
	if (authorization?.startsWith("Bearer ")) {
		return authorization.slice(7).trim();
	}

	return request.headers.get("x-session-token") ?? request.headers.get("x-auth-token");
}

export async function issueSession(userId: number) {
	const token = createToken(SESSION_PREFIX);
	const expiresAt = new Date(Date.now() + DEFAULT_SESSION_DAYS * 24 * 60 * 60 * 1000);

	await prisma.refreshToken.create({
		data: { token, userId, expiresAt },
	});

	return { token, expiresAt };
}

export async function issueResetToken(userId: number) {
	const token = createToken(RESET_PREFIX);
	const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

	await prisma.refreshToken.create({
		data: { token, userId, expiresAt },
	});

	return { token, expiresAt };
}

export async function findUserBySessionToken(token: string | null | undefined) {
	if (!token || !isPrefixedToken(token, SESSION_PREFIX)) {
		return null;
	}

	const session = await prisma.refreshToken.findUnique({
		where: { token },
		include: { user: true },
	});

	if (!session || session.revoked || session.expiresAt <= new Date()) {
		return null;
	}

	return session.user;
}

export async function requireUser(request: NextRequest | Request) {
	const token = getBearerToken(request);
	const user = await findUserBySessionToken(token);

	if (!user) {
		throw new Error("Unauthorized");
	}

	return { user, token: token as string };
}

export function isAdminRole(role: string | null | undefined): boolean {
	return String(role ?? "").toUpperCase() === "ADMIN";
}
