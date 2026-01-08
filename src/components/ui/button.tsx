import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  cn(
    // Base layout
    "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-300",
    // Gap between icon and text
    "gap-1.5 sm:gap-2",
    // Rounded
    "rounded-md sm:rounded-lg",
    // Focus styles
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    // Disabled
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    // Icon sizing
    "[&_svg]:pointer-events-none [&_svg]:size-4 sm:[&_svg]:size-5 [&_svg]:shrink-0",
    // Touch feedback
    "active:scale-[0.97]",
    // Minimum touch target for accessibility (44px on mobile)
    "min-h-[44px] sm:min-h-0"
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-gradient-to-r from-church-primary to-church-primary-light text-primary-foreground shadow-md",
          "hover:shadow-lg hover:from-church-primary-dark hover:to-church-primary",
          "hover:-translate-y-0.5"
        ),
        destructive: cn(
          "bg-destructive text-destructive-foreground shadow-md",
          "hover:shadow-lg hover:bg-destructive/90",
          "hover:-translate-y-0.5"
        ),
        outline: cn(
          "border-2 border-church-primary bg-background shadow-sm",
          "hover:bg-church-primary hover:text-white hover:shadow-md",
          "hover:-translate-y-0.5"
        ),
        secondary: cn(
          "bg-gradient-to-r from-church-accent to-church-secondary text-church-primary shadow-md font-semibold",
          "hover:shadow-lg hover:from-church-secondary hover:to-church-accent",
          "hover:-translate-y-0.5"
        ),
        ghost: cn(
          "hover:bg-church-primary/10 hover:text-church-primary",
          "dark:hover:bg-church-accent/10 dark:hover:text-church-accent"
        ),
        link: cn(
          "text-church-primary underline-offset-4 hover:underline hover:text-church-primary-light",
          "dark:text-church-accent dark:hover:text-church-accent",
          "min-h-0" // Links don't need touch target
        ),
      },
      size: {
        default: cn(
          // Mobile-first sizing with consistent touch target
          "h-11 px-4 py-2 text-sm",
          // Tablet and up
          "sm:h-10 sm:px-5 sm:py-2.5 sm:text-sm",
          // Desktop
          "md:h-11 md:px-6 md:py-3"
        ),
        sm: cn(
          // Small but still touch-friendly
          "h-10 px-3 py-2 text-xs",
          "sm:h-9 sm:px-4 sm:py-2 sm:text-sm"
        ),
        lg: cn(
          // Large buttons
          "h-12 px-6 py-3 text-base font-semibold",
          "sm:h-12 sm:px-8 sm:py-3.5 sm:text-base",
          "md:h-14 md:px-10 md:py-4 md:text-lg"
        ),
        icon: cn(
          // Square icon buttons with touch target
          "h-11 w-11",
          "sm:h-10 sm:w-10",
          "md:h-11 md:w-11"
        ),
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "opacity-70 cursor-wait"
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-label={props["aria-label"] || props.title}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="sr-only">Loading</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
