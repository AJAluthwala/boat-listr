import Link from "next/link";

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.4a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const COLUMN_TITLE: React.CSSProperties = {
  margin: 0,
  marginBottom: "1rem",
  fontSize: "0.95rem",
  fontWeight: 800,
  color: "#ffffff",
  letterSpacing: "-0.005em",
};

const LIST_STYLE: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "0.6rem",
};

const linkStyle: React.CSSProperties = {
  color: "rgba(255, 255, 255, 0.72)",
  fontSize: "0.92rem",
  textDecoration: "none",
  transition: "color 0.15s ease",
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    style={linkStyle}
    className="bl-footer-link"
  >
    {children}
  </Link>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background:
          "linear-gradient(180deg, #082b49 0%, #051d35 100%)",
        color: "#ffffff",
      }}
    >
      <div
        className="bl-container"
        style={{
          paddingTop: "3.5rem",
          paddingBottom: "1.5rem",
        }}
      >
        {/* 4-column link grid */}
        <div
          className="bl-footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: "2rem",
            paddingBottom: "3rem",
          }}
        >
          {/* Brand column */}
          <div>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "#ffffff",
                display: "inline-block",
                marginBottom: "0.85rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                }}
              >
                Boat<span style={{ color: "#1883ff" }}>L</span>istr
              </span>
            </Link>
            <p
              style={{
                margin: "0 0 1.2rem",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.92rem",
                lineHeight: 1.55,
                maxWidth: 320,
              }}
            >
              The trusted marketplace to buy, sell, and discover boats with
              ease and confidence.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.55rem",
                fontSize: "0.9rem",
              }}
            >
              <a
                href="mailto:contact@boatlistr.com"
                style={{ ...linkStyle, display: "inline-flex", alignItems: "center", gap: 8 }}
                className="bl-footer-link"
              >
                <MailIcon />
                contact@boatlistr.com
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, display: "inline-flex", alignItems: "center", gap: 8 }}
                className="bl-footer-link"
              >
                <FacebookIcon />
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, display: "inline-flex", alignItems: "center", gap: 8 }}
                className="bl-footer-link"
              >
                <InstagramIcon />
                Instagram
              </a>
            </div>
          </div>

          {/* For Sellers */}
          <div>
            <h3 style={COLUMN_TITLE}>For Sellers</h3>
            <ul style={LIST_STYLE}>
              <li><FooterLink href="/listings/create">List your boat</FooterLink></li>
              <li><FooterLink href="/dashboard/listings">My listings</FooterLink></li>
              <li><FooterLink href="/pricing">Pricing & plans</FooterLink></li>
              <li><FooterLink href="/dashboard">Seller dashboard</FooterLink></li>
            </ul>
          </div>

          {/* For Buyers */}
          <div>
            <h3 style={COLUMN_TITLE}>For Buyers</h3>
            <ul style={LIST_STYLE}>
              <li><FooterLink href="/listings">Browse boats</FooterLink></li>
              <li><FooterLink href="/favorites">Saved boats</FooterLink></li>
              <li><FooterLink href="/listings">Featured listings</FooterLink></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={COLUMN_TITLE}>Quick Links</h3>
            <ul style={LIST_STYLE}>
              <li><FooterLink href="/about">About us</FooterLink></li>
              <li><FooterLink href="/contact">Contact</FooterLink></li>
              <li><FooterLink href="/dashboard/profile">My profile</FooterLink></li>
              <li><FooterLink href="/dashboard/subscriptions">Subscription</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              color: "rgba(255, 255, 255, 0.55)",
              fontSize: "0.85rem",
            }}
          >
            © {year} <strong style={{ color: "rgba(255, 255, 255, 0.85)", fontWeight: 700 }}>BoatListr</strong>. All rights reserved.
          </div>
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              fontSize: "0.85rem",
            }}
          >
            <Link href="/privacy" style={linkStyle} className="bl-footer-link">Privacy Policy</Link>
            <Link href="/cookies" style={linkStyle} className="bl-footer-link">Cookies</Link>
            <Link href="/terms" style={linkStyle} className="bl-footer-link">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      <style>{`
        .bl-footer-link:hover {
          color: #ffffff !important;
        }

        @media (max-width: 880px) {
          .bl-footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
        }

        @media (max-width: 520px) {
          .bl-footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
