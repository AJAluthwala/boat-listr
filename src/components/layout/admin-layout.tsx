"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { useAuthModal } from "@/components/auth/auth-modal-context";

type NavItem = { href: string; label: string; icon: React.ReactNode };

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" />
  </svg>
);
const ShipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 1.9.5 2.5 1" />
    <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
    <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const CardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="14" rx="2" />
    <line x1="2" y1="11" x2="22" y2="11" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Overview", icon: <HomeIcon /> },
  { href: "/admin/listings", label: "Listings", icon: <ShipIcon /> },
  { href: "/admin/users", label: "Users", icon: <UsersIcon /> },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: <CardIcon /> },
];

const isActive = (pathname: string, href: string) => {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
};

type AdminUser = { id: number; name: string; email: string; role: string };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, token } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const [me, setMe] = useState<AdminUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const t = setTimeout(() => {
        router.replace("/");
        openAuthModal("login");
      }, 100);
      return () => clearTimeout(t);
    }
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (active) setForbidden(true);
          return;
        }
        const data = (await res.json()) as { user?: AdminUser };
        if (!active) return;
        if (!data.user || String(data.user.role).toUpperCase() !== "ADMIN") {
          setForbidden(true);
        } else {
          setMe(data.user);
        }
      } finally {
        if (active) setAuthChecked(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated, token, router, openAuthModal]);

  if (!isAuthenticated || !authChecked) {
    return (
      <main
        className="bl-container"
        style={{
          paddingTop: "4rem",
          paddingBottom: "4rem",
          textAlign: "center",
          color: "#55657a",
        }}
      >
        <p>Checking your session…</p>
      </main>
    );
  }

  if (forbidden) {
    return (
      <main
        className="bl-container"
        style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e1eef5",
            borderRadius: 18,
            padding: "3rem 1.5rem",
            textAlign: "center",
            maxWidth: 520,
            marginInline: "auto",
            boxShadow: "0 12px 32px rgba(10, 61, 98, 0.08)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#fff1f1",
              border: "1px solid #ffcfcf",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              color: "#c53030",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2
            style={{
              margin: "0 0 0.5rem",
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#0a3d62",
            }}
          >
            Admin access required
          </h2>
          <p style={{ margin: "0 0 1.5rem", color: "#55657a" }}>
            You don&apos;t have permission to view the admin panel.
          </p>
          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              padding: "0.65rem 1.4rem",
              background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
              color: "#ffffff",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: "0.92rem",
              boxShadow: "0 8px 18px rgba(24, 131, 255, 0.28)",
            }}
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const initial = (me?.name ?? "A").trim().charAt(0).toUpperCase();

  return (
    <main
      className="bl-container"
      style={{ paddingTop: "2rem", paddingBottom: "3rem" }}
    >
      <div
        className="bl-admin-grid"
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
          {/* Admin badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "0.4rem 0.85rem",
              background:
                "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 28px), linear-gradient(135deg, #051d35 0%, #0a3d62 40%, #1883ff 100%)",
              color: "#ffffff",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: 999,
              boxShadow: "0 6px 14px rgba(8, 43, 73, 0.25)",
              width: "fit-content",
            }}
          >
            <ShieldIcon />
            Admin panel
          </div>

          {/* User card */}
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
                {me?.name ?? "Admin"}
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
                {me?.email ?? "—"}
              </div>
            </div>
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

            <div
              style={{
                marginTop: "0.5rem",
                paddingTop: "0.5rem",
                borderTop: "1px solid #eef4f8",
              }}
            >
              <Link
                href="/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0.65rem 0.85rem",
                  borderRadius: 10,
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "#8ea3bb",
                  transition: "color 0.15s ease",
                }}
              >
                ← Back to user dashboard
              </Link>
            </div>
          </nav>
        </aside>

        <section style={{ minWidth: 0 }}>{children}</section>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .bl-admin-grid {
            grid-template-columns: 1fr !important;
          }
          .bl-admin-grid > aside {
            position: static !important;
          }
        }
      `}</style>
    </main>
  );
}
