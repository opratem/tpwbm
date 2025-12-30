"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import Events from "@/components/ui/events";
import { getCloudinaryImageUrl, churchImages } from "@/lib/cloudinary-client";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import {
  Radio,
  PlayCircle,
  Calendar,
  Clock,
  Users,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Tv,
  Settings,
  Maximize,
  Volume2,
  Smartphone,
  Play,
  Facebook,
  Youtube
} from "lucide-react";

export default function LiveStreamingPage() {
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState("00:00");

  // Simulate live viewer count changes
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setViewerCount(0);
    }
  }, [isLive]);

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
        <PageHeader
          title="Live Worship & Services"
          description="Join us for live worship services, special events, and connect with our community in real-time."
          backgroundImage={getCloudinaryImageUrl(churchImages.gallery.church1, {
            width: 1920,
            height: 1080,
            crop: 'fill',
            quality: 'auto',
            format: 'auto'
          })}
          minHeight="md"
          overlay="dark"
          blurBackground={true}
        />

        {/* Enhanced Main Live Stream Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-br from-gray-50 to-[hsl(45_56%_55%)]/10 dark:from-gray-900 dark:to-[hsl(218_31%_18%)]/20">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-3 gap-12 items-start">

              {/* Enhanced Main Live Stream Player */}
              <div className="lg:col-span-2 space-y-8">
                <div className="text-center mb-8">
                  <h2 className="mobile-text-2xl font-bold tracking-tight mb-4">
                    Watch{" "}
                    <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                      Live Service
                    </span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto mb-6" />
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Experience worship with us in real-time through our live broadcasts
                  </p>
                </div>

                {/* Modern Live Stream Player with Glassmorphism */}
                <div className="relative group">
                  <div className="aspect-video bg-gradient-to-br from-[hsl(218_31%_18%)] to-[hsl(218_31%_18%)]/80 rounded-3xl overflow-hidden shadow-2xl border border-[hsl(45_56%_55%)]/20 dark:border-[hsl(218_31%_18%)]/30 backdrop-blur-lg">
                    {/* Glassmorphism overlay for offline state */}
                    {!isLive && (
                      <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-[hsl(218_31%_18%)]/30 to-black/30" />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center">
                      {isLive ? (
                        <div className="text-center text-white">
                          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse shadow-2xl shadow-red-500/50">
                            <PlayCircle className="h-12 w-12 ml-1" />
                          </div>
                          <p className="text-3xl font-bold mb-2">LIVE NOW</p>
                          <p className="text-lg text-blue-100">Sunday Celebration Service</p>

                          {/* Live Stream Stats */}
                          <div className="flex items-center justify-center gap-6 mt-6">
                            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{streamDuration}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                              <Users className="h-4 w-4" />
                              <span className="text-sm">{viewerCount} watching</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-white">
                          <div className="w-24 h-24 bg-[hsl(218_31%_18%)]/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl">
                            <Tv className="h-12 w-12" />
                          </div>
                          <p className="text-3xl font-bold mb-2">Stream Offline</p>
                          <p className="text-lg text-[hsl(45_56%_55%)]">Next service: Sunday 8:30 AM</p>
                          <p className="text-sm text-[hsl(45_56%_55%)]/80 mt-2">We'll be back soon!</p>
                        </div>
                      )}
                    </div>

                    {/* Modern Live Indicator */}
                    {isLive && (
                      <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-red-400/30">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-lg shadow-white/50" />
                        LIVE
                      </div>
                    )}

                    {/* Modern Controls Preview */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="secondary" className="backdrop-blur-sm bg-black/30 border-white/20 text-white hover:bg-black/50">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="backdrop-blur-sm bg-black/30 border-white/20 text-white hover:bg-black/50">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button size="sm" variant="secondary" className="backdrop-blur-sm bg-black/30 border-white/20 text-white hover:bg-black/50">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Viewer count with modern styling */}
                    <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/10">
                      <Users className="h-4 w-4" />
                      <span>{isLive ? viewerCount : "0"} watching</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Platform Buttons with Modern Design */}
                <div className="grid md:grid-cols-2 gap-6">
                  <a
                    href="https://web.facebook.com/groups/1873785202754614"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-20 rounded-2xl bg-[hsl(218_31%_18%)] hover:bg-[hsl(218_28%_25%)] text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/10 flex items-center justify-center px-8"
                  >
                    <Facebook className="h-7 w-7 mr-4" />
                    <div className="text-left">
                      <div className="font-bold text-lg text-white">Watch on Facebook</div>
                      <div className="text-sm text-white/90">Join our community group</div>
                    </div>
                  </a>

                  <a
                    href="https://www.youtube.com/@tundeolufemi5339"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-20 rounded-2xl bg-[hsl(45_56%_55%)] hover:bg-[hsl(45_56%_48%)] text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/10 flex items-center justify-center px-8"
                  >
                    <Youtube className="h-7 w-7 mr-4" />
                    <div className="text-left">
                      <div className="font-bold text-lg text-white">Watch on YouTube</div>
                      <div className="text-sm text-white/90">Subscribe for updates</div>
                    </div>
                  </a>
                </div>

                {/* Enhanced Audio Radio Option with Glassmorphism */}
                <Card className="border border-[hsl(45_56%_55%)]/30 dark:border-[hsl(218_31%_18%)]/30 bg-gradient-to-r from-[hsl(45_56%_55%)]/10 to-white/80 dark:from-[hsl(218_31%_18%)]/20 dark:to-gray-800/80 shadow-xl backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[hsl(218_31%_18%)] to-[hsl(218_31%_18%)]/80 rounded-full flex items-center justify-center shadow-lg">
                        <Radio className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[hsl(218_31%_18%)] dark:text-[hsl(45_56%_55%)] mb-1">AKOKO IRIJU Radio</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Listen to Pastor's Stewardship Radio Broadcast</p>
                      </div>
                      <Button
                        className="bg-[hsl(45_56%_55%)] hover:bg-[hsl(45_56%_55%)]/80 text-[hsl(218_31%_18%)] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        size="sm"
                      >
                        <Volume2 className="h-4 w-4 mr-2" />
                        Listen Live
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Service Schedule Sidebar */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center lg:text-left mb-8">
                  Service{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                    Schedule
                  </span>
                </h3>

                <div className="space-y-4">
                  {/* Enhanced Service Cards with Church Theme Colors */}
                  <Card className="border border-[hsl(218_31%_18%)]/20 dark:border-[hsl(218_31%_18%)]/40 hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-lg bg-gradient-to-br from-white/90 to-[hsl(45_56%_55%)]/10 dark:from-[hsl(218_31%_18%)]/80 dark:to-[hsl(218_31%_18%)]/60">
                    <CardHeader className="pb-3 bg-gradient-to-r from-[hsl(218_31%_18%)]/10 to-[hsl(45_56%_55%)]/20 dark:from-[hsl(218_31%_18%)]/90 dark:to-[hsl(218_31%_18%)]/70 rounded-t-lg backdrop-blur-sm">
                      <CardTitle className="text-lg flex items-center gap-3 text-[hsl(218_31%_18%)] dark:text-white">
                        <div className="w-10 h-10 bg-[hsl(218_31%_18%)] rounded-full flex items-center justify-center shadow-lg">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <span>
                          Sunday{" "}
                          <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                            Bible School
                          </span>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">8:30 AM - 9:30 AM (WAT)</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Growing in Faith Together</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-[hsl(218_31%_18%)]/20 dark:border-[hsl(218_31%_18%)]/40 hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-lg bg-gradient-to-br from-white/90 to-[hsl(45_56%_55%)]/10 dark:from-[hsl(218_31%_18%)]/80 dark:to-[hsl(218_31%_18%)]/60">
                    <CardHeader className="pb-3 bg-gradient-to-r from-[hsl(45_56%_55%)]/20 to-[hsl(45_56%_55%)]/30 dark:from-[hsl(218_31%_18%)]/90 dark:to-[hsl(218_31%_18%)]/70 rounded-t-lg backdrop-blur-sm">
                      <CardTitle className="text-lg flex items-center gap-3 text-[hsl(218_31%_18%)] dark:text-white">
                        <div className="w-10 h-10 bg-[hsl(45_56%_55%)] rounded-full flex items-center justify-center shadow-lg">
                          <Calendar className="h-5 w-5 text-[hsl(218_31%_18%)]" />
                        </div>
                        <span>
                          Celebration{" "}
                          <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                            of Jesus
                          </span>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">9:30 AM - 12:00 PM (WAT)</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Sunday Worship Experience</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-[hsl(218_31%_18%)]/20 dark:border-[hsl(218_31%_18%)]/40 hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-lg bg-gradient-to-br from-white/90 to-[hsl(45_56%_55%)]/10 dark:from-[hsl(218_31%_18%)]/80 dark:to-[hsl(218_31%_18%)]/60">
                    <CardHeader className="pb-3 bg-gradient-to-r from-[hsl(218_31%_18%)]/10 to-[hsl(45_56%_55%)]/20 dark:from-[hsl(218_31%_18%)]/90 dark:to-[hsl(218_31%_18%)]/70 rounded-t-lg backdrop-blur-sm">
                      <CardTitle className="text-lg flex items-center gap-3 text-[hsl(218_31%_18%)] dark:text-white">
                        <div className="w-10 h-10 bg-[hsl(218_31%_18%)] rounded-full flex items-center justify-center shadow-lg">
                          <Volume2 className="h-5 w-5 text-white" />
                        </div>
                        <span>
                          Midweek{" "}
                          <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                            Bible Study
                          </span>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Tuesday 5:00 PM - 6:30 PM (WAT)</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Diving Deeper into Scripture</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Connect Card */}
                <Card className="border border-[hsl(45_56%_55%)]/30 dark:border-[hsl(218_31%_18%)]/40 bg-gradient-to-br from-[hsl(45_56%_55%)]/10 to-white/90 dark:from-[hsl(218_31%_18%)]/90 dark:to-[hsl(218_31%_18%)]/70 backdrop-blur-lg shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-[hsl(218_31%_18%)] dark:text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-[hsl(45_56%_55%)] rounded-full flex items-center justify-center shadow-lg">
                        <Smartphone className="h-5 w-5 text-[hsl(218_31%_18%)]" />
                      </div>
                      <span>
                        Connect{" "}
                        <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                          With Us
                        </span>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(45_56%_55%)]/20 dark:bg-[hsl(218_31%_18%)]/50 transition-colors hover:bg-[hsl(45_56%_55%)]/30 dark:hover:bg-[hsl(218_31%_18%)]/60">
                      <ExternalLink className="h-5 w-5 text-[hsl(45_56%_55%)]" />
                      <div>
                        <p className="font-medium text-[hsl(218_31%_18%)] dark:text-white">Website</p>
                        <p className="text-sm text-gray-500 dark:text-gray-300">Visit for updates and resources</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation to Message Archives */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-br from-white to-[hsl(45_56%_55%)]/20 dark:from-[hsl(218_31%_18%)] dark:to-[hsl(218_31%_18%)]/80">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold tracking-tight mb-4">
                Message{" "}
                <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                  Archives
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto mb-6" />
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Access our complete collection of sermons, audio messages, and Facebook content
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Sermons Link */}
              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-[hsl(218_31%_18%)]/30 dark:border-[hsl(218_31%_18%)]/50 bg-gradient-to-br from-white to-[hsl(45_56%_55%)]/20 dark:from-[hsl(218_31%_18%)] dark:to-[hsl(218_31%_18%)]/80 backdrop-blur-lg shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[hsl(218_31%_18%)] to-[hsl(218_31%_18%)]/90 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:shadow-2xl transition-shadow border-2 border-[hsl(218_31%_18%)]/20">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[hsl(218_31%_18%)] dark:text-white mb-3">Video Sermons</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Watch powerful messages and teachings from Pastor 'Tunde Olufemi
                  </p>
                  <Button
                    asChild
                    className="w-full bg-[hsl(218_31%_18%)] hover:bg-[hsl(218_31%_18%)]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-none"
                  >
                    <Link href="/sermons">
                      Browse Sermons
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Audio Messages Link */}
              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-[hsl(45_56%_55%)]/40 dark:border-[hsl(218_31%_18%)]/50 bg-gradient-to-br from-[hsl(45_56%_55%)]/20 to-white dark:from-[hsl(218_31%_18%)] dark:to-[hsl(218_31%_18%)]/80 backdrop-blur-lg shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[hsl(45_56%_55%)] to-[hsl(45_56%_55%)]/90 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:shadow-2xl transition-shadow border-2 border-[hsl(45_56%_55%)]/30">
                    <Volume2 className="h-8 w-8 text-[hsl(218_31%_18%)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[hsl(218_31%_18%)] dark:text-white mb-3">Audio Messages</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Listen to inspiring audio sermons and radio broadcasts
                  </p>
                  <Button
                    asChild
                    className="w-full bg-[hsl(45_56%_55%)] hover:bg-[hsl(45_56%_55%)]/90 text-[hsl(218_31%_18%)] shadow-lg hover:shadow-xl transition-all duration-300 border-none font-semibold"
                  >
                    <Link href="/audio-messages">
                      Listen Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Facebook Community Link */}
              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-[hsl(218_31%_18%)]/30 dark:border-[hsl(218_31%_18%)]/50 bg-gradient-to-br from-white to-[hsl(45_56%_55%)]/20 dark:from-[hsl(218_31%_18%)] dark:to-[hsl(218_31%_18%)]/80 backdrop-blur-lg shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[hsl(218_31%_18%)] to-[hsl(218_31%_18%)]/90 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:shadow-2xl transition-shadow border-2 border-[hsl(218_31%_18%)]/20">
                    <Facebook className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[hsl(218_31%_18%)] dark:text-white mb-3">Facebook Community</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Join our Facebook group for live discussions and community updates
                  </p>
                  <Button
                    asChild
                    className="w-full bg-[hsl(218_31%_18%)] hover:bg-[hsl(218_31%_18%)]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-none"
                  >
                    <a href="https://web.facebook.com/groups/1873785202754614" target="_blank" rel="noopener noreferrer">
                      Join Community
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-br from-white to-[hsl(45_56%_55%)]/15 dark:from-[hsl(218_31%_18%)]/90 dark:to-[hsl(218_31%_18%)]">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold tracking-tight mb-4">
                Upcoming{" "}
                <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                  Events
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto mb-6" />
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Don't miss these special events and services
              </p>
            </div>

            <Events
              limit={6}
              category="all"
              upcoming={true}
              showHeader={false}
              variant="card"
            />
          </div>
        </section>
      </div>
  );
}
