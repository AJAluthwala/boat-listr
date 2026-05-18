"use client";

import React from "react";
import Link from "next/link";
import descriptionImage from "@/images/Description_Image.jpg";

const MAIN_IMAGE = descriptionImage.src;

const BENEFITS = [
  {
    number: "01",
    title: "Find a boat",
    body: "Browse curated listings from sellers across the country. Filter by category, price, length, and location to find your perfect boat in minutes.",
  },
  {
    number: "02",
    title: "Sell a boat",
    body: "List your boat with up to 25 photos and 3 videos on Premium. Reach thousands of qualified buyers through the marketplace.",
  },
  {
    number: "03",
    title: "Secure inquiries",
    body: "Buyers contact you through a private form — your email stays hidden. Replies route straight to your inbox so you stay in control.",
  },
];

export default function BenefitsSection() {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: 1280,
        marginInline: "auto",
      }}
    >
      <div
        className="bl-benefits-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        {/* LEFT — single image */}
        <div
          className="bl-benefits-images"
          style={{
            width: "100%",
            maxWidth: 520,
            justifySelf: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4 / 5",
              borderRadius: 22,
              overflow: "hidden",
              boxShadow: "0 24px 56px rgba(8, 43, 73, 0.25)",
              background: "#0a3d62",
            }}
          >
            <img
              src={MAIN_IMAGE}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        </div>

        {/* RIGHT — content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-block",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#1883ff",
              width: "fit-content",
            }}
          >
            Why BoatListr
          </div>

          {/* Heading */}
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              color: "#0a3d62",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            Connecting buyers and sellers, the modern way
          </h2>

          {/* Subtitle */}
          <p
            style={{
              margin: 0,
              color: "#55657a",
              fontSize: "1rem",
              lineHeight: 1.6,
              maxWidth: 520,
            }}
          >
            BoatListr is a marketplace built for how people actually buy and sell
            boats today — clean listings, secure inquiries, and a publishing
            flow you can finish in minutes.
          </p>

          {/* Feature cards */}
          <div
            style={{
              display: "grid",
              gap: "0.85rem",
              marginTop: "0.5rem",
            }}
          >
            {BENEFITS.map((item) => (
              <div
                key={item.number}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e1eef5",
                  borderRadius: 14,
                  padding: "1.1rem 1.25rem",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "1rem",
                  alignItems: "start",
                  boxShadow: "0 4px 14px rgba(10, 61, 98, 0.04)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#8ea3bb",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.number}.
                </div>
                <div>
                  <h3
                    style={{
                      margin: "0 0 0.35rem",
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: "#0a3d62",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: "#55657a",
                      fontSize: "0.92rem",
                      lineHeight: 1.55,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: "0.5rem" }}>
            <Link
              href="/listings/create"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "0.8rem 1.6rem",
                background: "#0a3d62",
                color: "#ffffff",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow: "0 8px 20px rgba(10, 61, 98, 0.25)",
                transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1883ff";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(24, 131, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0a3d62";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(10, 61, 98, 0.25)";
              }}
            >
              Sell Your Boat
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .bl-benefits-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .bl-benefits-images {
            max-width: 420px !important;
          }
        }
      `}</style>
    </section>
  );
}
