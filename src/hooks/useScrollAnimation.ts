'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setIsVisible(true);
            } else {
              setIsVisible(false);
            }
          }
        },
        options
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return { ref, isVisible };
}

export function useStaggeredAnimation(delay = 100) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const target = entry.target as HTMLElement;
            const children = Array.from(target.children);

            for (const [index, child] of children.entries()) {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setVisibleItems(prev => new Set([...prev, index]));
                }, index * delay);
              } else {
                setVisibleItems(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(index);
                  return newSet;
                });
              }
            }
          }
        },
        { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay]);

  return { ref, visibleItems };
}

export function useParallaxEffect(speed = 0.5) {
  const [offsetY, setOffsetY] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const parallax = scrolled * speed;
        setOffsetY(parallax);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offsetY };
}

// Enhanced smooth scroll with easing
export function useSmoothScroll() {
  const scrollToElement = (elementId: string, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const y = element.offsetTop - offset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return { scrollToElement, scrollToTop };
}

// Enhanced scroll progress hook
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = scrollPx / winHeightPx;

      setScrollProgress(Math.min(scrolled * 100, 100));
      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return { scrollProgress, isScrolling };
}

// Section visibility tracking for navigation
export function useSectionObserver() {
  const [activeSection, setActiveSection] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<Map<string, Element>>(new Map());

  const registerSection = (id: string, element: Element) => {
    sectionsRef.current.set(id, element);

    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  const unregisterSection = (id: string) => {
    const element = sectionsRef.current.get(id);
    if (element && observerRef.current) {
      observerRef.current.unobserve(element);
    }
    sectionsRef.current.delete(id);
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setActiveSection(entry.target.id);
            }
          }
        },
        {
          threshold: [0.1, 0.5, 0.9],
          rootMargin: '-20% 0px -20% 0px'
        }
    );

    // Observe existing sections
    for (const element of sectionsRef.current.values()) {
      observerRef.current?.observe(element);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { activeSection, registerSection, unregisterSection };
}
