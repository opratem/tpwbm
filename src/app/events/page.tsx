"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import Calendar from "@/components/ui/calender";
import Events from "@/components/ui/events";
import type { Event } from "@/types/events";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Heart, ArrowRight, Grid, List, Edit, Settings, Plus } from "lucide-react";
import { images } from "@/lib/images";
import Link from "next/link";
import Image from "next/image";

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"calendar" | "list">("calendar");

  // Check if user is admin
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events?status=published");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = events.filter(event =>
      new Date(event.startDate) > new Date()
  ).slice(0, 3);

  const featuredEvent = upcomingEvents[0];

  return (
      <div className="flex flex-col min-h-screen">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Admin Floating Action Button */}
        {isAdmin && (
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2 sm:gap-3">
              <Button
                  size="lg"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[hsl(218,31%,18%)] hover:bg-[hsl(218,31%,15%)] shadow-xl text-white mobile-touch-target"
                  asChild
              >
                <Link href="/admin/events">
                  <Edit className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="sr-only">Manage Events</span>
                </Link>
              </Button>
              <Button
                  size="lg"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[hsl(45,56%,55%)] hover:bg-[hsl(45,56%,50%)] shadow-xl text-[hsl(218,31%,18%)] mobile-touch-target"
                  asChild
              >
                <Link href="/admin/events">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="sr-only">Create Event</span>
                </Link>
              </Button>
            </div>
        )}

        {/* Admin Panel Bar */}
        {isAdmin && (
            <div className="bg-[hsl(218,31%,18%)] text-white py-3 px-4 text-center sticky top-0 z-40">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">Admin Mode</span>
                </div>
                <Button
                    size="sm"
                    className="bg-[hsl(45,56%,55%)] text-[hsl(218,31%,18%)] hover:bg-[hsl(45,56%,50%)] border-0 font-semibold mobile-touch-target"
                    asChild
                >
                  <Link href="/admin/events">
                    Manage Events
                  </Link>
                </Button>
              </div>
            </div>
        )}

        {/* Hero Section */}
        <PageHeader
          title="Church Events & Activities"
          description="Discover opportunities to connect, grow, and serve together as a community of faith."
          backgroundImage={images.community.community}
          minHeight="md"
          overlay="dark"
          blurBackground={true}
        />

        {/* Featured Event Section */}
        {featuredEvent && (
            <section className="w-full mobile-section-spacing bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
              <div className="container mobile-container">
                <div className="flex flex-col items-center justify-center mobile-content-spacing text-center mb-8 sm:mb-12 md:mb-16">
                  <div className="mobile-space-y-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
                    <h2 className="mobile-text-2xl font-bold tracking-tight">
                      Featured{" "}
                      <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                        Event
                      </span>
                    </h2>
                    <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                    <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 mobile-text-base leading-relaxed px-4 sm:px-0">
                      Don't miss our upcoming featured event - mark your calendar!
                    </p>
                  </div>
                </div>

                <Card className="group overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-gray-800 max-w-4xl mx-auto mobile-card">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 h-56 sm:h-64 md:h-auto overflow-hidden relative">
                      {/* Event Image */}
                      {(featuredEvent.imageUrls && featuredEvent.imageUrls.length > 0) || featuredEvent.imageUrl ? (
                          <div className="relative h-full w-full">
                            <Image
                                src={featuredEvent.imageUrls && featuredEvent.imageUrls.length > 0
                                    ? featuredEvent.imageUrls[0]
                                    : featuredEvent.imageUrl || "/featuredevent.png"}
                                alt={featuredEvent.title}
                                fill
                                className="object-cover"
                                onError={() => {
                                  // This will be handled by Next.js Image component
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-black/20" />
                          </div>
                      ) : (
                          /* Fallback with default featured event image */
                          <div className="relative h-full w-full">
                            <Image
                                src="/featuredevent.png"
                                alt="Featured Event"
                                fill
                                className="object-cover"
                                onError={() => {
                                  // This will be handled by Next.js Image component
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-black/20" />
                          </div>
                      )}

                      {/* Overlay Content */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-[hsl(45,56%,55%)] text-[hsl(218,31%,18%)] px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          FEATURED EVENT
                        </div>
                      </div>

                      {featuredEvent.category === "special_program" && (
                          <div className="absolute top-4 right-4 z-10">
                            <Badge className="bg-[hsl(218,31%,18%)] text-white text-sm px-3 py-1 rounded-full shadow-lg">
                              SPECIAL_PROGRAM
                            </Badge>
                          </div>
                      )}

                      <div className="absolute bottom-4 left-4 z-10">
                        <Badge className="bg-white/90 text-[hsl(218,31%,18%)] text-lg px-4 py-2 shadow-lg">
                          {featuredEvent.category.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="md:w-1/2 p-8 flex flex-col justify-center">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-[hsl(218,31%,18%)]">
                          <CalendarIcon className="h-5 w-5" />
                          <span className="font-semibold">
                        {new Date(featuredEvent.startDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                        </div>
                        <h3 className="mobile-text-lg font-bold">{featuredEvent.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mobile-text-base leading-relaxed">
                          {featuredEvent.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Clock className="h-4 w-4 mr-2 text-[hsl(218,31%,18%)]" />
                            <span>
                          {new Date(featuredEvent.startDate).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })} - {new Date(featuredEvent.endDate).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                        </span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <MapPin className="h-4 w-4 mr-2 text-[hsl(218,31%,18%)]" />
                            <span>{featuredEvent.location}</span>
                          </div>
                          {featuredEvent.requiresRegistration && (
                              <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <Users className="h-4 w-4 mr-2 text-[hsl(218,31%,18%)]" />
                                <span>
                            {featuredEvent.registeredCount} registered
                                  {featuredEvent.capacity && ` of ${featuredEvent.capacity}`}
                          </span>
                              </div>
                          )}
                        </div>
                        <Button className="w-fit bg-[hsl(218,31%,18%)] hover:bg-[hsl(218,31%,15%)] rounded-full px-6">
                          Learn More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
        )}

        {/* Events Calendar Section */}
        <section id="events-calendar" className="w-full py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <h2 className="mobile-text-2xl font-bold tracking-tight">
                Events{" "}
                <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                  Calendar
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
              <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl leading-relaxed">
                Browse all our upcoming events in calendar or list view.
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex justify-center mb-8">
              <div className="flex border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                <Button
                    variant={view === "calendar" ? "default" : "ghost"}
                    onClick={() => setView("calendar")}
                    className="rounded-none flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Calendar View
                </Button>
                <Button
                    variant={view === "list" ? "default" : "ghost"}
                    onClick={() => setView("list")}
                    className="rounded-none flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  List View
                </Button>
              </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(218,31%,18%)]"></div>
                </div>
            ) : (
                <>
                  {view === "calendar" ? (
                      <Calendar
                          events={events}
                          className="max-w-6xl mx-auto"
                      />
                  ) : (
                      <div className="max-w-4xl mx-auto">
                        <Events
                            limit={0}
                            category="all"
                            upcoming={false}
                            showHeader={false}
                            variant="card"
                        />
                      </div>
                  )}
                </>
            )}
          </div>
        </section>

        {/* Quick Events Overview */}
        {upcomingEvents.length > 1 && (
            <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
                  <h2 className="mobile-text-2xl font-bold tracking-tight">
                    Coming Up{" "}
                    <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                      Next
                    </span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {upcomingEvents.slice(1, 3).map((event) => (
                      <Card key={event.id} className="group overflow-hidden flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white dark:bg-gray-800">
                        <div className="h-32 bg-gradient-to-br from-[hsl(218,31%,18%)] to-[hsl(218,31%,25%)] flex items-center justify-center relative overflow-hidden">
                          <div className="text-center text-white relative z-10">
                            <Badge className="bg-white text-gray-900 mb-2 px-3 py-1">
                              {event.category.toUpperCase()}
                            </Badge>
                            <CalendarIcon className="h-8 w-8 mx-auto" />
                          </div>
                          <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                            {new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="mobile-text-lg font-bold">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                            {event.description}
                          </p>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center text-gray-500">
                              <Clock className="h-4 w-4 mr-2 text-[hsl(218,31%,18%)]" />
                              <span>
                          {new Date(event.startDate).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <MapPin className="h-4 w-4 mr-2 text-[hsl(218,31%,18%)]" />
                              <span>{event.location}</span>
                            </div>
                            {event.requiresRegistration && (
                                <div className="flex items-center text-gray-500">
                                  <Users className="h-4 w-4 mr-2 text-[hsl(218,31%,18%)]" />
                                  <span>
                            {event.registeredCount} registered
                                    {event.capacity && ` of ${event.capacity}`}
                          </span>
                                </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              </div>
            </section>
        )}

        {/* Get Involved CTA */}
        <section className="w-full py-16 md:py-24 relative overflow-hidden">
          {/* Background Image with Blur Effect */}
          <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${images.community.community})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                filter: "blur(3px)",
                transform: "scale(1.05)", // Slightly scale to avoid blur edges
              }}
          />

          {/* Enhanced overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(218,31%,25%)]/75 via-[hsl(218,31%,20%)]/60 to-[hsl(218,31%,18%)]/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(218,31%,18%)]/20 to-[hsl(218,31%,15%)]/40" />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center text-white">
              <div className="space-y-4">
                <h2 className="mobile-text-2xl font-bold tracking-tight leading-tight max-w-3xl text-white">
                  Ready to{" "}
                  <span className="text-[hsl(45,56%,55%)] font-bold drop-shadow-lg">
                  Get Involved?
                </span>
                </h2>
                <p className="mx-auto max-w-[600px] mobile-text-lg text-white font-light leading-relaxed drop-shadow-lg">
                  Don't miss out on these amazing opportunities to connect with our community and grow in your faith.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="mobile-text-lg font-semibold px-8 py-4 rounded-full bg-white text-[hsl(218,31%,18%)] hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl" asChild>
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="mobile-text-lg font-semibold px-8 py-4 rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-[hsl(218,31%,18%)] transform hover:scale-105 transition-all duration-200 shadow-xl" asChild>
                  <Link href="/members/login">
                    Member Login
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}
