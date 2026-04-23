import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <main className="bl-grid-2 bl-section" style={{ paddingTop: "1rem" }}>
      <Card>
        <Badge tone="warning">Subscriptions</Badge>
        <h1>Offer premium visibility with easy billing control.</h1>
        <p>Start, pause, or adjust plans without breaking the seller experience.</p>
        <div className="bl-card-actions">
          <Button asChild><Link href="/pricing">Review plans</Link></Button>
        </div>
      </Card>
      <Card>
        <h2>Plan state</h2>
        <div className="bl-stack">
          <div className="bl-stat"><strong>Active</strong><span>Current subscription status</span></div>
          <div className="bl-stat"><strong>Billing portal</strong><span>Manage plan changes quickly</span></div>
        </div>
      </Card>
    </main>
  );
}
