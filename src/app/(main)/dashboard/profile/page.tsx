"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-context";

type Me = {
  id: number;
  name: string;
  email: string;
  address?: string | null;
  contactNumber?: string | null;
  role?: string;
};

const CARD: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e1eef5",
  borderRadius: 18,
  padding: "1.75rem",
  boxShadow: "0 8px 24px rgba(10, 61, 98, 0.06)",
};

const FIELD_LABEL: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#0a3d62",
  marginBottom: 6,
};

const FIELD_INPUT: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  borderRadius: 12,
  border: "1px solid #e1eef5",
  background: "#f6fafd",
  fontSize: "0.92rem",
  color: "#0a3d62",
  fontWeight: 500,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
};

const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "#1883ff";
  e.currentTarget.style.background = "#ffffff";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(24, 131, 255, 0.12)";
};
const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "#e1eef5";
  e.currentTarget.style.background = "#f6fafd";
  e.currentTarget.style.boxShadow = "none";
};

export default function ProfilePage() {
  const { isAuthenticated, token } = useAuth();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = (await res.json()) as { user?: Me };
        if (active && data.user) {
          setMe(data.user);
          setName(data.user.name ?? "");
          setAddress(data.user.address ?? "");
          setContactNumber(data.user.contactNumber ?? "");
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated, token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, address, contactNumber }),
      });
      const data = (await res.json()) as { user?: Me; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      if (data.user) setMe(data.user);
      setMessage("Profile updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const dirty =
    me !== null &&
    (name !== (me.name ?? "") ||
      address !== (me.address ?? "") ||
      contactNumber !== (me.contactNumber ?? ""));

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div>
        <span
          style={{
            display: "inline-block",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#1883ff",
          }}
        >
          Account
        </span>
        <h1
          style={{
            margin: "0.4rem 0 0.25rem",
            fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
            fontWeight: 800,
            color: "#0a3d62",
            letterSpacing: "-0.025em",
          }}
        >
          My Profile
        </h1>
        <p style={{ margin: 0, color: "#55657a", fontSize: "0.95rem" }}>
          Update your account information. Only you can see and edit this.
        </p>
      </div>

      {loading ? (
        <div style={{ ...CARD, color: "#8ea3bb", fontSize: "0.95rem" }}>Loading profile…</div>
      ) : (
        <form onSubmit={onSubmit} style={CARD}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.1rem",
            }}
          >
            <div>
              <label style={FIELD_LABEL}>Full name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                style={FIELD_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div>
              <label style={FIELD_LABEL}>Email</label>
              <input
                type="email"
                value={me?.email ?? ""}
                disabled
                style={{
                  ...FIELD_INPUT,
                  background: "#f0f4f7",
                  color: "#8ea3bb",
                  cursor: "not-allowed",
                }}
              />
              <div style={{ marginTop: 4, fontSize: "0.78rem", color: "#8ea3bb" }}>
                Contact support to change your email.
              </div>
            </div>

            <div>
              <label style={FIELD_LABEL}>Contact number</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g. +1 555 123 4567"
                style={FIELD_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={FIELD_LABEL}>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City, State"
                style={FIELD_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
          </div>

          {error && (
            <p
              style={{
                marginTop: "1rem",
                padding: "0.65rem 0.9rem",
                background: "#fff1f1",
                border: "1px solid #ffcfcf",
                borderRadius: 12,
                color: "#c53030",
                fontSize: "0.88rem",
              }}
            >
              {error}
            </p>
          )}
          {message && (
            <p
              style={{
                marginTop: "1rem",
                padding: "0.65rem 0.9rem",
                background: "#e8f7ee",
                border: "1px solid #b9e3c8",
                borderRadius: 12,
                color: "#2f7d43",
                fontSize: "0.88rem",
              }}
            >
              {message}
            </p>
          )}

          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={saving || !dirty}
              style={{
                padding: "0.75rem 1.6rem",
                background: dirty
                  ? "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)"
                  : "#cfdce8",
                color: "#ffffff",
                border: "none",
                borderRadius: 12,
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: saving ? "wait" : dirty ? "pointer" : "not-allowed",
                boxShadow: dirty ? "0 8px 18px rgba(24, 131, 255, 0.28)" : "none",
                fontFamily: "inherit",
              }}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
