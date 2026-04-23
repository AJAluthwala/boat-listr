import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "1.2rem" }}>
      <div className="bl-inbox-shell">
        <aside className="bl-inbox-list">
          <h2>Your inbox</h2>
          <article className="is-active">
            <strong>Rafael M.</strong>
            <p>Is this Sea Ray still available?</p>
            <span>2m ago</span>
          </article>
          <article>
            <strong>Marina Brokers</strong>
            <p>Can we schedule a sea trial this weekend?</p>
            <span>24m ago</span>
          </article>
          <article>
            <strong>Alex T.</strong>
            <p>Do you have service records?</p>
            <span>1h ago</span>
          </article>
        </aside>

        <Card className="bl-inbox-preview">
          <h1>Open a conversation</h1>
          <p>Pick a thread on the left to see the full chat and reply in real time.</p>
          <div className="bl-card-actions">
            <Button asChild><Link href="/messages/demo-conversation">Open sample thread</Link></Button>
            <Button variant="secondary" asChild><Link href="/listings">Back to listings</Link></Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
