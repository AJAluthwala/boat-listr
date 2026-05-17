"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { error?: string; token?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Login failed");
      }

      if (data.token) {
        localStorage.setItem("boatlistr-token", data.token);
      }

      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="bl-form-head">
        <span className="bl-eyebrow">Welcome back</span>
        <h2>Sign in to manage listings</h2>
        <p>Track messages, update inventory, and manage payouts from a focused dashboard.</p>
      </div>
      <form className="bl-form-grid" onSubmit={onSubmit}>
        <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
      </form>
      {error ? <p className="bl-form-error">{error}</p> : null}
      <p className="bl-form-link">
        Need an account? <Link href="/register">Create one</Link>
      </p>
      <p className="bl-form-link">
        Forgot password? <Link href="/forgot-password">Reset it</Link>
      </p>
    </Card>
  );
}
