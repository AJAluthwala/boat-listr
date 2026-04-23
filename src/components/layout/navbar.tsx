import Link from "next/link";
import Button from "@/components/ui/button";

const navLinks = [
  { href: "/listings", label: "Browse" },
  { href: "/favorites", label: "Saved" },
  { href: "/messages", label: "Messages" },
  { href: "/dashboard", label: "Selling" },
];

const categoryLinks = [
  { href: "/listings", label: "All boats" },
  { href: "/listings", label: "Sailboats" },
  { href: "/listings", label: "Yachts" },
  { href: "/listings", label: "Fishing" },
  { href: "/listings", label: "Jet boats" },
];

export default function Navbar() {
  return (
    <header className="bl-topbar">
      <div className="bl-container">
        <div className="bl-topbar-inner">
          <Link href="/" className="bl-brand">
            <span className="bl-brand-mark">BL</span>
            <span>
              <strong>Boat Listr Marketplace</strong>
              <span>Buy, sell, and message in one place</span>
            </span>
          </Link>
          <div className="bl-market-search-wrap">
            <input className="bl-market-search" placeholder="Search boats by model, category, or location" aria-label="Search boats" />
          </div>
          <nav className="bl-nav-links">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="bl-topbar-actions">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/listings/create">Create listing</Link>
            </Button>
          </div>
        </div>
        <div className="bl-market-tabs">
          {categoryLinks.map((link) => (
            <Link key={link.label} href={link.href} className="bl-market-tab">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
