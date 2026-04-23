export type AuthCredentials = {
	email?: string;
	password?: string;
	name?: string;
	address?: string;
	contactNumber?: string;
	role?: string;
};

export function normalizeEmail(email: string | undefined) {
	return email?.trim().toLowerCase() ?? "";
}

export function validatePassword(password: string | undefined) {
	return Boolean(password && password.length >= 8);
}
