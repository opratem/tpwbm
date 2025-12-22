"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateBreadcrumbSchema, siteConfig } from "@/lib/seo";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname();
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    if (items) {
      setBreadcrumbItems(items);
    } else {
      // Auto-generate from pathname
      const segments = pathname.split('/').filter(Boolean);
      const generated: BreadcrumbItem[] = segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        const name = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return { name, url: path };
      });

      setBreadcrumbItems(generated);
    }
  }, [pathname, items]);

  // Don't show breadcrumbs on homepage
  if (pathname === '/' || breadcrumbItems.length === 0) {
    return null;
  }

  const allItems = [
    { name: 'Home', url: '/' },
    ...breadcrumbItems
  ];

  // Generate JSON-LD schema
  const schema = generateBreadcrumbSchema(
    allItems.map(item => ({
      name: item.name,
      url: `${siteConfig.url}${item.url}`
    }))
  );

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={cn(
          "bg-muted/30 border-b border-border py-3 sm:py-4",
          className
        )}
      >
        <div className="container mobile-container">
          <ol
            className="flex items-center flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
            {allItems.map((item, index) => {
              const isLast = index === allItems.length - 1;

              return (
                <li
                  key={item.url}
                  className="flex items-center gap-1 sm:gap-2"
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  {index === 0 ? (
                    <Link
                      href={item.url}
                      className="flex items-center gap-1 text-muted-foreground hover:text-church-primary transition-colors min-h-[44px] sm:min-h-0 py-2 sm:py-0"
                      aria-label="Go to homepage"
                      itemProp="item"
                    >
                      <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only" itemProp="name">
                        {item.name}
                      </span>
                      <meta itemProp="position" content={String(index + 1)} />
                    </Link>
                  ) : (
                    <>
                      <ChevronRight
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0"
                        aria-hidden="true"
                      />
                      {isLast ? (
                        <span
                          className="text-foreground font-medium line-clamp-1 py-2 sm:py-0"
                          aria-current="page"
                          itemProp="name"
                        >
                          {item.name}
                          <meta itemProp="position" content={String(index + 1)} />
                        </span>
                      ) : (
                        <Link
                          href={item.url}
                          className="text-muted-foreground hover:text-church-primary transition-colors line-clamp-1 min-h-[44px] sm:min-h-0 py-2 sm:py-0 flex items-center"
                          itemProp="item"
                        >
                          <span itemProp="name">{item.name}</span>
                          <meta itemProp="position" content={String(index + 1)} />
                        </Link>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
