"use client";

import { AudioMessages } from "@/components/ui/audio-messages";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Music, PlayCircle, Download, ExternalLink, Clock } from "lucide-react";

export default function AudioMessagesPage() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
        <PageHeader
          title="Audio Messages & Teachings"
          description="Listen to inspiring sermons and teachings anytime, anywhere. Download and share God's word with others."
          backgroundImage="/images/background/sermon_library_background.jpg"
          minHeight="sm"
          overlay="medium"
          blurBackground={true}
        />

        {/* Audio Messages Component */}
        <AudioMessages />

        {/* Content Navigation Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="mobile-text-2xl font-bold tracking-tight mb-4 text-[hsl(218_31%_18%)]">
                        Explore More{" "}
                        <span className="bg-gradient-to-r from-[hsl(218_31%_18%)] via-[hsl(45_56%_55%)] to-[hsl(218_31%_18%)] bg-clip-text text-transparent">
                            Content
                        </span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[hsl(218_31%_18%)] via-[hsl(45_56%_55%)] to-[hsl(218_31%_18%)] rounded-full mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                        Access our complete collection of spiritual content across all platforms
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {/* Live Streaming Link */}
                    <div className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-[hsl(218_31%_18%)]/20 dark:border-[hsl(45_56%_55%)]/30 bg-gradient-to-br from-[hsl(218_31%_18%)]/5 to-[hsl(218_31%_18%)]/10 dark:from-[hsl(218_31%_18%)]/10 dark:to-[hsl(218_31%_18%)]/20 backdrop-blur-lg rounded-lg">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[hsl(218_31%_18%)] to-[hsl(218_28%_25%)] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow">
                                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-[hsl(218_31%_18%)] dark:text-white mb-3">Live Streaming</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Join us for live worship services and connect with our community
                            </p>
                            <a
                                href="/live-streaming"
                                className="inline-block w-full bg-gradient-to-r from-[hsl(218_31%_18%)] to-[hsl(218_28%_25%)] hover:from-[hsl(218_28%_25%)] hover:to-[hsl(218_31%_18%)] text-white shadow-lg hover:shadow-xl transition-all duration-300 py-2 px-4 rounded-lg text-center"
                            >
                                Watch Live
                            </a>
                        </div>
                    </div>

                    {/* Video Sermons Link */}
                    <div className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-[hsl(45_56%_55%)]/30 dark:border-[hsl(45_56%_55%)]/40 bg-gradient-to-br from-[hsl(45_56%_55%)]/10 to-[hsl(45_56%_55%)]/20 dark:from-[hsl(45_56%_55%)]/20 dark:to-[hsl(45_56%_55%)]/30 backdrop-blur-lg rounded-lg">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[hsl(45_56%_55%)] to-[hsl(45_56%_48%)] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow">
                                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-[hsl(218_31%_18%)] dark:text-white mb-3">Video Sermons</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Watch powerful messages and teachings from Pastor 'Tunde Olufemi
                            </p>
                            <a
                                href="/sermons"
                                className="inline-block w-full bg-gradient-to-r from-[hsl(45_56%_55%)] to-[hsl(45_56%_48%)] hover:from-[hsl(45_56%_48%)] hover:to-[hsl(45_56%_55%)] text-white shadow-lg hover:shadow-xl transition-all duration-300 py-2 px-4 rounded-lg text-center"
                            >
                                Browse Sermons
                            </a>
                        </div>
                    </div>

                    {/* YouTube Channel Link */}
                    <div className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-[hsl(218_31%_18%)]/20 dark:border-[hsl(45_56%_55%)]/30 bg-gradient-to-br from-[hsl(218_31%_18%)]/5 to-[hsl(45_56%_55%)]/10 dark:from-[hsl(218_31%_18%)]/10 dark:to-[hsl(45_56%_55%)]/20 backdrop-blur-lg rounded-lg">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[hsl(218_31%_18%)] to-[hsl(45_56%_55%)] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow">
                                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-[hsl(218_31%_18%)] dark:text-white mb-3">YouTube Channel</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Subscribe to our channel for the latest video content
                            </p>
                            <a
                                href="https://www.youtube.com/@tundeolufemi5339"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full bg-gradient-to-r from-[hsl(218_31%_18%)] to-[hsl(45_56%_55%)] hover:from-[hsl(45_56%_55%)] hover:to-[hsl(218_31%_18%)] text-white shadow-lg hover:shadow-xl transition-all duration-300 py-2 px-4 rounded-lg text-center"
                            >
                                Subscribe Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </div>
  );
}
