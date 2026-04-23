import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "2.5rem" }}>
      <div className="bl-stack">
        <Card>
          <Badge tone="info">Pricing</Badge>
          <h1>Simple plans for serious sellers and teams.</h1>
          <p>Start free, then upgrade when you need more visibility, more leads, or more advanced operations.</p>
        </Card>
        <div className="bl-section-grid">
          <Card>
            <h3>Starter</h3>
            <p>For new sellers getting their first boat online.</p>
            <strong>Free</strong>
          </Card>
          <Card>
            <h3>Growth</h3>
            <p>For brokers who want stronger exposure and lead handling.</p>
            <strong>$49 / month</strong>
          </Card>
          <Card>
            <h3>Pro</h3>
            <p>For teams needing analytics, billing, and priority support.</p>
            <strong>$149 / month</strong>
          </Card>
        </div>
        <div className="bl-card-actions">
          <Button asChild><Link href="/register">Start free</Link></Button>
          <Button variant="secondary" asChild><Link href="/dashboard/subscriptions">Manage plan</Link></Button>
        </div>
      </div>
    </main>
  );
}
