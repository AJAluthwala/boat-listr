"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import {
  BOAT_BRANDS,
  FILTER_DATA,
  LISTING_STATUS_OPTIONS,
} from "@/components/listings/constants";

type Listing = {
  id: number;
  title: string;
  category: string;
  brand?: string | null;
  manufacturedYear: number;
  lengthFt?: number | null;
  capacity?: number | null;
  engine?: string | null;
  totalPowerHP?: number | null;
  location: string;
  valueUSD: number;
  shortDescription: string;
  mainDescription?: string | null;
  status?: string;
  user?: { id: number };
};

const CARD: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e1eef5",
  borderRadius: 18,
  padding: "1.75rem",
  boxShadow: "0 8px 24px rgba(10, 61, 98, 0.06)",
};

const SECTION_HEADING: React.CSSProperties = {
  margin: 0,
  marginBottom: "1.1rem",
  fontSize: "0.95rem",
  fontWeight: 800,
  color: "#1883ff",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const EYEBROW: React.CSSProperties = {
  display: "inline-block",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "#1883ff",
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

const CHEVRON_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%231e6091' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")";

const SELECT_INPUT: React.CSSProperties = {
  ...FIELD_INPUT,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  paddingRight: "2.3rem",
  background: `#f6fafd ${CHEVRON_SVG} no-repeat right 0.85rem center`,
  cursor: "pointer",
};

const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#1883ff";
  e.currentTarget.style.background = e.currentTarget.tagName === "SELECT" ? "#ffffff" : "#ffffff";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(24, 131, 255, 0.12)";
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  if (e.currentTarget.tagName === "SELECT") {
    e.currentTarget.style.background = `#f6fafd ${CHEVRON_SVG} no-repeat right 0.85rem center`;
  } else {
    e.currentTarget.style.background = "#f6fafd";
  }
  e.currentTarget.style.borderColor = "#e1eef5";
  e.currentTarget.style.boxShadow = "none";
};

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label style={FIELD_LABEL}>
      {label}
      {required && <span style={{ color: "#ff4d4d", marginLeft: 4 }}>*</span>}
    </label>
    {children}
  </div>
);

export default function EditListingPage() {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const listingId = params?.id;
  const { isAuthenticated, token } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [forbidden, setForbidden] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [manufacturedYear, setManufacturedYear] = useState("");
  const [lengthFt, setLengthFt] = useState("");
  const [capacity, setCapacity] = useState("");
  const [engine, setEngine] = useState("");
  const [totalPowerHP, setTotalPowerHP] = useState("");
  const [location, setLocation] = useState("");
  const [valueUSD, setValueUSD] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [mainDescription, setMainDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const load = useCallback(async () => {
    if (!listingId || !isAuthenticated || !token) return;
    setLoading(true);
    setError("");
    try {
      const meRes = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meData = (await meRes.json()) as { user?: { id: number } };

      const res = await fetch(`/api/listings/${listingId}`);
      if (!res.ok) throw new Error("Listing not found");
      const data = (await res.json()) as { listing?: Listing };
      const l = data.listing;
      if (!l) throw new Error("Listing not found");

      if (meData.user?.id && l.user?.id && meData.user.id !== l.user.id) {
        setForbidden(true);
        return;
      }

      setListing(l);
      setTitle(l.title ?? "");
      setCategory(l.category ?? "");
      setBrand(l.brand ?? "");
      setManufacturedYear(String(l.manufacturedYear ?? ""));
      setLengthFt(l.lengthFt != null ? String(l.lengthFt) : "");
      setCapacity(l.capacity != null ? String(l.capacity) : "");
      setEngine(l.engine ?? "");
      setTotalPowerHP(l.totalPowerHP != null ? String(l.totalPowerHP) : "");
      setLocation(l.location ?? "");
      setValueUSD(String(l.valueUSD ?? ""));
      setShortDescription(l.shortDescription ?? "");
      setMainDescription(l.mainDescription ?? "");
      setStatus((l.status ?? "ACTIVE").toUpperCase());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listing");
    } finally {
      setLoading(false);
    }
  }, [listingId, isAuthenticated, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !listingId) return;
    setError("");
    setMessage("");

    if (!title.trim()) return setError("Title is required");
    if (!category.trim()) return setError("Category is required");
    if (!manufacturedYear || isNaN(Number(manufacturedYear)))
      return setError("Year is required");
    if (!lengthFt || isNaN(Number(lengthFt)))
      return setError("Length is required");
    if (!location.trim()) return setError("Location is required");
    if (!valueUSD || isNaN(Number(valueUSD)))
      return setError("Price is required");
    if (!shortDescription.trim())
      return setError("Short description is required");

    setSaving(true);
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim(),
          brand: brand.trim(),
          manufacturedYear: Number(manufacturedYear),
          lengthFt: Number(lengthFt),
          capacity: capacity ? Number(capacity) : undefined,
          engine: engine.trim(),
          totalPowerHP: totalPowerHP ? Number(totalPowerHP) : undefined,
          location: location.trim(),
          valueUSD: Number(valueUSD),
          shortDescription: shortDescription.trim(),
          mainDescription: mainDescription.trim(),
          status,
        }),
      });
      const data = (await res.json()) as { error?: string; listing?: Listing };
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      setMessage("Listing updated successfully.");
      if (data.listing) setListing(data.listing);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (forbidden) {
    return (
      <div style={{ ...CARD, padding: "3rem 1.5rem", textAlign: "center" }}>
        <h2
          style={{
            margin: "0 0 0.5rem",
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#0a3d62",
          }}
        >
          You can&apos;t edit this listing
        </h2>
        <p style={{ margin: "0 0 1.5rem", color: "#55657a" }}>
          This listing belongs to another seller.
        </p>
        <Link
          href="/dashboard/listings"
          style={{
            display: "inline-block",
            padding: "0.65rem 1.4rem",
            background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
            color: "#ffffff",
            borderRadius: 14,
            fontWeight: 700,
            fontSize: "0.92rem",
            boxShadow: "0 8px 18px rgba(24, 131, 255, 0.28)",
          }}
        >
          Back to my listings
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div style={{ ...CARD, color: "#8ea3bb" }}>Loading listing…</div>;
  }

  if (!listing) {
    return (
      <div style={{ ...CARD, padding: "3rem 1.5rem", textAlign: "center" }}>
        <h2
          style={{
            margin: "0 0 0.5rem",
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#0a3d62",
          }}
        >
          Listing not found
        </h2>
        <p style={{ margin: "0 0 1.5rem", color: "#55657a" }}>
          {error || "We couldn't find that listing."}
        </p>
        <Link
          href="/dashboard/listings"
          style={{
            display: "inline-block",
            padding: "0.65rem 1.4rem",
            background: "#f6fafd",
            color: "#0a3d62",
            border: "1px solid #e1eef5",
            borderRadius: 14,
            fontWeight: 600,
            fontSize: "0.92rem",
          }}
        >
          Back to my listings
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <span style={EYEBROW}>Edit listing</span>
          <h1
            style={{
              margin: "0.4rem 0 0.25rem",
              fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
              fontWeight: 800,
              color: "#0a3d62",
              letterSpacing: "-0.025em",
            }}
          >
            {listing.title}
          </h1>
          <p style={{ margin: 0, color: "#55657a", fontSize: "0.95rem" }}>
            Update any field below and save your changes.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href={`/listings/${listing.id}`}
            style={{
              padding: "0.65rem 1.2rem",
              background: "#f6fafd",
              color: "#0a3d62",
              border: "1px solid #e1eef5",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            View public listing
          </Link>
          <Link
            href={`/dashboard/listings/${listing.id}/media`}
            style={{
              padding: "0.65rem 1.2rem",
              background: "#eaf3fb",
              color: "#1883ff",
              border: "1px solid #c7e0f4",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            Manage media
          </Link>
        </div>
      </div>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: "1.25rem" }}>
        {/* Status */}
        <div style={CARD}>
          <h3 style={SECTION_HEADING}>Listing status</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={SELECT_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                {LISTING_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Basic */}
        <div style={CARD}>
          <h3 style={SECTION_HEADING}>Basic information</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.1rem",
            }}
          >
            <Field label="Title" required>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={FIELD_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Field>
            <Field label="Category" required>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={SELECT_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                <option value="">Select category</option>
                {FILTER_DATA.categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Brand">
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                style={SELECT_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                <option value="">Select brand</option>
                {BOAT_BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Year" required>
              <select
                value={manufacturedYear}
                onChange={(e) => setManufacturedYear(e.target.value)}
                style={SELECT_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                <option value="">Select year</option>
                {FILTER_DATA.years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Specifications */}
        <div style={CARD}>
          <h3 style={SECTION_HEADING}>Specifications</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.1rem",
            }}
          >
            <Field label="Length (ft)" required>
              <input
                type="number"
                min="1"
                value={lengthFt}
                onChange={(e) => setLengthFt(e.target.value)}
                style={FIELD_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Field>
            <Field label="Capacity (people)">
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                style={FIELD_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Field>
            <Field label="Engine">
              <input
                type="text"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                placeholder="e.g. Twin Mercury 350hp"
                style={FIELD_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Field>
            <Field label="Total Power (HP)">
              <input
                type="number"
                min="1"
                value={totalPowerHP}
                onChange={(e) => setTotalPowerHP(e.target.value)}
                style={FIELD_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Field>
          </div>
        </div>

        {/* Location & pricing */}
        <div style={CARD}>
          <h3 style={SECTION_HEADING}>Location & pricing</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.1rem",
            }}
          >
            <Field label="Location" required>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Miami, Florida"
                style={FIELD_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Field>
            <Field label="Price (USD)" required>
              <input
                type="number"
                min="1"
                value={valueUSD}
                onChange={(e) => setValueUSD(e.target.value)}
                style={FIELD_INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Field>
          </div>
        </div>

        {/* Description */}
        <div style={CARD}>
          <h3 style={SECTION_HEADING}>Description</h3>
          <div style={{ display: "grid", gap: "1.1rem" }}>
            <Field label="Short description" required>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={3}
                style={{ ...FIELD_INPUT, minHeight: 90, resize: "vertical" }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Field>
            <Field label="Detailed description">
              <textarea
                value={mainDescription}
                onChange={(e) => setMainDescription(e.target.value)}
                rows={8}
                style={{
                  ...FIELD_INPUT,
                  minHeight: 180,
                  resize: "vertical",
                  lineHeight: 1.5,
                }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Field>
          </div>
        </div>

        {/* Status messages + actions */}
        <div style={{ ...CARD, padding: "1.25rem 1.75rem" }}>
          {error && (
            <p
              style={{
                margin: "0 0 1rem",
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
                margin: "0 0 1rem",
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => router.push("/dashboard/listings")}
              disabled={saving}
              style={{
                padding: "0.75rem 1.4rem",
                background: "#ffffff",
                color: "#55657a",
                border: "1px solid #e1eef5",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: "0.92rem",
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "0.75rem 1.6rem",
                background: saving
                  ? "#9ec0e8"
                  : "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: saving ? "wait" : "pointer",
                boxShadow: saving ? "none" : "0 8px 18px rgba(24, 131, 255, 0.28)",
                fontFamily: "inherit",
              }}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
