"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";

type Listing = {
  id: number;
  title: string;
  category: string;
  location: string;
  valueUSD: number;
  shortDescription: string;
  manufacturedYear: number;
  media?: Array<{ url?: string; kind?: string; mimeType?: string; isPrimary?: boolean; sortOrder?: number }>;
};

type ListingMedia = {
  url?: string;
  kind?: string;
  mimeType?: string;
  isPrimary?: boolean;
  sortOrder?: number;
};

function getCoverMedia(listing: Listing) {
  const media = listing.media ?? [];
  const primary = media.find((item) => item.isPrimary);
  const image = media.find((item) => item.kind === "IMAGE" || item.mimeType?.startsWith("image/"));

  return primary ?? image ?? media[0] ?? null;
}

function isImageMedia(media: ListingMedia | null) {
  return Boolean(media && (media.kind === "IMAGE" || media.mimeType?.startsWith("image/")));
}

export default function ListingBrowser() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("500000");
  const [sortBy, setSortBy] = useState("newest");

  const categories = ["All", "Yacht", "Sailboat", "Fishing", "Pontoon", "Jet Boat"];

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const pageSize = 100;
      const params = new URLSearchParams({ page: "1", pageSize: String(pageSize) });
      if (query.trim()) params.set("search", query.trim());

      const firstResponse = await fetch(`/api/listings?${params.toString()}`);
      const firstPage = (await firstResponse.json()) as { items?: Listing[]; total?: number };

      const initialItems = firstPage.items ?? [];
      const total = firstPage.total ?? initialItems.length;
      const pageCount = Math.max(1, Math.ceil(total / pageSize));
      const nextPages: Promise<Response>[] = [];

      for (let page = 2; page <= pageCount; page += 1) {
        const nextParams = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
        if (query.trim()) nextParams.set("search", query.trim());
        nextPages.push(fetch(`/api/listings?${nextParams.toString()}`));
      }

      const remainingPages = await Promise.all(nextPages);
      const remainingItems = await Promise.all(
        remainingPages.map(async (response) => {
          const payload = (await response.json()) as { items?: Listing[] };
          return payload.items ?? [];
        }),
      );

      const data = [...initialItems, ...remainingItems.flat()];
      if (active) {
        setItems(data);
        setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [query]);

  const filteredItems = useMemo(() => {
    const max = Number(maxPrice);
    let next = items.filter((item) => item.valueUSD <= max);
    if (selectedCategory !== "All") {
      next = next.filter((item) => item.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    if (sortBy === "price-low") {
      next = [...next].sort((a, b) => a.valueUSD - b.valueUSD);
    } else if (sortBy === "price-high") {
      next = [...next].sort((a, b) => b.valueUSD - a.valueUSD);
    } else {
      next = [...next].sort((a, b) => b.id - a.id);
    }

    return next;
  }, [items, maxPrice, selectedCategory, sortBy]);

  return (
    <div className="bl-market-shell">
      <aside className="bl-market-sidebar">
        <h3>Filters</h3>
        <p className="bl-market-muted">Narrow what buyers see in the feed.</p>
        <div className="bl-stack">
          <label>
            Search
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Sea Ray, Miami, diesel..." />
          </label>
          <label>
            Max price
            <input type="range" min="10000" max="1000000" step="10000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            <span className="bl-market-muted">Up to ${Number(maxPrice).toLocaleString()}</span>
          </label>
          <label>
            Sort by
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
          <div>
            <p className="bl-market-muted">Category</p>
            <div className="bl-chip-row">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`bl-chip ${selectedCategory === category ? "is-active" : ""}`.trim()}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="bl-market-quick-links">
            <Button asChild><Link href="/listings/create">Sell something</Link></Button>
            <Button variant="secondary" asChild><Link href="/favorites">Saved boats</Link></Button>
          </div>
        </div>
      </aside>

      <section className="bl-market-feed">
        <div className="bl-market-toolbar">
          <div>
            <span className="bl-eyebrow">Boats for sale</span>
            <h2>Today's picks in marketplace</h2>
            <p className="bl-market-muted">{filteredItems.length} results</p>
          </div>
          <div className="bl-chip-row">
            <Badge tone="info">Local pickup</Badge>
            <Badge tone="success">Best response time</Badge>
            <Badge tone="warning">Recently reduced</Badge>
          </div>
        </div>

        <div className="bl-listing-grid">
          {loading ? <article className="bl-market-card"><p>Loading listings...</p></article> : null}
          {!loading && filteredItems.length === 0 ? <article className="bl-market-card"><p>No listings found for this filter set.</p></article> : null}
          {filteredItems.map((listing) => (
            <article key={listing.id} className="bl-market-card">
              {(() => {
                const coverMedia = getCoverMedia(listing);

                if (!coverMedia?.url) {
                  return (
                    <div className="bl-market-image bl-market-image-empty">
                      <span>No cover image</span>
                    </div>
                  );
                }

                if (isImageMedia(coverMedia)) {
                  return (
                    <img
                      className="bl-market-image"
                      src={coverMedia.url}
                      alt={listing.title}
                      loading="lazy"
                    />
                  );
                }

                return (
                  <div className="bl-market-video-cover">
                    <video className="bl-market-image" src={coverMedia.url} muted playsInline />
                    <div className="bl-market-video-badge">Video</div>
                  </div>
                );
              })()}
              <div className="bl-market-card-body">
                <div className="bl-market-price">${listing.valueUSD.toLocaleString()}</div>
                <h3>{listing.title}</h3>
                <p>{listing.location} · {listing.manufacturedYear}</p>
                <p className="bl-market-muted">{listing.shortDescription}</p>
              </div>
              <div className="bl-market-actions">
                <Button asChild><Link href={`/listings/${listing.id}`}>View listing</Link></Button>
                <Button variant="secondary" asChild><Link href="/messages">Message</Link></Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
