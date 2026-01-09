import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, Check } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  success?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  label?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, leftIcon, rightIcon, label, helperText, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || `input-${generatedId}`
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
      <div className="w-full space-y-1.5 sm:space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm sm:text-base font-medium text-foreground"
          >
            {label}
            {props.required && <span className="text-destructive ml-1" aria-label="required">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            className={cn(
              // Base styles
              "flex h-10 sm:h-11 md:h-12 w-full rounded-md border bg-background px-3 sm:px-4 py-2 text-sm sm:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground transition-all duration-200",

              // Placeholder
              "placeholder:text-muted-foreground",

              // Focus states
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-church-primary",

              // Disabled state
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",

              // Error state
              error && "border-destructive focus-visible:ring-destructive text-destructive pr-10",

              // Success state
              success && !error && "border-green-500 focus-visible:ring-green-500 pr-10",

              // Normal state
              !error && !success && "border-input hover:border-church-primary/50",

              // Icon padding
              leftIcon && "pl-9 sm:pl-10",
              rightIcon && !error && !success && "pr-9 sm:pr-10",

              // Mobile-first touch target
              "min-h-[44px] sm:min-h-0",

              // Enable text scrolling on mobile
              "[touch-action:manipulation]",

              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={cn(
              error && errorId,
              helperText && helperId
            )}
            {...props}
          />

          {/* Error icon */}
          {error && (
            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-destructive pointer-events-none">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </div>
          )}

          {/* Success icon */}
          {success && !error && (
            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">
              <Check className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </div>
          )}

          {/* Right icon (only shown when no error/success) */}
          {rightIcon && !error && !success && (
            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={errorId}
            className="text-xs sm:text-sm text-destructive flex items-center gap-1 animate-in slide-in-from-top-1 duration-200"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p
            id={helperId}
            className="text-xs sm:text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
