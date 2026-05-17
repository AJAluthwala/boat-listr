"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { useAuth } from "@/components/auth/auth-context";

const navLinks: { href: string; label: string; hasDropdown?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Browse Boats", hasDropdown: true },
  { href: "/dashboard", label: "Selling" },
  { href: "/favorites", label: "Saved" }
];

const ChevronDownIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MessageIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const isActivePath = (pathname: string | null, href: string) => {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open: openAuthModal } = useAuthModal();
  const { isAuthenticated, logout } = useAuth();

  const handleSellClick = () => {
    if (isAuthenticated) {
      router.push("/listings/create");
    } else {
      openAuthModal("login");
    }
  };

  const handleLogout = () => {
    logout();
    router.refresh();
  };

  return (
    <header className="bl-navbar-wrap">
      <div className="bl-container">
        <div className="bl-navbar">
          {/* Brand / Logo — replace placeholder with provided logo asset */}
          <Link href="/" className="bl-navbar-brand" aria-label="Boat Listr home">
            <span className="bl-navbar-brand-text">
              Boat<span className="bl-navbar-brand-accent">L</span>istr
            </span>
          </Link>

          {/* Center navigation */}
          <nav className="bl-navbar-nav" aria-label="Primary">
            {navLinks.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`bl-navbar-link${active ? " bl-navbar-link-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDownIcon />}
                </Link>
              );
            })}
          </nav>

          {/* Right-side actions */}
          <div className="bl-navbar-actions">
            <button
              type="button"
              className="bl-navbar-icon-btn"
              aria-label="Search listings"
            >
              <SearchIcon />
            </button>

            <Link
              href="/messages"
              className="bl-navbar-icon-btn bl-navbar-icon-btn-badged"
              aria-label="Messages"
            >
              <MessageIcon />
              <span className="bl-navbar-badge" aria-hidden="true">0</span>
            </Link>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="bl-navbar-signin"
              >
                Log out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="bl-navbar-signin"
              >
                Sign in
              </button>
            )}

            <button
              type="button"
              onClick={handleSellClick}
              className="bl-navbar-cta"
            >
              Sell Your Boat
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
