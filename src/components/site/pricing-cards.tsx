"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PLANS, type PlanKey } from "@/lib/plans";
import { useAuth } from "@/components/auth/auth-context";
import { useAuthModal } from "@/components/auth/auth-modal-context";

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#16a34a"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

type PricingCardsProps = {
  showHeader?: boolean;
  headerEyebrow?: string;
  headerTitle?: string;
  headerSubtitle?: string;
};

export default function PricingCards({
  showHeader = true,
  headerEyebrow = "Pricing",
  headerTitle = "Choose Your Listing Package",
  headerSubtitle = "Simple pricing plans to showcase your boat effectively"
}: PricingCardsProps) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const { open: openAuthModal } = useAuthModal();

  const [currentPlan, setCurrentPlan] = useState<PlanKey>("free");
  const [checkingPlan, setCheckingPlan] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [error, setError] = useState("");

  // Fetch current plan when authenticated
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setCurrentPlan("free");
      return;
    }
    let active = true;
    (async () => {
      setCheckingPlan(true);
      try {
        const res = await fetch("/api/subscriptions/status", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = (await res.json()) as { plan?: PlanKey };
        if (active && data.plan) setCurrentPlan(data.plan);
      } finally {
        if (active) setCheckingPlan(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated, token]);

  const handleFreeClick = () => {
    router.push("/listings/create");
  };

  const handlePremiumClick = async () => {
    setError("");
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    if (currentPlan === "premium") {
      router.push("/dashboard/subscriptions");
      return;
    }
    setLoadingCheckout(true);
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Failed to start checkout");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setLoadingCheckout(false);
    }
  };

  const free = PLANS.free;
  const premium = PLANS.premium;
  const isOnPremium = currentPlan === "premium";

  return (
    <section style={{ width: "100%" }}>
      {showHeader && (
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span
            style={{
              display: "inline-block",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#1883ff",
              marginBottom: "0.75rem"
            }}
          >
            {headerEyebrow}
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
              fontWeight: 800,
              color: "#0a3d62",
              letterSpacing: "-0.025em",
              lineHeight: 1.2
            }}
          >
            {headerTitle}
          </h2>
          <p
            style={{
              margin: "0.6rem auto 0",
              color: "#55657a",
              fontSize: "1rem",
              maxWidth: 520,
              lineHeight: 1.5
            }}
          >
            {headerSubtitle}
          </p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          maxWidth: 880,
          marginInline: "auto"
        }}
      >
        {/* FREE */}
        <PlanCard
          plan={free}
          isCurrent={isOnPremium ? false : isAuthenticated}
          highlighted={false}
          ctaLabel="Start Free Listing"
          ctaVariant="outline"
          onCtaClick={handleFreeClick}
          loading={false}
        />

        {/* PREMIUM */}
        <PlanCard
          plan={premium}
          isCurrent={isOnPremium}
          highlighted
          ctaLabel={
            isOnPremium
              ? "Manage subscription"
              : checkingPlan
                ? "Checking…"
                : "Choose Premium"
          }
          ctaVariant="solid"
          onCtaClick={handlePremiumClick}
          loading={loadingCheckout}
        />
      </div>

      {error && (
        <p
          style={{
            marginTop: "1rem",
            textAlign: "center",
            color: "#c53030",
            fontSize: "0.9rem"
          }}
        >
          {error}
        </p>
      )}
    </section>
  );
}

type PlanCardProps = {
  plan: typeof PLANS.free | typeof PLANS.premium;
  highlighted: boolean;
  isCurrent: boolean;
  ctaLabel: string;
  ctaVariant: "outline" | "solid";
  onCtaClick: () => void;
  loading: boolean;
};

function PlanCard({
  plan,
  highlighted,
  isCurrent,
  ctaLabel,
  ctaVariant,
  onCtaClick,
  loading
}: PlanCardProps) {
  const isPremium = plan.key === "premium";
  return (
    <div
      style={{
        position: "relative",
        background: "#ffffff",
        border: `2px solid ${highlighted ? "#1883ff" : "#e1eef5"}`,
        borderRadius: 20,
        padding: "2.25rem 1.75rem 1.75rem",
        boxShadow: highlighted
          ? "0 18px 44px rgba(24, 131, 255, 0.18)"
          : "0 8px 24px rgba(10, 61, 98, 0.06)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease"
      }}
    >
      {highlighted && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
            color: "#ffffff",
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0.4rem 1rem",
            borderRadius: 999,
            boxShadow: "0 6px 14px rgba(24, 131, 255, 0.35)",
            whiteSpace: "nowrap"
          }}
        >
          Most Popular
        </div>
      )}

      {isCurrent && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "#eaf6ef",
            color: "#16a34a",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "0.25rem 0.65rem",
            borderRadius: 999,
            border: "1px solid #c5e9d2"
          }}
        >
          Current
        </div>
      )}

      <h3
        style={{
          margin: 0,
          fontSize: "1.25rem",
          fontWeight: 800,
          color: "#0a3d62",
          textAlign: "center",
          letterSpacing: "-0.015em",
          marginBottom: "0.85rem"
        }}
      >
        {plan.name}
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 6,
          marginBottom: "1.6rem"
        }}
      >
        <span
          style={{
            fontSize: "2.6rem",
            fontWeight: 800,
            color: "#1883ff",
            letterSpacing: "-0.025em",
            lineHeight: 1
          }}
        >
          ${plan.priceUSD}
        </span>
        <span style={{ color: "#8ea3bb", fontSize: "0.95rem", fontWeight: 600 }}>
          / {plan.billingPeriod}
        </span>
      </div>

      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gap: "0.7rem",
          marginBottom: "1.75rem",
          flexGrow: 1
        }}
      >
        {plan.features.map((feature) => (
          <li
            key={feature}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              color: "#3d4f63",
              fontSize: "0.92rem",
              lineHeight: 1.45
            }}
          >
            <span style={{ marginTop: 2, flexShrink: 0 }}>
              <CheckIcon />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onCtaClick}
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.85rem 1rem",
          borderRadius: 12,
          fontSize: "0.95rem",
          fontWeight: 700,
          cursor: loading ? "wait" : "pointer",
          fontFamily: "inherit",
          transition: "all 0.18s ease",
          ...(ctaVariant === "solid"
            ? {
                background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
                color: "#ffffff",
                border: "none",
                boxShadow: "0 8px 18px rgba(24, 131, 255, 0.28)",
                opacity: loading ? 0.75 : 1
              }
            : {
                background: "#ffffff",
                color: "#1883ff",
                border: "2px solid #1883ff"
              })
        }}
        onMouseEnter={(e) => {
          if (loading) return;
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          if (loading) return;
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {loading ? "Redirecting…" : ctaLabel}
      </button>

      {/* Subtle plan duration line (mostly relevant for Free's 7-day note) */}
      {!isPremium && (
        <p
          style={{
            margin: "0.85rem 0 0",
            textAlign: "center",
            color: "#8ea3bb",
            fontSize: "0.8rem"
          }}
        >
          {plan.durationLabel}
        </p>
      )}
    </div>
  );
}
