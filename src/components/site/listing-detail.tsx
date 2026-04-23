"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import MediaGallery, { MediaItem } from "@/components/listings/media-gallery";

type ListingDetailDto = {
  id: number;
  title: string;
  category: string;
  location: string;
  shortDescription: string;
  valueUSD: number;
  manufacturedYear: number;
  fuelType?: string | null;
  lengthFt?: number | null;
  condition?: string | null;
  media?: MediaItem[];
  seller?: {
    id: number;
    name: string;
  } | null;
};

export default function ListingDetail() {
  const params = useParams<{ id?: string }>();
  const [item, setItem] = useState<ListingDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const listingId = params?.id;

  useEffect(() => {
    let active = true;

    async function load() {
      if (!listingId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/listings/${listingId}`);
        const payload = (await response.json()) as { listing?: ListingDetailDto; item?: ListingDetailDto };

        if (active) {
          setItem(payload.listing ?? payload.item ?? null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [listingId]);

  if (loading) {
    return (
      <div className="bl-market-detail">
        <article className="bl-market-panel">Loading listing...</article>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bl-market-detail">
        <article className="bl-market-panel">
          <h1>Listing not available</h1>
          <p>This listing could not be found. Try browsing active boats.</p>
          <div className="bl-market-actions">
            <Button asChild>
              <Link href="/listings">Back to listings</Link>
            </Button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="bl-market-detail">
      <article className="bl-market-panel">
        <div className="bl-market-gallery">
          <MediaGallery media={item.media ?? []} listingId={item.id} editable={false} />
        </div>

        <div className="bl-market-detail-head">
          <div>
            <Badge tone="info">{item.category}</Badge>
            <h1>{item.title}</h1>
            <p>{item.location} · Listed recently</p>
          </div>
          <div className="bl-market-price">${item.valueUSD.toLocaleString()}</div>
        </div>

        <div className="bl-market-spec-grid">
          <div>
            <strong>{item.manufacturedYear}</strong>
            <span>Year</span>
          </div>
          <div>
            <strong>{item.lengthFt ?? "-"} ft</strong>
            <span>Length</span>
          </div>
          <div>
            <strong>{item.fuelType ?? "N/A"}</strong>
            <span>Fuel</span>
          </div>
          <div>
            <strong>{item.condition ?? "N/A"}</strong>
            <span>Condition</span>
          </div>
        </div>

        <p className="bl-market-description">{item.shortDescription}</p>
      </article>

      <aside className="bl-market-panel">
        <h2>Seller information</h2>
        <p>
          <strong>{item.seller?.name ?? "Verified Seller"}</strong>
        </p>
        <p className="bl-market-muted">Usually replies in under an hour.</p>
        <div className="bl-market-actions">
          <Button asChild>
            <Link href="/messages">Message seller</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/favorites">Save listing</Link>
          </Button>
        </div>
        <hr className="bl-separator" />
        <h3>Buyer safety tips</h3>
        <ul className="bl-market-list">
          <li>Meet in secure marinas or broker offices.</li>
          <li>Verify ownership and maintenance logs.</li>
          <li>Use documented payment channels.</li>
        </ul>
      </aside>

      <style jsx>{`
        .bl-market-gallery {
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
}
