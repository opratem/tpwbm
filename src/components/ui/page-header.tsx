import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  subtitle?: string;
  backgroundImage?: string;
  minHeight?: "sm" | "md" | "lg";
  overlay?: "light" | "medium" | "dark";
  blurBackground?: boolean;
  backgroundPosition?: string;
}

const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  ({
    className,
    title,
    description,
    subtitle,
    backgroundImage,
    minHeight = "md",
    overlay = "medium",
    blurBackground = false,
    backgroundPosition = "center",
    ...props
  }, ref) => {
    const heightClasses = {
      sm: "min-h-[25vh] sm:min-h-[30vh]",
      md: "min-h-[30vh] sm:min-h-[35vh] md:min-h-[40vh]",
      lg: "min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh]"
    };

    const overlayClasses = {
      light: "from-black/40 via-black/30 to-black/40",
      medium: "from-black/60 via-black/40 to-black/70",
      dark: "from-black/75 via-black/65 to-black/80"
    };

    return (
      <header
        ref={ref}
        className={cn(
          "relative w-full mobile-section-spacing overflow-hidden",
          heightClasses[minHeight],
          className
        )}
        {...props}
      >
        {/* Background Image */}
        {backgroundImage && (
          <div
            className="absolute inset-0"
            style={{
              filter: blurBackground ? 'blur(8px)' : 'none',
              transform: blurBackground ? 'scale(1.1)' : 'none',
            }}
          >
            <Image
              src={backgroundImage}
              alt={`${title} background`}
              fill
              priority
              className={cn("object-cover", `object-${backgroundPosition}`)}
              style={{ zIndex: -1 }}
            />
          </div>
        )}

        {/* Gradient Overlays */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br",
          backgroundImage
            ? overlayClasses[overlay]
            : "from-church-primary-dark via-church-primary to-church-secondary"
        )} />
        {backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-b from-church-primary/30 via-church-primary-light/20 to-church-primary-dark/40" />
        )}

        <div className="container mobile-container relative z-10 h-full flex items-center justify-center">
          <div className="mobile-space-y-6 text-center w-full max-w-4xl">
            {subtitle && (
              <p className="section-subtitle text-church-accent uppercase tracking-widest animate-in fade-in slide-in-from-top duration-1000 delay-200">
                {subtitle}
              </p>
            )}

            <h1
              className="mobile-text-3xl font-bold tracking-tight text-white drop-shadow-2xl animate-in fade-in slide-in-from-top duration-1000 delay-400"
              style={{
                textShadow: '0 0 30px rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.7)'
              }}
            >
              {title}
            </h1>

            {description && (
              <p
                className="mobile-text-base text-white font-light leading-relaxed drop-shadow-lg max-w-3xl mx-auto px-4 sm:px-0 animate-in fade-in slide-in-from-top duration-1000 delay-600"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.3)'
                }}
              >
                {description}
              </p>
            )}

            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 animate-in fade-in duration-1000 delay-800">
              <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent to-white" />
              <div className="w-2 h-2 bg-white rounded-full" />
              <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-l from-transparent to-white" />
            </div>
          </div>
        </div>
      </header>
    );
  }
);
PageHeader.displayName = "PageHeader";

export { PageHeader };
