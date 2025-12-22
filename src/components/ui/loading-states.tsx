import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Spinner Loading Component
export function LoadingSpinner({
  size = "default",
  className
}: {
  size?: "sm" | "default" | "lg" | "xl"
  className?: string
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  return (
    <Loader2
      className={cn(
        "animate-spin text-church-primary",
        sizeClasses[size],
        className
      )}
      aria-label="Loading"
    />
  );
}

// Full Page Loading
export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-4 p-4"
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="xl" />
      <p className="text-sm sm:text-base text-muted-foreground">{message}</p>
    </div>
  );
}

// Card Skeleton
export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 animate-pulse"
          aria-hidden="true"
        >
          <div className="h-32 sm:h-40 md:h-48 bg-gray-200 dark:bg-gray-700 rounded-md" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
      ))}
    </>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2 sm:space-y-3 animate-pulse" aria-hidden="true">
      {/* Header */}
      <div className="flex gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 sm:gap-4 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-3 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Form Skeleton
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse" aria-hidden="true">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-10 sm:h-11 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
      <div className="h-10 sm:h-11 bg-church-primary/20 rounded w-full" />
    </div>
  );
}

// Text Skeleton
export function TextSkeleton({
  lines = 3,
  className
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-2 animate-pulse", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

// Avatar Skeleton
export function AvatarSkeleton() {
  return (
    <div
      className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
      aria-hidden="true"
    />
  );
}

// Grid Skeleton
export function GridSkeleton({
  count = 6,
  columns = 3
}: {
  count?: number
  columns?: number
}) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      )}
      aria-hidden="true"
    >
      <CardSkeleton count={count} />
    </div>
  );
}

// Progress Bar
export function ProgressBar({
  progress,
  showPercentage = true,
  className
}: {
  progress: number
  showPercentage?: boolean
  className?: string
}) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full space-y-2", className)}>
      {showPercentage && (
        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className="h-2 sm:h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-church-primary to-church-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

// Dots Loading
export function DotsLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-1", className)} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 bg-church-primary rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// Pulse Loading (for images)
export function PulseLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse",
        className
      )}
      aria-hidden="true"
    />
  );
}
