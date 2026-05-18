"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FILTER_DATA } from "@/components/listings/constants";

const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const RulerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="4" rx="1" />
    <path d="M7 11V7M11 11V8M15 11V7M19 11V8" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CHEVRON_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%231e6091' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")";

const chipStyle = (active: boolean): React.CSSProperties => ({
  border: active ? "1px solid #1883ff" : "1px solid #e1eef5",
  borderRadius: 999,
  padding: "0.45rem 0.95rem",
  fontWeight: active ? 600 : 500,
  fontSize: "0.82rem",
  cursor: "pointer",
  background: active ? "#1883ff" : "#f6fafd",
  color: active ? "#ffffff" : "#0a3d62",
  boxShadow: active ? "0 4px 10px rgba(24,131,255,0.25)" : "none",
  transition: "all 0.18s ease",
  whiteSpace: "nowrap"
});

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#0a3d62",
  marginBottom: 6
};

const fieldInputBase: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem 0.7rem 2.3rem",
  borderRadius: 12,
  border: "1px solid #e1eef5",
  background: "#f6fafd",
  fontSize: "0.92rem",
  color: "#0a3d62",
  fontWeight: 500,
  outline: "none",
  transition: "border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease"
};

const fieldIconStyle: React.CSSProperties = {
  position: "absolute",
  left: 12,
  top: "50%",
  transform: "translateY(-50%)",
  color: "#1e6091",
  pointerEvents: "none",
  display: "inline-flex"
};

type FieldProps = {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

const Field = ({ label, icon, children }: FieldProps) => (
  <div>
    <label style={fieldLabelStyle}>{label}</label>
    <div style={{ position: "relative" }}>
      <span style={fieldIconStyle}>{icon}</span>
      {children}
    </div>
  </div>
);

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#1883ff";
  e.currentTarget.style.background = "#ffffff";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(24,131,255,0.12)";
};

const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#e1eef5";
  e.currentTarget.style.background = "#f6fafd";
  e.currentTarget.style.boxShadow = "none";
};

export default function SiteHero() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minLength, setMinLength] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const fields: Record<string, string> = {
      category,
      location,
      minPrice,
      maxPrice,
      minLength,
      maxLength,
      year
    };
    for (const [key, value] of Object.entries(fields)) {
      if (value) params.set(key, value);
    }
    const query = params.toString();
    router.push(query ? `/listings?${query}` : "/listings");
  };

  return (
    <section
      style={{
        position: "relative",
        padding: "3.5rem 0 4.5rem",
        background:
          "linear-gradient(180deg, #eaf4fb 0%, #f4f8f8 55%, #ffffff 100%)",
        overflow: "hidden"
      }}
    >
      {/* Subtle decorative blue glow */}
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
          pointerEvents: "none"
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-160px",
          left: "-120px",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(2,62,138,0.08) 0%, transparent 70%)",
          pointerEvents: "none"
        }}
      />

      <div
        className="bl-container"
        style={{
          position: "relative",
          textAlign: "center"
        }}
      >
        <span
          style={{
            display: "inline-block",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#1883ff",
            marginBottom: "1rem"
          }}
        >
          BoatListr
        </span>
        <h1
          style={{
            margin: 0,
            color: "#0a3d62",
            fontSize: "clamp(2.2rem, 4.8vw, 3.4rem)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 1.1
          }}
        >
          Welcome to BoatListr
        </h1>
        <p
          style={{
            margin: "0.9rem auto 0",
            color: "#55657a",
            fontSize: "clamp(1rem, 1.6vw, 1.1rem)",
            fontWeight: 500,
            maxWidth: 560
          }}
        >
          Your journey to find the perfect boat starts here.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "2.5rem",
            background: "#ffffff",
            border: "1px solid #e1eef5",
            borderRadius: 22,
            padding: "1.75rem",
            maxWidth: 920,
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "0 18px 44px rgba(10, 61, 98, 0.10)",
            textAlign: "left"
          }}
        >
          {/* Category chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "1.4rem",
              justifyContent: "center"
            }}
          >
            <button
              type="button"
              onClick={() => setCategory("")}
              style={chipStyle(category === "")}
            >
              All
            </button>
            {FILTER_DATA.categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                style={chipStyle(category === cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Input grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap: "0.9rem",
              marginBottom: "1.5rem",
              maxWidth: 820,
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            <Field label="Location" icon={<PinIcon />}>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="State or city"
                style={fieldInputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </Field>

            <Field label="Min Price" icon={<DollarIcon />}>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                min="0"
                style={fieldInputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </Field>

            <Field label="Max Price" icon={<DollarIcon />}>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Any"
                min="0"
                style={fieldInputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </Field>

            <Field label="Min Length (ft)" icon={<RulerIcon />}>
              <input
                type="number"
                value={minLength}
                onChange={(e) => setMinLength(e.target.value)}
                placeholder="0"
                min="0"
                style={fieldInputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </Field>

            <Field label="Max Length (ft)" icon={<RulerIcon />}>
              <input
                type="number"
                value={maxLength}
                onChange={(e) => setMaxLength(e.target.value)}
                placeholder="Any"
                min="0"
                style={fieldInputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </Field>

            <Field label="Year" icon={<CalendarIcon />}>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                style={{
                  ...fieldInputBase,
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  paddingRight: "2.3rem",
                  background: `#f6fafd ${CHEVRON_SVG} no-repeat right 0.85rem center`,
                  cursor: "pointer"
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <option value="">Any</option>
                {FILTER_DATA.years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Submit button */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: 999,
                padding: "0.85rem 2.6rem",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 12px 26px rgba(24, 131, 255, 0.4)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 14px 30px rgba(24, 131, 255, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 12px 26px rgba(24, 131, 255, 0.4)";
              }}
            >
              Show Boats
              <SearchIcon />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
