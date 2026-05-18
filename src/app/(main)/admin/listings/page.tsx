"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";

type AdminListing = {
  id: number;
  title: string;
  category: string;
  location: string;
  valueUSD: number;
  manufacturedYear: number;
  status: string;
  createdAt: string;
  user?: { id: number; name: string; email: string } | null;
  media?: Array<{ url?: string; isPrimary?: boolean; kind?: string; mimeType?: string }>;
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

const CHEVRON_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%231e6091' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "SOLD", label: "Sold" },
  { value: "EXPIRED", label: "Expired" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ARCHIVED", label: "Archived" },
];

const statusTone: Record<string, { bg: string; color: string; border: string }> = {
  ACTIVE: { bg: "#eaf6ef", color: "#2f7d43", border: "#c5e9d2" },
  PENDING: { bg: "#fff8ec", color: "#b45309", border: "#fde7b8" },
  SOLD: { bg: "#eef2ff", color: "#4338ca", border: "#d6dafe" },
  EXPIRED: { bg: "#f6fafd", color: "#8ea3bb", border: "#e1eef5" },
  REJECTED: { bg: "#fff1f1", color: "#c53030", border: "#ffcfcf" },
  ARCHIVED: { bg: "#f6fafd", color: "#8ea3bb", border: "#e1eef5" },
};

const StatusPill = ({ status }: { status: string }) => {
  const t = statusTone[status.toUpperCase()] ?? statusTone.ACTIVE;
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
      {status.toLowerCase()}
    </span>
  );
};

const coverUrl = (l: AdminListing): string | null => {
  const media = l.media ?? [];
  const primary = media.find((m) => m.isPrimary);
  const image = media.find(
    (m) => m.kind === "IMAGE" || m.mimeType?.startsWith("image/"),
  );
  return primary?.url ?? image?.url ?? media[0]?.url ?? null;
};

const fmtPrice = (n: number) => `$${Number(n).toLocaleString()}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function AdminListingsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/listings?page=1&pageSize=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load listings");
      const data = (await res.json()) as { items?: AdminListing[] };
      setItems(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (listingId: number, status: string) => {
    if (!token) return;
    setBusy(listingId);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/listings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId, status }),
      });
      const data = (await res.json()) as { error?: string; listing?: AdminListing };
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      setItems((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status } : l)),
      );
      setMessage(`Listing #${listingId} → ${status.toLowerCase()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(null);
    }
  };

  const deleteListing = async (listingId: number) => {
    if (!token) return;
    if (
      !window.confirm(
        `Permanently delete listing #${listingId}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusy(listingId);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Delete failed");
      }
      setItems((prev) => prev.filter((l) => l.id !== listingId));
      setMessage(`Listing #${listingId} deleted.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div>
        <span style={EYEBROW}>Admin · Listings</span>
        <h1
          style={{
            margin: "0.4rem 0 0.25rem",
            fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
            fontWeight: 800,
            color: "#0a3d62",
            letterSpacing: "-0.025em",
          }}
        >
          Manage Listings
        </h1>
        <p style={{ margin: 0, color: "#55657a", fontSize: "0.95rem" }}>
          {loading
            ? "Loading…"
            : `${items.length} listing${items.length === 1 ? "" : "s"} across the platform`}
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
        <div style={{ ...CARD, color: "#8ea3bb" }}>Loading listings…</div>
      ) : items.length === 0 ? (
        <div style={{ ...CARD, color: "#55657a", padding: "2rem", textAlign: "center" }}>
          No listings on the platform yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.8rem" }}>
          {items.map((l) => {
            const cover = coverUrl(l);
            const isBusy = busy === l.id;
            return (
              <div
                key={l.id}
                style={{
                  ...CARD,
                  padding: "1rem",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: "1rem",
                  alignItems: "center",
                  opacity: isBusy ? 0.6 : 1,
                }}
              >
                <div
                  style={{
                    width: 88,
                    height: 72,
                    borderRadius: 10,
                    overflow: "hidden",
                    background: "linear-gradient(140deg, #e8f4fb, #f6fafd)",
                    flexShrink: 0,
                  }}
                >
                  {cover ? (
                    <img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8ea3bb",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      No image
                    </div>
                  )}
                </div>

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
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#0a3d62",
                        fontSize: "1rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {l.title}
                    </div>
                    <StatusPill status={l.status} />
                    <span style={{ fontSize: "0.78rem", color: "#8ea3bb" }}>
                      #{l.id}
                    </span>
                  </div>
                  <div style={{ color: "#55657a", fontSize: "0.85rem", marginBottom: 4 }}>
                    {l.category} · {l.location} · {l.manufacturedYear} · {fmtPrice(l.valueUSD)}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#8ea3bb" }}>
                    Seller: {l.user?.name ?? "—"}{l.user?.email ? ` (${l.user.email})` : ""} · Created {fmtDate(l.createdAt)}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "flex-end",
                    flexShrink: 0,
                  }}
                >
                  <select
                    value={l.status.toUpperCase()}
                    onChange={(e) => updateStatus(l.id, e.target.value)}
                    disabled={isBusy}
                    style={{
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      padding: "0.5rem 2.2rem 0.5rem 0.9rem",
                      borderRadius: 10,
                      border: "1px solid #e1eef5",
                      background: `#f6fafd ${CHEVRON_SVG} no-repeat right 0.75rem center`,
                      color: "#0a3d62",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      cursor: isBusy ? "not-allowed" : "pointer",
                      minWidth: 140,
                    }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Link
                      href={`/listings/${l.id}`}
                      style={{
                        padding: "0.4rem 0.75rem",
                        background: "#f6fafd",
                        color: "#0a3d62",
                        border: "1px solid #e1eef5",
                        borderRadius: 8,
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteListing(l.id)}
                      disabled={isBusy}
                      style={{
                        padding: "0.4rem 0.75rem",
                        background: "#fff5f5",
                        color: "#c53030",
                        border: "1px solid #ffd0d0",
                        borderRadius: 8,
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        cursor: isBusy ? "wait" : "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
