"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  cn(
    "fixed z-50 bg-background shadow-xl transition ease-in-out",
    "data-[state=closed]:duration-300 data-[state=open]:duration-500",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    // Base padding
    "p-4 sm:p-5 md:p-6",
    // Gap between elements
    "gap-3 sm:gap-4 md:gap-5"
  ),
  {
    variants: {
      side: {
        top: cn(
          "inset-x-0 top-0 border-b",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          // Safe area for notched devices
          "pt-[calc(1rem+env(safe-area-inset-top))]",
          "px-[calc(1rem+env(safe-area-inset-left))]"
        ),
        bottom: cn(
          "inset-x-0 bottom-0 border-t rounded-t-2xl",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          // Safe area for notched devices (home indicator)
          "pb-[calc(1rem+env(safe-area-inset-bottom))]",
          "px-[calc(1rem+env(safe-area-inset-left))]",
          // Max height to prevent full screen takeover
          "max-h-[90vh]"
        ),
        left: cn(
          "inset-y-0 left-0 h-full border-r",
          "w-[85%] sm:w-3/4 sm:max-w-sm md:max-w-md",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          // Safe area for notched devices
          "pt-[calc(1rem+env(safe-area-inset-top))]",
          "pb-[calc(1rem+env(safe-area-inset-bottom))]",
          "pl-[calc(1rem+env(safe-area-inset-left))]"
        ),
        right: cn(
          "inset-y-0 right-0 h-full border-l",
          "w-[85%] sm:w-3/4 sm:max-w-sm md:max-w-md",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          // Safe area for notched devices
          "pt-[calc(1rem+env(safe-area-inset-top))]",
          "pb-[calc(1rem+env(safe-area-inset-bottom))]",
          "pr-[calc(1rem+env(safe-area-inset-right))]"
        ),
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), "overflow-y-auto", className)}
      {...props}
    >
      {/* Drag handle for bottom sheet */}
      {side === "bottom" && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-muted-foreground/30 rounded-full" aria-hidden="true" />
      )}

      <SheetPrimitive.Close className={cn(
        "absolute",
        // Position based on side
        side === "left" ? "right-3 top-3 sm:right-4 sm:top-4" : "right-3 top-3 sm:right-4 sm:top-4",
        // For bottom sheet, account for drag handle
        side === "bottom" && "top-6",
        // Touch-friendly size (minimum 44px)
        "min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0",
        "h-10 w-10 sm:h-8 sm:w-8",
        // Styling
        "flex items-center justify-center",
        "rounded-full",
        "opacity-70 hover:opacity-100",
        "ring-offset-background transition-opacity",
        "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:pointer-events-none",
        "data-[state=open]:bg-secondary"
      )}>
        <X className="h-5 w-5 sm:h-4 sm:w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>

      {/* Content wrapper with padding for close button */}
      <div className={cn(
        "flex flex-col h-full",
        side === "bottom" && "pt-4" // Extra padding for drag handle
      )}>
        {children}
      </div>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 sm:space-y-2 md:space-y-2.5 text-center sm:text-left",
      // Padding for close button
      "pr-12 sm:pr-10",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3",
      "mt-auto pt-4",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg sm:text-xl md:text-2xl font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm sm:text-base text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
