import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <main className="bl-grid-2 bl-section" style={{ paddingTop: "1rem" }}>
      <Card>
        <h1>Subscription billing</h1>
        <p>Keep your subscription state visible and manageable from a single place.</p>
      </Card>
      <Card>
        <div className="bl-stack">
          <div className="bl-stat"><strong>Status</strong><span>Active</span></div>
          <div className="bl-stat"><strong>Portal</strong><span>Update payment details and plan</span></div>
        </div>
        <div className="bl-card-actions">
          <Button asChild><Link href="/dashboard/subscriptions">Open billing dashboard</Link></Button>
        </div>
      </Card>
    </main>
  );
}
