export type PaymentInput = {
	amountUSD?: number;
	currency?: string;
	description?: string;
	status?: string;
	paymentIntentId?: string;
	stripePaymentId?: string;
	metadata?: Record<string, unknown>;
};
