type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return <section className={`bl-card ${className}`.trim()}>{children}</section>;
}
