import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  centered?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  children,
  className = "",
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`${className} ${centered ? "text-center" : ""}`}>
      {subtitle && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-church-accent">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-church-primary dark:text-church-text mb-4">
        {title}
      </h2>
      {description && (
        <p className={`text-lg text-muted-foreground ${centered ? "mx-auto max-w-3xl" : ""}`}>
          {description}
        </p>
      )}
      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
}
