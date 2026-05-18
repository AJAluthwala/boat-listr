"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartIcon, LocationIcon } from "./icons";
import { useResponsiveStyles } from "./hooks/use-responsive-styles";
import { getCoverMedia, isImageMedia } from "./utils";
import { useAuth } from "@/components/auth/auth-context";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { useFavorites } from "./favorites-context";
import type { Listing, ListingMedia } from "./types";

type BoatCardListing = Listing & {
  user?: { id: number; name: string } | null;
};

type BoatCardProps = {
  listing: BoatCardListing;
};

type CoverMediaProps = {
  coverMedia: ListingMedia | null;
  title: string;
  imageLoading: boolean;
  setImageLoading: (loading: boolean) => void;
};

const CoverMedia = ({
  coverMedia,
  title,
  imageLoading,
  setImageLoading
}: CoverMediaProps) => {
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
          background: "linear-gradient(140deg, #e8f4fb, #f6fafd 60%, #ffffff)"
        }}
      >
        <span>No cover image</span>
      </div>
    );
  }

  if (isImageMedia(coverMedia)) {
    return (
      <img
        className="bl-market-image bl-market-image-zoom"
        src={coverMedia.url}
        alt={title}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: imageLoading ? 0.5 : 1
        }}
        onLoad={() => setImageLoading(false)}
        onError={() => setImageLoading(false)}
      />
    );
  }

  return (
    <div className="bl-market-video-cover">
      <video
        className="bl-market-image bl-market-image-zoom"
        src={coverMedia.url}
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: imageLoading ? 0.5 : 1
        }}
        onLoadedData={() => setImageLoading(false)}
      />
      <div className="bl-market-video-badge">Video</div>
    </div>
  );
};

const ShimmerOverlay = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(90deg, rgba(240,247,250,0.8) 25%, rgba(226,237,242,0.8) 50%, rgba(240,247,250,0.8) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.6s infinite",
      pointerEvents: "none"
    }}
  />
);

const DEFAULT_SHADOW = "0 6px 18px rgba(10, 61, 98, 0.07)";
const HOVER_SHADOW = "0 16px 36px rgba(10, 61, 98, 0.14)";

export const BoatCard = ({ listing }: BoatCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const responsive = useResponsiveStyles();
  const coverMedia = getCoverMedia(listing);
  const { isAuthenticated } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const { isFavorited, toggleFavorite } = useFavorites();
  const isFavorite = isFavorited(listing.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    void toggleFavorite(listing);
  };

  const sellerName = listing.user?.name ?? "BoatListr seller";

  return (
    <Link href={`/listings/${listing.id}`} passHref>
      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bl-market-card"
        style={{
          cursor: "pointer",
          borderRadius: 18,
          overflow: "hidden",
          background: "#ffffff",
          border: `1px solid ${isHovered ? "#b2dcf2" : "#e1eef5"}`,
          boxShadow: isHovered ? HOVER_SHADOW : DEFAULT_SHADOW,
          transform: isHovered ? "translateY(-3px)" : "translateY(0)",
          transition:
            "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }}
      >
        {/* Image — edge to edge, clips to card's rounded top corners */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: responsive.imageHeight,
            overflow: "hidden",
            background: "#f0f7fa",
            flexShrink: 0
          }}
        >
          <CoverMedia
            coverMedia={coverMedia}
            title={listing.title}
            imageLoading={imageLoading}
            setImageLoading={setImageLoading}
          />

          {imageLoading && <ShimmerOverlay />}

          {/* Category pill — dark, top-left */}
          {listing.category && (
            <span
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "rgba(10, 25, 42, 0.72)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                color: "#ffffff",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                padding: "5px 12px",
                letterSpacing: 0.2,
                lineHeight: 1
              }}
            >
              {listing.category}
            </span>
          )}

          {/* Favorite (heart) — top-right, no background, just icon */}
          <button
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "transparent",
              border: "none",
              padding: 6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.18s ease",
              filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35))"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <HeartIcon
              isFilled={isFavorite}
              color={isFavorite ? "#ff4d4d" : "#ffffff"}
              size={responsive.isMobile ? 20 : 22}
            />
          </button>
        </div>

        {/* Info section */}
        <div
          style={{
            padding: "16px 18px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flexGrow: 1
          }}
        >
          {/* Location row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#1e6091",
              fontSize: 13,
              fontWeight: 600
            }}
          >
            <LocationIcon color="#1e6091" />
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {listing.location || "—"}
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontWeight: 800,
              fontSize: responsive.isMobile ? 16 : 18,
              color: isHovered ? "#1883ff" : "#0a3d62",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
              transition: "color 0.2s ease"
            }}
          >
            {listing.title}
          </div>

          {/* Year + Length row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 13,
              color: "#55657a",
              flexWrap: "wrap"
            }}
          >
            <span>
              <span style={{ color: "#8ea3bb" }}>Year: </span>
              <strong style={{ color: "#0a3d62", fontWeight: 700 }}>
                {listing.manufacturedYear || "—"}
              </strong>
            </span>
            {listing.lengthFt != null && (
              <span>
                <span style={{ color: "#8ea3bb" }}>Length: </span>
                <strong style={{ color: "#0a3d62", fontWeight: 700 }}>
                  {listing.lengthFt} ft
                </strong>
              </span>
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "#eef4f8",
              marginTop: 2,
              marginBottom: 2
            }}
          />

          {/* Footer: seller (left) + price (right) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginTop: "auto"
            }}
          >
            <span
              style={{
                color: "#55657a",
                fontSize: 13,
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0
              }}
            >
              {sellerName}
            </span>
            <span
              style={{
                fontWeight: 800,
                fontSize: responsive.isMobile ? 16 : 18,
                color: "#0a3d62",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap"
              }}
            >
              ${listing.valueUSD.toLocaleString()}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BoatCard;
