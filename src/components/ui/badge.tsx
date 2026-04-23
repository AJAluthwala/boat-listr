type BadgeProps = {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "info";
  className?: string;
};

export default function Badge({ children, tone = "default", className = "" }: BadgeProps) {
  return <span className={`bl-badge bl-badge-${tone} ${className}`.trim()}>{children}</span>;
}
