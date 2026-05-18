"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";

type Listing = {
  id: number;
  title: string;
  category: string;
  location: string;
  valueUSD: number;
  manufacturedYear: number;
  status?: string;
  createdAt?: string;
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

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const fmtPrice = (n: number) => `$${Number(n).toLocaleString()}`;

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

const coverUrl = (l: Listing): string | null => {
  const media = l.media ?? [];
  const primary = media.find((m) => m.isPrimary);
  const image = media.find(
    (m) => m.kind === "IMAGE" || m.mimeType?.startsWith("image/"),
  );
  return primary?.url ?? image?.url ?? media[0]?.url ?? null;
};

export default function MyListingsPage() {
  const { isAuthenticated, token } = useAuth();
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = React.useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    setError("");
    try {
      const meRes = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meData = (await meRes.json()) as { user?: { id: number } };
      if (!meData.user?.id) throw new Error("Failed to load profile");

      const lr = await fetch(
        `/api/listings?userId=${meData.user.id}&page=1&pageSize=100`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!lr.ok) throw new Error("Failed to load listings");
      const ld = (await lr.json()) as { items?: Listing[] };
      setItems(ld.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    setDeleting(id);
    setError("");
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Delete failed");
      }
      setItems((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const totalCount = items.length;
  const activeCount = items.filter(
    (l) => (l.status ?? "ACTIVE").toUpperCase() === "ACTIVE",
  ).length;

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <span style={EYEBROW}>Inventory</span>
          <h1
            style={{
              margin: "0.4rem 0 0.25rem",
              fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
              fontWeight: 800,
              color: "#0a3d62",
              letterSpacing: "-0.025em",
            }}
          >
            My Listings
          </h1>
          <p style={{ margin: 0, color: "#55657a", fontSize: "0.95rem" }}>
            {loading
              ? "Loading your listings…"
              : `${totalCount} listing${totalCount === 1 ? "" : "s"} · ${activeCount} active`}
          </p>
        </div>
        <Link
          href="/listings/create"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "0.75rem 1.4rem",
            background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: 14,
            fontWeight: 700,
            fontSize: "0.95rem",
            boxShadow: "0 8px 18px rgba(24, 131, 255, 0.28)",
          }}
        >
          <PlusIcon />
          New listing
        </Link>
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

      {/* List */}
      {loading ? (
        <div style={{ ...CARD, color: "#8ea3bb", fontSize: "0.95rem" }}>Loading…</div>
      ) : items.length === 0 ? (
        <div
          style={{
            ...CARD,
            padding: "3rem 1.5rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              background:
                "linear-gradient(140deg, #e0f2fe 0%, #f0f9ff 60%, #ffffff 100%)",
              border: "1px solid #d3ecf6",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem",
              color: "#0284c7",
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 1.9.5 2.5 1" />
              <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
              <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
            </svg>
          </div>
          <h3
            style={{
              margin: 0,
              marginBottom: "0.5rem",
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#0a3d62",
            }}
          >
            No listings yet
          </h3>
          <p
            style={{
              margin: 0,
              marginBottom: "1.5rem",
              color: "#55657a",
              fontSize: "0.95rem",
              maxWidth: 400,
              marginInline: "auto",
              lineHeight: 1.5,
            }}
          >
            Get your first boat in front of buyers. It only takes a few minutes.
          </p>
          <Link
            href="/listings/create"
            style={{
              display: "inline-block",
              padding: "0.7rem 1.5rem",
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
        <div style={{ display: "grid", gap: "0.8rem" }}>
          {items.map((l) => {
            const cover = coverUrl(l);
            const status = (l.status ?? "ACTIVE").toUpperCase();
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
                }}
              >
                {/* Thumbnail */}
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
                    <img
                      src={cover}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
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

                {/* Info */}
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
                        letterSpacing: "-0.01em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {l.title}
                    </div>
                    <StatusPill status={status} />
                  </div>
                  <div style={{ color: "#55657a", fontSize: "0.85rem" }}>
                    {l.category} · {l.location} · {l.manufacturedYear}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontWeight: 800,
                      color: "#1883ff",
                      fontSize: "1.05rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {fmtPrice(l.valueUSD)}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                  <Link
                    href={`/listings/${l.id}`}
                    title="View public listing"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "0.5rem 0.85rem",
                      background: "#f6fafd",
                      color: "#0a3d62",
                      border: "1px solid #e1eef5",
                      borderRadius: 10,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    <EyeIcon />
                    View
                  </Link>
                  <Link
                    href={`/dashboard/listings/${l.id}/edit`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "0.5rem 0.85rem",
                      background: "#eaf3fb",
                      color: "#1883ff",
                      border: "1px solid #c7e0f4",
                      borderRadius: 10,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    <EditIcon />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(l.id)}
                    disabled={deleting === l.id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "0.5rem 0.85rem",
                      background: "#fff5f5",
                      color: "#c53030",
                      border: "1px solid #ffd0d0",
                      borderRadius: 10,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: deleting === l.id ? "wait" : "pointer",
                      opacity: deleting === l.id ? 0.7 : 1,
                      fontFamily: "inherit",
                    }}
                  >
                    <TrashIcon />
                    {deleting === l.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
