import Link from "next/link";

const CheckIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#16a34a"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Page() {
  return (
    <div
      style={{ paddingTop: "1rem", paddingBottom: "2rem" }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e1eef5",
          borderRadius: 20,
          padding: "3.5rem 1.5rem",
          textAlign: "center",
          maxWidth: 520,
          marginInline: "auto",
          boxShadow: "0 12px 32px rgba(10, 61, 98, 0.08)"
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background:
              "linear-gradient(140deg, #ecfdf5 0%, #f0fdf4 60%, #ffffff 100%)",
            border: "1px solid #c5e9d2",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem"
          }}
        >
          <CheckIcon />
        </div>
        <h1
          style={{
            margin: 0,
            marginBottom: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#0a3d62",
            letterSpacing: "-0.02em"
          }}
        >
          You&apos;re on Premium 🎉
        </h1>
        <p
          style={{
            margin: 0,
            marginBottom: "1.75rem",
            color: "#55657a",
            fontSize: "0.98rem",
            lineHeight: 1.55,
            maxWidth: 420,
            marginInline: "auto"
          }}
        >
          Your subscription is active. You can now publish listings with up to
          25 photos, 3 videos, and priority placement in search.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
          <Link
            href="/listings/create"
            style={{
              display: "inline-block",
              padding: "0.8rem 1.5rem",
              background: "linear-gradient(135deg, #1883ff 0%, #0a6ed9 100%)",
              color: "#ffffff",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: "0.95rem",
              boxShadow: "0 8px 18px rgba(24, 131, 255, 0.28)"
            }}
          >
            Start a listing
          </Link>
          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              padding: "0.8rem 1.5rem",
              background: "#f6fafd",
              color: "#0a3d62",
              border: "1px solid #e1eef5",
              borderRadius: 14,
              fontWeight: 600,
              fontSize: "0.95rem"
            }}
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
