"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import loginImage from "@/images/Boatlistr_login_image.jpg";
import { useAuthModal, type AuthView } from "./auth-modal-context";
import { useAuth } from "./auth-context";

const BOAT_IMAGE = loginImage.src;

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.7 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.3A12 12 0 0 1 12.8 28l-6.5 5A20 20 0 0 0 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.4l6.3 5.3C41.4 35.6 44 30.2 44 24c0-1.2-.1-2.4-.4-3.5z" />
  </svg>
);

type FloatingFieldProps = {
  id: string;
  type?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
};

const FloatingField = ({
  id,
  type = "text",
  label,
  value,
  onChange,
  required,
  autoComplete
}: FloatingFieldProps) => (
  <div className="bl-float-input">
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      required={required}
      autoComplete={autoComplete}
    />
    <label htmlFor={id}>{label}</label>
  </div>
);

const FormHeading = ({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <h2
      style={{
        margin: 0,
        marginBottom: "0.4rem",
        color: "#1883ff",
        fontSize: "1.8rem",
        fontWeight: 800,
        letterSpacing: "-0.02em"
      }}
    >
      {title}
    </h2>
    <p
      style={{
        margin: 0,
        color: "#6b7c8e",
        fontSize: "0.95rem",
        fontWeight: 500
      }}
    >
      {subtitle}
    </p>
  </div>
);

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.85rem",
  background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
  color: "#ffffff",
  border: "none",
  borderRadius: 10,
  fontSize: "1rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(24, 131, 255, 0.28)",
  transition: "transform 0.15s ease, box-shadow 0.15s ease"
};

const googleButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  background: "#ffffff",
  color: "#0a3d62",
  border: "1.5px solid #d4dee8",
  borderRadius: 10,
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  transition: "border-color 0.18s ease, background 0.18s ease"
};

const errorStyle: React.CSSProperties = {
  margin: 0,
  padding: "0.6rem 0.85rem",
  background: "#fff1f1",
  border: "1px solid #ffcfcf",
  borderRadius: 10,
  color: "#c53030",
  fontSize: "0.88rem"
};

const successStyle: React.CSSProperties = {
  margin: 0,
  padding: "0.6rem 0.85rem",
  background: "#e8f7ee",
  border: "1px solid #b9e3c8",
  borderRadius: 10,
  color: "#2f7d43",
  fontSize: "0.88rem"
};

const linkStyle: React.CSSProperties = {
  color: "#1883ff",
  fontWeight: 700,
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
  fontSize: "inherit"
};

const Divider = ({ label }: { label: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      color: "#9aaabd",
      fontSize: "0.85rem",
      fontWeight: 500,
      margin: "1.25rem 0"
    }}
  >
    <span style={{ flex: 1, height: 1, background: "#e1eef5" }} />
    {label}
    <span style={{ flex: 1, height: 1, background: "#e1eef5" }} />
  </div>
);

// ============================================
// LOGIN VIEW
// ============================================

const LoginView = ({ onSuccess }: { onSuccess: () => void }) => {
  const { setView } = useAuthModal();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = (await response.json()) as { error?: string; token?: string };
      if (!response.ok) throw new Error(data.error ?? "Login failed");
      if (data.token) login(data.token);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <FormHeading title="Log In" subtitle="Welcome back! Please enter your details." />

      <FloatingField id="bl-login-email" type="email" label="Email *" value={email} onChange={setEmail} required autoComplete="email" />
      <FloatingField id="bl-login-password" type="password" label="Password *" value={password} onChange={setPassword} required autoComplete="current-password" />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-0.25rem" }}>
        <button type="button" onClick={() => setView("forgot")} style={linkStyle}>
          Forgot password?
        </button>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem", color: "#4a5b6e", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: "#1883ff", cursor: "pointer" }}
        />
        I agree to the{" "}
        <a href="/terms" style={{ color: "#1883ff", textDecoration: "underline", fontWeight: 600 }}>Terms & Conditions</a>
        {" "}and{" "}
        <a href="/privacy" style={{ color: "#1883ff", textDecoration: "underline", fontWeight: 600 }}>Privacy Policy</a>
      </label>

      {error && <p style={errorStyle}>{error}</p>}

      <button type="submit" disabled={loading || !agreed} style={{ ...primaryButtonStyle, opacity: loading || !agreed ? 0.7 : 1, cursor: loading || !agreed ? "not-allowed" : "pointer" }}>
        {loading ? "Signing in..." : "Log in"}
      </button>

      <Divider label="or Continue With" />

      <button type="button" style={googleButtonStyle}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#b2dcf2"; e.currentTarget.style.background = "#f6fafd"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d4dee8"; e.currentTarget.style.background = "#ffffff"; }}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <p style={{ margin: "0.5rem 0 0", textAlign: "center", color: "#6b7c8e", fontSize: "0.92rem" }}>
        Don't have an account?{" "}
        <button type="button" onClick={() => setView("register")} style={linkStyle}>
          Sign up
        </button>
      </p>
    </form>
  );
};

// ============================================
// REGISTER VIEW
// ============================================

const RegisterView = ({ onSuccess }: { onSuccess: () => void }) => {
  const { setView } = useAuthModal();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, contactNumber })
      });
      const data = (await response.json()) as { error?: string; token?: string };
      if (!response.ok) throw new Error(data.error ?? "Registration failed");
      if (data.token) login(data.token);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <FormHeading title="Create Account" subtitle="Join BoatListr and start listing in minutes." />

      <FloatingField id="bl-reg-name" label="Full Name *" value={name} onChange={setName} required autoComplete="name" />
      <FloatingField id="bl-reg-email" type="email" label="Email *" value={email} onChange={setEmail} required autoComplete="email" />
      <FloatingField id="bl-reg-password" type="password" label="Password *" value={password} onChange={setPassword} required autoComplete="new-password" />
      <FloatingField id="bl-reg-phone" type="tel" label="Contact Number" value={contactNumber} onChange={setContactNumber} autoComplete="tel" />

      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem", color: "#4a5b6e", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: "#1883ff", cursor: "pointer" }}
        />
        I agree to the{" "}
        <a href="/terms" style={{ color: "#1883ff", textDecoration: "underline", fontWeight: 600 }}>Terms & Conditions</a>
        {" "}and{" "}
        <a href="/privacy" style={{ color: "#1883ff", textDecoration: "underline", fontWeight: 600 }}>Privacy Policy</a>
      </label>

      {error && <p style={errorStyle}>{error}</p>}

      <button type="submit" disabled={loading || !agreed} style={{ ...primaryButtonStyle, opacity: loading || !agreed ? 0.7 : 1, cursor: loading || !agreed ? "not-allowed" : "pointer" }}>
        {loading ? "Creating account..." : "Create account"}
      </button>

      <Divider label="or Continue With" />

      <button type="button" style={googleButtonStyle}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#b2dcf2"; e.currentTarget.style.background = "#f6fafd"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d4dee8"; e.currentTarget.style.background = "#ffffff"; }}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <p style={{ margin: "0.5rem 0 0", textAlign: "center", color: "#6b7c8e", fontSize: "0.92rem" }}>
        Already have an account?{" "}
        <button type="button" onClick={() => setView("login")} style={linkStyle}>
          Log in
        </button>
      </p>
    </form>
  );
};

// ============================================
// FORGOT PASSWORD VIEW
// ============================================

const ForgotView = () => {
  const { setView } = useAuthModal();
  const [stage, setStage] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Request failed");
      setMessage(`We sent a 5-digit code to ${email}. Check your inbox.`);
      setStage("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const submitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (otp.length !== 5 || !/^\d{5}$/.test(otp)) {
      setError("Enter the 5-digit code from your email");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password })
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Reset failed");
      setMessage(data.message ?? "Password updated. You can now sign in.");
      setTimeout(() => setView("login"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (stage === "request") {
    return (
      <form onSubmit={requestOtp} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <FormHeading
          title="Reset Password"
          subtitle="Enter your email and we'll send a 5-digit verification code."
        />

        <FloatingField
          id="bl-forgot-email"
          type="email"
          label="Email *"
          value={email}
          onChange={setEmail}
          required
          autoComplete="email"
        />

        {error && <p style={errorStyle}>{error}</p>}
        {message && <p style={successStyle}>{message}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...primaryButtonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Sending..." : "Send code"}
        </button>

        <p style={{ margin: "0.5rem 0 0", textAlign: "center", color: "#6b7c8e", fontSize: "0.92rem" }}>
          Remember your password?{" "}
          <button type="button" onClick={() => setView("login")} style={linkStyle}>
            Log in
          </button>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={submitNewPassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <FormHeading
        title="Enter Code"
        subtitle={`We sent a 5-digit code to ${email}. Enter it below with your new password.`}
      />

      <div className="bl-float-input">
        <input
          id="bl-otp-code"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          placeholder=" "
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
          style={{
            letterSpacing: "0.5em",
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
            fontSize: "1.25rem"
          }}
        />
        <label htmlFor="bl-otp-code">5-digit code *</label>
      </div>

      <FloatingField
        id="bl-new-password"
        type="password"
        label="New password *"
        value={password}
        onChange={setPassword}
        required
        autoComplete="new-password"
      />
      <FloatingField
        id="bl-confirm-password"
        type="password"
        label="Confirm password *"
        value={confirm}
        onChange={setConfirm}
        required
        autoComplete="new-password"
      />

      {error && <p style={errorStyle}>{error}</p>}
      {message && <p style={successStyle}>{message}</p>}

      <button
        type="submit"
        disabled={loading}
        style={{
          ...primaryButtonStyle,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Updating..." : "Update password"}
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          marginTop: "0.25rem",
          fontSize: "0.88rem",
          color: "#6b7c8e",
          flexWrap: "wrap"
        }}
      >
        <button
          type="button"
          onClick={() => {
            setStage("request");
            setOtp("");
            setPassword("");
            setConfirm("");
            setMessage("");
            setError("");
          }}
          style={linkStyle}
        >
          ← Use a different email
        </button>
        <button type="button" onClick={requestOtp} disabled={loading} style={linkStyle}>
          Resend code
        </button>
      </div>
    </form>
  );
};

// ============================================
// MODAL SHELL
// ============================================

const VIEW_TITLES: Record<AuthView, string> = {
  login: "Log in",
  register: "Sign up",
  forgot: "Reset password"
};

export const AuthModal = () => {
  const { isOpen, view, close } = useAuthModal();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!mounted || !isOpen) return null;

  const handleSuccess = () => {
    close();
    router.refresh();
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={VIEW_TITLES[view]}
      onClick={close}
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
        animation: "bl-auth-fade-in 0.2s ease"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 980,
          maxHeight: "calc(100vh - 3rem)",
          background: "#ffffff",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(2, 12, 28, 0.4)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          animation: "bl-auth-pop-in 0.25s ease"
        }}
        className="bl-auth-modal-card"
      >
        {/* Form side */}
        <div
          style={{
            padding: "2.25rem 2.25rem 2rem",
            overflowY: "auto",
            maxHeight: "calc(100vh - 3rem)"
          }}
        >
          {view === "login" && <LoginView onSuccess={handleSuccess} />}
          {view === "register" && <RegisterView onSuccess={handleSuccess} />}
          {view === "forgot" && <ForgotView />}
        </div>

        {/* Image side */}
        <div
          className="bl-auth-image-side"
          style={{
            position: "relative",
            background: `linear-gradient(135deg, rgba(10,61,98,0.4), rgba(24,131,255,0.2)), url(${BOAT_IMAGE}) center/cover no-repeat, #0a3d62`,
            minHeight: 520
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#ffffff",
              border: "none",
              color: "#0a3d62",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
              transition: "transform 0.15s ease, background 0.15s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.background = "#f6fafd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "#ffffff";
            }}
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .bl-auth-modal-card {
            grid-template-columns: 1fr !important;
            max-height: calc(100vh - 1.5rem) !important;
          }
          .bl-auth-image-side {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AuthModal;
