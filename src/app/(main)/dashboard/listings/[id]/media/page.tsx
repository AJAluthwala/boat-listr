import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <main className="bl-grid-2 bl-section" style={{ paddingTop: "1rem" }}>
        <Card>
          <h1>Listing media</h1>
          <p>Upload photos and videos with a simple, guided media workflow.</p>
        </Card>
      <Card>
        <h2>Media workflow</h2>
        <div className="bl-stack">
          <div className="bl-stat"><strong>Primary image</strong><span>Choose the clearest hero shot.</span></div>
          <div className="bl-stat"><strong>Gallery</strong><span>Show deck, interior, engine, and living space.</span></div>
          <div className="bl-stat"><strong>Video</strong><span>Add a walkthrough to improve conversion.</span></div>
        </div>
      </Card>
    </main>
  );
}
