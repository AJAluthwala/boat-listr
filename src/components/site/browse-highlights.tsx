"use client";

import React from "react";
import Link from "next/link";
import premiumYachtImage from "@/images/Premium_yacht.png";
import sailboatImage from "@/images/newsailboat_cover.jpg";
import pontoonImage from "@/images/Sailboat_cover.jpg";

const HERO_IMAGE = premiumYachtImage.src;
const SAILBOAT_IMAGE = sailboatImage.src;
const PONTOON_IMAGE = pontoonImage.src;

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

type Panel = {
  title: string;
  subtitle: string;
  href: string;
  cta: string;
};

const PANELS = {
  topLeft: {
    title: "Sailboats",
    subtitle: "Wind-powered escapes",
    href: "/listings?category=Sailboat",
    cta: "Browse",
  } as Panel,
  bottomLeft: {
    title: "Pontoon Boats",
    subtitle: "Easy days on the lake",
    href: "/listings?category=Pontoon+Boat",
    cta: "Browse",
  } as Panel,
  right: {
    title: "Premium Yachts",
    subtitle: "Curated luxury on the water",
    href: "/listings?category=Yacht",
    cta: "Explore",
  } as Panel,
};

const CtaPill = ({ label, light }: { label: string; light?: boolean }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "0.6rem 1.1rem",
      borderRadius: 999,
      background: light ? "#ffffff" : "rgba(255, 255, 255, 0.15)",
      color: light ? "#0a3d62" : "#ffffff",
      fontWeight: 700,
      fontSize: "0.88rem",
      backdropFilter: light ? "none" : "blur(6px)",
      WebkitBackdropFilter: light ? "none" : "blur(6px)",
      border: light ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: light ? "0 8px 18px rgba(10, 61, 98, 0.18)" : "none",
      transition: "transform 0.18s ease",
    }}
  >
    {label}
    <ArrowIcon />
  </span>
);

type CardLinkProps = {
  panel: Panel;
  area: "top-left" | "bottom-left" | "right";
  background: string;
  icon?: React.ReactNode;
  ctaLight?: boolean;
};

const CardLink = ({ panel, area, background, icon, ctaLight }: CardLinkProps) => (
  <Link
    href={panel.href}
    className={`bl-highlight-card bl-highlight-${area}`}
    style={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "1.6rem 1.75rem",
      borderRadius: 20,
      overflow: "hidden",
      color: "#ffffff",
      background,
      boxShadow: "0 12px 32px rgba(10, 61, 98, 0.12)",
      minHeight: 220,
      textDecoration: "none",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "0 18px 40px rgba(10, 61, 98, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 12px 32px rgba(10, 61, 98, 0.12)";
    }}
  >
    {icon && (
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          pointerEvents: "none",
        }}
      >
        {icon}
      </div>
    )}

    <div style={{ position: "relative", zIndex: 1 }}>
      <div
        style={{
          display: "inline-block",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          background: "rgba(255, 255, 255, 0.18)",
          padding: "0.3rem 0.7rem",
          borderRadius: 999,
          marginBottom: "0.8rem",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        Category
      </div>
      <h3
        style={{
          margin: 0,
          fontSize: area === "right" ? "clamp(1.8rem, 3.2vw, 2.4rem)" : "1.5rem",
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
          marginBottom: 6,
        }}
      >
        {panel.title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: area === "right" ? "1rem" : "0.92rem",
          color: "rgba(255, 255, 255, 0.85)",
          maxWidth: 340,
        }}
      >
        {panel.subtitle}
      </p>
    </div>

    <div style={{ position: "relative", zIndex: 1, marginTop: "1.25rem" }}>
      <CtaPill label={panel.cta} light={ctaLight} />
    </div>
  </Link>
);

export default function BrowseHighlights() {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: 1420,
        marginInline: "auto",
      }}
    >
      <div
        className="bl-highlights-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
          gridTemplateRows: "1fr 1fr",
          gridTemplateAreas: `
            "topLeft right"
            "bottomLeft right"
          `,
          gap: "1.25rem",
        }}
      >
        <div style={{ gridArea: "topLeft" }}>
          <CardLink
            panel={PANELS.topLeft}
            area="top-left"
            background={`linear-gradient(135deg, rgba(8, 43, 73, 0.78) 0%, rgba(10, 61, 98, 0.45) 60%, rgba(24, 131, 255, 0.15) 100%), url(${SAILBOAT_IMAGE}) center/cover no-repeat`}
          />
        </div>

        <div style={{ gridArea: "bottomLeft" }}>
          <CardLink
            panel={PANELS.bottomLeft}
            area="bottom-left"
            background={`linear-gradient(135deg, rgba(8, 43, 73, 0.78) 0%, rgba(10, 61, 98, 0.45) 60%, rgba(24, 131, 255, 0.15) 100%), url(${PONTOON_IMAGE}) center/cover no-repeat`}
          />
        </div>

        <div style={{ gridArea: "right" }}>
          <CardLink
            panel={PANELS.right}
            area="right"
            background={`linear-gradient(to right, rgba(10, 61, 98, 0.65) 0%, rgba(10, 61, 98, 0.15) 55%, rgba(24, 131, 255, 0.08) 100%), url(${HERO_IMAGE}) center/cover no-repeat`}
            ctaLight
          />
        </div>
      </div>

      <style>{`
        .bl-highlight-right {
          min-height: 460px !important;
        }

        @media (max-width: 768px) {
          .bl-highlights-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
            grid-template-areas:
              "topLeft"
              "bottomLeft"
              "right" !important;
          }

          .bl-highlight-card {
            min-height: 200px !important;
            padding: 1.4rem !important;
          }

          .bl-highlight-right {
            min-height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
}
