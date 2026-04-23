import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <main className="bl-grid-2 bl-section" style={{ paddingTop: "1rem" }}>
      <Card>
        <Badge tone="warning">Edit listing</Badge>
        <h1>Review and update listing details before republishing.</h1>
        <p>This screen is ready for a richer edit experience with media, pricing, and status controls.</p>
        <div className="bl-card-actions">
          <Button asChild><Link href="/dashboard/listings">Back to listings</Link></Button>
          <Button variant="secondary" asChild><Link href="/dashboard/listings/create">Create new listing</Link></Button>
        </div>
      </Card>
      <Card>
        <h2>Editing checklist</h2>
        <div className="bl-stack">
          <div className="bl-stat"><strong>Title</strong><span>Keep it short and specific.</span></div>
          <div className="bl-stat"><strong>Media</strong><span>Add bright, high-resolution photos.</span></div>
          <div className="bl-stat"><strong>Status</strong><span>Move to active once ready.</span></div>
        </div>
      </Card>
    </main>
  );
}
