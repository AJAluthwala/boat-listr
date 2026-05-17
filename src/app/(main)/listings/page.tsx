import { Suspense } from "react";
import ListingBrowser from "@/components/site/listing-browser";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "2.5rem" }}>
      <Suspense fallback={null}>
        <ListingBrowser />
      </Suspense>
    </main>
  );
}
