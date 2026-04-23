import RegisterForm from "@/components/auth/register-form";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "3rem" }}>
      <div className="bl-grid-2">
        <section className="bl-panel">
          <span className="bl-eyebrow">Create your account</span>
          <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", margin: "0.4rem 0" }}>Start listing boats with a professional presence.</h1>
          <p>Register once, publish listings, manage messages, and keep your marketplace work organized in one place.</p>
          <div className="bl-stack" style={{ marginTop: "1.5rem" }}>
            <div className="bl-stat"><strong>Fast setup</strong><span>Complete onboarding in minutes.</span></div>
            <div className="bl-stat"><strong>Live access</strong><span>Token is available immediately after sign-up.</span></div>
          </div>
        </section>
        <RegisterForm />
      </div>
    </main>
  );
}
