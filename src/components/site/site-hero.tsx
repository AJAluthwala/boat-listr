import Link from "next/link";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";

export default function SiteHero() {
  return (
    <section className="bl-hero">
      <div className="bl-container bl-hero-grid">
        <div>
          <Badge tone="info">Marketplace</Badge>
          <h1>Discover local boats for sale and message sellers instantly.</h1>
          <p>
            Browse fresh listings in feed format, save favorites, compare prices, and contact sellers
            without leaving the listing experience.
          </p>
          <div className="bl-hero-actions">
            <Button asChild>
              <Link href="/listings">Browse marketplace</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/listings/create">Sell something</Link>
            </Button>
          </div>
          <div className="bl-hero-metrics">
            <div><strong>1,200+</strong><span>active monthly views</span></div>
            <div><strong>90+</strong><span>new listings this week</span></div>
            <div><strong>24h</strong><span>average first reply time</span></div>
          </div>
        </div>
        <div className="bl-hero-card">
          <div className="bl-preview-card">
            <span className="bl-preview-label">Today in your area</span>
            <h3>Sea Ray 350 Sundancer</h3>
            <p>2021, low engine hours, Orlando</p>
            <div className="bl-preview-row">
              <span>Price</span>
              <strong>$189,000</strong>
            </div>
            <div className="bl-preview-row">
              <span>Saved by buyers</span>
              <strong>48 times</strong>
            </div>
            <div className="bl-preview-row">
              <span>Seller response</span>
              <strong>Usually in 30 min</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
