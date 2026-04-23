import CreateListingForm from "@/components/listings/create-listing-form";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "2.5rem" }}>
      <div className="bl-grid-2">
        <section className="bl-panel">
          <span className="bl-eyebrow">New listing</span>
          <h1 style={{ fontSize: "clamp(2.4rem, 4vw, 4rem)", margin: "0.4rem 0" }}>Publish a listing with a clear seller journey.</h1>
          <p>Use the form to create a clean listing, then add media and open conversations from the dashboard.</p>
          <div className="bl-stack" style={{ marginTop: "1.5rem" }}>
            <div className="bl-stat"><strong>Clear CTA</strong><span>Publish listing as soon as details are complete.</span></div>
            <div className="bl-stat"><strong>Structured data</strong><span>Keep year, price, capacity, and engine fields obvious.</span></div>
          </div>
        </section>
        <CreateListingForm />
      </div>
    </main>
  );
}
