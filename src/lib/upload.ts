const DEFAULT_SAFE_FILE_NAME = "file";

function sanitizeFileName(fileName: string): string {
	const cleaned = fileName
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9._-]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");

	return cleaned || DEFAULT_SAFE_FILE_NAME;
}

export function buildS3ObjectKey(params: {
	listingId?: number;
	fileName: string;
	mediaType: "image" | "video";
}): string {
	const date = new Date();
	const y = date.getUTCFullYear();
	const m = String(date.getUTCMonth() + 1).padStart(2, "0");
	const d = String(date.getUTCDate()).padStart(2, "0");
	const nonce = crypto.randomUUID();
	const safeFileName = sanitizeFileName(params.fileName);
	const listingPrefix = params.listingId ? `listing-${params.listingId}` : "unassigned";

	return `${params.mediaType}/${listingPrefix}/${y}/${m}/${d}/${nonce}-${safeFileName}`;
}

export function isValidImageMimeType(contentType: string): boolean {
	return /^image\/(jpeg|jpg|png|webp|gif|avif)$/i.test(contentType);
}

export function isValidVideoMimeType(contentType: string): boolean {
	return /^video\/(mp4|quicktime|webm|x-matroska)$/i.test(contentType);
}
