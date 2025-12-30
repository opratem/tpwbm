"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsLoading(false);
    setEmail("");

    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="py-6 sm:py-10 md:py-12 lg:py-14 relative overflow-hidden">
      {/* Background Image with Blur Effect */}
      <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/images/gallery/Church3.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            filter: "blur(4px)",
            transform: "scale(1.05)",
          }}
      />

      {/* Enhanced overlay with church theme colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-church-primary/85 via-church-primary-light/80 to-church-primary-dark/85" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-church-primary/40 to-church-primary-dark/60" />

      <div className="container mobile-container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mobile-content-spacing">
            <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full mb-3 sm:mb-4 shadow-xl">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white drop-shadow-lg" />
            </div>
            <h2 className="mobile-text-2xl font-bold tracking-tight mb-2 sm:mb-3 text-white drop-shadow-lg">
              Stay Connected
            </h2>
            <p className="mobile-text-base text-gray-100 max-w-2xl mx-auto drop-shadow-md">
              Subscribe to our newsletter and receive spiritual insights, event updates, and inspiring messages directly in your inbox.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="mobile-card-spacing pb-2 sm:pb-3">
              <CardTitle className="mobile-text-lg text-gray-900">
                Join Our Family Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent className="mobile-card-spacing pb-3 sm:pb-4">
              {isSubmitted ? (
                <div className="text-center py-4 sm:py-6">
                  <CheckCircle className="h-12 w-12 sm:h-14 sm:w-14 text-green-500 mx-auto mb-3" />
                  <h3 className="mobile-text-lg font-semibold text-green-600 mb-2">Thank You!</h3>
                  <p className="mobile-text-sm text-gray-600">
                    You've been successfully subscribed to our newsletter.
                    We'll send you inspiring content and updates about our church family.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 h-10 sm:h-11 mobile-text-sm border-2 border-gray-200 focus:border-church-accent rounded-xl"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="h-10 sm:h-11 px-4 sm:px-6 bg-gradient-to-r from-church-primary to-church-primary-light hover:from-church-primary-dark hover:to-church-primary text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg mobile-text-sm"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Subscribing...
                        </div>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Subscribe
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-church-accent/10 rounded-xl p-3 border border-church-accent/20">
                    <p className="mobile-text-xs text-church-text">
                      🙏 By subscribing, you'll receive weekly devotionals, prayer requests, event announcements, and spiritual encouragement.
                      We respect your privacy and you can unsubscribe at any time.
                    </p>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Additional Benefits - updated with church theme */}
          <div className="mt-4 sm:mt-6 grid md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="text-center p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-church-accent/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-church-primary" />
              </div>
              <h3 className="font-semibold mobile-text-sm mb-1">Weekly Devotionals</h3>
              <p className="text-gray-600 mobile-text-xs">
                Receive inspiring devotional messages to strengthen your faith journey
              </p>
            </div>

            <div className="text-center p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-church-accent/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-church-primary" />
              </div>
              <h3 className="font-semibold mobile-text-sm mb-1">Event Updates</h3>
              <p className="text-gray-600 mobile-text-xs">
                Stay informed about upcoming services, special events, and church activities
              </p>
            </div>

            <div className="text-center p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-church-accent/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-church-primary" />
              </div>
              <h3 className="font-semibold mobile-text-sm mb-1">Prayer Requests</h3>
              <p className="text-gray-600 mobile-text-xs">
                Join our community in prayer and receive requests for intercession
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
