import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg sm:rounded-xl border-2 p-4 sm:p-5 md:p-6 [&>svg~*]:pl-7 sm:[&>svg~*]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 sm:[&>svg]:left-5 [&>svg]:top-4 sm:[&>svg]:top-5 [&>svg]:size-5 sm:[&>svg]:size-6 transition-all duration-200 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        destructive:
          "border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-500/50 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/50 [&>svg]:text-green-600 dark:[&>svg]:text-green-500",
        warning:
          "border-amber-500/50 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-500/50 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-500",
        info:
          "border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500/50 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-500",
        church:
          "border-church-accent/50 bg-church-accent/10 text-church-primary dark:border-church-accent/50 dark:text-church-accent [&>svg]:text-church-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    aria-live="polite"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 sm:mb-1.5 text-base sm:text-lg md:text-xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm sm:text-base md:text-lg [&_p]:leading-relaxed opacity-90", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
