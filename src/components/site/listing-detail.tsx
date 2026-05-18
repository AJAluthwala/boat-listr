"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { useFavorites } from "@/components/listings/favorites-context";
import ContactSellerModal from "@/components/listings/contact-seller-modal";
import { BoatCard } from "@/components/listings/boat-card";
import { HeartIcon } from "@/components/listings/icons";
import type { Listing, ListingMedia } from "@/components/listings/types";

type ListingDetailDto = Listing & {
  mainDescription?: string | null;
  engine?: string | null;
  totalPowerHP?: number | null;
  brand?: string | null;
  capacity?: number | null;
  status?: string | null;
  createdAt?: string;
  user?: { id: number; name: string; email: string } | null;
};

// ============================================
// ICONS
// ============================================

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const
};

const CalendarIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const RulerIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="11" width="18" height="4" rx="1" />
    <path d="M7 11V7M11 11V8M15 11V7M19 11V8" />
  </svg>
);
const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const BoltIcon = () => (
  <svg {...iconProps}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const UsersIcon = () => (
  <svg {...iconProps}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const TagIcon = () => (
  <svg {...iconProps}>
    <path d="M20.59 13.41L13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const ShieldIcon = () => (
  <svg {...iconProps}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const StarIcon = () => (
  <svg {...iconProps}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const ShipIcon = () => (
  <svg {...iconProps}>
    <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 1.9.5 2.5 1" />
    <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
    <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
    <path d="M12 10v4M12 2v3" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg {...iconProps} width={20} height={20}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg {...iconProps} width={20} height={20}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const CheckIcon = () => (
  <svg {...iconProps} width={14} height={14} strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg {...iconProps} width={16} height={16}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// ============================================
// UTILITIES
// ============================================

const formatPrice = (n: number | undefined | null) =>
  n != null ? `$${Number(n).toLocaleString()}` : "—";

const relativeTime = (dateString?: string): string => {
  if (!dateString) return "recently";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

const isVideoMedia = (m?: ListingMedia | null) =>
  Boolean(m && (m.kind === "VIDEO" || m.mimeType?.startsWith("video/")));

// ============================================
// SHARED STYLES
// ============================================

const CARD_STYLE: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e1eef5",
  borderRadius: 18,
  boxShadow: "0 8px 24px rgba(10, 61, 98, 0.06)",
  padding: "1.4rem"
};

const SECTION_HEADING: React.CSSProperties = {
  margin: 0,
  marginBottom: "1rem",
  fontSize: "0.95rem",
  fontWeight: 800,
  color: "#1883ff",
  textTransform: "uppercase",
  letterSpacing: "0.08em"
};

// ============================================
// HEADER BAR (favorite + title + price)
// ============================================

const HeaderBar = ({
  listing,
  isFavorite,
  onFavoriteClick
}: {
  listing: ListingDetailDto;
  isFavorite: boolean;
  onFavoriteClick: () => void;
}) => (
  <div
    style={{
      ...CARD_STYLE,
      display: "flex",
      alignItems: "center",
      gap: 16,
      flexWrap: "wrap",
      padding: "1.1rem 1.4rem"
    }}
  >
    <button
      type="button"
      onClick={onFavoriteClick}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      style={{
        flexShrink: 0,
        width: 46,
        height: 46,
        borderRadius: "50%",
        background: isFavorite ? "#fff1f1" : "#f6fafd",
        border: `1.5px solid ${isFavorite ? "#ffcccc" : "#e1eef5"}`,
        color: isFavorite ? "#ff4d4d" : "#0a3d62",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.18s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <HeartIcon isFilled={isFavorite} color={isFavorite ? "#ff4d4d" : "#0a3d62"} size={22} />
    </button>

    <div style={{ flex: 1, minWidth: 0 }}>
      <h1
        style={{
          margin: 0,
          fontSize: "1.45rem",
          fontWeight: 800,
          color: "#0a3d62",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {listing.title}
      </h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 6,
          color: "#55657a",
          fontSize: "0.92rem",
          fontWeight: 500,
          flexWrap: "wrap"
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: "#1e6091", display: "inline-flex" }}>
            <PinIcon />
          </span>
          {listing.location || "—"}
        </span>
        <span style={{ width: 1, height: 14, background: "#e1eef5" }} />
        <span style={{ color: "#8ea3bb" }}>Published {relativeTime(listing.createdAt)}</span>
      </div>
    </div>

    <div
      style={{
        fontSize: "1.6rem",
        fontWeight: 800,
        color: "#0a3d62",
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap"
      }}
    >
      {formatPrice(listing.valueUSD)}
      <span
        style={{
          fontSize: "0.7rem",
          color: "#8ea3bb",
          fontWeight: 600,
          letterSpacing: "0.06em",
          marginLeft: 4
        }}
      >
        USD
      </span>
    </div>
  </div>
);

// ============================================
// MEDIA VIEWER
// ============================================

const MediaViewer = ({ media }: { media: ListingMedia[] }) => {
  const [index, setIndex] = useState(0);
  const active = media[index];

  if (!media || media.length === 0) {
    return (
      <div
        style={{
          ...CARD_STYLE,
          padding: 0,
          aspectRatio: "16 / 9",
          background: "linear-gradient(140deg, #e8f4fb, #f6fafd 60%, #ffffff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8ea3bb",
          fontWeight: 600
        }}
      >
        No media available
      </div>
    );
  }

  const navigate = (dir: "prev" | "next") => {
    setIndex((i) =>
      dir === "prev" ? (i - 1 + media.length) % media.length : (i + 1) % media.length
    );
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
          background: "#0a3d62",
          borderRadius: 18,
          overflow: "hidden",
          aspectRatio: "16 / 9",
          maxHeight: 480,
          boxShadow: "0 8px 24px rgba(10, 61, 98, 0.12)"
        }}
      >
        {isVideoMedia(active) ? (
          <video
            key={active?.url}
            src={active?.url}
            controls
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img
            key={active?.url}
            src={active?.url}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}

        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => navigate("prev")}
              aria-label="Previous"
              style={navButtonStyle("left")}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.9)")}
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              onClick={() => navigate("next")}
              aria-label="Next"
              style={navButtonStyle("right")}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.9)")}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 14,
            padding: "10px 12px",
            background: "#ffffff",
            border: "1px solid #e1eef5",
            borderRadius: 14,
            boxShadow: "0 4px 12px rgba(10, 61, 98, 0.05)",
            overflowX: "auto",
            // Center when few thumbs (no overflow); left-align when many
            justifyContent: media.length <= 5 ? "center" : "flex-start"
          }}
        >
          {media.map((m, i) => {
            const selected = i === index;
            const isVideo = isVideoMedia(m);
            return (
              <button
                key={m.url ?? i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View media ${i + 1}`}
                style={{
                  flexShrink: 0,
                  width: 96,
                  height: 72,
                  border: `2px solid ${selected ? "#1883ff" : "#e1eef5"}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  padding: 0,
                  cursor: "pointer",
                  background: "#0a3d62",
                  opacity: selected ? 1 : 0.72,
                  transition: "all 0.18s ease",
                  boxShadow: selected
                    ? "0 0 0 3px rgba(24, 131, 255, 0.18)"
                    : "none"
                }}
                onMouseEnter={(e) => {
                  if (selected) return;
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.borderColor = "#b2dcf2";
                }}
                onMouseLeave={(e) => {
                  if (selected) return;
                  e.currentTarget.style.opacity = "0.72";
                  e.currentTarget.style.borderColor = "#e1eef5";
                }}
              >
                {isVideo ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff"
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 4 20 12 6 20" />
                    </svg>
                  </div>
                ) : (
                  <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const navButtonStyle = (side: "left" | "right"): React.CSSProperties => ({
  position: "absolute",
  top: "50%",
  [side]: 14,
  transform: "translateY(-50%)",
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.9)",
  border: "none",
  color: "#0a3d62",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
  transition: "background 0.18s ease"
});

// ============================================
// DETAILS GRID
// ============================================

const InfoItem = ({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
}) => {
  if (value == null || value === "") return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "#f0f7fb",
          color: "#1883ff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
      >
        {icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#8ea3bb",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 2
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#0a3d62",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

const DetailsCard = ({ listing }: { listing: ListingDetailDto }) => (
  <div style={CARD_STYLE}>
    <h3 style={SECTION_HEADING}>Boat Details</h3>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1.1rem"
      }}
    >
      <InfoItem icon={<TagIcon />} label="Category" value={listing.category} />
      <InfoItem icon={<CalendarIcon />} label="Year" value={listing.manufacturedYear} />
      <InfoItem
        icon={<RulerIcon />}
        label="Length"
        value={listing.lengthFt ? `${listing.lengthFt} ft` : undefined}
      />
      <InfoItem icon={<BoltIcon />} label="Engine" value={listing.engine} />
      <InfoItem
        icon={<BoltIcon />}
        label="Power"
        value={listing.totalPowerHP ? `${listing.totalPowerHP} HP` : undefined}
      />
      <InfoItem
        icon={<UsersIcon />}
        label="Capacity"
        value={listing.capacity ? `${listing.capacity} people` : undefined}
      />
      <InfoItem icon={<StarIcon />} label="Brand" value={listing.brand} />
      <InfoItem icon={<ShieldIcon />} label="Condition" value={listing.status} />
    </div>
  </div>
);

// ============================================
// DESCRIPTION
// ============================================

const DescriptionSection = ({ listing }: { listing: ListingDetailDto }) => {
  if (!listing.shortDescription && !listing.mainDescription) return null;
  return (
    <>
      {listing.shortDescription && (
        <div style={CARD_STYLE}>
          <h3 style={SECTION_HEADING}>Overview</h3>
          <p style={{ margin: 0, color: "#3d4f63", lineHeight: 1.65, fontSize: "0.96rem" }}>
            {listing.shortDescription}
          </p>
        </div>
      )}

      {listing.mainDescription && (
        <details
          style={{
            ...CARD_STYLE,
            padding: 0,
            overflow: "hidden"
          }}
        >
          <summary
            style={{
              listStyle: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.1rem 1.4rem",
              cursor: "pointer",
              fontWeight: 700,
              color: "#0a3d62",
              fontSize: "0.95rem",
              userSelect: "none"
            }}
          >
            More Information
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "#1883ff" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <div
            style={{
              padding: "0 1.4rem 1.4rem",
              color: "#3d4f63",
              lineHeight: 1.7,
              fontSize: "0.94rem",
              whiteSpace: "pre-line",
              borderTop: "1px solid #eef4f8",
              paddingTop: "1.1rem"
            }}
          >
            {listing.mainDescription}
          </div>
        </details>
      )}
    </>
  );
};

// ============================================
// SELLER CARD
// ============================================

const SellerCard = ({
  listing,
  onContactClick
}: {
  listing: ListingDetailDto;
  onContactClick: () => void;
}) => {
  const seller = listing.user;
  const initial = (seller?.name ?? "U").trim().charAt(0).toUpperCase();
  return (
    <div style={{ ...CARD_STYLE, textAlign: "center" }}>
      <div style={SECTION_HEADING}>Listed By</div>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1883ff 0%, #0a3d62 100%)",
          color: "#ffffff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "1.5rem",
          marginBottom: "0.6rem",
          boxShadow: "0 6px 16px rgba(24, 131, 255, 0.3)"
        }}
      >
        {initial}
      </div>
      <div
        style={{
          fontWeight: 700,
          color: "#0a3d62",
          fontSize: "1rem",
          marginBottom: "0.25rem"
        }}
      >
        {seller?.name || "Unknown Seller"}
      </div>
      <div style={{ color: "#8ea3bb", fontSize: "0.82rem", marginBottom: "1.2rem" }}>
        Member of BoatListr
      </div>
      <button
        type="button"
        onClick={onContactClick}
        style={{
          display: "inline-block",
          width: "100%",
          padding: "0.75rem 1rem",
          background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "0.95rem",
          borderRadius: 12,
          textAlign: "center",
          boxShadow: "0 8px 18px rgba(24, 131, 255, 0.28)",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
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
        Contact Seller
      </button>
    </div>
  );
};

// ============================================
// SAFETY TIPS
// ============================================

const SAFETY_TIPS = [
  "Meet in a public marina or broker office",
  "Inspect the boat in person before purchase",
  "Verify ownership and maintenance documents",
  "Use secure, documented payment methods"
];

const SafetyTipsCard = () => (
  <div style={CARD_STYLE}>
    <div
      style={{
        ...SECTION_HEADING,
        display: "inline-flex",
        alignItems: "center",
        gap: 8
      }}
    >
      <span style={{ color: "#1883ff", display: "inline-flex" }}>
        <ShieldIcon />
      </span>
      Safety Tips
    </div>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
      {SAFETY_TIPS.map((tip) => (
        <li
          key={tip}
          style={{ display: "flex", alignItems: "flex-start", gap: 10, color: "#3d4f63", fontSize: "0.9rem", lineHeight: 1.5 }}
        >
          <span
            style={{
              flexShrink: 0,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#eaf6ef",
              color: "#2f7d43",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 1
            }}
          >
            <CheckIcon />
          </span>
          {tip}
        </li>
      ))}
    </ul>
  </div>
);

// ============================================
// LOADING / NOT FOUND
// ============================================

const LoadingState = () => (
  <div style={{ display: "grid", gap: 20 }}>
    <div style={{ ...CARD_STYLE, height: 96 }} />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
        gap: 24
      }}
    >
      <div style={{ display: "grid", gap: 20 }}>
        <div
          style={{
            aspectRatio: "16 / 9",
            background: "linear-gradient(140deg, #e8f4fb, #f6fafd 60%, #ffffff)",
            borderRadius: 18,
            border: "1px solid #e1eef5"
          }}
        />
        <div style={{ ...CARD_STYLE, height: 200 }} />
      </div>
      <div style={{ display: "grid", gap: 20 }}>
        <div style={{ ...CARD_STYLE, height: 280 }} />
        <div style={{ ...CARD_STYLE, height: 220 }} />
      </div>
    </div>
  </div>
);

const NotFoundState = () => (
  <div
    style={{
      ...CARD_STYLE,
      padding: "3rem 1.5rem",
      textAlign: "center"
    }}
  >
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: "50%",
        background: "linear-gradient(140deg, #e0f2fe, #f0f9ff 60%, #ffffff)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.25rem",
        border: "1px solid #d3ecf6",
        color: "#0284c7"
      }}
    >
      <ShipIcon />
    </div>
    <h2
      style={{
        margin: 0,
        marginBottom: "0.5rem",
        fontSize: "1.25rem",
        fontWeight: 700,
        color: "#0a3d62"
      }}
    >
      Listing not available
    </h2>
    <p
      style={{
        margin: 0,
        marginBottom: "1.5rem",
        color: "#55657a",
        fontSize: "0.95rem",
        maxWidth: 420,
        marginLeft: "auto",
        marginRight: "auto",
        lineHeight: 1.5
      }}
    >
      This listing was either removed or could not be found. Browse other boats to keep exploring.
    </p>
    <Link
      href="/listings"
      style={{
        display: "inline-block",
        padding: "0.7rem 1.5rem",
        background: "#1883ff",
        color: "#ffffff",
        borderRadius: 14,
        fontWeight: 700,
        fontSize: "0.92rem",
        boxShadow: "0 8px 18px rgba(24, 131, 255, 0.28)"
      }}
    >
      Back to listings
    </Link>
  </div>
);

// ============================================
// MAIN
// ============================================

export default function ListingDetail() {
  const params = useParams<{ id?: string }>();
  const listingId = params?.id;
  const [item, setItem] = useState<ListingDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [related, setRelated] = useState<Listing[]>([]);

  const { isAuthenticated } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const { isFavorited, toggleFavorite } = useFavorites();

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
        const payload = (await response.json()) as { listing?: ListingDetailDto };
        if (active) setItem(payload.listing ?? null);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [listingId]);

  const media = useMemo(() => item?.media ?? [], [item]);

  // Fetch related listings (same category, excluding current)
  useEffect(() => {
    if (!item?.category || !item.id) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `/api/listings?page=1&pageSize=6&category=${encodeURIComponent(item.category)}`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as { items?: Listing[] };
        if (!active) return;
        const filtered = (data.items ?? [])
          .filter((l) => l.id !== item.id)
          .slice(0, 3);
        setRelated(filtered);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      active = false;
    };
  }, [item?.id, item?.category]);

  if (loading) return <LoadingState />;
  if (!item) return <NotFoundState />;

  const isFavorite = isFavorited(item.id);

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    void toggleFavorite(item);
  };

  const handleContactClick = () => setContactOpen(true);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Link
        href="/listings"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#1883ff",
          fontWeight: 600,
          fontSize: "0.92rem",
          marginBottom: 4,
          width: "fit-content"
        }}
      >
        <ArrowLeftIcon />
        Back to listings
      </Link>

      <HeaderBar listing={item} isFavorite={isFavorite} onFavoriteClick={handleFavoriteClick} />

      <div
        className="bl-detail-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(300px, 1fr)",
          gap: 20,
          alignItems: "start"
        }}
      >
        <div style={{ display: "grid", gap: 18, minWidth: 0 }}>
          <MediaViewer media={media} />
          <DetailsCard listing={item} />
          <DescriptionSection listing={item} />
        </div>

        <aside
          style={{
            display: "grid",
            gap: 18,
            position: "sticky",
            top: 100,
            alignSelf: "start"
          }}
        >
          <SellerCard listing={item} onContactClick={handleContactClick} />
          <SafetyTipsCard />
        </aside>
      </div>

      {related.length > 0 && (
        <section style={{ display: "grid", gap: "1.25rem", marginTop: "1rem" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 800,
              color: "#0a3d62",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Related Listings
          </h2>
          <div className="bl-listing-grid">
            {related.map((listing) => (
              <BoatCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      <ContactSellerModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        listingId={item.id}
        boatTitle={item.title}
        boatLocation={item.location}
      />

      <style>{`
        @media (max-width: 900px) {
          .bl-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .bl-detail-grid aside {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
