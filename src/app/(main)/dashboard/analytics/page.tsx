import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";

export default function Page() {
  return (
    <main className="bl-stack bl-section" style={{ paddingTop: "1rem" }}>
      <Card>
        <Badge tone="info">Analytics</Badge>
        <h1>See the marketplace pulse in a glance.</h1>
        <p>Track lead volume, listing performance, and engagement without digging through technical screens.</p>
      </Card>
      <div className="bl-section-grid">
        <Card><strong>1.2k</strong><p>Monthly views</p></Card>
        <Card><strong>84</strong><p>Buyer conversations</p></Card>
        <Card><strong>27%</strong><p>Conversion lift</p></Card>
      </div>
    </main>
  );
}
