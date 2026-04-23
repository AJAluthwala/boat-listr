import { randomUUID } from "node:crypto";

export function createToken(prefix = "token"): string {
	return `${prefix}_${randomUUID().replace(/-/g, "")}`;
}

export function isPrefixedToken(token: string, prefix: string): boolean {
	return token.startsWith(`${prefix}_`);
}
