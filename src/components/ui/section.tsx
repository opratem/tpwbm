import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  container?: boolean;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "white" | "gray" | "primary" | "gradient" | "transparent";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, container = true, spacing = "md", background = "transparent", children, ...props }, ref) => {
    const spacingClasses = {
      none: "",
      sm: "py-6 sm:py-8 md:py-10",
      md: "py-8 sm:py-12 md:py-16 lg:py-20",
      lg: "py-12 sm:py-16 md:py-20 lg:py-24",
      xl: "py-16 sm:py-20 md:py-24 lg:py-32"
    };

    const backgroundClasses = {
      white: "bg-white dark:bg-gray-900",
      gray: "bg-gray-50 dark:bg-gray-900/50",
      primary: "bg-church-primary dark:bg-church-primary-dark text-white",
      gradient: "bg-gradient-to-br from-church-primary via-church-primary-light to-church-secondary text-white",
      transparent: "bg-transparent"
    };

    return (
      <section
        ref={ref}
        className={cn(
          "w-full",
          spacingClasses[spacing],
          backgroundClasses[background],
          className
        )}
        {...props}
      >
        {container ? (
          <div className="container mobile-container mx-auto">
            {children}
          </div>
        ) : (
          children
        )}
      </section>
    );
  }
);
Section.displayName = "Section";

const SectionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    center?: boolean;
  }
>(({ className, center = false, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mobile-space-y-4 mb-8 sm:mb-10 md:mb-12",
      center && "text-center",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SectionHeader.displayName = "SectionHeader";

const SectionTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    gradient?: boolean;
  }
>(({ className, as: Comp = "h2", gradient = false, children, ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn(
      "mobile-text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight",
      gradient && "bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent",
      !gradient && "text-church-primary dark:text-church-accent",
      className
    )}
    {...props}
  >
    {children}
  </Comp>
));
SectionTitle.displayName = "SectionTitle";

const SectionSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "section-subtitle text-church-text-muted dark:text-gray-400",
      className
    )}
    {...props}
  />
));
SectionSubtitle.displayName = "SectionSubtitle";

const SectionDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "mobile-text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl",
      className
    )}
    {...props}
  />
));
SectionDescription.displayName = "SectionDescription";

export {
  Section,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  SectionDescription
};
