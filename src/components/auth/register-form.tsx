"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    contactNumber: "",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { error?: string; message?: string; token?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Registration failed");
      }

      if (data.token) {
        setToken(data.token);
        localStorage.setItem("boatlistr-token", data.token);
      }
      setMessage("Account created. You can continue to the marketplace or sign in again anytime.");
      router.push("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="bl-form-head">
        <span className="bl-eyebrow">Create account</span>
        <h2>Start listing in minutes</h2>
        <p>Set up your seller profile, create a listing, and respond to leads from one clean dashboard.</p>
      </div>
      <form className="bl-form-grid" onSubmit={onSubmit}>
        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input placeholder="Contact number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
        <Button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      {error ? <p className="bl-form-error">{error}</p> : null}
      {message ? <p className="bl-form-success">{message}</p> : null}
      {token ? <p className="bl-form-note">Token saved locally for protected API actions.</p> : null}
      <p className="bl-form-link">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </Card>
  );
}
