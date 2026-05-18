"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import type { PlanKey } from "@/lib/plans";

type NavItem = { href: string; label: string; icon: React.ReactNode };

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" />
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
  </svg>
);
const ShipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 1.9.5 2.5 1" />
    <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
    <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
  </svg>
);
const CardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="14" rx="2" />
    <line x1="2" y1="11" x2="22" y2="11" />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: <HomeIcon /> },
  { href: "/dashboard/profile", label: "My Profile", icon: <UserIcon /> },
  { href: "/dashboard/listings", label: "My Listings", icon: <ShipIcon /> },
  { href: "/dashboard/subscriptions", label: "Subscription", icon: <CardIcon /> },
];

const isActive = (pathname: string, href: string) => {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
};

type DashboardUser = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, token } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [plan, setPlan] = useState<PlanKey>("free");
  const [authChecked, setAuthChecked] = useState(false);

  // Guard the page — if not signed in, send to home and pop the auth modal
  useEffect(() => {
    if (!isAuthenticated) {
      const t = setTimeout(() => {
        router.replace("/");
        openAuthModal("login");
      }, 100);
      return () => clearTimeout(t);
    }
    setAuthChecked(true);
  }, [isAuthenticated, router, openAuthModal]);

  // Fetch user + plan once authed
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    let active = true;
    (async () => {
      try {
        const [meRes, planRes] = await Promise.all([
          fetch("/api/users/me", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/subscriptions/status", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (meRes.ok && active) {
          const data = (await meRes.json()) as { user?: DashboardUser };
          if (data.user) setUser(data.user);
        }
        if (planRes.ok && active) {
          const data = (await planRes.json()) as { plan?: PlanKey };
          if (data.plan) setPlan(data.plan);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated, token]);

  if (!authChecked || !isAuthenticated) {
    return (
      <main
        className="bl-container"
        style={{ paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center", color: "#55657a" }}
      >
        <p>Checking your session…</p>
      </main>
    );
  }

  const initial = (user?.name ?? "U").trim().charAt(0).toUpperCase();

  return (
    <main className="bl-container" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
      <div
        className="bl-dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 260px) minmax(0, 1fr)",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        <aside
          style={{
            position: "sticky",
            top: 100,
            background: "#ffffff",
            border: "1px solid #e1eef5",
            borderRadius: 18,
            padding: "1.4rem",
            boxShadow: "0 8px 24px rgba(10, 61, 98, 0.06)",
            display: "grid",
            gap: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1883ff 0%, #0a3d62 100%)",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.15rem",
                boxShadow: "0 4px 10px rgba(24, 131, 255, 0.25)",
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  color: "#0a3d62",
                  fontSize: "0.95rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name ?? "Welcome"}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#8ea3bb",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email ?? "—"}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.6rem 0.85rem",
              background: plan === "premium" ? "#fff8ec" : "#f6fafd",
              border: `1px solid ${plan === "premium" ? "#fde7b8" : "#e1eef5"}`,
              borderRadius: 12,
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: plan === "premium" ? "#b45309" : "#1883ff",
              }}
            >
              {plan === "premium" ? "★ Premium" : "Free plan"}
            </span>
            {plan === "free" && (
              <Link
                href="/dashboard/subscriptions"
                style={{ fontSize: "0.78rem", color: "#1883ff", fontWeight: 600 }}
              >
                Upgrade
              </Link>
            )}
          </div>

          <nav style={{ display: "grid", gap: "0.25rem" }}>
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname ?? "", item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "0.65rem 0.85rem",
                    borderRadius: 10,
                    fontSize: "0.92rem",
                    fontWeight: active ? 700 : 600,
                    color: active ? "#1883ff" : "#4a5b6e",
                    background: active ? "#eaf3fb" : "transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ color: active ? "#1883ff" : "#8ea3bb", display: "inline-flex" }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}

            {user?.role?.toUpperCase() === "ADMIN" && (
              <div
                style={{
                  marginTop: "0.5rem",
                  paddingTop: "0.5rem",
                  borderTop: "1px solid #eef4f8",
                }}
              >
                <Link
                  href="/admin"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "0.65rem 0.85rem",
                    borderRadius: 10,
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    background:
                      "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 24px), linear-gradient(135deg, #0a3d62 0%, #1883ff 100%)",
                    boxShadow: "0 6px 14px rgba(8, 43, 73, 0.25)",
                    transition: "transform 0.15s ease",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Admin Panel
                </Link>
              </div>
            )}
          </nav>
        </aside>

        <section style={{ minWidth: 0 }}>{children}</section>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .bl-dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .bl-dashboard-grid > aside {
            position: static !important;
          }
        }
      `}</style>
    </main>
  );
}
