import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "1rem" }}>
      <Card>
        <h1>Edit profile details</h1>
        <p>Update name, address, and contact details to keep buyer communication accurate.</p>
        <div className="bl-card-actions">
          <Button asChild><Link href="/profile">Back to profile</Link></Button>
        </div>
      </Card>
    </main>
  );
}
