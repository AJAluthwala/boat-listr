"use client";

import { useEffect, useState } from "react";
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
  lengthFt?: number;
  media?: Array<{ url?: string; kind?: string; mimeType?: string; isPrimary?: boolean; sortOrder?: number }>;
};

type ListingMedia = {
  url?: string;
  kind?: string;
  mimeType?: string;
  isPrimary?: boolean;
  sortOrder?: number;
};

// ========================================
// RESPONSIVE STYLES HELPER
// ========================================

const useResponsiveStyles = () => {
  const [styles, setStyles] = useState({
    imageHeight: 240,
    isMobile: false,
    isTablet: false,
  });

  useEffect(() => {
    const updateStyles = () => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

      setStyles({
        imageHeight: isMobile ? 200 : isTablet ? 220 : 240,
        isMobile,
        isTablet,
      });
    };

    updateStyles();
    window.addEventListener("resize", updateStyles);
    return () => window.removeEventListener("resize", updateStyles);
  }, []);

  return styles;
};

// ========================================
// ICON SVG COMPONENTS
// ========================================

const IconSVG = ({ children, color = "#6c757d" }: { children: React.ReactNode; color?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const CalendarIcon = ({ color }: { color?: string }) => (
  <IconSVG color={color}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </IconSVG>
);

const RulerIcon = ({ color }: { color?: string }) => (
  <IconSVG color={color}>
    <rect x="3" y="11" width="18" height="4" rx="2" />
    <path d="M7 11V7M17 11V7" />
  </IconSVG>
);

const LocationIcon = ({ color }: { color?: string }) => (
  <IconSVG color={color}>
    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </IconSVG>
);

// ========================================
// CONSTANTS & DATA
// ========================================

const FILTER_DATA = {
  categories: [
    "Aluminum Fishing Boat",
    "Bass Boat",
    "Jon Boat",
    "Pontoon Boat",
    "Bay Boat",
    "Center Console Boat",
    "Flats Boat",
    "Skiff",
    "Dual Console Boat",
    "Jet Boat",
    "Yacht",
    "Sailboat",
    "Other"
  ],

  brands: [
    "Sea Ray",
    "Viking",
    "Azimut",
    "Invincible",
    "MTI",
    "Freeman",
    "Nor-Tech",
    "Grady White"
  ],

  engineTypes: [
    "Outboard",
    "Inboard",
    "Inboard/Outboard",
    "Jet Drive",
    "Electric",
    "Sail",
    "Pod Drive",
    "Diesel",
    "Gas",
    "Twin Outboard",
    "Triple Outboard"
  ],

  usStates: [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming"
  ],

  years: Array.from({ length: 30 }, (_, i) => String(2026 - i))
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

function getCoverMedia(listing: Listing) {
  const media = listing.media ?? [];
  const primary = media.find((item) => item.isPrimary);
  const image = media.find(
    (item) =>
      item.kind === "IMAGE" || item.mimeType?.startsWith("image/")
  );

  return primary ?? image ?? media[0] ?? null;
}

function isImageMedia(media: ListingMedia | null) {
  return Boolean(
    media &&
      (media.kind === "IMAGE" || media.mimeType?.startsWith("image/"))
  );
}

// ========================================
// CUSTOM HOOKS
// ========================================

const useAutocomplete = (dataSource: string[], maxSuggestions = 5) => {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleChange = (inputValue: string) => {
    setValue(inputValue);

    if (inputValue.length > 0) {
      const filtered = dataSource.filter((item) =>
        item.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered.slice(0, maxSuggestions));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleFocus = () => {
    if (value.length > 0) {
      const filtered = dataSource.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, maxSuggestions));
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (selectedValue: string) => {
    setValue(selectedValue);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const reset = () => {
    setValue("");
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return {
    value,
    setValue,
    showSuggestions,
    suggestions,
    handleChange,
    handleFocus,
    handleBlur,
    handleSuggestionClick,
    reset
  };
};

// ========================================
// SUB-COMPONENT: BoatCard
// ========================================

const BoatCard = ({ listing }: { listing: Listing }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const responsive = useResponsiveStyles();
  const coverMedia = getCoverMedia(listing);

  return (
    <article
      style={{
        cursor: "pointer",
        borderRadius: responsive.isMobile ? "1rem" : "1.25rem",
        overflow: "hidden",
        background: "#ffffff",
        border: "1px solid #e1eef5",
        boxShadow: "0 8px 20px rgba(10,61,98,0.08)",
        transition: "all 0.3s ease",
        position: "relative",
      }}
      className="bl-market-card"
    >
      {/* Image Container with Shimmer Loading */}
      <div
        style={{
          width: "100%",
          height: responsive.imageHeight,
          position: "relative",
          overflow: "hidden",
          background: "#f0f7fa",
        }}
      >
        {(() => {
          if (!coverMedia?.url) {
            return (
              <div 
                className="bl-market-image bl-market-image-empty"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f0f7fa",
                }}
              >
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
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity 0.4s ease",
                  opacity: imageLoading ? 0.5 : 1,
                }}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            );
          }

          return (
            <div className="bl-market-video-cover">
              <video
                className="bl-market-image"
                src={coverMedia.url}
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: imageLoading ? 0.5 : 1,
                  transition: "opacity 0.4s ease",
                }}
                onLoadedData={() => setImageLoading(false)}
              />
              <div className="bl-market-video-badge">Video</div>
            </div>
          );
        })()}

        {/* Shimmer Overlay */}
        {imageLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, rgba(240,247,250,0.8) 25%, rgba(226,237,242,0.8) 50%, rgba(240,247,250,0.8) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.6s infinite",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "45%",
            background: "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0))",
            pointerEvents: "none",
          }}
        />

        {/* Category Badge */}
        {listing.category && (
          <span
            style={{
              position: "absolute",
              top: responsive.isMobile ? 10 : 14,
              left: responsive.isMobile ? 10 : 14,
              background: "rgba(255,255,255,0.95)",
              color: "#0077b6",
              border: "1px solid #b2e0f2",
              borderRadius: 20,
              fontSize: responsive.isMobile ? 11 : 13,
              fontWeight: 600,
              padding: responsive.isMobile ? "4px 10px" : "5px 14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              letterSpacing: 0.5,
            }}
          >
            {listing.category}
          </span>
        )}
      </div>

      {/* Info Section */}
      <div
        style={{
          padding: responsive.isMobile ? "14px 16px" : "16px 18px",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontWeight: 700,
            fontSize: responsive.isMobile ? 16 : 19,
            color: "#0a3d62",
            lineHeight: 1.35,
            marginBottom: responsive.isMobile ? 6 : 8,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {listing.title}
        </div>

        {/* Price */}
        <div
          style={{
            fontWeight: 700,
            fontSize: responsive.isMobile ? 18 : 21,
            color: "#023e8a",
            marginBottom: responsive.isMobile ? 10 : 12,
          }}
        >
          ${listing.valueUSD.toLocaleString()}
        </div>

        {/* Details Row with Icons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: responsive.isMobile ? 12 : 22,
            fontSize: responsive.isMobile ? 12 : 14,
            color: "#1e6091",
            fontWeight: 600,
            flexWrap: responsive.isMobile ? "wrap" : "nowrap",
          }}
        >
          {/* Year */}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <CalendarIcon color="#1e6091" />
            <span>{listing.manufacturedYear || "-"}</span>
          </span>

          {/* Length */}
          {listing.lengthFt && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <RulerIcon color="#1e6091" />
              <span>{listing.lengthFt} ft</span>
            </span>
          )}

          {/* Location */}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              maxWidth: responsive.isMobile ? 100 : 120,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <LocationIcon color="#1e6091" />
            <span>{listing.location || "-"}</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="bl-market-actions">
        <Button asChild>
          <Link href={`/listings/${listing.id}`}>View listing</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/messages">Message</Link>
        </Button>
      </div>
    </article>
  );
};

// ========================================
// TYPES & COMPONENTS
// ========================================

type ChipSelectorProps = {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  scrollable?: boolean;
};

type AutocompleteInputProps = {
  label: string;
  placeholder: string;
  autocompleteHook: ReturnType<typeof useAutocomplete>;
};

type RangeInputProps = {
  label: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
};

// ========================================
// COMPONENT: ChipSelector
// ========================================

const ChipSelector = ({
  label,
  options,
  selected,
  onSelect,
  scrollable = false
}: ChipSelectorProps) => (
  <div>
    <label style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.95rem", display: "block" }}>
      {label}
    </label>
    <div className="bl-chip-row" style={scrollable ? { maxHeight: "90px", overflowY: "auto", paddingRight: "4px", gap: "0.6rem" } : { gap: "0.6rem" }}>
      <button
        type="button"
        onClick={() => onSelect("")}
        style={{
          border: "none",
          borderRadius: "20px",
          padding: "0.3rem 0.65rem",
          fontWeight: 400,
          fontSize: "0.7rem",
          cursor: "pointer",
          background: selected === "" ? "#1883ff" : "#fff",
          color: selected === "" ? "#fff" : "#0284c7",
          transition: "all 0.2s ease"
        }}
      >
        {label === "Year" ? "Any" : "All"}
      </button>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          style={{
            border: "none",
            borderRadius: "20px",
            padding: "0.3rem 0.65rem",
            fontWeight: 500,
            fontSize: "0.7rem",
            cursor: "pointer",
            background: selected === option ? "#1883ff" : "#fff",
            color: selected === option ? "#fff" : "#0284c7",
            transition: "all 0.2s ease"
          }}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

// ========================================
// COMPONENT: AutocompleteInput
// ========================================

const AutocompleteInput = ({
  label,
  placeholder,
  autocompleteHook
}: AutocompleteInputProps) => {
  const {
    value,
    showSuggestions,
    suggestions,
    handleChange,
    handleFocus,
    handleBlur,
    handleSuggestionClick
  } = autocompleteHook;

  return (
    <div style={{ position: "relative" }}>
      <label style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.95rem", display: "block" }}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid rgba(15, 23, 42, 0.12)",
            borderTop: "none",
            borderRadius: "0 0 14px 14px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
            maxHeight: label === "Engine" ? "250px" : "200px",
            overflowY: "auto"
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                fontSize: "0.95rem",
                color: "#374151",
                borderBottom: index < suggestions.length - 1 ? "1px solid #f3f4f6" : "none"
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = "#f9fafb")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = "transparent")
              }
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ========================================
// COMPONENT: RangeInput
// ========================================

const RangeInput = ({
  label,
  minPlaceholder,
  maxPlaceholder,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange
}: RangeInputProps) => (
  <div>
    <label style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.95rem", display: "block" }}>
      {label}
    </label>
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <input
        type="number"
        placeholder={minPlaceholder}
        value={minValue}
        onChange={(e) => onMinChange(e.target.value)}
        style={{ flex: 1 }}
      />
      <input
        type="number"
        placeholder={maxPlaceholder}
        value={maxValue}
        onChange={(e) => onMaxChange(e.target.value)}
        style={{ flex: 1 }}
      />
    </div>
  </div>
);

// ========================================
// MAIN COMPONENT: ListingBrowser
// ========================================

export default function ListingBrowser() {
  const [items, setItems] = useState<Listing[]>([]);
  const [allItems, setAllItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPower, setMinPower] = useState("");
  const [maxPower, setMaxPower] = useState("");
  const [minLength, setMinLength] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");

  // Autocomplete hooks
  const locationAutocomplete = useAutocomplete(FILTER_DATA.usStates, 5);
  const engineAutocomplete = useAutocomplete(FILTER_DATA.engineTypes, 8);

  // Load all listings on mount
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const pageSize = 100;
      const params = new URLSearchParams({
        page: "1",
        pageSize: String(pageSize)
      });

      const firstResponse = await fetch(`/api/listings?${params.toString()}`);
      const firstPage = (await firstResponse.json()) as {
        items?: Listing[];
        total?: number;
      };

      const initialItems = firstPage.items ?? [];
      const total = firstPage.total ?? initialItems.length;
      const pageCount = Math.max(1, Math.ceil(total / pageSize));
      const nextPages: Promise<Response>[] = [];

      for (let page = 2; page <= pageCount; page += 1) {
        const nextParams = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize)
        });
        nextPages.push(fetch(`/api/listings?${nextParams.toString()}`));
      }

      const remainingPages = await Promise.all(nextPages);
      const remainingItems = await Promise.all(
        remainingPages.map(async (response) => {
          const payload = (await response.json()) as { items?: Listing[] };
          return payload.items ?? [];
        })
      );

      const data = [...initialItems, ...remainingItems.flat()];
      if (active) {
        setAllItems(data);
        setItems(data);
        setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  // Handle filter application
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const minPriceNum = minPrice ? Number(minPrice) : 0;
    const maxPriceNum = maxPrice ? Number(maxPrice) : Infinity;

    let filtered = allItems.filter((item) => {
      // Price filter
      if (item.valueUSD < minPriceNum || item.valueUSD > maxPriceNum)
        return false;

      // Category filter
      if (category && !item.category.toLowerCase().includes(category.toLowerCase()))
        return false;

      // Year filter
      if (year && item.manufacturedYear !== Number(year)) return false;

      // Location filter
      if (
        locationAutocomplete.value &&
        !item.location
          .toLowerCase()
          .includes(locationAutocomplete.value.toLowerCase())
      )
        return false;

      return true;
    });

    setItems(filtered);
  };

  const handleClear = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setYear("");
    setBrand("");
    setMinPower("");
    setMaxPower("");
    setMinLength("");
    setMaxLength("");
    setMinCapacity("");
    setMaxCapacity("");
    locationAutocomplete.reset();
    engineAutocomplete.reset();
    setItems(allItems);
  };

  return (
    <div className="bl-market-shell">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      
      {/* SIDEBAR FILTERS */}
      <aside className="bl-market-sidebar">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>Find Your Boat</h3>
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: "none",
                border: "none",
                color: "#1883ff",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem"
              }}
            >
              Reset
            </button>
          </div>

          <div className="bl-stack">
            {/* Category Selection */}
            <ChipSelector
              label="Category"
              options={FILTER_DATA.categories}
              selected={category}
              onSelect={setCategory}
            />

            {/* Brand Selection */}
            <ChipSelector
              label="Brand"
              options={FILTER_DATA.brands}
              selected={brand}
              onSelect={setBrand}
              scrollable
            />

            {/* Engine Autocomplete */}
            <AutocompleteInput
              label="Engine"
              placeholder="Engine type/model"
              autocompleteHook={engineAutocomplete}
            />

            {/* Power Range */}
            <RangeInput
              label="Power Range (HP)"
              minPlaceholder="Min HP"
              maxPlaceholder="Max HP"
              minValue={minPower}
              maxValue={maxPower}
              onMinChange={setMinPower}
              onMaxChange={setMaxPower}
            />

            {/* Length Range */}
            <RangeInput
              label="Length Range (ft)"
              minPlaceholder="Min ft"
              maxPlaceholder="Max ft"
              minValue={minLength}
              maxValue={maxLength}
              onMinChange={setMinLength}
              onMaxChange={setMaxLength}
            />

            {/* Capacity Range */}
            <RangeInput
              label="Capacity (people)"
              minPlaceholder="Min"
              maxPlaceholder="Max"
              minValue={minCapacity}
              maxValue={maxCapacity}
              onMinChange={setMinCapacity}
              onMaxChange={setMaxCapacity}
            />

            {/* Price Range */}
            <RangeInput
              label="Price Range"
              minPlaceholder="Min ($)"
              maxPlaceholder="Max ($)"
              minValue={minPrice}
              maxValue={maxPrice}
              onMinChange={setMinPrice}
              onMaxChange={setMaxPrice}
            />

            {/* Location Autocomplete */}
            <AutocompleteInput
              label="Location"
              placeholder="Enter State"
              autocompleteHook={locationAutocomplete}
            />

            {/* Year Selection */}
            <ChipSelector
              label="Year"
              options={FILTER_DATA.years}
              selected={year}
              onSelect={setYear}
              scrollable
            />

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#1883ff",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                padding: "0.65rem",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer"
              }}
            >
              Show Boats
            </button>
          </div>
        </form>
      </aside>

      {/* LISTINGS FEED */}
      <section className="bl-market-feed">
        <div className="bl-market-toolbar">
          <div>
            <span className="bl-eyebrow">Boats for sale</span>
            <h2>Today's picks in marketplace</h2>
            <p className="bl-market-muted">{items.length} results</p>
          </div>
          <div className="bl-chip-row">
            <Badge tone="info">Local pickup</Badge>
            <Badge tone="success">Best response time</Badge>
            <Badge tone="warning">Recently reduced</Badge>
          </div>
        </div>

        <div className="bl-listing-grid">
          {loading ? (
            <article className="bl-market-card">
              <p>Loading listings...</p>
            </article>
          ) : null}
          {!loading && items.length === 0 ? (
            <article className="bl-market-card">
              <p>No listings found for this filter set.</p>
            </article>
          ) : null}
          {items.map((listing) => (
            <BoatCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
