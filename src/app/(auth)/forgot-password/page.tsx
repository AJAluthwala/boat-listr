import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "3rem" }}>
      <div className="bl-grid-2">
        <section className="bl-panel">
          <span className="bl-eyebrow">Account recovery</span>
          <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", margin: "0.4rem 0" }}>Reset your password with a simple, secure flow.</h1>
          <p>We’ll generate a reset token and send it to your email so you can get back in quickly.</p>
        </section>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
