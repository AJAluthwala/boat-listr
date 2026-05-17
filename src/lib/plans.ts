export type PlanKey = "free" | "premium";

export type Plan = {
	key: PlanKey;
	name: string;
	priceUSD: number;
	billingPeriod: string;
	tagline: string;
	maxPhotos: number;
	maxVideos: number;
	videoDurationSec: number;
	durationLabel: string;
	features: string[];
};

export const PLANS: Record<PlanKey, Plan> = {
	free: {
		key: "free",
		name: "Free Listing",
		priceUSD: 0,
		billingPeriod: "7 days",
		tagline: "Try it out",
		maxPhotos: 10,
		maxVideos: 1,
		videoDurationSec: 30,
		durationLabel: "7-day listing",
		features: [
			"Up to 10 photos",
			"1 video (30 seconds)",
			"Basic listing features",
			"Mobile-friendly display",
		],
	},
	premium: {
		key: "premium",
		name: "Premium Listing",
		priceUSD: 47,
		billingPeriod: "month",
		tagline: "Most Popular",
		maxPhotos: 25,
		maxVideos: 3,
		videoDurationSec: 60,
		durationLabel: "per month, auto-renew",
		features: [
			"Up to 25 photos",
			"3 videos (60 seconds each)",
			"30-day auto-renewal",
			"Priority search placement",
			"Sales analytics & insights",
		],
	},
};
