import Card from "@/components/ui/card";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "2.5rem" }}>
      <div className="bl-grid-2">
        <Card>
          <h1>Built for clarity in a complex marketplace.</h1>
          <p>Boat Listr focuses on fast discovery, clean seller onboarding, and a professional lead flow.</p>
        </Card>
        <Card>
          <h2>What this product gives you</h2>
          <div className="bl-stack">
            <div className="bl-stat"><strong>Clean pages</strong><span>Readable content and direct calls to action.</span></div>
            <div className="bl-stat"><strong>Connected APIs</strong><span>Real app flow behind the interface.</span></div>
            <div className="bl-stat"><strong>Scalable structure</strong><span>Easy to expand into a full product.</span></div>
          </div>
        </Card>
      </div>
    </main>
  );
}
