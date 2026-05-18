"use client";

import React from "react";
import Link from "next/link";

const ICON_PROPS = {
  width: 44,
  height: 44,
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const SailboatIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M32 12 L32 46" />
    <path d="M32 14 L46 44 L32 44 Z" />
    <path d="M14 50 Q32 58 50 50" />
  </svg>
);

const YachtIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M18 36 L46 36 L48 28 L18 28 Z" />
    <path d="M22 28 L22 20 L40 20 L40 28" />
    <line x1="26" y1="24" x2="36" y2="24" />
    <path d="M14 44 L50 44 L48 48 L16 48 Z" />
    <path d="M10 52 Q32 58 54 52" />
  </svg>
);

const PontoonIcon = () => (
  <svg {...ICON_PROPS}>
    <rect x="14" y="28" width="36" height="6" rx="1" />
    <circle cx="20" cy="42" r="5" />
    <circle cx="44" cy="42" r="5" />
    <path d="M22 28 L22 20 L42 20 L42 28" />
    <line x1="26" y1="24" x2="38" y2="24" />
  </svg>
);

const FishingBoatIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 38 Q32 50 52 38 L48 30 L16 30 Z" />
    <path d="M40 30 L46 14" />
    <path d="M44 18 Q50 20 48 16" />
    <line x1="24" y1="28" x2="24" y2="22" />
  </svg>
);

const ConsoleBoatIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M10 36 Q32 48 54 36 L50 28 L14 28 Z" />
    <rect x="28" y="18" width="8" height="10" rx="1" />
    <line x1="32" y1="18" x2="32" y2="14" />
    <circle cx="32" cy="13" r="1.2" />
  </svg>
);

const JetBoatIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M14 36 Q32 30 52 36" />
    <path d="M14 36 Q22 44 32 44 Q42 44 52 36" />
    <path d="M28 28 Q32 22 36 28" />
    <path d="M10 48 Q32 54 54 48" />
  </svg>
);

const SkiffIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M10 36 L54 36 L50 44 L14 44 Z" />
    <line x1="22" y1="36" x2="22" y2="32" />
    <line x1="32" y1="36" x2="32" y2="30" />
    <line x1="42" y1="36" x2="42" y2="32" />
    <path d="M8 50 Q32 56 56 50" />
  </svg>
);

const BayBoatIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 34 Q32 44 52 34 L48 26 L16 26 Z" />
    <line x1="20" y1="30" x2="44" y2="30" />
    <path d="M10 48 Q32 54 54 48" />
  </svg>
);

type CategoryItem = {
  label: string;
  /** Value to put in the ?category= URL param (matches FILTER_DATA.categories) */
  query: string;
  icon: React.ComponentType;
};

const CATEGORIES: CategoryItem[] = [
  { label: "Sailboat", query: "Sailboat", icon: SailboatIcon },
  { label: "Yacht", query: "Yacht", icon: YachtIcon },
  { label: "Pontoon", query: "Pontoon Boat", icon: PontoonIcon },
  { label: "Bass Boat", query: "Bass Boat", icon: FishingBoatIcon },
  { label: "Center Console", query: "Center Console Boat", icon: ConsoleBoatIcon },
  { label: "Bay Boat", query: "Bay Boat", icon: BayBoatIcon },
  { label: "Jet Boat", query: "Jet Boat", icon: JetBoatIcon },
  { label: "Skiff", query: "Skiff", icon: SkiffIcon },
];

const CARD_STYLE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "1.25rem 0.75rem",
  background: "#ffffff",
  border: "1px solid #e1eef5",
  borderRadius: 16,
  color: "#55657a",
  textAlign: "center",
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(10, 61, 98, 0.05)",
  transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, color 0.18s ease",
  cursor: "pointer",
};

export default function BoatCategories() {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: 1280,
        marginInline: "auto",
      }}
    >
      <div
        className="bl-categories-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
          gap: "1rem",
        }}
      >
        {CATEGORIES.map(({ label, query, icon: Icon }) => (
          <Link
            key={label}
            href={`/listings?category=${encodeURIComponent(query)}`}
            className="bl-category-card"
            style={CARD_STYLE}
          >
            <div
              style={{
                width: 64,
                height: 64,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1e6091",
              }}
            >
              <Icon />
            </div>
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#0a3d62",
                lineHeight: 1.3,
              }}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>

      <style>{`
        .bl-category-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 26px rgba(10, 61, 98, 0.12);
          border-color: #b2dcf2;
          color: #1883ff;
        }

        @media (max-width: 1100px) {
          .bl-categories-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 540px) {
          .bl-categories-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </section>
  );
}
