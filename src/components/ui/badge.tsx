import { cn } from "@/lib/ui";

type BadgeVariant =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "published";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-surface-tertiary text-text-secondary",
  accent:
    "bg-accent-muted text-accent",
  success:
    "bg-status-success-muted text-status-success",
  warning:
    "bg-status-warning-muted text-status-warning",
  danger:
    "bg-status-danger-muted text-status-danger",
  published:
    "bg-status-published-muted text-status-published",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
