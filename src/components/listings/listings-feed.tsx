"use client";

import { BoatCard } from "./boat-card";
import { BoatCardSkeleton } from "./boat-card-skeleton";
import { SORT_OPTIONS } from "./sort";
import type { Listing, SortOption } from "./types";

const SKELETON_COUNT = 6;

type ListingsFeedProps = {
  items: Listing[];
  loading: boolean;
  sortBy: SortOption;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onResetFilters?: () => void;
};

const CHEVRON_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%231e6091' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")";

const FeedToolbar = ({
  count,
  loading,
  sortBy,
  onSortChange
}: {
  count: number;
  loading: boolean;
  sortBy: SortOption;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="bl-market-toolbar">
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "#1883ff"
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#1883ff",
            boxShadow: "0 0 0 4px rgba(24,131,255,0.18)"
          }}
        />
        Boats for sale
      </span>
      <h2
        style={{
          margin: 0,
          fontSize: "1.55rem",
          fontWeight: 800,
          color: "#0a3d62",
          letterSpacing: "-0.02em",
          lineHeight: 1.2
        }}
      >
        Browse boats from sellers nationwide
      </h2>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#55657a",
          fontSize: "0.9rem",
          fontWeight: 500
        }}
      >
        {loading ? (
          <>
            <span
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: "2px solid #cfe2ef",
                borderTopColor: "#1883ff",
                animation: "shimmer-spin 0.9s linear infinite"
              }}
            />
            Loading listings…
          </>
        ) : (
          <>
            <strong
              style={{
                color: "#0a3d62",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums"
              }}
            >
              {count.toLocaleString()}
            </strong>
            {count === 1 ? "boat" : "boats"} available
          </>
        )}
      </div>
    </div>

    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10
      }}
    >
      <label
        htmlFor="bl-sort-select"
        style={{
          fontSize: "0.78rem",
          fontWeight: 700,
          color: "#0a3d62",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          whiteSpace: "nowrap"
        }}
      >
        Sort by
      </label>
      <select
        id="bl-sort-select"
        value={sortBy}
        onChange={onSortChange}
        disabled={loading}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          padding: "0.55rem 2.2rem 0.55rem 0.9rem",
          borderRadius: 12,
          border: "1px solid #e1eef5",
          background: `#f6fafd ${CHEVRON_SVG} no-repeat right 0.75rem center`,
          color: "#0a3d62",
          fontSize: "0.9rem",
          fontWeight: 600,
          opacity: loading ? 0.55 : 1,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease"
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#1883ff";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(24,131,255,0.12)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#e1eef5";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const EmptyResults = ({ onResetFilters }: { onResetFilters?: () => void }) => (
  <div
    style={{
      gridColumn: "1 / -1",
      background: "#ffffff",
      border: "1px dashed #b2e0f2",
      borderRadius: 20,
      padding: "3rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      boxShadow: "0 8px 20px rgba(10,61,98,0.05)",
      minHeight: 320
    }}
  >
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: "50%",
        background:
          "linear-gradient(140deg, #e0f2fe 0%, #f0f9ff 60%, #ffffff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.25rem",
        border: "1px solid #d3ecf6"
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0284c7"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>
    <h3
      style={{
        margin: 0,
        marginBottom: "0.5rem",
        fontSize: "1.25rem",
        fontWeight: 700,
        color: "#0a3d62"
      }}
    >
      No boats match your filters
    </h3>
    <p
      style={{
        margin: 0,
        marginBottom: onResetFilters ? "1.25rem" : 0,
        color: "#55657a",
        fontSize: "0.95rem",
        maxWidth: 420,
        lineHeight: 1.5
      }}
    >
      Try adjusting your filters or clearing them to see all available
      listings.
    </p>
    {onResetFilters && (
      <button
        type="button"
        onClick={onResetFilters}
        style={{
          background: "#1883ff",
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: "0.65rem 1.4rem",
          fontWeight: 600,
          fontSize: "0.92rem",
          cursor: "pointer",
          boxShadow: "0 6px 14px rgba(24,131,255,0.25)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 8px 18px rgba(24,131,255,0.32)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 6px 14px rgba(24,131,255,0.25)";
        }}
      >
        Reset filters
      </button>
    )}
  </div>
);

export const ListingsFeed = ({
  items,
  loading,
  sortBy,
  onSortChange,
  onResetFilters
}: ListingsFeedProps) => (
  <section className="bl-market-feed">
    <FeedToolbar
      count={items.length}
      loading={loading}
      sortBy={sortBy}
      onSortChange={onSortChange}
    />

    <div className="bl-listing-grid">
      {loading &&
        Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <BoatCardSkeleton key={`skeleton-${i}`} />
        ))}

      {!loading && items.length === 0 && (
        <EmptyResults onResetFilters={onResetFilters} />
      )}

      {!loading &&
        items.map((listing) => <BoatCard key={listing.id} listing={listing} />)}
    </div>
  </section>
);

export default ListingsFeed;
