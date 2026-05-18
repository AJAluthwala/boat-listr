"use client";

import React from "react";
import yachtImage from "@/images/Premium_yacht.png";
import CtaBanner from "@/components/site/cta-banner";

const HERO_IMAGE = yachtImage.src;

const EYEBROW: React.CSSProperties = {
  display: "inline-block",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "#1883ff",
};

const CARD: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e1eef5",
  borderRadius: 18,
  padding: "1.4rem",
  boxShadow: "0 8px 24px rgba(10, 61, 98, 0.06)",
};

const SECTION_PADDING: React.CSSProperties = {
  paddingTop: "5rem",
  paddingBottom: "3rem",
};

// ============================================
// TIMELINE ICONS
// ============================================

const UserIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
  </svg>
);
const UploadShipIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 19c.6.4 1.2.8 2 .8 2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 1.6.4 2 .8" />
    <path d="M19 16a9 9 0 0 0 1.5-5L12 8 3.5 11A9 9 0 0 0 5 16" />
    <path d="M12 8V4M9 4h6" />
  </svg>
);
const MailIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const TIMELINE_STEPS = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up in seconds with email — no paperwork. Your profile is the home base for every listing, message, and sale.",
    icon: <UserIcon />,
  },
  {
    number: "02",
    title: "Publish a Listing",
    description:
      "Add photos, videos, specs, and your asking price. Premium plans get priority placement and richer media support.",
    icon: <UploadShipIcon />,
  },
  {
    number: "03",
    title: "Receive Buyer Inquiries",
    description:
      "Interested buyers reach out through our secure contact form. Replies land in your inbox — your email stays private.",
    icon: <MailIcon />,
  },
  {
    number: "04",
    title: "Close the Deal",
    description:
      "Coordinate viewings, agree on terms, and finalize the sale on your schedule. Mark the listing as sold when you're done.",
    icon: <CheckCircleIcon />,
  },
];

// ============================================
// PAGE
// ============================================

export default function AboutPage() {
  return (
    <main>
      {/* ===== HERO ===== */}
      <section
        style={{
          position: "relative",
          padding: "3.5rem 0 4rem",
          background:
            "linear-gradient(180deg, #eaf4fb 0%, #f4f8f8 55%, #ffffff 100%)",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(24,131,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="bl-container"
          style={{ position: "relative", textAlign: "center" }}
        >
          <span style={EYEBROW}>About BoatListr</span>
          <h1
            style={{
              margin: "0.9rem auto 0.9rem",
              color: "#0a3d62",
              fontSize: "clamp(2.2rem, 4.8vw, 3.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              maxWidth: 760,
            }}
          >
            Building the modern boat marketplace
          </h1>
          <p
            style={{
              margin: "0 auto",
              color: "#55657a",
              fontSize: "clamp(1rem, 1.6vw, 1.1rem)",
              fontWeight: 500,
              maxWidth: 620,
              lineHeight: 1.6,
            }}
          >
            BoatListr connects buyers with sellers through a clean, secure, and
            fast marketplace — built so the right boat finds the right owner.
          </p>
        </div>
      </section>

      {/* ===== MISSION (image + text) ===== */}
      <section className="bl-container" style={SECTION_PADDING}>
        <div
          className="bl-about-mission"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "3rem",
            alignItems: "center",
            maxWidth: 1180,
            marginInline: "auto",
          }}
        >
          <div
            className="bl-about-mission-image"
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
                aspectRatio: "4 / 3",
                borderRadius: 22,
                overflow: "hidden",
                boxShadow: "0 24px 56px rgba(8, 43, 73, 0.25)",
                background: "#0a3d62",
              }}
            >
              <img
                src={HERO_IMAGE}
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

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <span style={EYEBROW}>Our mission</span>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 800,
                color: "#0a3d62",
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
              }}
            >
              Boat sales, without the friction
            </h2>
            <p
              style={{
                margin: 0,
                color: "#55657a",
                fontSize: "1rem",
                lineHeight: 1.65,
                maxWidth: 540,
              }}
            >
              We built BoatListr because buying and selling a boat shouldn&apos;t
              feel like a treasure hunt. Bloated classifieds, days-long reply
              cycles, listings that may or may not be real — none of that
              respects your time.
            </p>
            <p
              style={{
                margin: 0,
                color: "#55657a",
                fontSize: "1rem",
                lineHeight: 1.65,
                maxWidth: 540,
              }}
            >
              Instead, we give you clean listings, secure inquiries that protect
              your email, and a publishing flow you can finish in minutes. The
              focus stays where it belongs — the boats.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "0.75rem",
                marginTop: "0.5rem",
              }}
            >
              {[
                { label: "Listings published", value: "1,200+" },
                { label: "Active sellers", value: "500+" },
                { label: "Avg. response", value: "< 24h" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#f6fafd",
                    border: "1px solid #e1eef5",
                    borderRadius: 12,
                    padding: "0.85rem 1rem",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      color: "#0a3d62",
                      fontSize: "1.25rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "#8ea3bb",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginTop: 2,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS TIMELINE ===== */}
      <section className="bl-container" style={SECTION_PADDING}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={EYEBROW}>How it works</span>
          <h2
            style={{
              margin: "0.9rem 0 0.5rem",
              fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
              fontWeight: 800,
              color: "#0a3d62",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            Get started in four simple steps
          </h2>
          <p
            style={{
              margin: "0 auto",
              color: "#55657a",
              fontSize: "1rem",
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            From your first signup to closing a sale — here&apos;s exactly how
            BoatListr works.
          </p>
        </div>

        <div
          className="bl-timeline"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
            maxWidth: 1180,
            marginInline: "auto",
          }}
        >
          {/* Horizontal connecting line behind icons (desktop) */}
          <div
            className="bl-timeline-line"
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 48,
              left: "12.5%",
              right: "12.5%",
              height: 2,
              background:
                "repeating-linear-gradient(90deg, #b2dcf2 0 6px, transparent 6px 12px)",
              zIndex: 0,
            }}
          />

          {TIMELINE_STEPS.map((step) => (
            <div
              key={step.number}
              className="bl-timeline-step"
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #1883ff 0%, #0a3d62 100%)",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 12px 28px rgba(24, 131, 255, 0.28)",
                  border: "4px solid #ffffff",
                  marginBottom: "1.1rem",
                }}
              >
                {step.icon}
              </div>

              {/* Step number pill */}
              <div
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.7rem",
                  background: "#eaf3fb",
                  color: "#1883ff",
                  borderRadius: 999,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  marginBottom: "0.65rem",
                }}
              >
                STEP {step.number}
              </div>

              {/* Title */}
              <h3
                style={{
                  margin: 0,
                  marginBottom: "0.55rem",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#0a3d62",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  margin: 0,
                  color: "#55657a",
                  fontSize: "0.92rem",
                  lineHeight: 1.55,
                  maxWidth: 240,
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="bl-container" style={SECTION_PADDING}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
            maxWidth: 1180,
            marginInline: "auto",
          }}
        >
          {[
            {
              title: "Privacy first",
              body: "Buyer inquiries route through a secure form. Your email is never visible on a listing — replies still land in your inbox.",
            },
            {
              title: "Clean listings",
              body: "Every listing is structured the same way — title, year, length, price, photos — so buyers find what they need fast.",
            },
            {
              title: "Built for sellers",
              body: "Publish in minutes, manage from a single dashboard, and upgrade to Premium when you're ready for priority placement.",
            },
          ].map((value) => (
            <div key={value.title} style={CARD}>
              <div style={{ ...EYEBROW, marginBottom: "0.5rem" }}>
                {value.title}
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#55657a",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <CtaBanner />

      <style>{`
        @media (max-width: 900px) {
          .bl-about-mission {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .bl-about-mission-image {
            max-width: 380px !important;
          }
        }

        @media (max-width: 880px) {
          .bl-timeline {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            max-width: 480px !important;
          }
          .bl-timeline-line {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
