"use client";

import { AudioMessages } from "@/components/ui/audio-messages";

export default function AudioMessagesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
            {/* Enhanced Hero Section with Modern Overlays */}
            <section className="relative text-white py-6 overflow-hidden">
                {/* Background Image with Blur Effect */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(/images/background/audio_message_background.jpeg)`,
                        backgroundPosition: "center top",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundAttachment: "fixed",
                        filter: "blur(4px)",
                        transform: "scale(1.1)", // Slightly scale to avoid blur edges
                    }}
                />

                {/* Enhanced overlay for better text readability */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Floating Particles Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                  <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/15 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
                  <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
                  <div className="absolute bottom-1/3 right-2/3 w-1 h-1 bg-white/25 rounded-full animate-ping" style={{ animationDelay: '4s' }} />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="space-y-6">
                        <h1 className="mobile-text-3xl font-extrabold mb-4 text-white drop-shadow-2xl">
                          Audio Messages & Radio Broadcasts
                        </h1>
                        <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto drop-shadow-lg font-medium leading-relaxed">
                            Listen to powerful sermons, teachings, and inspirational messages from our Pastor's STEWARDSHIP RADIO BROADCAST titled "AKOKO IRIJU" and share with others.
                        </p>

                        {/* Enhanced Platform Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                            <button
                                className="h-14 px-8 rounded-full bg-[hsl(218_31%_18%)] hover:bg-[hsl(218_28%_25%)] text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/10 flex items-center justify-center"
                                onClick={() => window.open('https://www.youtube.com/playlist?list=PLwBPssCuCmumudb67faguWlaKGHB_YOg-', '_blank')}
                            >
                                <svg className="h-5 w-5 mr-3 fill-white" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                <div className="text-left">
                                    <div className="font-bold text-sm text-white">YouTube</div>
                                    <div className="text-xs text-white/90">Audio Playlist</div>
                                </div>
                            </button>

                            <button
                                className="h-14 px-8 rounded-full bg-[hsl(45_56%_55%)] hover:bg-[hsl(45_56%_48%)] text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/10 flex items-center justify-center"
                                onClick={() => window.open('https://web.facebook.com/groups/1873785202754614', '_blank')}
                            >
                                <svg className="h-5 w-5 mr-3 fill-white" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                <div className="text-left">
                                    <div className="font-bold text-sm text-white">Facebook</div>
                                    <div className="text-xs text-white/90">Community</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

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
