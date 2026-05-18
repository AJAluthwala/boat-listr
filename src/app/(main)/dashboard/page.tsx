"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import type { PlanKey } from "@/lib/plans";

type Me = { id: number; name: string; email: string };
type Listing = {
  id: number;
  title: string;
  category: string;
  location: string;
  valueUSD: number;
  manufacturedYear: number;
  status?: string;
  createdAt?: string;
};

const CARD: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e1eef5",
  borderRadius: 18,
  padding: "1.4rem",
  boxShadow: "0 8px 24px rgba(10, 61, 98, 0.06)",
};

const EYEBROW: React.CSSProperties = {
  display: "inline-block",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "#1883ff",
};

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const fmtPrice = (n: number) => `$${Number(n).toLocaleString()}`;

const SectionCard = ({
  href,
  title,
  description,
  accent,
}: {
  href: string;
  title: string;
  description: string;
  accent: string;
}) => (
  <Link
    href={href}
    style={{
      ...CARD,
      display: "block",
      transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 14px 30px rgba(10, 61, 98, 0.1)";
      e.currentTarget.style.borderColor = "#b2dcf2";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(10, 61, 98, 0.06)";
      e.currentTarget.style.borderColor = "#e1eef5";
    }}
  >
    <div style={{ ...EYEBROW, color: accent, marginBottom: "0.5rem" }}>{title}</div>
    <p style={{ margin: 0, color: "#55657a", fontSize: "0.95rem", lineHeight: 1.5 }}>
      {description}
    </p>
    <div
      style={{
        marginTop: "1rem",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: accent,
        fontSize: "0.88rem",
        fontWeight: 700,
      }}
    >
      Open
      <ArrowIcon />
    </div>
  </Link>
);

const StatTile = ({ label, value, hint }: { label: string; value: string | number; hint?: string }) => (
  <div style={CARD}>
    <div style={{ ...EYEBROW, marginBottom: "0.5rem" }}>{label}</div>
    <div
      style={{
        fontSize: "1.8rem",
        fontWeight: 800,
        color: "#0a3d62",
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
      }}
    >
      {value}
    </div>
    {hint && <div style={{ marginTop: 4, color: "#8ea3bb", fontSize: "0.82rem" }}>{hint}</div>}
  </div>
);

export default function DashboardPage() {
  const { isAuthenticated, token } = useAuth();
  const [me, setMe] = useState<Me | null>(null);
  const [plan, setPlan] = useState<PlanKey>("free");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [meRes, planRes] = await Promise.all([
          fetch("/api/users/me", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/subscriptions/status", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const meData = (await meRes.json()) as { user?: Me };
        const planData = (await planRes.json()) as { plan?: PlanKey };
        if (active) {
          if (meData.user) setMe(meData.user);
          if (planData.plan) setPlan(planData.plan);
          if (meData.user?.id) {
            const lr = await fetch(
              `/api/listings?userId=${meData.user.id}&page=1&pageSize=100`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            if (lr.ok) {
              const ld = (await lr.json()) as { items?: Listing[] };
              if (active) setListings(ld.items ?? []);
            }
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated, token]);

  const activeCount = listings.filter((l) => (l.status ?? "ACTIVE").toUpperCase() === "ACTIVE").length;
  const totalCount = listings.length;
  const recent = listings.slice(0, 3);

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div>
        <span style={EYEBROW}>My Account</span>
        <h1
          style={{
            margin: "0.4rem 0 0.25rem",
            fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
            fontWeight: 800,
            color: "#0a3d62",
            letterSpacing: "-0.025em",
          }}
        >
          Welcome back{me?.name ? `, ${me.name.split(" ")[0]}` : ""}
        </h1>
        <p style={{ margin: 0, color: "#55657a", fontSize: "0.95rem" }}>
          Manage your profile, listings, and subscription from one place.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        <StatTile
          label="My listings"
          value={loading ? "…" : totalCount}
          hint={`${activeCount} active`}
        />
        <StatTile
          label="Current plan"
          value={plan === "premium" ? "Premium" : "Free"}
          hint={plan === "premium" ? "30-day auto-renew" : "Up to 10 photos"}
        />
        <StatTile
          label="Member status"
          value={me ? "Active" : "…"}
          hint={me?.email ?? "BoatListr account"}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        <SectionCard
          href="/dashboard/profile"
          title="My Profile"
          accent="#1883ff"
          description="Update your name, address, contact details, and account information."
        />
        <SectionCard
          href="/dashboard/listings"
          title="My Listings"
          accent="#0a6ed9"
          description="View, edit, or remove the boats you have listed for sale."
        />
        <SectionCard
          href="/dashboard/subscriptions"
          title="Subscription"
          accent={plan === "premium" ? "#b45309" : "#1883ff"}
          description={
            plan === "premium"
              ? "View your premium status, renewal date, or cancel anytime."
              : "Upgrade to Premium for 25 photos, 3 videos, and priority placement."
          }
        />
      </div>

      <div style={CARD}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <span style={EYEBROW}>Recent activity</span>
            <h2
              style={{
                margin: "0.35rem 0 0",
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#0a3d62",
                letterSpacing: "-0.015em",
              }}
            >
              Your latest listings
            </h2>
          </div>
          <Link
            href="/dashboard/listings"
            style={{
              fontSize: "0.88rem",
              color: "#1883ff",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            View all <ArrowIcon />
          </Link>
        </div>

        {loading ? (
          <div style={{ color: "#8ea3bb", fontSize: "0.9rem" }}>Loading…</div>
        ) : recent.length === 0 ? (
          <div
            style={{
              padding: "2rem 1rem",
              textAlign: "center",
              color: "#55657a",
              fontSize: "0.95rem",
            }}
          >
            <p style={{ margin: "0 0 1rem" }}>You haven&apos;t listed a boat yet.</p>
            <Link
              href="/listings/create"
              style={{
                display: "inline-block",
                padding: "0.7rem 1.4rem",
                background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
                color: "#ffffff",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: "0.92rem",
                boxShadow: "0 8px 18px rgba(24, 131, 255, 0.28)",
              }}
            >
              Create your first listing
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {recent.map((l) => (
              <Link
                key={l.id}
                href={`/listings/${l.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "0.8rem 1rem",
                  background: "#f6fafd",
                  border: "1px solid #eef4f8",
                  borderRadius: 12,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#b2dcf2";
                  e.currentTarget.style.background = "#eaf3fb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#eef4f8";
                  e.currentTarget.style.background = "#f6fafd";
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#0a3d62",
                      fontSize: "0.95rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {l.title}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#8ea3bb", marginTop: 2 }}>
                    {l.category} · {l.location}
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    color: "#1883ff",
                    fontSize: "1rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fmtPrice(l.valueUSD)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
