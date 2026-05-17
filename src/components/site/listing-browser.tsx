"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BoatFilters } from "@/components/listings/boat-filters";
import { ListingsFeed } from "@/components/listings/listings-feed";
import {
  useListingFilters,
  type InitialListingFilters
} from "@/components/listings/hooks/use-listing-filters";
import { useListings } from "@/components/listings/hooks/use-listings";
import { sortListings } from "@/components/listings/sort";
import type { Listing, SortOption } from "@/components/listings/types";

const SHIMMER_KEYFRAMES = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const URL_FILTER_KEYS: (keyof InitialListingFilters)[] = [
  "category",
  "brand",
  "year",
  "minPrice",
  "maxPrice",
  "minPower",
  "maxPower",
  "minLength",
  "maxLength",
  "minCapacity",
  "maxCapacity",
  "location",
  "engine"
];

export default function ListingBrowser() {
  const searchParams = useSearchParams();

  const [initialFromUrl] = useState<InitialListingFilters>(() => {
    const result: InitialListingFilters = {};
    for (const key of URL_FILTER_KEYS) {
      const value = searchParams.get(key);
      if (value) result[key] = value;
    }
    return result;
  });

  const hasUrlFilters = Object.keys(initialFromUrl).length > 0;

  const { allItems, loading } = useListings();
  const filters = useListingFilters(initialFromUrl);

  const [items, setItems] = useState<Listing[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const appliedInitialRef = useRef(false);

  useEffect(() => {
    if (loading || appliedInitialRef.current) return;
    appliedInitialRef.current = true;
    setItems(hasUrlFilters ? filters.apply(allItems) : allItems);
  }, [loading, allItems, hasUrlFilters, filters]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setItems(filters.apply(allItems));
  };

  const handleClear = () => {
    filters.reset();
    setItems(allItems);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value as SortOption;
    setSortBy(newSortBy);
    setItems((current) => sortListings(current, newSortBy));
  };

  return (
    <div className="bl-market-shell">
      <style>{SHIMMER_KEYFRAMES}</style>

      <BoatFilters
        filters={filters}
        onSubmit={handleSubmit}
        onReset={handleClear}
      />

      <ListingsFeed
        items={items}
        loading={loading}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onResetFilters={handleClear}
      />
    </div>
  );
}
