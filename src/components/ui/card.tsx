import { cn } from "@/lib/ui";
import { type HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border-default bg-surface-secondary p-5",
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";
