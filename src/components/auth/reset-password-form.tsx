"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ token: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Reset failed");
      }
      setMessage(data.message ?? "Password updated.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="bl-form-head">
        <span className="bl-eyebrow">Set a new password</span>
        <h2>Finish password recovery</h2>
        <p>Paste the reset token from email and choose a stronger password.</p>
      </div>
      <form className="bl-form-grid" onSubmit={onSubmit}>
        <input required placeholder="Reset token" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} />
        <input required type="password" placeholder="New password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" disabled={loading}>{loading ? "Updating..." : "Update password"}</Button>
      </form>
      {message ? <p className="bl-form-success">{message}</p> : null}
      {error ? <p className="bl-form-error">{error}</p> : null}
      <p className="bl-form-link"><Link href="/login">Return to sign in</Link></p>
    </Card>
  );
}
