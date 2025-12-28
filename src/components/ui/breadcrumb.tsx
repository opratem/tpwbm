'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema } from '@/lib/seo';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // Add home to the beginning
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    ...items,
  ];

  // Generate schema
  const schema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumb UI */}
      <nav
        aria-label="Breadcrumb"
        className={`py-3 px-4 bg-gray-50 border-b border-gray-200 ${className}`}
      >
        <ol className="flex items-center space-x-2 text-sm max-w-7xl mx-auto">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isHome = index === 0;

            return (
              <li key={item.url} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                )}
                {isLast ? (
                  <span className="text-gray-700 font-medium" aria-current="page">
                    {isHome ? <Home className="w-4 h-4" /> : item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                  >
                    {isHome ? <Home className="w-4 h-4" /> : item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

// Helper function to generate breadcrumbs from pathname
export function getBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  paths.forEach((path, index) => {
    const url = '/' + paths.slice(0, index + 1).join('/');
    const name = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({ name, url });
  });

  return breadcrumbs;
}
