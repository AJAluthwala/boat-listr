import Card from "@/components/ui/card";
import Link from "next/link";
import Button from "@/components/ui/button";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "1.2rem" }}>
      <div className="bl-market-shell">
        <aside className="bl-market-sidebar">
          <h3>Account</h3>
          <p className="bl-market-muted">Manage your public profile and seller preferences.</p>
          <div className="bl-stack">
            <Button variant="secondary" asChild><Link href="/profile/edit">Edit profile</Link></Button>
            <Button variant="secondary" asChild><Link href="/profile/subscription">Subscription</Link></Button>
          </div>
        </aside>
        <Card>
          <h1>Your marketplace profile</h1>
          <p>Keep your seller details clear so buyers can trust and contact you quickly.</p>
          <div className="bl-market-kpi-grid">
            <div><strong>Rafael Boats</strong><span>Display name</span></div>
            <div><strong>4.8/5</strong><span>Seller rating</span></div>
            <div><strong>96%</strong><span>Response rate</span></div>
            <div><strong>22 min</strong><span>Average reply</span></div>
          </div>
        </Card>
      </div>
    </main>
  );
}
