import type { Listing, ListingMedia } from "./types";

export function getCoverMedia(listing: Listing) {
  const media = listing.media ?? [];
  const primary = media.find((item) => item.isPrimary);
  const image = media.find(
    (item) =>
      item.kind === "IMAGE" || item.mimeType?.startsWith("image/")
  );

  return primary ?? image ?? media[0] ?? null;
}

export function isImageMedia(media: ListingMedia | null) {
  return Boolean(
    media &&
      (media.kind === "IMAGE" || media.mimeType?.startsWith("image/"))
  );
}
