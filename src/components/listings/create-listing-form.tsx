"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./image-uploader";
import { FILTER_DATA } from "./constants";
import { useAuth } from "@/components/auth/auth-context";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { PLANS, type PlanKey } from "@/lib/plans";

const BOAT_BRANDS = [
  "Yamaha",
  "Sea Ray",
  "Bayliner",
  "Tracker",
  "Lund",
  "Starcraft",
  "Boston Whaler",
  "Ranger",
  "Nitro",
  "Skeeter",
  "Crestliner",
  "Alumacraft",
  "Other"
];

type UploadedFile = {
  id: string;
  file: File;
  preview: string;
  uploadUrl?: string;
  s3Key?: string;
  publicUrl?: string;
  progress: number;
  status: "pending" | "uploading" | "uploaded" | "error";
  error?: string;
};

type FormState = {
  title: string;
  category: string;
  brand: string;
  manufacturedYear: string;
  lengthFt: string;
  capacity: string;
  engine: string;
  totalPowerHP: string;
  location: string;
  valueUSD: string;
  shortDescription: string;
  mainDescription: string;
};

const INITIAL_FORM: FormState = {
  title: "",
  category: "",
  brand: "",
  manufacturedYear: "",
  lengthFt: "",
  capacity: "",
  engine: "",
  totalPowerHP: "",
  location: "",
  valueUSD: "",
  shortDescription: "",
  mainDescription: ""
};

const STEPS = [
  { number: 1, title: "Basic Information", subtitle: "Tell us about your boat" },
  { number: 2, title: "Specifications", subtitle: "Length, engine, and capacity" },
  { number: 3, title: "Location & Pricing", subtitle: "Where it is and how much" },
  { number: 4, title: "Description", subtitle: "Help buyers picture your boat" },
  { number: 5, title: "Photos & Videos", subtitle: "Upload your media" },
  { number: 6, title: "Review & Submit", subtitle: "Confirm and publish" }
];

const CHEVRON_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%231e6091' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")";

// ============================================
// SHARED STYLES
// ============================================

const CARD: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e1eef5",
  borderRadius: 20,
  padding: "1.75rem",
  boxShadow: "0 12px 32px rgba(10, 61, 98, 0.07)"
};

const FIELD_LABEL: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#0a3d62",
  marginBottom: 6
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
  transition: "border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
  boxSizing: "border-box"
};

const onFieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#1883ff";
  e.currentTarget.style.background = "#ffffff";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(24, 131, 255, 0.12)";
};
const onFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#e1eef5";
  e.currentTarget.style.background = "#f6fafd";
  e.currentTarget.style.boxShadow = "none";
};

const Field = ({
  label,
  required,
  children
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

// ============================================
// ICONS
// ============================================

const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const LockIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// ============================================
// STEP WIZARD
// ============================================

const StepWizard = ({
  currentStep,
  completedSteps,
  onStepClick
}: {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (n: number) => void;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
      overflowX: "auto",
      paddingBottom: 4,
      WebkitOverflowScrolling: "touch"
    }}
  >
    {STEPS.map((step, idx) => {
      const isActive = currentStep === step.number;
      const isCompleted = completedSteps.has(step.number);
      const reachable = isCompleted || isActive;

      return (
        <React.Fragment key={step.number}>
          <button
            type="button"
            onClick={() => reachable && onStepClick(step.number)}
            disabled={!reachable}
            aria-label={`Step ${step.number}: ${step.title}`}
            style={{
              flexShrink: 0,
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: `2px solid ${isCompleted ? "#1883ff" : isActive ? "#1883ff" : "#e1eef5"}`,
              background: isCompleted ? "#1883ff" : isActive ? "#ffffff" : "#ffffff",
              color: isCompleted ? "#ffffff" : isActive ? "#1883ff" : "#8ea3bb",
              fontSize: "0.92rem",
              fontWeight: 700,
              cursor: reachable ? "pointer" : "not-allowed",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              boxShadow: isActive ? "0 0 0 4px rgba(24, 131, 255, 0.12)" : "none"
            }}
          >
            {isCompleted ? <CheckIcon size={16} /> : step.number}
          </button>
          {idx < STEPS.length - 1 && (
            <div
              style={{
                flexShrink: 0,
                width: 36,
                height: 2,
                background: completedSteps.has(step.number) ? "#1883ff" : "#e1eef5",
                margin: "0 4px",
                transition: "background 0.2s ease"
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ============================================
// STEP CONTENTS
// ============================================

const Step1Basic = ({
  form,
  setForm
}: {
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
}) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
    <Field label="Listing Title" required>
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        placeholder="e.g. 2020 Sea Ray Sundancer 350"
        style={FIELD_INPUT}
        onFocus={onFieldFocus}
        onBlur={onFieldBlur}
      />
    </Field>
    <Field label="Category" required>
      <select
        value={form.category}
        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
        style={{
          ...FIELD_INPUT,
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          paddingRight: "2.3rem",
          background: `#f6fafd ${CHEVRON_SVG} no-repeat right 0.85rem center`,
          cursor: "pointer"
        }}
        onFocus={onFieldFocus}
        onBlur={onFieldBlur}
      >
        <option value="">Select category</option>
        {FILTER_DATA.categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </Field>
    <Field label="Brand" required>
      <select
        value={form.brand}
        onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
        style={{
          ...FIELD_INPUT,
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          paddingRight: "2.3rem",
          background: `#f6fafd ${CHEVRON_SVG} no-repeat right 0.85rem center`,
          cursor: "pointer"
        }}
        onFocus={onFieldFocus}
        onBlur={onFieldBlur}
      >
        <option value="">Select brand</option>
        {BOAT_BRANDS.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
    </Field>
    <Field label="Year" required>
      <select
        value={form.manufacturedYear}
        onChange={(e) => setForm((p) => ({ ...p, manufacturedYear: e.target.value }))}
        style={{
          ...FIELD_INPUT,
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          paddingRight: "2.3rem",
          background: `#f6fafd ${CHEVRON_SVG} no-repeat right 0.85rem center`,
          cursor: "pointer"
        }}
        onFocus={onFieldFocus}
        onBlur={onFieldBlur}
      >
        <option value="">Select year</option>
        {FILTER_DATA.years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </Field>
  </div>
);

const Step2Specs = ({
  form,
  setForm
}: {
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
}) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
    <Field label="Length (ft)" required>
      <input
        type="number"
        min="1"
        value={form.lengthFt}
        onChange={(e) => setForm((p) => ({ ...p, lengthFt: e.target.value }))}
        placeholder="e.g. 35"
        style={FIELD_INPUT}
        onFocus={onFieldFocus}
        onBlur={onFieldBlur}
      />
    </Field>
    <Field label="Capacity (people)">
      <input
        type="number"
        min="1"
        value={form.capacity}
        onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
        placeholder="e.g. 12"
        style={FIELD_INPUT}
        onFocus={onFieldFocus}
        onBlur={onFieldBlur}
      />
    </Field>
    <Field label="Engine">
      <input
        type="text"
        value={form.engine}
        onChange={(e) => setForm((p) => ({ ...p, engine: e.target.value }))}
        placeholder="e.g. Twin Mercury 350hp"
        style={FIELD_INPUT}
        onFocus={onFieldFocus}
        onBlur={onFieldBlur}
      />
    </Field>
    <Field label="Total Power (HP)">
      <input
        type="number"
        min="1"
        value={form.totalPowerHP}
        onChange={(e) => setForm((p) => ({ ...p, totalPowerHP: e.target.value }))}
        placeholder="e.g. 700"
        style={FIELD_INPUT}
        onFocus={onFieldFocus}
        onBlur={onFieldBlur}
      />
    </Field>
  </div>
);

const Step3Pricing = ({
  form,
  setForm
}: {
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
}) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
    <Field label="Location" required>
      <input
        type="text"
        value={form.location}
        onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
        placeholder="e.g. Miami, Florida"
        style={FIELD_INPUT}
        onFocus={onFieldFocus}
        onBlur={onFieldBlur}
      />
    </Field>
    <Field label="Price (USD)" required>
      <input
        type="number"
        min="1"
        value={form.valueUSD}
        onChange={(e) => setForm((p) => ({ ...p, valueUSD: e.target.value }))}
        placeholder="e.g. 125000"
        style={FIELD_INPUT}
        onFocus={onFieldFocus}
        onBlur={onFieldBlur}
      />
    </Field>
  </div>
);

const Step4Description = ({
  form,
  setForm
}: {
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
}) => {
  const charCount = form.mainDescription.length;
  const isShort = charCount > 0 && charCount < 200;

  return (
    <div style={{ display: "grid", gap: "1.1rem" }}>
      <Field label="Short Description" required>
        <textarea
          value={form.shortDescription}
          onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
          placeholder="Brief overview shown in search results"
          rows={3}
          style={{ ...FIELD_INPUT, minHeight: 90, resize: "vertical" }}
          onFocus={onFieldFocus}
          onBlur={onFieldBlur}
        />
      </Field>

      <Field label="Detailed Description">
        <div
          style={{
            background: "#f6fafd",
            border: "1px solid #e1eef5",
            borderRadius: 12,
            padding: "0.85rem 1rem",
            marginBottom: "0.65rem",
            fontSize: "0.85rem",
            color: "#55657a"
          }}
        >
          <div style={{ fontWeight: 700, color: "#0a3d62", marginBottom: 6 }}>
            Include these details to attract buyers:
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 4
            }}
          >
            <div>• Condition & maintenance history</div>
            <div>• Notable features & upgrades</div>
            <div>• Usage (fishing, cruising, etc.)</div>
            <div>• Storage location & history</div>
            <div>• Electronics & navigation</div>
            <div>• Reason for selling</div>
          </div>
        </div>
        <textarea
          value={form.mainDescription}
          onChange={(e) => setForm((p) => ({ ...p, mainDescription: e.target.value }))}
          placeholder="Provide a comprehensive description of your boat..."
          rows={10}
          style={{ ...FIELD_INPUT, minHeight: 200, resize: "vertical", lineHeight: 1.5 }}
          onFocus={onFieldFocus}
          onBlur={onFieldBlur}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 6,
            fontSize: "0.78rem",
            color: "#8ea3bb"
          }}
        >
          {charCount} characters
          {charCount > 0 && (
            <span
              style={{
                marginLeft: 8,
                color: isShort ? "#d97706" : "#2f7d43",
                fontWeight: 600
              }}
            >
              {isShort ? "Add more details" : "Great detail"}
            </span>
          )}
        </div>
      </Field>
    </div>
  );
};

const Step5Media = ({
  onFilesChange,
  onUploadStateChange,
  planKey
}: {
  onFilesChange: (files: UploadedFile[]) => void;
  onUploadStateChange: (uploading: boolean) => void;
  planKey: PlanKey;
}) => {
  const plan = PLANS[planKey];
  const maxFiles = plan.maxPhotos + plan.maxVideos;
  return (
    <div style={{ display: "grid", gap: "0.85rem" }}>
      <div
        style={{
          fontSize: "0.9rem",
          color: "#55657a",
          fontWeight: 500,
          lineHeight: 1.5
        }}
      >
        Upload up to {plan.maxPhotos} photos and {plan.maxVideos} video
        {plan.maxVideos > 1 ? "s" : ""} ({plan.videoDurationSec}s each). The first
        photo becomes the cover.
      </div>
      <ImageUploader
        onFilesReady={onFilesChange}
        onUploadStateChange={onUploadStateChange}
        maxFiles={maxFiles}
      />
    </div>
  );
};

const Step6Review = ({
  form,
  fileCount
}: {
  form: FormState;
  fileCount: number;
}) => {
  const Row = ({ label, value }: { label: string; value?: string | number }) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "0.5rem 0" }}>
      <span style={{ color: "#55657a", fontSize: "0.9rem", fontWeight: 500 }}>{label}</span>
      <span style={{ color: "#0a3d62", fontSize: "0.92rem", fontWeight: 600, textAlign: "right" }}>
        {value || "—"}
      </span>
    </div>
  );

  const ReviewBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div
      style={{
        background: "#f6fafd",
        border: "1px solid #e1eef5",
        borderRadius: 14,
        padding: "1rem 1.2rem"
      }}
    >
      <div
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#1883ff",
          marginBottom: "0.55rem"
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ display: "grid", gap: "0.85rem" }}>
      <ReviewBlock title="Basic Information">
        <Row label="Title" value={form.title} />
        <Row label="Category" value={form.category} />
        <Row label="Brand" value={form.brand} />
        <Row label="Year" value={form.manufacturedYear} />
      </ReviewBlock>

      <ReviewBlock title="Specifications">
        <Row label="Length" value={form.lengthFt ? `${form.lengthFt} ft` : ""} />
        <Row label="Capacity" value={form.capacity ? `${form.capacity} people` : ""} />
        <Row label="Engine" value={form.engine} />
        <Row label="Total Power" value={form.totalPowerHP ? `${form.totalPowerHP} HP` : ""} />
      </ReviewBlock>

      <ReviewBlock title="Location & Pricing">
        <Row label="Location" value={form.location} />
        <Row label="Price" value={form.valueUSD ? `$${Number(form.valueUSD).toLocaleString()}` : ""} />
      </ReviewBlock>

      <ReviewBlock title="Description">
        <div style={{ color: "#3d4f63", fontSize: "0.9rem", lineHeight: 1.55, whiteSpace: "pre-line" }}>
          {form.shortDescription || "—"}
          {form.mainDescription && (
            <div style={{ marginTop: 8, color: "#55657a", fontSize: "0.86rem" }}>
              {form.mainDescription.length} characters of detail provided
            </div>
          )}
        </div>
      </ReviewBlock>

      <ReviewBlock title="Media">
        <Row label="Files uploaded" value={fileCount} />
      </ReviewBlock>
    </div>
  );
};

// ============================================
// PLAN BANNER
// ============================================

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const PlanBanner = ({
  planKey,
  onUpgrade,
  upgrading
}: {
  planKey: PlanKey;
  onUpgrade: () => void;
  upgrading: boolean;
}) => {
  const isPremium = planKey === "premium";
  const plan = PLANS[planKey];

  return (
    <div
      style={{
        ...CARD,
        padding: "1.1rem 1.4rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
        background: isPremium
          ? "linear-gradient(135deg, #0a3d62 0%, #1883ff 100%)"
          : "#ffffff",
        border: isPremium ? "1px solid #0a3d62" : "1px solid #e1eef5",
        color: isPremium ? "#ffffff" : "#0a3d62"
      }}
    >
      <span
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: isPremium ? "rgba(255,255,255,0.18)" : "#eaf3fb",
          color: isPremium ? "#ffffff" : "#1883ff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
      >
        {isPremium ? <StarIcon /> : <ZapIcon />}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: isPremium ? "rgba(255,255,255,0.75)" : "#1883ff",
            marginBottom: 2
          }}
        >
          {isPremium ? "Premium plan active" : "Currently on free plan"}
        </div>
        <div
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: isPremium ? "#ffffff" : "#0a3d62"
          }}
        >
          {isPremium
            ? `Up to ${plan.maxPhotos} photos · ${plan.maxVideos} videos · 30-day auto-renew`
            : `Up to ${plan.maxPhotos} photos · ${plan.maxVideos} video · 7-day listing`}
        </div>
      </div>

      {!isPremium && (
        <button
          type="button"
          onClick={onUpgrade}
          disabled={upgrading}
          style={{
            padding: "0.65rem 1.2rem",
            background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: upgrading ? "wait" : "pointer",
            fontFamily: "inherit",
            boxShadow: "0 6px 14px rgba(24, 131, 255, 0.28)",
            opacity: upgrading ? 0.7 : 1,
            whiteSpace: "nowrap"
          }}
        >
          {upgrading ? "Redirecting…" : "Upgrade to Premium"}
        </button>
      )}
    </div>
  );
};

// ============================================
// NAV BUTTONS
// ============================================

const NavButtons = ({
  currentStep,
  totalSteps,
  canProceed,
  loading,
  onPrev,
  onNext,
  onSubmit
}: {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) => {
  const isLast = currentStep === totalSteps;
  const isFirst = currentStep === 1;

  const baseBtn: React.CSSProperties = {
    padding: "0.75rem 1.4rem",
    borderRadius: 12,
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.2s ease",
    fontFamily: "inherit"
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginTop: "1.75rem",
        paddingTop: "1.25rem",
        borderTop: "1px solid #eef4f8",
        flexWrap: "wrap"
      }}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        style={{
          ...baseBtn,
          background: "#f6fafd",
          color: isFirst ? "#bccad8" : "#0a3d62",
          border: "1px solid #e1eef5",
          cursor: isFirst ? "not-allowed" : "pointer"
        }}
      >
        <ArrowLeftIcon />
        Previous
      </button>

      {isLast ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          style={{
            ...baseBtn,
            background: loading ? "#9ec0e8" : "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
            color: "#ffffff",
            boxShadow: loading ? "none" : "0 8px 18px rgba(24, 131, 255, 0.3)",
            cursor: loading ? "not-allowed" : "pointer",
            padding: "0.75rem 1.75rem"
          }}
        >
          {loading ? "Publishing…" : "Publish Listing"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          style={{
            ...baseBtn,
            background: canProceed ? "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)" : "#cfdce8",
            color: "#ffffff",
            boxShadow: canProceed ? "0 8px 18px rgba(24, 131, 255, 0.28)" : "none",
            cursor: canProceed ? "pointer" : "not-allowed"
          }}
        >
          Next
          <ArrowRightIcon />
        </button>
      )}
    </div>
  );
};

// ============================================
// AUTH GATE
// ============================================

const AuthGate = ({ onSignIn }: { onSignIn: () => void }) => (
  <div style={{ ...CARD, padding: "3rem 1.5rem", textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: "50%",
        background: "linear-gradient(140deg, #e0f2fe 0%, #f0f9ff 60%, #ffffff 100%)",
        border: "1px solid #d3ecf6",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.25rem"
      }}
    >
      <LockIcon />
    </div>
    <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 700, color: "#0a3d62" }}>
      Sign in to list your boat
    </h2>
    <p
      style={{
        margin: "0 0 1.5rem",
        color: "#55657a",
        fontSize: "0.95rem",
        maxWidth: 380,
        marginInline: "auto",
        lineHeight: 1.5
      }}
    >
      You need an account to create a listing. Sign in or create one to continue.
    </p>
    <button
      type="button"
      onClick={onSignIn}
      style={{
        background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
        color: "#ffffff",
        border: "none",
        borderRadius: 14,
        padding: "0.75rem 1.75rem",
        fontWeight: 700,
        fontSize: "0.95rem",
        cursor: "pointer",
        boxShadow: "0 8px 18px rgba(24, 131, 255, 0.28)"
      }}
    >
      Sign in
    </button>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function CreateListingForm() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const { open: openAuthModal } = useAuthModal();

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [planKey, setPlanKey] = useState<PlanKey>("free");
  const [upgrading, setUpgrading] = useState(false);

  // Auto-open auth modal if user lands here unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const t = setTimeout(() => openAuthModal("login"), 300);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated, openAuthModal]);

  // Fetch current plan when authed
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/subscriptions/status", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = (await res.json()) as { plan?: PlanKey };
        if (active && data.plan) setPlanKey(data.plan);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated, token]);

  const handleUpgrade = async () => {
    if (!token) {
      openAuthModal("login");
      return;
    }
    setUpgrading(true);
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Failed to start checkout");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setUpgrading(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(form.title && form.category && form.brand && form.manufacturedYear);
      case 2:
        return Boolean(form.lengthFt);
      case 3:
        return Boolean(form.location && form.valueUSD);
      case 4:
        return Boolean(form.shortDescription);
      case 5:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleStepClick = (n: number) => setCurrentStep(n);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    setError("");

    if (mediaUploading) {
      setError("Wait for media uploads to finish before publishing.");
      return;
    }
    if (!token) {
      openAuthModal("login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          brand: form.brand || undefined,
          manufacturedYear: Number(form.manufacturedYear),
          lengthFt: Number(form.lengthFt),
          shortDescription: form.shortDescription,
          mainDescription: form.mainDescription || undefined,
          location: form.location,
          valueUSD: Number(form.valueUSD),
          engine: form.engine || undefined,
          totalPowerHP: form.totalPowerHP ? Number(form.totalPowerHP) : undefined,
          capacity: form.capacity ? Number(form.capacity) : undefined
        })
      });

      const data = (await response.json()) as { error?: string; listing?: { id: number } };
      if (!response.ok) throw new Error(data.error ?? "Failed to create listing");

      const newListingId = data.listing?.id;
      if (!newListingId) throw new Error("No listing ID returned");

      // Attach uploaded media
      for (let i = 0; i < uploadedFiles.length; i++) {
        const fileItem = uploadedFiles[i];
        if (fileItem.status === "uploaded" && fileItem.s3Key && fileItem.publicUrl) {
          await fetch(`/api/listings/${newListingId}/media`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              url: fileItem.publicUrl,
              type: fileItem.file.type,
              kind: fileItem.file.type.startsWith("video") ? "VIDEO" : "IMAGE",
              s3Key: fileItem.s3Key,
              bucket: "boatlistr-media",
              mimeType: fileItem.file.type,
              sizeBytes: fileItem.file.size,
              isPrimary: i === 0,
              sortOrder: i
            })
          });
        }
      }

      router.push(`/listings/${newListingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create listing");
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <AuthGate onSignIn={() => openAuthModal("login")} />;
  }

  const canProceed = validateStep(currentStep);
  const step = STEPS[currentStep - 1];
  const readyFileCount = uploadedFiles.filter((f) => f.status === "uploaded").length;

  return (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: 880, marginInline: "auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#1883ff",
            marginBottom: "0.6rem"
          }}
        >
          New listing
        </span>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.9rem, 4vw, 2.4rem)",
            fontWeight: 800,
            color: "#0a3d62",
            letterSpacing: "-0.025em",
            lineHeight: 1.15
          }}
        >
          List Your Boat
        </h1>
        <p
          style={{
            margin: "0.6rem auto 0",
            color: "#55657a",
            fontSize: "1rem",
            maxWidth: 480,
            lineHeight: 1.5
          }}
        >
          A clean 6-step flow to publish your boat. We&apos;ll make it fast and simple.
        </p>
      </div>

      {/* Plan banner */}
      <PlanBanner
        planKey={planKey}
        onUpgrade={handleUpgrade}
        upgrading={upgrading}
      />

      {/* Step wizard */}
      <StepWizard
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Step content card */}
      <div style={CARD}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#0a3d62",
              letterSpacing: "-0.015em"
            }}
          >
            {step.title}
          </h2>
          <p
            style={{
              margin: "0.25rem 0 0",
              color: "#55657a",
              fontSize: "0.92rem",
              fontWeight: 500
            }}
          >
            {step.subtitle}
          </p>
        </div>

        {currentStep === 1 && <Step1Basic form={form} setForm={setForm} />}
        {currentStep === 2 && <Step2Specs form={form} setForm={setForm} />}
        {currentStep === 3 && <Step3Pricing form={form} setForm={setForm} />}
        {currentStep === 4 && <Step4Description form={form} setForm={setForm} />}
        {currentStep === 5 && (
          <Step5Media
            onFilesChange={setUploadedFiles}
            onUploadStateChange={setMediaUploading}
            planKey={planKey}
          />
        )}
        {currentStep === 6 && <Step6Review form={form} fileCount={readyFileCount} />}

        {error && (
          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.7rem 0.95rem",
              background: "#fff1f1",
              border: "1px solid #ffcfcf",
              borderRadius: 12,
              color: "#c53030",
              fontSize: "0.9rem"
            }}
          >
            {error}
          </div>
        )}

        <NavButtons
          currentStep={currentStep}
          totalSteps={STEPS.length}
          canProceed={canProceed}
          loading={loading}
          onPrev={handlePrev}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
