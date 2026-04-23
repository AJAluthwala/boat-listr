import LoginForm from "@/components/auth/login-form";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "3rem" }}>
      <div className="bl-grid-2">
        <section className="bl-panel">
          <span className="bl-eyebrow">Welcome back</span>
          <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", margin: "0.4rem 0" }}>Return to your dashboard and keep leads moving.</h1>
          <p>Sign in to view messages, manage listings, and track payments or subscriptions without jumping between tools.</p>
        </section>
        <LoginForm />
      </div>
    </main>
  );
}
