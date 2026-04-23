import Card from "@/components/ui/card";

export default function Page() {
  return (
    <main className="bl-section" style={{ paddingTop: "1rem" }}>
      <div className="bl-grid-2">
        <Card>
          <h1>Account settings</h1>
          <p>Fine tune profile, notification preferences, and access information.</p>
          <div className="bl-stack">
            <div className="bl-stat"><strong>Profile</strong><span>Name, address, contact details</span></div>
            <div className="bl-stat"><strong>Security</strong><span>Session token and password recovery</span></div>
          </div>
        </Card>
        <Card>
          <h2>Preferences</h2>
          <div className="bl-stack">
            <div className="bl-stat"><strong>Email alerts</strong><span>New leads, saved searches, and payment events</span></div>
            <div className="bl-stat"><strong>Privacy</strong><span>Manage who can contact you about listings</span></div>
          </div>
        </Card>
      </div>
    </main>
  );
}
