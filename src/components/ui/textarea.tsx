import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  helperText?: string
  showCharCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, showCharCount, id, maxLength, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(0)
    const textareaId = id || `textarea-${React.useId()}`
    const errorId = `${textareaId}-error`
    const helperId = `${textareaId}-helper`
    const charCountId = `${textareaId}-charcount`

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCharCount) {
        setCharCount(e.target.value.length)
      }
      props.onChange?.(e)
    }

    return (
      <div className="w-full space-y-1.5 sm:space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm sm:text-base font-medium text-foreground"
          >
            {label}
            {props.required && <span className="text-destructive ml-1" aria-label="required">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            id={textareaId}
            className={cn(
              // Base styles
              "flex min-h-[80px] sm:min-h-[100px] w-full rounded-md border bg-background px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ring-offset-background transition-all duration-200 resize-y",

              // Placeholder
              "placeholder:text-muted-foreground",

              // Focus states
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-church-primary",

              // Disabled state
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted disabled:resize-none",

              // Error state
              error && "border-destructive focus-visible:ring-destructive",

              // Normal state
              !error && "border-input hover:border-church-primary/50",

              // Character count padding
              showCharCount && maxLength && "pb-8 sm:pb-10",

              className
            )}
            ref={ref}
            maxLength={maxLength}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={cn(
              error && errorId,
              helperText && helperId,
              showCharCount && maxLength && charCountId
            )}
            onChange={handleChange}
            {...props}
          />

          {/* Character count */}
          {showCharCount && maxLength && (
            <div
              id={charCountId}
              className={cn(
                "absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-xs sm:text-sm pointer-events-none",
                charCount > maxLength * 0.9 ? "text-destructive" : "text-muted-foreground"
              )}
              aria-live="polite"
            >
              {charCount}/{maxLength}
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
Textarea.displayName = "Textarea"

export { Textarea }
