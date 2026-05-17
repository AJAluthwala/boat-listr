"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [stage, setStage] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function requestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Request failed");
      setMessage(`We sent a 5-digit code to ${email}.`);
      setStage("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitNewPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!/^\d{5}$/.test(otp)) {
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
        body: JSON.stringify({ email, otp, password }),
      });
      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error ?? "Reset failed");
      setMessage(data.message ?? "Password updated. Redirecting to sign in...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="bl-form-head">
        <span className="bl-eyebrow">Recovery</span>
        <h2>{stage === "request" ? "Reset your password" : "Enter your code"}</h2>
        <p>
          {stage === "request"
            ? "We'll send a 5-digit verification code to your email."
            : `Code sent to ${email}. Enter it below with your new password.`}
        </p>
      </div>

      {stage === "request" ? (
        <form className="bl-form-grid" onSubmit={requestOtp}>
          <input
            required
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send code"}
          </Button>
        </form>
      ) : (
        <form className="bl-form-grid" onSubmit={submitNewPassword}>
          <input
            required
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            placeholder="5-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
            style={{ letterSpacing: "0.4em", textAlign: "center", fontSize: "1.1rem" }}
          />
          <input
            required
            type="password"
            placeholder="New password (8+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <input
            required
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </Button>
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
            style={{
              background: "none",
              border: "none",
              color: "#1883ff",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: 0,
            }}
          >
            ← Use a different email
          </button>
        </form>
      )}

      {error ? <p className="bl-form-error">{error}</p> : null}
      {message ? <p className="bl-form-success">{message}</p> : null}

      <p className="bl-form-link">
        <Link href="/login">Back to sign in</Link>
      </p>
    </Card>
  );
}
