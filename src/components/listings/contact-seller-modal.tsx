"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/components/auth/auth-context";

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

type ContactSellerModalProps = {
  open: boolean;
  onClose: () => void;
  listingId: number;
  boatTitle: string;
  boatLocation?: string;
};

type Me = { name?: string; email?: string; contactNumber?: string | null };

const buildDefaultMessage = (boatTitle: string) =>
  `Hi, I would like to get more information about the boat "${boatTitle}". Please contact me with more details regarding availability, pricing, and specifications.`;

export default function ContactSellerModal({
  open,
  onClose,
  listingId,
  boatTitle,
  boatLocation,
}: ContactSellerModalProps) {
  const { isAuthenticated, token } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => setMounted(true), []);

  // Lock body scroll and listen for Escape while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Reset state + default message when opened
  useEffect(() => {
    if (!open) return;
    setMessage(buildDefaultMessage(boatTitle));
    setError("");
    setSuccess(false);
  }, [open, boatTitle]);

  // Pre-fill name / email / phone from the signed-in user, if any
  useEffect(() => {
    if (!open || !isAuthenticated || !token) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = (await res.json()) as { user?: Me };
        if (!active || !data.user) return;
        if (data.user.name && !name) setName(data.user.name);
        if (data.user.email && !email) setEmail(data.user.email);
        if (data.user.contactNumber && !phone) setPhone(data.user.contactNumber);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isAuthenticated, token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your name");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }
    if (message.trim().length < 10) {
      setError("Message must be at least 10 characters");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/listings/${listingId}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          website, // honeypot
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to send");
      setSuccess(true);
      // Auto-close after a short delay so user sees the success state
      setTimeout(() => {
        onClose();
        // Reset form for next open
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setSuccess(false);
      }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted || !open) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contact seller"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(10, 25, 42, 0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        animation: "bl-auth-fade-in 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 560,
          maxHeight: "calc(100vh - 3rem)",
          background: "#ffffff",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(2, 12, 28, 0.4)",
          animation: "bl-auth-pop-in 0.25s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem 1.75rem",
            background: "linear-gradient(135deg, #1883ff 0%, #0a3d62 100%)",
            color: "#ffffff",
            position: "relative",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.18)",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.18)";
            }}
          >
            <CloseIcon />
          </button>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              opacity: 0.85,
              marginBottom: 4,
            }}
          >
            Contact Seller
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.3rem",
              fontWeight: 800,
              letterSpacing: "-0.015em",
              lineHeight: 1.25,
            }}
          >
            {boatTitle}
          </h2>
          {boatLocation && (
            <div style={{ marginTop: 4, opacity: 0.85, fontSize: "0.88rem" }}>
              {boatLocation}
            </div>
          )}
        </div>

        {/* Success state */}
        {success ? (
          <div
            style={{
              padding: "2.5rem 1.75rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#eaf6ef",
                border: "1px solid #c5e9d2",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <CheckIcon />
            </div>
            <h3
              style={{
                margin: "0 0 0.5rem",
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#0a3d62",
              }}
            >
              Message sent
            </h3>
            <p
              style={{
                margin: 0,
                color: "#55657a",
                fontSize: "0.95rem",
                lineHeight: 1.5,
              }}
            >
              The seller will reply to you at <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            style={{
              padding: "1.5rem 1.75rem 1.75rem",
              overflowY: "auto",
              display: "grid",
              gap: "0.9rem",
            }}
          >
            {/* Honeypot — hidden from real users */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{
                position: "absolute",
                left: "-9999px",
                width: 1,
                height: 1,
                opacity: 0,
              }}
              aria-hidden="true"
            />

            <div className="bl-float-input">
              <input
                id="bl-contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
                required
                autoComplete="name"
                disabled={submitting}
              />
              <label htmlFor="bl-contact-name">Your name *</label>
            </div>

            <div className="bl-float-input">
              <input
                id="bl-contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                autoComplete="email"
                disabled={submitting}
              />
              <label htmlFor="bl-contact-email">Your email *</label>
            </div>

            <div className="bl-float-input">
              <input
                id="bl-contact-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder=" "
                autoComplete="tel"
                disabled={submitting}
              />
              <label htmlFor="bl-contact-phone">Phone number</label>
            </div>

            <div>
              <label
                htmlFor="bl-contact-message"
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#0a3d62",
                  marginBottom: 6,
                }}
              >
                Message *
              </label>
              <textarea
                id="bl-contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "0.7rem 0.9rem",
                  borderRadius: 12,
                  border: "1px solid #e1eef5",
                  background: "#f6fafd",
                  fontSize: "0.92rem",
                  color: "#0a3d62",
                  fontFamily: "inherit",
                  outline: "none",
                  resize: "vertical",
                  minHeight: 110,
                  lineHeight: 1.5,
                  boxSizing: "border-box",
                  transition: "border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#1883ff";
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(24, 131, 255, 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e1eef5";
                  e.currentTarget.style.background = "#f6fafd";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {error && (
              <p
                style={{
                  margin: 0,
                  padding: "0.6rem 0.85rem",
                  background: "#fff1f1",
                  border: "1px solid #ffcfcf",
                  borderRadius: 10,
                  color: "#c53030",
                  fontSize: "0.88rem",
                }}
              >
                {error}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: "0.25rem",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                style={{
                  padding: "0.7rem 1.2rem",
                  background: "#ffffff",
                  color: "#55657a",
                  border: "1px solid #e1eef5",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "0.7rem 1.4rem",
                  background: submitting
                    ? "#9ec0e8"
                    : "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  cursor: submitting ? "wait" : "pointer",
                  boxShadow: submitting
                    ? "none"
                    : "0 8px 18px rgba(24, 131, 255, 0.28)",
                  fontFamily: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {submitting ? "Sending…" : <>Send message <SendIcon /></>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
