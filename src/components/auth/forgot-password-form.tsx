"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Request failed");
      }
      setMessage(data.message ?? "If the email exists, a reset email has been sent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="bl-form-head">
        <span className="bl-eyebrow">Recovery</span>
        <h2>Reset access without friction</h2>
        <p>Request a password reset token and continue back into your account safely.</p>
      </div>
      <form className="bl-form-grid" onSubmit={onSubmit}>
        <input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send reset email"}</Button>
      </form>
      {message ? <p className="bl-form-success">{message}</p> : null}
      <p className="bl-form-link"><Link href="/login">Back to sign in</Link></p>
    </Card>
  );
}
