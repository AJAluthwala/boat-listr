"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-context";

type AdminSubscription = {
  id: number;
  stripeSubId: string;
  stripePriceId: string | null;
  status: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  user?: { id: number; name: string; email: string } | null;
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

const statusTone: Record<string, { bg: string; color: string; border: string }> = {
  ACTIVE: { bg: "#eaf6ef", color: "#2f7d43", border: "#c5e9d2" },
  TRIALING: { bg: "#eef2ff", color: "#4338ca", border: "#d6dafe" },
  PAST_DUE: { bg: "#fff8ec", color: "#b45309", border: "#fde7b8" },
  CANCELED: { bg: "#f6fafd", color: "#8ea3bb", border: "#e1eef5" },
  INCOMPLETE: { bg: "#fff8ec", color: "#b45309", border: "#fde7b8" },
  INCOMPLETE_EXPIRED: { bg: "#fff1f1", color: "#c53030", border: "#ffcfcf" },
  UNPAID: { bg: "#fff1f1", color: "#c53030", border: "#ffcfcf" },
};

const StatusPill = ({ status }: { status: string }) => {
  const t = statusTone[status.toUpperCase()] ?? statusTone.CANCELED;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 999,
        background: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {status.toLowerCase().replace(/_/g, " ")}
    </span>
  );
};

const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

export default function AdminSubscriptionsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/subscriptions?page=1&pageSize=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load subscriptions");
      const data = (await res.json()) as { items?: AdminSubscription[] };
      setItems(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const activeCount = items.filter((s) =>
    ["ACTIVE", "TRIALING"].includes(s.status.toUpperCase()),
  ).length;

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div>
        <span style={EYEBROW}>Admin · Subscriptions</span>
        <h1
          style={{
            margin: "0.4rem 0 0.25rem",
            fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
            fontWeight: 800,
            color: "#0a3d62",
            letterSpacing: "-0.025em",
          }}
        >
          Subscriptions
        </h1>
        <p style={{ margin: 0, color: "#55657a", fontSize: "0.95rem" }}>
          {loading
            ? "Loading…"
            : `${items.length} subscription${items.length === 1 ? "" : "s"} on record · ${activeCount} currently active`}
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

      {loading ? (
        <div style={{ ...CARD, color: "#8ea3bb" }}>Loading subscriptions…</div>
      ) : items.length === 0 ? (
        <div style={{ ...CARD, color: "#55657a", padding: "2rem", textAlign: "center" }}>
          No subscriptions on record yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          {items.map((s) => (
            <div
              key={s.id}
              style={{
                ...CARD,
                padding: "1rem 1.2rem",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#0a3d62",
                      fontSize: "0.95rem",
                    }}
                  >
                    {s.user?.name ?? "—"}
                  </span>
                  <StatusPill status={s.status} />
                  {s.cancelAtPeriodEnd && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "#b45309",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      Cancels at period end
                    </span>
                  )}
                </div>
                <div style={{ color: "#55657a", fontSize: "0.85rem", marginBottom: 4 }}>
                  {s.user?.email ?? "—"}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#8ea3bb" }}>
                  Stripe sub: <code style={{ fontFamily: "monospace" }}>{s.stripeSubId}</code>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#8ea3bb",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.cancelAtPeriodEnd ? "Access ends" : "Renews"}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#0a3d62",
                    fontSize: "0.92rem",
                  }}
                >
                  {fmtDate(s.currentPeriodEnd)}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#8ea3bb" }}>
                  Since {fmtDate(s.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
