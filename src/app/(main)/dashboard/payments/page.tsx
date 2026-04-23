import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";

export default function Page() {
  return (
    <main className="bl-grid-2 bl-section" style={{ paddingTop: "1rem" }}>
      <Card>
        <Badge tone="success">Payments</Badge>
        <h1>Keep payment history and billing actions visible.</h1>
        <p>Track intent creation, history, and subscription billing in a clean financial surface.</p>
      </Card>
      <Card>
        <h2>Summary</h2>
        <div className="bl-stack">
          <div className="bl-stat"><strong>$9,900</strong><span>Recent intent amount</span></div>
          <div className="bl-stat"><strong>2</strong><span>Open invoices</span></div>
          <div className="bl-stat"><strong>Active</strong><span>Subscription state</span></div>
        </div>
      </Card>
    </main>
  );
}
