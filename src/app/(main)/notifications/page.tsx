import Card from "@/components/ui/card";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "1.2rem" }}>
      <div className="bl-stack">
        <Card>
          <h1>Marketplace notifications</h1>
          <p className="bl-market-muted">Recent updates from saved items, sellers, and buyer chats.</p>
        </Card>
        <div className="bl-notification-list">
          <article>
            <strong>Price dropped on Sea Ray 350</strong>
            <p>Now listed at $189,000 in Orlando.</p>
            <span>12 minutes ago</span>
          </article>
          <article>
            <strong>New message from Rafael M.</strong>
            <p>Asked for available showing times.</p>
            <span>45 minutes ago</span>
          </article>
          <article>
            <strong>Your listing received 24 new views</strong>
            <p>Bayliner Element E18 is trending this afternoon.</p>
            <span>2 hours ago</span>
          </article>
        </div>
      </div>
    </main>
  );
}
