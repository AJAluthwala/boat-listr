"use client";

import React from "react";
import { FILTER_DATA } from "./constants";
import { ChipSelector } from "./filters/chip-selector";
import { AutocompleteInput } from "./filters/autocomplete-input";
import { RangeInput } from "./filters/range-input";
import type { ListingFilters } from "./hooks/use-listing-filters";

type BoatFiltersProps = {
  filters: ListingFilters;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
};

const sectionIconStyle = {
  width: 14,
  height: 14
} as const;

const TagIcon = () => (
  <svg {...sectionIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41L13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const StarIcon = () => (
  <svg {...sectionIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const EngineIcon = () => (
  <svg {...sectionIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const BoltIcon = () => (
  <svg {...sectionIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const RulerIcon = () => (
  <svg {...sectionIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="4" rx="1" />
    <path d="M7 11V7M11 11V8M15 11V7M19 11V8" />
  </svg>
);

const UsersIcon = () => (
  <svg {...sectionIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DollarIcon = () => (
  <svg {...sectionIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const PinIcon = () => (
  <svg {...sectionIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg {...sectionIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const countActiveFilters = (filters: ListingFilters): number => {
  const values = [
    filters.category,
    filters.brand,
    filters.year,
    filters.minPrice,
    filters.maxPrice,
    filters.minPower,
    filters.maxPower,
    filters.minLength,
    filters.maxLength,
    filters.minCapacity,
    filters.maxCapacity,
    filters.locationAutocomplete.value,
    filters.engineAutocomplete.value
  ];
  return values.filter((v) => v && v.length > 0).length;
};

export const BoatFilters = ({
  filters,
  onSubmit,
  onReset
}: BoatFiltersProps) => {
  const activeCount = countActiveFilters(filters);
  const hasActive = activeCount > 0;

  return (
    <aside className="bl-market-sidebar">
      <form onSubmit={onSubmit}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.1rem",
            paddingBottom: "0.85rem",
            borderBottom: "1px solid #eef4f8"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3
              style={{
                margin: 0,
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#0a3d62",
                letterSpacing: "-0.01em"
              }}
            >
              Find Your Boat
            </h3>
            {hasActive && (
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  background: "#1883ff",
                  padding: "2px 8px",
                  borderRadius: 999,
                  minWidth: 20,
                  textAlign: "center"
                }}
              >
                {activeCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onReset}
            disabled={!hasActive}
            style={{
              background: "none",
              border: "none",
              color: hasActive ? "#1883ff" : "#aabac9",
              cursor: hasActive ? "pointer" : "not-allowed",
              fontWeight: 600,
              fontSize: "0.85rem",
              padding: 0,
              transition: "color 0.2s ease"
            }}
          >
            Clear all
          </button>
        </div>

        <div className="bl-stack">
          <ChipSelector
            label="Category"
            options={FILTER_DATA.categories}
            selected={filters.category}
            onSelect={filters.setCategory}
            icon={<TagIcon />}
          />

          <ChipSelector
            label="Brand"
            options={FILTER_DATA.brands}
            selected={filters.brand}
            onSelect={filters.setBrand}
            scrollable
            icon={<StarIcon />}
          />

          <AutocompleteInput
            label="Engine"
            placeholder="Engine type or model"
            autocompleteHook={filters.engineAutocomplete}
            icon={<EngineIcon />}
          />

          <RangeInput
            label="Power (HP)"
            minPlaceholder="Min"
            maxPlaceholder="Max"
            minValue={filters.minPower}
            maxValue={filters.maxPower}
            onMinChange={filters.setMinPower}
            onMaxChange={filters.setMaxPower}
            icon={<BoltIcon />}
          />

          <RangeInput
            label="Length (ft)"
            minPlaceholder="Min"
            maxPlaceholder="Max"
            minValue={filters.minLength}
            maxValue={filters.maxLength}
            onMinChange={filters.setMinLength}
            onMaxChange={filters.setMaxLength}
            icon={<RulerIcon />}
          />

          <RangeInput
            label="Capacity (people)"
            minPlaceholder="Min"
            maxPlaceholder="Max"
            minValue={filters.minCapacity}
            maxValue={filters.maxCapacity}
            onMinChange={filters.setMinCapacity}
            onMaxChange={filters.setMaxCapacity}
            icon={<UsersIcon />}
          />

          <RangeInput
            label="Price (USD)"
            minPlaceholder="Min $"
            maxPlaceholder="Max $"
            minValue={filters.minPrice}
            maxValue={filters.maxPrice}
            onMinChange={filters.setMinPrice}
            onMaxChange={filters.setMaxPrice}
            icon={<DollarIcon />}
          />

          <AutocompleteInput
            label="Location"
            placeholder="Search by state"
            autocompleteHook={filters.locationAutocomplete}
            icon={<PinIcon />}
          />

          <ChipSelector
            label="Year"
            options={FILTER_DATA.years}
            selected={filters.year}
            onSelect={filters.setYear}
            scrollable
            icon={<CalendarIcon />}
          />

          <button
            type="submit"
            style={{
              marginTop: "0.4rem",
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: 14,
              padding: "0.8rem 1rem",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(24, 131, 255, 0.28)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 10px 22px rgba(24, 131, 255, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 18px rgba(24, 131, 255, 0.28)";
            }}
          >
            <SearchIcon />
            Show Boats
          </button>
        </div>
      </form>
    </aside>
  );
};

export default BoatFilters;
