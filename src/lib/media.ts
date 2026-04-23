import { createPresignedReadUrl } from "@/lib/s3";

type MediaRecord = {
	id?: number;
	url?: string | null;
	s3Key?: string | null;
	kind?: string | null;
	mimeType?: string | null;
	isPrimary?: boolean | null;
	sortOrder?: number | null;
	createdAt?: Date | string | null;
};

type ListingWithMedia = {
	media?: MediaRecord[] | null;
};

async function signMediaRecord<TMedia extends MediaRecord>(media: TMedia): Promise<TMedia> {
	let key = media.s3Key ?? null;

	if (!key && media.url) {
		try {
			const parsed = new URL(media.url);
			if (parsed.hostname.includes("amazonaws.com")) {
				key = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
			}
		} catch {
			key = null;
		}
	}

	if (!key) {
		return media;
	}

	return {
		...media,
		url: await createPresignedReadUrl({ key }),
	};
}

export async function signListingMediaUrls(listing: any): Promise<any> {
	if (!listing.media?.length) {
		return listing;
	}

	return {
		...listing,
		media: await Promise.all(listing.media.map((media: MediaRecord) => signMediaRecord(media))),
	};
}

export async function signListingsMediaUrls(listings: any[]): Promise<any[]> {
	return Promise.all(listings.map((listing) => signListingMediaUrls(listing)));
}

export async function signMediaUrls(media: MediaRecord[]): Promise<MediaRecord[]> {
	return Promise.all(media.map((item: MediaRecord) => signMediaRecord(item)));
}
