"use client";

import React from "react";
import Link from "next/link";
import sailboatCover from "@/images/Sailboat_cover.jpg";

const BG_IMAGE = sailboatCover.src;

export default function CtaBanner() {
  return (
    <section
      className="bl-container"
      style={{
        paddingTop: "5rem",
        paddingBottom: "1.5rem",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 24,
          padding: "3rem 2.5rem",
          background: `repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 28px), linear-gradient(135deg, rgba(5, 29, 53, 0.88) 0%, rgba(10, 61, 98, 0.75) 45%, rgba(24, 131, 255, 0.5) 100%), url(${BG_IMAGE}) center/cover no-repeat`,
          color: "#ffffff",
          boxShadow: "0 24px 56px rgba(8, 43, 73, 0.35)",
          textAlign: "center",
          maxWidth: 1420,
          marginInline: "auto",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            Ready to set sail?
          </h2>
          <p
            style={{
              margin: "0.9rem auto 0",
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "1rem",
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            Whether you&apos;re buying your first boat or moving up to a bigger
            one, BoatListr makes it simple.
          </p>
          <div
            style={{
              marginTop: "1.6rem",
              display: "flex",
              gap: "0.9rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/listings"
              style={{
                padding: "0.85rem 1.6rem",
                background: "#ffffff",
                color: "#0a3d62",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 10px 24px rgba(0, 0, 0, 0.25)",
              }}
            >
              Browse listings
            </Link>
            <Link
              href="/listings/create"
              style={{
                padding: "0.85rem 1.6rem",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
              }}
            >
              Sell your boat
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
