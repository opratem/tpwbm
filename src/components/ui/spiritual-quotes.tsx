"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, ChevronLeft, ChevronRight, Heart, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

const spiritualQuotes = [
  {
    text: "Faith is not about everything going right; faith is about being strong when things go wrong.",
    author: "Pastor Tunde Olufemi",
    category: "Faith"
  },
  {
    text: "God's grace is sufficient for every challenge you face today. Trust in His perfect timing.",
    author: "Pastor Esther Olufemi",
    category: "Grace"
  },
  {
    text: "Prayer is not just asking God for things; it's aligning your heart with His will.",
    author: "Pastor Tunde Olufemi",
    category: "Prayer"
  },
  {
    text: "In every season of life, remember that God is writing a beautiful story through your circumstances.",
    author: "Pastor Esther Olufemi",
    category: "Hope"
  },
  {
    text: "True worship begins when we surrender our will to God's perfect plan for our lives.",
    author: "Pastor Tunde Olufemi",
    category: "Worship"
  },
  {
    text: "God's love for you is not based on your performance but on His unchanging character.",
    author: "Pastor Esther Olufemi",
    category: "Love"
  }
];

export function SpiritualQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Auto-advance quotes every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % spiritualQuotes.length);
      setIsLiked(false);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % spiritualQuotes.length);
    setIsLiked(false);
  };

  const prevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + spiritualQuotes.length) % spiritualQuotes.length);
    setIsLiked(false);
  };

  const quote = spiritualQuotes[currentQuote];

  return (
      <section className="w-full mobile-section-spacing bg-gradient-to-br from-church-surface via-church-surface-hover to-gray-50 dark:from-church-primary/20 dark:via-church-primary-light/20 dark:to-church-secondary/20">
        <div className="container mobile-container">
          <div className="text-center mobile-content-spacing">
            <h2 className="mobile-text-2xl font-bold tracking-tight mb-2 sm:mb-3">
              Words of{" "}<span className="bg-gradient-to-r from-church-primary to-church-accent bg-clip-text text-transparent">Inspiration</span>
            </h2>
            <div className="w-20 sm:w-24 md:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-church-primary to-church-accent rounded-full mx-auto mb-4 sm:mb-6" />
            <p className="mobile-text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Daily spiritual insights and wisdom for your faith journey
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="mobile-card-spacing">
                <div className="text-center">
                  {/* Quote Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-church-accent/20 to-church-accent/30 dark:from-church-accent/10 dark:to-church-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8">
                    <Quote className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-church-primary dark:text-church-accent" />
                  </div>

                  {/* Quote Text */}
                  <blockquote className="mobile-text-lg font-light text-gray-800 dark:text-gray-200 leading-relaxed mb-6 sm:mb-8 min-h-[80px] sm:min-h-[100px] flex items-center justify-center">
                  <span className="animate-in fade-in-50 duration-700">
                    "{quote.text}"
                  </span>
                  </blockquote>

                  {/* Author & Category */}
                  <div className="mobile-space-y-3 mb-6 sm:mb-8">
                    <p className="mobile-text-base font-semibold text-gray-900 dark:text-white">
                      — {quote.author}
                    </p>
                    <div className="inline-block">
                    <span className="bg-gradient-to-r from-church-accent/20 to-church-accent/30 dark:from-church-accent/10 dark:to-church-accent/20 text-church-primary dark:text-church-accent px-3 py-1.5 rounded-full mobile-text-sm font-medium">
                      {quote.category}
                    </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4 sm:gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevQuote}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-church-accent/20 dark:hover:bg-church-accent/10"
                    >
                      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsLiked(!isLiked)}
                          className={`rounded-full mobile-text-sm ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                      >
                        <Heart className={`h-4 w-4 mr-1.5 sm:mr-2 ${isLiked ? 'fill-current' : ''}`} />
                        {isLiked ? 'Loved' : 'Love'}
                      </Button>

                      <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full text-gray-500 hover:text-church-primary mobile-text-sm"
                      >
                        <Share className="h-4 w-4 mr-1.5 sm:mr-2" />
                        Share
                      </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextQuote}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-church-accent/20 dark:hover:bg-church-accent/10"
                    >
                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                  </div>

                  {/* Progress Indicators */}
                  <div className="flex justify-center gap-2 mt-6 sm:mt-8">
                    {spiritualQuotes.map((quote, index) => (
                        <button
                            key={`quote-${quote.text.slice(0, 20)}`}
                            onClick={() => {
                              setCurrentQuote(index);
                              setIsLiked(false);
                            }}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                                index === currentQuote
                                    ? 'bg-gradient-to-r from-church-primary to-church-accent scale-125'
                                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                            }`}
                        />
                    ))}
                  </div>
                </div>
              </CardContent>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-church-accent/20 to-church-accent/30 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-church-primary/20 to-church-accent/20 rounded-full blur-xl" />
            </Card>
          </div>
        </div>
      </section>
  );
}
