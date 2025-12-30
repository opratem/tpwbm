'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useSmoothScroll, useSectionObserver } from '@/hooks/useScrollAnimation';

interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SmoothNavigationProps {
  items: NavigationItem[];
  className?: string;
  position?: 'left' | 'right';
  offset?: number;
}

export function SmoothNavigation({
                                   items,
                                   className,
                                   position = 'right',
                                   offset = 80
                                 }: SmoothNavigationProps) {
  const { scrollToElement } = useSmoothScroll();
  const { activeSection, registerSection, unregisterSection } = useSectionObserver();

  React.useEffect(() => {
    // Register all sections on mount
    for (const item of items) {
      const element = document.getElementById(item.id);
      if (element) {
        registerSection(item.id, element);
      }
    }

    return () => {
      // Cleanup on unmount
      for (const item of items) {
        unregisterSection(item.id);
      }
    };
  }, [items, registerSection, unregisterSection]);

  const handleNavClick = (sectionId: string) => {
    scrollToElement(sectionId, offset);
  };

  return (
      <nav
          className={cn(
              'fixed top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-2',
              position === 'left' ? 'left-6' : 'right-6',
              className
          )}
      >
        {items.map((item) => (
            <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                    'group relative p-3 rounded-full transition-all duration-300 hover:scale-110',
                    'bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg',
                    'hover:bg-white/20 hover:shadow-xl',
                    activeSection === item.id
                        ? 'bg-church-primary text-white shadow-xl scale-110'
                        : 'text-gray-600 dark:text-gray-300'
                )}
                aria-label={`Navigate to ${item.label}`}
            >
              {item.icon || (
                  <div className={cn(
                      'w-3 h-3 rounded-full transition-all duration-300',
                      activeSection === item.id ? 'bg-white' : 'bg-current'
                  )} />
              )}

              {/* Tooltip */}
              <div className={cn(
                  'absolute top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-lg',
                  'bg-gray-900 text-white text-sm font-medium',
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                  'pointer-events-none whitespace-nowrap',
                  position === 'left' ? 'left-full ml-3' : 'right-full mr-3'
              )}>
                {item.label}
              </div>
            </button>
        ))}
      </nav>
  );
}

// Section wrapper component that auto-registers with navigation
export function NavigationSection({
                                    id,
                                    children,
                                    className
                                  }: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
      <section
          id={id}
          className={cn('scroll-snap-section', className)}
      >
        {children}
      </section>
  );
}

// Smooth scroll link component
export function SmoothScrollLink({
                                   to,
                                   children,
                                   className,
                                   offset = 80
                                 }: {
  to: string;
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  const { scrollToElement } = useSmoothScroll();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToElement(to, offset);
  };

  return (
      <a
          href={`#${to}`}
          onClick={handleClick}
          className={cn('cursor-pointer transition-colors duration-200', className)}
      >
        {children}
      </a>
  );
}

// Breadcrumb navigation with smooth scrolling
export function SectionBreadcrumbs({
                                     sections,
                                     separator = '/',
                                     className
                                   }: {
  sections: NavigationItem[];
  separator?: string;
  className?: string;
}) {
  const { activeSection } = useSectionObserver();
  const { scrollToElement } = useSmoothScroll();

  const currentIndex = sections.findIndex(section => section.id === activeSection);
  const visibleSections = sections.slice(0, currentIndex + 1);

  return (
      <nav className={cn('flex items-center space-x-2 text-sm', className)}>
        {visibleSections.map((section, index) => (
            <React.Fragment key={section.id}>
              <button
                  onClick={() => scrollToElement(section.id, 80)}
                  className={cn(
                      'hover:text-church-primary transition-colors duration-200',
                      index === visibleSections.length - 1
                          ? 'text-church-primary font-medium'
                          : 'text-gray-500 hover:text-gray-700'
                  )}
              >
                {section.label}
              </button>
              {index < visibleSections.length - 1 && (
                  <span className="text-gray-400">{separator}</span>
              )}
            </React.Fragment>
        ))}
      </nav>
  );
}
