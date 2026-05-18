"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-context";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  address: string | null;
  contactNumber: string | null;
  role: string;
  createdAt: string;
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

const ROLE_OPTIONS = [
  { value: "SELLER", label: "Seller" },
  { value: "ADMIN", label: "Admin" },
];

const RolePill = ({ role }: { role: string }) => {
  const isAdmin = role.toUpperCase() === "ADMIN";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 999,
        background: isAdmin ? "#fff8ec" : "#f6fafd",
        color: isAdmin ? "#b45309" : "#1e6091",
        border: `1px solid ${isAdmin ? "#fde7b8" : "#e1eef5"}`,
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {role.toLowerCase()}
    </span>
  );
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  const [me, setMe] = useState<{ id: number } | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [usersRes, meRes] = await Promise.all([
        fetch("/api/admin/users?page=1&pageSize=100", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (!usersRes.ok) throw new Error("Failed to load users");
      const data = (await usersRes.json()) as { items?: AdminUser[] };
      setItems(data.items ?? []);
      if (meRes.ok) {
        const meData = (await meRes.json()) as { user?: { id: number } };
        if (meData.user) setMe(meData.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateRole = async (userId: number, role: string) => {
    if (!token) return;
    setBusy(userId);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      setItems((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u)),
      );
      setMessage(`User #${userId} role updated to ${role.toLowerCase()}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div>
        <span style={EYEBROW}>Admin · Users</span>
        <h1
          style={{
            margin: "0.4rem 0 0.25rem",
            fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
            fontWeight: 800,
            color: "#0a3d62",
            letterSpacing: "-0.025em",
          }}
        >
          Manage Users
        </h1>
        <p style={{ margin: 0, color: "#55657a", fontSize: "0.95rem" }}>
          {loading
            ? "Loading…"
            : `${items.length} registered user${items.length === 1 ? "" : "s"}`}
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
        <div style={{ ...CARD, color: "#8ea3bb" }}>Loading users…</div>
      ) : items.length === 0 ? (
        <div style={{ ...CARD, color: "#55657a", padding: "2rem", textAlign: "center" }}>
          No users found.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          {items.map((u) => {
            const initial = (u.name ?? "U").trim().charAt(0).toUpperCase();
            const isBusy = busy === u.id;
            const isSelf = me?.id === u.id;
            return (
              <div
                key={u.id}
                style={{
                  ...CARD,
                  padding: "1rem 1.2rem",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: "1rem",
                  alignItems: "center",
                  opacity: isBusy ? 0.6 : 1,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1883ff 0%, #0a3d62 100%)",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1rem",
                    flexShrink: 0,
                  }}
                >
                  {initial}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#0a3d62",
                        fontSize: "0.95rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {u.name}
                    </span>
                    <RolePill role={u.role} />
                    {isSelf && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "#1883ff",
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        You
                      </span>
                    )}
                  </div>
                  <div style={{ color: "#55657a", fontSize: "0.85rem" }}>
                    {u.email}
                    {u.contactNumber ? ` · ${u.contactNumber}` : ""}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#8ea3bb", marginTop: 2 }}>
                    #{u.id} · Joined {fmtDate(u.createdAt)}
                  </div>
                </div>

                <select
                  value={u.role.toUpperCase()}
                  onChange={(e) => updateRole(u.id, e.target.value)}
                  disabled={isBusy || isSelf}
                  title={isSelf ? "You can't change your own role" : undefined}
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
                    cursor: isBusy || isSelf ? "not-allowed" : "pointer",
                    opacity: isSelf ? 0.55 : 1,
                    minWidth: 120,
                  }}
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
