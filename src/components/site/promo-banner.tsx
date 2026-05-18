"use client";

import React from "react";
import Link from "next/link";
import loginImage from "@/images/Boatlistr_login_image.jpg";

const BANNER_IMAGE = loginImage.src;

const AnchorIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="22" x2="12" y2="8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
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

const MASK_GRADIENT =
  "linear-gradient(to right, #000 0%, #000 45%, transparent 95%)";

export default function PromoBanner() {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: 1420,
        marginInline: "auto",
      }}
    >
      <div
        className="bl-promo-banner"
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 24,
          background:
            "linear-gradient(135deg, #051d35 0%, #082b49 45%, #0a3d62 75%, #1e3a6a 100%)",
          color: "#ffffff",
          boxShadow: "0 18px 44px rgba(8, 43, 73, 0.35)",
          minHeight: 320,
          padding: "2.75rem 2.5rem",
        }}
      >
        {/* Left image, masked to fade into the gradient */}
        <div
          className="bl-promo-image-bg"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "58%",
            background: `url(${BANNER_IMAGE}) center/cover no-repeat`,
            maskImage: MASK_GRADIENT,
            WebkitMaskImage: MASK_GRADIENT,
            pointerEvents: "none",
          }}
        />

        {/* Subtle diagonal texture overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 32px)",
            pointerEvents: "none",
          }}
        />

        {/* Blue accent glow top-right */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-100px",
            right: "-120px",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(24, 131, 255, 0.28) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Text + CTA block, pushed to the right of the image */}
        <div
          className="bl-promo-text"
          style={{
            position: "relative",
            zIndex: 1,
            marginLeft: "44%",
            maxWidth: 620,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0.4rem 0.85rem",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: 999,
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.92)",
              width: "fit-content",
            }}
          >
            <AnchorIcon />
            BoatListr
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            Sell Your Boat in Minutes
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: "1rem",
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.55,
            }}
          >
            Reach thousands of buyers across the marketplace. Publish a free
            listing today — premium upgrades available anytime.
          </p>

          <div
            style={{
              marginTop: "0.4rem",
              display: "flex",
              alignItems: "center",
              gap: "0.9rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/listings/create"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "0.85rem 1.6rem",
                background: "#ffffff",
                color: "#0a3d62",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow: "0 10px 24px rgba(0, 0, 0, 0.25)",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 14px 28px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(0, 0, 0, 0.25)";
              }}
            >
              Start Your Free Listing
              <ArrowIcon />
            </Link>
            <Link
              href="/pricing"
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "underline",
                textDecorationColor: "rgba(255, 255, 255, 0.35)",
                textUnderlineOffset: 4,
              }}
            >
              See Premium plans
            </Link>
          </div>
        </div>

        {/* Bottom-right URL tag */}
        <div
          aria-hidden="true"
          className="bl-promo-url"
          style={{
            position: "absolute",
            right: 24,
            bottom: 16,
            fontSize: "0.78rem",
            color: "rgba(255, 255, 255, 0.45)",
            letterSpacing: "0.03em",
            zIndex: 1,
          }}
        >
          www.boatlistr.com
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .bl-promo-banner {
            padding: 2rem 1.5rem 3rem !important;
            min-height: auto !important;
          }
          .bl-promo-image-bg {
            width: 100% !important;
            height: 180px !important;
            bottom: auto !important;
            mask-image: linear-gradient(to bottom, #000 0%, #000 40%, transparent 100%) !important;
            -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 40%, transparent 100%) !important;
            opacity: 0.7;
          }
          .bl-promo-text {
            margin-left: 0 !important;
            margin-top: 8rem !important;
            text-align: center;
            align-items: center;
          }
          .bl-promo-text > div:last-child {
            justify-content: center !important;
          }
        }

        @media (max-width: 480px) {
          .bl-promo-url {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
