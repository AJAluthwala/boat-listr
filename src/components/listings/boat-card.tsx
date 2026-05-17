"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  HeartIcon,
  LocationIcon,
  RulerIcon
} from "./icons";
import { useResponsiveStyles } from "./hooks/use-responsive-styles";
import { getCoverMedia, isImageMedia } from "./utils";
import { useAuth } from "@/components/auth/auth-context";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { useFavorites } from "./favorites-context";
import type { Listing, ListingMedia } from "./types";

type BoatCardProps = {
  listing: Listing;
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

const GradientOverlay = () => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "40%",
      background:
        "linear-gradient(to top, rgba(10,61,98,0.4), rgba(10,61,98,0))",
      pointerEvents: "none"
    }}
  />
);

const DEFAULT_SHADOW = "0 8px 20px rgba(10,61,98,0.08)";
const HOVER_SHADOW = "0 18px 36px rgba(10,61,98,0.16)";

const detailChipStyle = (isMobile: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  background: "#f6fafd",
  border: "1px solid #e8f1f7",
  borderRadius: 999,
  padding: isMobile ? "4px 9px" : "5px 10px",
  fontSize: isMobile ? 11.5 : 12.5,
  color: "#1e6091",
  fontWeight: 600
});

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

  return (
    <Link href={`/listings/${listing.id}`} passHref>
      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          cursor: "pointer",
          borderRadius: responsive.isMobile ? "1rem" : "1.25rem",
          overflow: "hidden",
          background: "#ffffff",
          border: `1px solid ${isHovered ? "#b2dcf2" : "#e1eef5"}`,
          boxShadow: isHovered ? HOVER_SHADOW : DEFAULT_SHADOW,
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          transition:
            "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }}
        className="bl-market-card"
      >
        <div
          style={{
            width: "100%",
            height: responsive.imageHeight,
            position: "relative",
            overflow: "hidden",
            background: "#f0f7fa"
          }}
        >
          <CoverMedia
            coverMedia={coverMedia}
            title={listing.title}
            imageLoading={imageLoading}
            setImageLoading={setImageLoading}
          />

          {imageLoading && <ShimmerOverlay />}
          <GradientOverlay />

          <button
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            style={{
              position: "absolute",
              top: responsive.isMobile ? 10 : 14,
              right: responsive.isMobile ? 10 : 14,
              background: "rgba(255, 255, 255, 0.92)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: "50%",
              width: responsive.isMobile ? 36 : 42,
              height: responsive.isMobile ? 36 : 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(10, 61, 98, 0.12)",
              transition: "background 0.18s ease, transform 0.18s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.92)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <HeartIcon
              isFilled={isFavorite}
              color={isFavorite ? "#ff4d4d" : "#0a3d62"}
              size={responsive.isMobile ? 18 : 20}
            />
          </button>

          {listing.category && (
            <span
              style={{
                position: "absolute",
                top: responsive.isMobile ? 10 : 14,
                left: responsive.isMobile ? 10 : 14,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "#1883ff",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                borderRadius: 999,
                fontSize: responsive.isMobile ? 11 : 12,
                fontWeight: 700,
                padding: responsive.isMobile ? "4px 10px" : "5px 12px",
                boxShadow: "0 4px 10px rgba(10, 61, 98, 0.12)",
                letterSpacing: 0.3,
                textTransform: "uppercase"
              }}
            >
              {listing.category}
            </span>
          )}
        </div>

        <div
          style={{
            padding: responsive.isMobile ? "14px 16px 16px" : "16px 18px 18px",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            gap: responsive.isMobile ? 8 : 10
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: responsive.isMobile ? 16 : 18,
              color: isHovered ? "#1883ff" : "#0a3d62",
              lineHeight: 1.35,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
              transition: "color 0.2s ease"
            }}
          >
            {listing.title}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 6
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: responsive.isMobile ? 19 : 22,
                color: "#0a3d62",
                letterSpacing: "-0.02em"
              }}
            >
              ${listing.valueUSD.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: responsive.isMobile ? 10 : 11,
                color: "#8ea3bb",
                fontWeight: 600,
                letterSpacing: "0.06em"
              }}
            >
              USD
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
              marginTop: "auto",
              paddingTop: responsive.isMobile ? 4 : 6
            }}
          >
            <span style={detailChipStyle(responsive.isMobile)}>
              <CalendarIcon color="#1e6091" />
              <span>{listing.manufacturedYear || "-"}</span>
            </span>

            {listing.lengthFt && (
              <span style={detailChipStyle(responsive.isMobile)}>
                <RulerIcon color="#1e6091" />
                <span>{listing.lengthFt} ft</span>
              </span>
            )}

            <span
              style={{
                ...detailChipStyle(responsive.isMobile),
                maxWidth: responsive.isMobile ? 120 : 140,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
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
                {listing.location || "-"}
              </span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BoatCard;
