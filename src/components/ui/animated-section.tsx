'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollAnimation, useStaggeredAnimation, useParallaxEffect } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    animation?: 'fadeUp' | 'slideLeft' | 'slideRight' | 'stagger';
    delay?: number;
    threshold?: number;
}

export function AnimatedSection({
                                    children,
                                    className,
                                    animation = 'fadeUp',
                                    delay = 0,
                                    threshold = 0.1,
                                }: AnimatedSectionProps) {
    const { ref, isVisible } = useScrollAnimation({ threshold });

    const getAnimationClass = () => {
        switch (animation) {
            case 'slideLeft':
                return isVisible ? 'slide-in-left visible' : 'slide-in-left';
            case 'slideRight':
                return isVisible ? 'slide-in-right visible' : 'slide-in-right';
            case 'fadeUp':
            default:
                return isVisible ? 'section-reveal visible' : 'section-reveal';
        }
    };

    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={cn(getAnimationClass(), className)}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

interface StaggeredContainerProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function StaggeredContainer({
                                       children,
                                       className,
                                       delay = 150,
                                   }: StaggeredContainerProps) {
    const { ref, visibleItems } = useStaggeredAnimation(delay);

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>} className={cn(className)}>
            {React.Children.map(children, (child, index) => (
                <div
                    key={index}
                    className={cn(
                        'transition-all duration-700 ease-out',
                        visibleItems.has(index)
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-8 scale-95'
                    )}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}

// Enhanced staggered container with animation types
export function AdvancedStaggeredContainer({
                                               children,
                                               className,
                                               delay = 150,
                                               animation = 'fadeUp',
                                               duration = 700,
                                           }: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    animation?: 'fadeUp' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
    duration?: number;
}) {
    const { ref, visibleItems } = useStaggeredAnimation(delay);

    const getAnimationClasses = (index: number, isVisible: boolean) => {
        const baseClasses = `transition-all ease-out`;
        const durationClass = `duration-${duration}`;

        switch (animation) {
            case 'slideLeft':
                return cn(
                    baseClasses,
                    durationClass,
                    isVisible
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-8'
                );
            case 'slideRight':
                return cn(
                    baseClasses,
                    durationClass,
                    isVisible
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-8'
                );
            case 'scale':
                return cn(
                    baseClasses,
                    durationClass,
                    isVisible
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-75'
                );
            case 'rotate':
                return cn(
                    baseClasses,
                    durationClass,
                    isVisible
                        ? 'opacity-100 rotate-0'
                        : 'opacity-0 -rotate-12'
                );
            case 'fadeUp':
            default:
                return cn(
                    baseClasses,
                    durationClass,
                    isVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                );
        }
    };

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>} className={cn(className)}>
            {React.Children.map(children, (child, index) => (
                <div
                    key={index}
                    className={getAnimationClasses(index, visibleItems.has(index))}
                    style={{ transitionDelay: `${index * delay}ms` }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}

// Floating action component for scroll to top
export function ScrollToTop() {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={cn(
                'fixed bottom-8 right-8 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
            )}
            aria-label="Scroll to top"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
            </svg>
        </button>
    );
}

// Card reveal animation component
export function CardReveal({
                               children,
                               className,
                               delay = 0
                           }: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={cn(
                'transition-all duration-700 ease-out',
                isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95',
                className
            )}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

// Text reveal animation with typing effect
export function TextReveal({
                               text,
                               className,
                               speed = 50
                           }: {
    text: string;
    className?: string;
    speed?: number;
}) {
    const [displayText, setDisplayText] = React.useState('');
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

    React.useEffect(() => {
        if (isVisible) {
            let index = 0;
            const timer = setInterval(() => {
                setDisplayText(text.slice(0, index + 1));
                index++;
                if (index >= text.length) {
                    clearInterval(timer);
                }
            }, speed);

            return () => clearInterval(timer);
        }
    }, [isVisible, text, speed]);

    return (
        <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {displayText}
            {isVisible && displayText.length < text.length && (
                <span className="animate-pulse">|</span>
            )}
    </span>
    );
}

// Parallax scroll component
export function ParallaxSection({
                                    children,
                                    speed = 0.5,
                                    className
                                }: {
    children: React.ReactNode;
    speed?: number;
    className?: string;
}) {
    const { ref, offsetY } = useParallaxEffect(speed);

    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={cn('relative', className)}
            style={{ transform: `translateY(${offsetY}px)` }}
        >
            {children}
        </div>
    );
}

// Enhanced Grid Animation Container
export function GridRevealContainer({
                                        children,
                                        className,
                                        delay = 100,
                                        animation = 'fadeUpStagger',
                                        columns = 'auto'
                                    }: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    animation?: 'fadeUpStagger' | 'slideInStagger' | 'scaleStagger' | 'rotateStagger';
    columns?: number | 'auto';
}) {
    const { ref, visibleItems } = useStaggeredAnimation(delay);

    const getAnimationClasses = (index: number, isVisible: boolean) => {
        const baseClasses = 'transition-all duration-700 ease-out';

        switch (animation) {
            case 'slideInStagger':
                return cn(
                    baseClasses,
                    isVisible
                        ? 'opacity-100 translate-x-0 translate-y-0'
                        : 'opacity-0 -translate-x-8 translate-y-4'
                );
            case 'scaleStagger':
                return cn(
                    baseClasses,
                    isVisible
                        ? 'opacity-100 scale-100 rotate-0'
                        : 'opacity-0 scale-75 rotate-2'
                );
            case 'rotateStagger':
                return cn(
                    baseClasses,
                    isVisible
                        ? 'opacity-100 rotate-0 scale-100'
                        : 'opacity-0 -rotate-6 scale-90'
                );
            case 'fadeUpStagger':
            default:
                return cn(
                    baseClasses,
                    isVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-12 scale-95'
                );
        }
    };

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>} className={cn(className)}>
            {React.Children.map(children, (child, index) => (
                <div
                    key={index}
                    className={getAnimationClasses(index, visibleItems.has(index))}
                    style={{
                        transitionDelay: `${index * delay}ms`,
                        // Add randomness for more organic feel
                        transitionDuration: `${700 + (index % 3) * 100}ms`
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}

// Cascading Text Animation
export function CascadingText({
                                  text,
                                  className,
                                  delay = 50,
                                  animation = 'slideUp'
                              }: {
    text: string;
    className?: string;
    delay?: number;
    animation?: 'slideUp' | 'slideRight' | 'fadeIn' | 'elastic';
}) {
    const [visibleChars, setVisibleChars] = React.useState(new Set<number>());
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
    const words = text.split(' ');

    React.useEffect(() => {
        if (isVisible) {
            words.forEach((word, wordIndex) => {
                const wordDelay = wordIndex * delay * 2;
                setTimeout(() => {
                    for (let i = 0; i < word.length; i++) {
                        setTimeout(() => {
                            setVisibleChars(prev => new Set([...prev, wordIndex * 100 + i]));
                        }, i * delay);
                    }
                }, wordDelay);
            });
        }
    }, [isVisible, words, delay]);

    const getCharAnimation = (wordIndex: number, charIndex: number, isVisible: boolean) => {
        const key = wordIndex * 100 + charIndex;
        const visible = visibleChars.has(key);

        switch (animation) {
            case 'slideRight':
                return cn(
                    'inline-block transition-all duration-300 ease-out',
                    visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                );
            case 'fadeIn':
                return cn(
                    'inline-block transition-all duration-500 ease-out',
                    visible ? 'opacity-100' : 'opacity-0'
                );
            case 'elastic':
                return cn(
                    'inline-block transition-all duration-500 ease-elastic',
                    visible ? 'opacity-100 scale-100' : 'opacity-0 scale-150'
                );
            case 'slideUp':
            default:
                return cn(
                    'inline-block transition-all duration-400 ease-out',
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                );
        }
    };

    return (
        <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block">
          {word.split('').map((char, charIndex) => (
              <span
                  key={charIndex}
                  className={getCharAnimation(wordIndex, charIndex, true)}
                  style={{
                      transitionDelay: `${(wordIndex * word.length + charIndex) * delay}ms`
                  }}
              >
              {char}
            </span>
          ))}
              {wordIndex < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
    );
}

// Progressive Image Reveal
export function ImageReveal({
                                src,
                                alt,
                                className,
                                containerClassName,
                                animation = 'scaleUp'
                            }: {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
    animation?: 'scaleUp' | 'slideUp' | 'fadeIn' | 'clipPath';
}) {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

    const getImageAnimation = () => {
        switch (animation) {
            case 'slideUp':
                return cn(
                    'transition-all duration-1000 ease-out',
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                );
            case 'fadeIn':
                return cn(
                    'transition-all duration-800 ease-out',
                    isVisible ? 'opacity-100' : 'opacity-0'
                );
            case 'clipPath':
                return cn(
                    'transition-all duration-1000 ease-out',
                    isVisible
                        ? 'opacity-100 [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]'
                        : 'opacity-80 [clip-path:polygon(0%_100%,100%_100%,100%_100%,0%_100%)]'
                );
            case 'scaleUp':
            default:
                return cn(
                    'transition-all duration-800 ease-out',
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                );
        }
    };

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>} className={cn('overflow-hidden', containerClassName)}>
            <img
                src={src}
                alt={alt}
                className={cn(getImageAnimation(), className)}
            />
        </div>
    );
}

// Number Counter Animation
export function CounterAnimation({
                                     end,
                                     duration = 2000,
                                     prefix = '',
                                     suffix = '',
                                     className
                                 }: {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}) {
    const [count, setCount] = React.useState(0);
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.5 });

    React.useEffect(() => {
        if (isVisible) {
            let startTime: number;
            const startCount = 0;

            const updateCount = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const percentage = Math.min(progress / duration, 1);

                // Easing function for smooth animation
                const easeOut = 1 - Math.pow(1 - percentage, 3);
                setCount(Math.floor(easeOut * end));

                if (percentage < 1) {
                    requestAnimationFrame(updateCount);
                }
            };

            requestAnimationFrame(updateCount);
        }
    }, [isVisible, end, duration]);

    return (
        <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
    );
}

// Multi-layer Parallax Container
export function MultiLayerParallax({
                                       children,
                                       className,
                                       layers = 3
                                   }: {
    children: React.ReactNode[];
    className?: string;
    layers?: number;
}) {
    const refs = React.useRef<(HTMLDivElement | null)[]>([]);
    const [offsets, setOffsets] = React.useState<number[]>([]);

    React.useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const newOffsets = refs.current.map((ref, index) => {
                if (!ref) return 0;
                const rect = ref.getBoundingClientRect();
                const speed = 0.1 + (index * 0.1); // Different speeds for each layer
                return scrolled * speed;
            });
            setOffsets(newOffsets);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={cn('relative', className)}>
            {React.Children.map(children, (child, index) => (
                <div
                    key={index}
                    ref={el => { refs.current[index] = el; }}
                    className="absolute inset-0"
                    style={{
                        transform: `translateY(${offsets[index] || 0}px)`,
                        zIndex: layers - index
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}

// Default export
export default AnimatedSection;
