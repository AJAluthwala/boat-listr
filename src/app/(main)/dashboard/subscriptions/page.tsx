"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import { PLANS, type PlanKey } from "@/lib/plans";

type SubscriptionInfo = {
  id: number;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

type StatusResponse = {
  plan: PlanKey;
  subscription: SubscriptionInfo | null;
};

const CARD: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e1eef5",
  borderRadius: 18,
  padding: "1.75rem",
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

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

const statusTone = (status: string): { bg: string; color: string; border: string; label: string } => {
  const s = status.toUpperCase();
  if (s === "ACTIVE") return { bg: "#eaf6ef", color: "#2f7d43", border: "#c5e9d2", label: "Active" };
  if (s === "TRIALING") return { bg: "#eef2ff", color: "#4338ca", border: "#d6dafe", label: "Trial" };
  if (s === "PAST_DUE") return { bg: "#fff8ec", color: "#b45309", border: "#fde7b8", label: "Past Due" };
  if (s === "CANCELED") return { bg: "#f6fafd", color: "#8ea3bb", border: "#e1eef5", label: "Canceled" };
  return { bg: "#f6fafd", color: "#8ea3bb", border: "#e1eef5", label: s };
};

export default function SubscriptionsPage() {
  const { isAuthenticated, token } = useAuth();
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = React.useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscriptions/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load subscription");
      const d = (await res.json()) as StatusResponse;
      setData(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subscription");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleUpgrade = async () => {
    if (!token) return;
    setUpgrading(true);
    setError("");
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "Failed to start checkout");
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setUpgrading(false);
    }
  };

  const handleCancel = async () => {
    if (!token) return;
    if (
      !window.confirm(
        "Cancel your premium subscription? You'll keep premium access until the current period ends.",
      )
    ) {
      return;
    }
    setCancelling(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to cancel");
      setMessage(
        "Your subscription will end at the close of the current billing period. You'll keep premium access until then.",
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  const handleSync = async () => {
    if (!token) return;
    setSyncing(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/subscriptions/sync", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as { synced?: number; message?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Sync failed");
      setMessage(json.message ?? "Sync complete");
      if (json.synced && json.synced > 0) {
        await load();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const handlePortal = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/subscriptions/portal", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "Failed to open portal");
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open portal");
    }
  };

  const plan = data?.plan ?? "free";
  const subscription = data?.subscription ?? null;
  const isPremium = plan === "premium";
  const tone = subscription ? statusTone(subscription.status) : null;

  const premiumPlan = PLANS.premium;

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div>
        <span style={EYEBROW}>Billing</span>
        <h1
          style={{
            margin: "0.4rem 0 0.25rem",
            fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
            fontWeight: 800,
            color: "#0a3d62",
            letterSpacing: "-0.025em",
          }}
        >
          Subscription
        </h1>
        <p style={{ margin: 0, color: "#55657a", fontSize: "0.95rem" }}>
          Manage your plan, billing, and premium features.
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
      {message && (
        <div
          style={{
            padding: "0.65rem 0.9rem",
            background: "#e8f7ee",
            border: "1px solid #b9e3c8",
            borderRadius: 12,
            color: "#2f7d43",
            fontSize: "0.9rem",
          }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div style={{ ...CARD, color: "#8ea3bb" }}>Loading subscription…</div>
      ) : isPremium ? (
        <div
          style={{
            ...CARD,
            background:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 28px), linear-gradient(135deg, #051d35 0%, #0a3d62 40%, #1883ff 100%)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.75)",
                  marginBottom: 4,
                }}
              >
                Current Plan
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                }}
              >
                ★ Premium Listing
              </h2>
              <div
                style={{
                  marginTop: 4,
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "0.95rem",
                }}
              >
                ${premiumPlan.priceUSD} / {premiumPlan.billingPeriod}
              </div>
            </div>
            {tone && (
              <span
                style={{
                  background: "rgba(255,255,255,0.18)",
                  color: "#ffffff",
                  padding: "0.3rem 0.85rem",
                  borderRadius: 999,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {tone.label}
              </span>
            )}
          </div>

          {/* Renewal info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "0.85rem 1rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: 4,
                }}
              >
                {subscription?.cancelAtPeriodEnd ? "Access ends" : "Renews on"}
              </div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "#ffffff" }}>
                {formatDate(subscription?.currentPeriodEnd ?? null)}
              </div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "0.85rem 1rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: 4,
                }}
              >
                Auto-renew
              </div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "#ffffff" }}>
                {subscription?.cancelAtPeriodEnd ? "Off — ends soon" : "On"}
              </div>
            </div>
          </div>

          {/* Features */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 8,
              marginBottom: "1.5rem",
            }}
          >
            {premiumPlan.features.map((f) => (
              <li
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "rgba(255,255,255,0.92)",
                  fontSize: "0.92rem",
                }}
              >
                <span style={{ color: "#86efac", display: "inline-flex" }}>
                  <CheckIcon />
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handlePortal}
              style={{
                padding: "0.7rem 1.4rem",
                background: "#ffffff",
                color: "#0a3d62",
                border: "none",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: "0.92rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Manage billing
            </button>
            {!subscription?.cancelAtPeriodEnd && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                style={{
                  padding: "0.7rem 1.4rem",
                  background: "transparent",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.45)",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  cursor: cancelling ? "wait" : "pointer",
                  opacity: cancelling ? 0.65 : 1,
                  fontFamily: "inherit",
                }}
              >
                {cancelling ? "Cancelling…" : "Cancel subscription"}
              </button>
            )}
          </div>
        </div>
      ) : (
        // FREE plan — show upgrade card
        <div style={CARD}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <div
                style={{
                  ...EYEBROW,
                  marginBottom: 4,
                }}
              >
                Current Plan
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "#0a3d62",
                  letterSpacing: "-0.02em",
                }}
              >
                Free Listing
              </h2>
              <div style={{ marginTop: 4, color: "#55657a", fontSize: "0.95rem" }}>
                No payment on file
              </div>
            </div>
            <span
              style={{
                background: "#f6fafd",
                color: "#1883ff",
                padding: "0.3rem 0.85rem",
                borderRadius: 999,
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                border: "1px solid #e1eef5",
              }}
            >
              Free
            </span>
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 8,
              marginBottom: "1.5rem",
            }}
          >
            {PLANS.free.features.map((f) => (
              <li
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#3d4f63",
                  fontSize: "0.92rem",
                }}
              >
                <span style={{ color: "#16a34a", display: "inline-flex" }}>
                  <CheckIcon />
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* Upgrade nudge */}
          <div
            style={{
              padding: "1.25rem",
              background: "linear-gradient(135deg, #f6fafd 0%, #eaf3fb 100%)",
              border: "1px solid #c7e0f4",
              borderRadius: 14,
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#1883ff",
                marginBottom: 6,
              }}
            >
              Upgrade to Premium
            </div>
            <h3
              style={{
                margin: 0,
                marginBottom: "0.5rem",
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#0a3d62",
              }}
            >
              ${premiumPlan.priceUSD} / month — sell faster
            </h3>
            <p
              style={{
                margin: 0,
                marginBottom: "1rem",
                color: "#55657a",
                fontSize: "0.92rem",
                lineHeight: 1.5,
              }}
            >
              Unlock 25 photos, 3 videos, priority placement in search, and sales
              analytics.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={upgrading}
                style={{
                  padding: "0.7rem 1.4rem",
                  background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  cursor: upgrading ? "wait" : "pointer",
                  boxShadow: "0 8px 18px rgba(24, 131, 255, 0.28)",
                  opacity: upgrading ? 0.75 : 1,
                  fontFamily: "inherit",
                }}
              >
                {upgrading ? "Redirecting…" : "Upgrade to Premium"}
              </button>
              <Link
                href="/pricing"
                style={{
                  padding: "0.7rem 1.4rem",
                  background: "#ffffff",
                  color: "#0a3d62",
                  border: "1px solid #e1eef5",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: "0.92rem",
                }}
              >
                Compare plans
              </Link>
            </div>
          </div>

          {/* Recovery: payment went through but plan didn't flip? */}
          <div
            style={{
              marginTop: "1.25rem",
              paddingTop: "1.25rem",
              borderTop: "1px dashed #e1eef5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontSize: "0.82rem", color: "#8ea3bb", maxWidth: 420 }}>
              Already paid but still seeing Free? Pull the latest subscription
              from Stripe directly.
            </div>
            <button
              type="button"
              onClick={handleSync}
              disabled={syncing}
              style={{
                padding: "0.55rem 1.1rem",
                background: "#ffffff",
                color: "#1883ff",
                border: "1px solid #c7e0f4",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: syncing ? "wait" : "pointer",
                opacity: syncing ? 0.7 : 1,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              {syncing ? "Syncing…" : "Sync from Stripe"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
