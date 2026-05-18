"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BoatCard } from "@/components/listings/boat-card";
import { BoatCardSkeleton } from "@/components/listings/boat-card-skeleton";
import type { Listing } from "@/components/listings/types";

const SHIMMER_KEYFRAMES = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const ArrowIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function FeaturedListings() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/listings?page=1&pageSize=6");
        const data = (await res.json()) as { items?: Listing[] };
        if (active) setItems(data.items ?? []);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Hide section entirely when there are no listings (e.g. fresh install)
  if (!loading && items.length === 0) return null;

  return (
    <section
      style={{
        display: "grid",
        gap: "2.5rem",
        width: "100%",
        maxWidth: 1420,
        marginInline: "auto"
      }}
    >
      <style>{SHIMMER_KEYFRAMES}</style>

      {/* Section header — same toolbar pattern as the listings page */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap"
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#1883ff",
              marginBottom: "0.4rem"
            }}
          >
            Just listed
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 800,
              color: "#0a3d62",
              letterSpacing: "-0.02em",
              lineHeight: 1.2
            }}
          >
            Featured Listings
          </h2>
          <p
            style={{
              margin: "0.4rem 0 0",
              color: "#55657a",
              fontSize: "0.95rem",
              fontWeight: 500
            }}
          >
            The latest boats from sellers across the marketplace
          </p>
        </div>

        <Link
          href="/listings"
          className="bl-featured-browse-all"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "0.7rem 1.4rem",
            background: "#0a3d62",
            color: "#ffffff",
            border: "none",
            borderRadius: 999,
            fontWeight: 700,
            fontSize: "0.9rem",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 20px rgba(10, 61, 98, 0.25)",
            transition: "background 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease"
          }}
        >
          Browse all
          <ArrowIcon />
        </Link>

        <style>{`
          .bl-featured-browse-all:hover {
            background: #1883ff !important;
            transform: translateY(-1px);
            box-shadow: 0 10px 24px rgba(24, 131, 255, 0.3) !important;
          }
        `}</style>
      </div>

      {/* Grid — reuses the same 3-column class as the listings page */}
      <div className="bl-listing-grid">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <BoatCardSkeleton key={`fl-skel-${i}`} />)
          : items.map((listing) => <BoatCard key={listing.id} listing={listing} />)}
      </div>
    </section>
  );
}
