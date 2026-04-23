import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Link from "next/link";

export default function DashboardOverview() {
  return (
    <div className="bl-market-shell">
      <aside className="bl-market-sidebar">
        <h3>Seller workspace</h3>
        <p className="bl-market-muted">Everything you need to run listings and close buyers.</p>
        <div className="bl-stack">
          <Button asChild><Link href="/dashboard/listings/create">Create listing</Link></Button>
          <Button variant="secondary" asChild><Link href="/messages">Open inbox</Link></Button>
          <Button variant="secondary" asChild><Link href="/dashboard/payments">Payouts</Link></Button>
        </div>
      </aside>

      <section className="bl-market-feed">
        <Card>
          <Badge tone="success">Seller dashboard</Badge>
          <h1>Manage your marketplace business in one flow.</h1>
          <p>Track listing health, buyer messages, and paid visibility from a single seller workspace.</p>
          <div className="bl-market-kpi-grid">
            <div><strong>17</strong><span>Open buyer chats</span></div>
            <div><strong>8</strong><span>Active listings</span></div>
            <div><strong>3</strong><span>Pending offers</span></div>
            <div><strong>94%</strong><span>Reply rate</span></div>
          </div>
        </Card>

        <div className="bl-market-seller-list">
          <article>
            <div>
              <strong>Sea Ray 350 Sundancer</strong>
              <p className="bl-market-muted">12 new views · 3 new messages</p>
            </div>
            <Button variant="secondary" asChild><Link href="/dashboard/listings">Manage</Link></Button>
          </article>
          <article>
            <div>
              <strong>Bayliner Element E18</strong>
              <p className="bl-market-muted">Price watch alert · 2 similar boats reduced</p>
            </div>
            <Button variant="secondary" asChild><Link href="/dashboard/listings">Adjust price</Link></Button>
          </article>
        </div>
      </section>
    </div>
  );
}
