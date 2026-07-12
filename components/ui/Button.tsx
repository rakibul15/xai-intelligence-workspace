import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium rounded-[10px] transition-all duration-200 [transition-timing-function:var(--ease-out-expo)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-base hover:bg-fg-mid shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
  secondary:
    "bg-transparent text-fg border border-line-hi hover:bg-surface hover:border-fg-mute",
  ghost:
    "bg-transparent text-fg-mid hover:text-fg hover:bg-surface",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
