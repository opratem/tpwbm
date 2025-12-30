import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullscreen?: boolean;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, variant = "spinner", size = "md", text, fullscreen = false, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
      xl: "h-16 w-16"
    };

    const spinnerAnimation = (
      <Loader2 className={cn("animate-spin text-church-primary dark:text-church-accent", sizeClasses[size])} />
    );

    const dotsAnimation = (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className={cn(
          "rounded-full bg-church-primary dark:bg-church-accent animate-bounce",
          size === "sm" && "h-2 w-2",
          size === "md" && "h-3 w-3",
          size === "lg" && "h-4 w-4",
          size === "xl" && "h-5 w-5"
        )} style={{ animationDelay: "0ms" }} />
        <div className={cn(
          "rounded-full bg-church-primary dark:bg-church-accent animate-bounce",
          size === "sm" && "h-2 w-2",
          size === "md" && "h-3 w-3",
          size === "lg" && "h-4 w-4",
          size === "xl" && "h-5 w-5"
        )} style={{ animationDelay: "150ms" }} />
        <div className={cn(
          "rounded-full bg-church-primary dark:bg-church-accent animate-bounce",
          size === "sm" && "h-2 w-2",
          size === "md" && "h-3 w-3",
          size === "lg" && "h-4 w-4",
          size === "xl" && "h-5 w-5"
        )} style={{ animationDelay: "300ms" }} />
      </div>
    );

    const pulseAnimation = (
      <div className={cn(
        "rounded-full bg-church-primary dark:bg-church-accent animate-pulse",
        sizeClasses[size]
      )} />
    );

    const skeletonAnimation = (
      <div className="space-y-3 sm:space-y-4 w-full">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
      </div>
    );

    const renderVariant = () => {
      switch (variant) {
        case "dots":
          return dotsAnimation;
        case "pulse":
          return pulseAnimation;
        case "skeleton":
          return skeletonAnimation;
        default:
          return spinnerAnimation;
      }
    };

    const content = (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-3 sm:gap-4",
          fullscreen && "fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50",
          className
        )}
        role="status"
        aria-live="polite"
        aria-label={text || "Loading"}
        {...props}
      >
        {renderVariant()}
        {text && (
          <p className="mobile-text-sm md:text-base font-medium text-gray-600 dark:text-gray-400">
            {text}
          </p>
        )}
        <span className="sr-only">{text || "Loading..."}</span>
      </div>
    );

    return content;
  }
);
Loading.displayName = "Loading";

export { Loading };
