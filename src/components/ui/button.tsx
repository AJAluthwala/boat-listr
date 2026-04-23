import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  asChild?: boolean;
  children: ReactNode;
};

export default function Button({ variant = "primary", asChild = false, className = "", children, ...props }: ButtonProps) {
  const classes = `bl-button bl-button-${variant} ${className}`.trim();

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement, {
      className: `${classes} ${(children.props as { className?: string }).className ?? ""}`.trim(),
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
