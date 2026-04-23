import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "2.5rem" }}>
      <div className="bl-grid-2">
        <Card>
          <h1>Talk to Boat Listr.</h1>
          <p>Need onboarding help, custom setup, or assistance with a listing workflow? Reach out directly.</p>
          <div className="bl-stack">
            <div className="bl-stat"><strong>Email</strong><span>support@boatlistr.com</span></div>
            <div className="bl-stat"><strong>Response time</strong><span>Within one business day</span></div>
          </div>
        </Card>
        <Card>
          <h2>Next step</h2>
          <p>Open the marketplace or create an account to begin testing the live flows.</p>
          <div className="bl-card-actions">
            <Button asChild><Link href="/register">Create account</Link></Button>
            <Button variant="secondary" asChild><Link href="/listings">Browse listings</Link></Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
