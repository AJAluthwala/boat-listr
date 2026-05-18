"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";

type Stats = {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  soldListings: number;
  activeSubscriptions: number;
  totalSubscriptions: number;
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

const StatTile = ({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}) => (
  <div style={CARD}>
    <div style={{ ...EYEBROW, color: accent ?? "#1883ff", marginBottom: "0.5rem" }}>
      {label}
    </div>
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
    {hint && (
      <div style={{ marginTop: 4, color: "#8ea3bb", fontSize: "0.82rem" }}>{hint}</div>
    )}
  </div>
);

const SectionLink = ({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
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
    <div style={{ ...EYEBROW, marginBottom: "0.5rem" }}>{title}</div>
    <p style={{ margin: 0, color: "#55657a", fontSize: "0.95rem", lineHeight: 1.5 }}>
      {description}
    </p>
    <div
      style={{
        marginTop: "1rem",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: "#1883ff",
        fontSize: "0.88rem",
        fontWeight: 700,
      }}
    >
      Open →
    </div>
  </Link>
);

export default function AdminOverviewPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load stats");
        const data = (await res.json()) as Stats;
        if (active) setStats(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div>
        <span style={EYEBROW}>Admin</span>
        <h1
          style={{
            margin: "0.4rem 0 0.25rem",
            fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
            fontWeight: 800,
            color: "#0a3d62",
            letterSpacing: "-0.025em",
          }}
        >
          Platform overview
        </h1>
        <p style={{ margin: 0, color: "#55657a", fontSize: "0.95rem" }}>
          Manage listings, users, and subscriptions across the marketplace.
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: "0.65rem 0.9rem",
            background: "#fff1f1",
            border: "1px solid #ffcfcf",
            borderRadius: 12,
            color: "#c53030",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
        }}
      >
        <StatTile
          label="Total users"
          value={loading ? "…" : (stats?.totalUsers ?? 0).toLocaleString()}
        />
        <StatTile
          label="Total listings"
          value={loading ? "…" : (stats?.totalListings ?? 0).toLocaleString()}
          hint={loading ? "" : `${stats?.activeListings ?? 0} active · ${stats?.pendingListings ?? 0} pending`}
        />
        <StatTile
          label="Sold listings"
          value={loading ? "…" : (stats?.soldListings ?? 0).toLocaleString()}
          accent="#16a34a"
        />
        <StatTile
          label="Active subscriptions"
          value={loading ? "…" : (stats?.activeSubscriptions ?? 0).toLocaleString()}
          hint={loading ? "" : `${stats?.totalSubscriptions ?? 0} total all-time`}
          accent="#b45309"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        <SectionLink
          href="/admin/listings"
          title="Listings"
          description="Review, change status (Active → Pending, Sold, Archived), or remove listings."
        />
        <SectionLink
          href="/admin/users"
          title="Users"
          description="View all registered users and promote sellers to admin."
        />
        <SectionLink
          href="/admin/subscriptions"
          title="Subscriptions"
          description="Check Stripe subscription status, renewal dates, and history."
        />
      </div>
    </div>
  );
}
