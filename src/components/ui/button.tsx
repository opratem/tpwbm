import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-md text-xs sm:text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-3.5 sm:[&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 min-h-[44px] sm:min-h-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-church-primary to-church-primary-light text-primary-foreground shadow-md hover:shadow-lg hover:from-church-primary-dark hover:to-church-primary transform hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:shadow-lg hover:bg-destructive/90 transform hover:-translate-y-0.5",
        outline:
          "border-2 border-church-primary bg-background shadow-sm hover:bg-church-primary hover:text-white transform hover:-translate-y-0.5 hover:shadow-md",
        secondary:
          "bg-gradient-to-r from-church-accent to-church-secondary text-church-primary shadow-md hover:shadow-lg hover:from-church-secondary hover:to-church-accent transform hover:-translate-y-0.5 font-semibold",
        ghost: "hover:bg-church-primary/10 hover:text-church-primary dark:hover:bg-church-accent/10 dark:hover:text-church-accent",
        link: "text-church-primary underline-offset-4 hover:underline hover:text-church-primary-light dark:text-church-accent dark:hover:text-church-accent",
      },
      size: {
        default: "h-9 px-4 py-2 sm:h-10 sm:px-5 sm:py-2.5 md:h-11 md:px-6 md:py-3",
        sm: "h-8 px-3 py-1.5 sm:h-9 sm:px-4 sm:py-2 text-xs sm:text-sm",
        lg: "h-11 px-6 py-3 sm:h-12 sm:px-8 sm:py-3.5 md:h-13 md:px-10 md:py-4 text-sm sm:text-base md:text-lg font-semibold",
        icon: "h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-label={props["aria-label"] || props.title}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
