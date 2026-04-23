import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function Page() {
  return (
    <main className="bl-container bl-section" style={{ paddingTop: "3rem" }}>
      <div className="bl-grid-2">
        <section className="bl-panel">
          <span className="bl-eyebrow">Security</span>
          <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", margin: "0.4rem 0" }}>Choose a new password and continue.</h1>
          <p>Use the token from email to complete recovery and return to your Boat Listr workspace.</p>
        </section>
        <ResetPasswordForm />
      </div>
    </main>
  );
}
