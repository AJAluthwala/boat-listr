import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "1rem" }}>
      <div className="bl-inbox-thread-shell">
        <Card className="bl-thread-messages">
          <div className="bl-thread-header">
            <h1>Sea Ray 350 conversation</h1>
            <Button variant="secondary" asChild><Link href="/messages">Back to inbox</Link></Button>
          </div>

          <div className="bl-thread-bubbles">
            <article className="bl-bubble incoming">Hi, is this still available?</article>
            <article className="bl-bubble outgoing">Yes, it is available and ready for viewing this week.</article>
            <article className="bl-bubble incoming">Great, can I come Saturday morning?</article>
          </div>
        </Card>

        <Card>
          <h2>Reply</h2>
          <div className="bl-form-grid">
            <textarea placeholder="Write a message..." />
            <Button>Send message</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
