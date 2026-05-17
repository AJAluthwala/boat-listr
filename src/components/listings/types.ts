export type ListingMedia = {
  url?: string;
  kind?: string;
  mimeType?: string;
  isPrimary?: boolean;
  sortOrder?: number;
};

export type Listing = {
  id: number;
  title: string;
  category: string;
  location: string;
  valueUSD: number;
  shortDescription: string;
  manufacturedYear: number;
  lengthFt?: number;
  media?: ListingMedia[];
};

export type SortOption =
  | "newest"
  | "price-desc"
  | "price-asc"
  | "year-desc"
  | "year-asc";
