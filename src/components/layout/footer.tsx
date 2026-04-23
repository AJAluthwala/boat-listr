import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bl-footer">
      <div className="bl-container bl-footer-inner">
        <div>
          <strong>Boat Listr</strong>
          <p>Built for boat owners, brokers, and serious buyers.</p>
        </div>
        <div className="bl-footer-links">
          <Link href="/listings">Listings</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/register">Create account</Link>
        </div>
      </div>
    </footer>
  );
}
