import * as React from "react"

import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  compact?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, compact = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base styles
      "bg-card text-card-foreground shadow-md transition-all duration-300",
      // Border
      "border border-gray-200 dark:border-gray-700",
      // Rounded corners - less on mobile for more content space
      "rounded-lg sm:rounded-xl md:rounded-2xl",
      // Interactive styles
      interactive && [
        "hover:shadow-xl hover:-translate-y-1 cursor-pointer hover:border-church-accent/30",
        // Touch feedback
        "active:scale-[0.98] active:shadow-lg",
        // Focus for keyboard navigation
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-accent focus-visible:ring-offset-2"
      ],
      // Compact mode for mobile lists
      compact && "shadow-sm hover:shadow-md",
      className
    )}
    role={interactive ? "button" : undefined}
    tabIndex={interactive ? 0 : undefined}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { compact?: boolean }
>(({ className, compact = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col",
      compact
        ? "space-y-1 p-3 sm:p-4"
        : "space-y-1.5 sm:space-y-2 p-4 sm:p-5 md:p-6",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { compact?: boolean }
>(({ className, compact = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-bold leading-tight tracking-tight text-church-primary dark:text-church-accent",
      compact
        ? "text-base sm:text-lg"
        : "text-lg sm:text-xl md:text-2xl",
      className
    )}
    role="heading"
    aria-level={3}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { compact?: boolean }
>(({ className, compact = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-muted-foreground leading-relaxed",
      compact
        ? "text-sm"
        : "text-sm sm:text-base md:text-lg",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { compact?: boolean }
>(({ className, compact = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "pt-0",
      compact
        ? "p-3 sm:p-4"
        : "p-4 sm:p-5 md:p-6",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { compact?: boolean }
>(({ className, compact = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center pt-0",
      compact
        ? "gap-2 p-3 sm:p-4"
        : "gap-2 sm:gap-3 p-4 sm:p-5 md:p-6",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Compact card variant for mobile-first lists
const CardCompact = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn("rounded-lg shadow-sm", className)}
      interactive={interactive}
      compact
      {...props}
    />
  )
)
CardCompact.displayName = "CardCompact"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardCompact }
