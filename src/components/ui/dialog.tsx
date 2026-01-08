"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    fullScreenMobile?: boolean
  }
>(({ className, children, fullScreenMobile = false, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Base positioning and sizing
        "fixed z-50 grid border bg-background shadow-xl duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",

        // Mobile: drawer-style from bottom (default) or full screen
        fullScreenMobile
          ? "inset-0 sm:inset-auto sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]"
          : "inset-x-0 bottom-0 sm:inset-auto sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",

        // Mobile animations (slide up from bottom)
        fullScreenMobile
          ? "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          : "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%] sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%]",

        // Desktop animations
        "sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:fade-in-0 sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95",

        // Width
        "w-full sm:w-full sm:max-w-lg",

        // Height constraints
        fullScreenMobile
          ? "h-full sm:h-auto sm:max-h-[90vh]"
          : "max-h-[85vh] sm:max-h-[90vh]",

        // Rounded corners (none on mobile bottom sheet, rounded on desktop)
        fullScreenMobile
          ? "rounded-none sm:rounded-xl"
          : "rounded-t-2xl sm:rounded-xl",

        // Padding with safe areas
        "p-4 sm:p-5 md:p-6",
        "pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-5 md:pb-6",

        // Gap
        "gap-3 sm:gap-4 md:gap-5",

        // Overflow
        "overflow-y-auto overflow-x-hidden",

        className
      )}
      {...props}
    >
      {/* Mobile drag handle indicator */}
      {!fullScreenMobile && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-muted-foreground/30 rounded-full sm:hidden" aria-hidden="true" />
      )}

      {children}

      <DialogPrimitive.Close className={cn(
        "absolute right-3 top-3 sm:right-4 sm:top-4",
        // Touch-friendly size (minimum 44px)
        "min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0",
        "h-10 w-10 sm:h-8 sm:w-8",
        // Styling
        "flex items-center justify-center",
        "rounded-full",
        "opacity-70 hover:opacity-100",
        "ring-offset-background transition-all",
        "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:pointer-events-none",
        "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
        "z-10 bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm"
      )}>
        <X className="h-5 w-5 sm:h-4 sm:w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1 sm:space-y-1.5 md:space-y-2 text-center sm:text-left",
      // Extra padding on mobile to account for drag handle
      "pt-2 sm:pt-0",
      // Padding right for close button
      "pr-10 sm:pr-8",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Stack on mobile, row on desktop
      "flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3",
      // Sticky footer with safe area
      "pt-3 sm:pt-4",
      "sticky bottom-0 bg-background",
      // Safe area padding already in container
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg sm:text-xl md:text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm sm:text-base text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
