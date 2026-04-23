import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/listings", label: "My listings" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/subscriptions", label: "Subscription" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bl-dashboard-shell">
      <aside className="bl-dashboard-sidebar">
        <Link href="/" className="bl-brand bl-brand-compact">
          <span className="bl-brand-mark">BL</span>
          <span>
            <strong>Boat Listr</strong>
            <span>Dashboard</span>
          </span>
        </Link>
        <nav className="bl-sidebar-nav">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="bl-dashboard-main">{children}</main>
    </div>
  );
}
