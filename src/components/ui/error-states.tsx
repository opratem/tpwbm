import { AlertTriangle, XCircle, AlertCircle, Wifi, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

// Generic Error State Component
export function ErrorState({
  title,
  message,
  icon,
  action,
  secondaryAction,
  className
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 text-center",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="mb-4 sm:mb-6 text-destructive">
        {icon || <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16" />}
      </div>

      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3">
        {title}
      </h2>

      <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-6 sm:mb-8">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
        {action && (
          action.href ? (
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button onClick={action.onClick} size="lg" className="w-full sm:w-auto">
              {action.label}
            </Button>
          )
        )}

        {secondaryAction && (
          secondaryAction.href ? (
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          ) : (
            <Button onClick={secondaryAction.onClick} variant="outline" size="lg" className="w-full sm:w-auto">
              {secondaryAction.label}
            </Button>
          )
        )}
      </div>
    </div>
  );
}

// 404 Not Found Error
export function NotFoundError() {
  return (
    <ErrorState
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      icon={<AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16" />}
      action={{
        label: "Go to Homepage",
        href: "/"
      }}
      secondaryAction={{
        label: "Go Back",
        onClick: () => window.history.back()
      }}
    />
  );
}

// 500 Server Error
export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Something Went Wrong"
      message="We're experiencing technical difficulties. Please try again later."
      icon={<XCircle className="h-12 w-12 sm:h-16 sm:w-16" />}
      action={{
        label: "Try Again",
        onClick: onRetry || (() => window.location.reload())
      }}
      secondaryAction={{
        label: "Go to Homepage",
        href: "/"
      }}
    />
  );
}

// Network Error
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Problem"
      message="Please check your internet connection and try again."
      icon={<Wifi className="h-12 w-12 sm:h-16 sm:w-16" />}
      action={{
        label: "Retry",
        onClick: onRetry || (() => window.location.reload())
      }}
    />
  );
}

// Permission Error
export function PermissionError() {
  return (
    <ErrorState
      title="Access Denied"
      message="You don't have permission to access this page. Please contact an administrator if you believe this is a mistake."
      icon={<AlertCircle className="h-12 w-12 sm:h-16 sm:w-16" />}
      action={{
        label: "Go to Homepage",
        href: "/"
      }}
      secondaryAction={{
        label: "Contact Support",
        href: "/contact"
      }}
    />
  );
}

// Empty State (not an error, but related)
export function EmptyState({
  title,
  message,
  icon,
  action,
  className
}: {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 sm:mb-6 text-muted-foreground">
          {icon}
        </div>
      )}

      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>

      <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-4 sm:mb-6">
        {message}
      </p>

      {action && (
        action.href ? (
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Button onClick={action.onClick} size="lg" className="w-full sm:w-auto">
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}

// Inline Error Alert
export function InlineError({
  message,
  onDismiss,
  className
}: {
  message: string
  onDismiss?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive",
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm sm:text-base">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-destructive hover:text-destructive/80 transition-colors"
          aria-label="Dismiss error"
        >
          <XCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

// Form Field Error
export function FieldError({ message }: { message: string }) {
  return (
    <p className="text-xs sm:text-sm text-destructive flex items-center gap-1 mt-1">
      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      {message}
    </p>
  );
}
