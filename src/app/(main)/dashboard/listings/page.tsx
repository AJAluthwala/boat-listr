import Link from "next/link";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function Page() {
  return (
    <main className="bl-stack">
      <Card>
        <Badge tone="info">My listings</Badge>
        <h1>Keep your inventory organized and easy to update.</h1>
        <p>View active inventory, jump into edits, and keep status changes visible for your team.</p>
        <div className="bl-card-actions">
          <Button asChild><Link href="/dashboard/listings/create">Create listing</Link></Button>
          <Button variant="secondary" asChild><Link href="/listings">View public marketplace</Link></Button>
        </div>
      </Card>
      <div className="bl-section-grid">
        <Card><strong>8</strong><p>Active listings</p></Card>
        <Card><strong>4</strong><p>Pending review</p></Card>
        <Card><strong>12</strong><p>Open conversations</p></Card>
      </div>
    </main>
  );
}
