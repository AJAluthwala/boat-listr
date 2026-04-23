export type ListingInput = {
	title?: string;
	category?: string;
	manufacturedYear?: number;
	lengthFt?: number;
	shortDescription?: string;
	mainDescription?: string;
	location?: string;
	valueUSD?: number;
	status?: string;
	freeEndsAt?: string | Date | null;
	paidEndsAt?: string | Date | null;
	engine?: string | null;
	totalPowerHP?: number | null;
	brand?: string | null;
	capacity?: number | null;
	userId?: number;
};

export function isValidStatus(status: string | undefined, allowed: string[]) {
	return Boolean(status && allowed.includes(status));
}
