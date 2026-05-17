"use client";

import Link from "next/link";
import { BoatCard } from "@/components/listings/boat-card";
import { BoatCardSkeleton } from "@/components/listings/boat-card-skeleton";
import { useFavorites } from "@/components/listings/favorites-context";
import { useAuth } from "@/components/auth/auth-context";
import { useAuthModal } from "@/components/auth/auth-modal-context";

const SKELETON_COUNT = 6;

const SHIMMER_KEYFRAMES = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const HeartIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0284c7"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const stateContainerStyle: React.CSSProperties = {
  gridColumn: "1 / -1",
  background: "#ffffff",
  border: "1px dashed #b2e0f2",
  borderRadius: 20,
  padding: "3.5rem 1.5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(10,61,98,0.05)",
  minHeight: 360
};

const iconBadgeStyle: React.CSSProperties = {
  width: 84,
  height: 84,
  borderRadius: "50%",
  background: "linear-gradient(140deg, #e0f2fe 0%, #f0f9ff 60%, #ffffff 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "1.25rem",
  border: "1px solid #d3ecf6"
};

const stateHeadingStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: "0.5rem",
  fontSize: "1.25rem",
  fontWeight: 700,
  color: "#0a3d62"
};

const stateBodyStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: "1.25rem",
  color: "#55657a",
  fontSize: "0.95rem",
  maxWidth: 420,
  lineHeight: 1.5
};

const primaryButtonStyle: React.CSSProperties = {
  background: "#1883ff",
  color: "#fff",
  border: "none",
  borderRadius: 14,
  padding: "0.65rem 1.5rem",
  fontWeight: 600,
  fontSize: "0.92rem",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  boxShadow: "0 6px 14px rgba(24,131,255,0.25)",
  transition: "transform 0.15s ease, box-shadow 0.15s ease"
};

const Toolbar = ({ count, loading }: { count: number; loading: boolean }) => (
  <div className="bl-market-toolbar">
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        style={{
          display: "inline-block",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "#1883ff"
        }}
      >
        Your Collection
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
        Saved Boats
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
          "Loading your saved boats…"
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
            {count === 1 ? "boat" : "boats"} saved
          </>
        )}
      </div>
    </div>
    <Link
      href="/listings"
      style={{
        ...primaryButtonStyle,
        background: "#f6fafd",
        color: "#0a3d62",
        border: "1px solid #e1eef5",
        boxShadow: "none",
        fontWeight: 600
      }}
    >
      Browse more boats
    </Link>
  </div>
);

const NotAuthedState = ({ onSignIn }: { onSignIn: () => void }) => (
  <div style={stateContainerStyle}>
    <div style={iconBadgeStyle}>
      <HeartIcon />
    </div>
    <h3 style={stateHeadingStyle}>Sign in to view saved boats</h3>
    <p style={stateBodyStyle}>
      Sign in to your BoatListr account to save boats and pick up right where you left off.
    </p>
    <button
      type="button"
      onClick={onSignIn}
      style={primaryButtonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 8px 18px rgba(24,131,255,0.32)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 14px rgba(24,131,255,0.25)";
      }}
    >
      Sign in
    </button>
  </div>
);

const EmptyState = () => (
  <div style={stateContainerStyle}>
    <div style={iconBadgeStyle}>
      <HeartIcon />
    </div>
    <h3 style={stateHeadingStyle}>No saved boats yet</h3>
    <p style={stateBodyStyle}>
      Browse listings and tap the heart on any boat to save it here for easy comparison.
    </p>
    <Link
      href="/listings"
      style={primaryButtonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 8px 18px rgba(24,131,255,0.32)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 14px rgba(24,131,255,0.25)";
      }}
    >
      Browse boats
    </Link>
  </div>
);

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const { favorites, loading } = useFavorites();
  const { open: openAuthModal } = useAuthModal();

  return (
    <main
      className="bl-container"
      style={{ paddingTop: "2.5rem", paddingBottom: "3rem" }}
    >
      <style>{SHIMMER_KEYFRAMES}</style>

      <section className="bl-market-feed">
        <Toolbar
          count={isAuthenticated ? favorites.length : 0}
          loading={isAuthenticated && loading}
        />

        <div className="bl-listing-grid">
          {!isAuthenticated && (
            <NotAuthedState onSignIn={() => openAuthModal("login")} />
          )}

          {isAuthenticated && loading &&
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <BoatCardSkeleton key={`skeleton-${i}`} />
            ))}

          {isAuthenticated && !loading && favorites.length === 0 && (
            <EmptyState />
          )}

          {isAuthenticated && !loading &&
            favorites.map((listing) => (
              <BoatCard key={listing.id} listing={listing} />
            ))}
        </div>
      </section>
    </main>
  );
}
