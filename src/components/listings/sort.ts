import type { Listing, SortOption } from "./types";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "year-desc", label: "Year: New to Old" },
  { value: "year-asc", label: "Year: Old to New" }
];

export function sortListings(items: Listing[], sortBy: SortOption): Listing[] {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case "price-desc":
        return b.valueUSD - a.valueUSD;
      case "price-asc":
        return a.valueUSD - b.valueUSD;
      case "year-desc":
        return b.manufacturedYear - a.manufacturedYear;
      case "year-asc":
        return a.manufacturedYear - b.manufacturedYear;
      case "newest":
      default:
        return b.id - a.id;
    }
  });
}
