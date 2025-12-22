"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Users, Calendar, Clock, Volume2, ExternalLink, MessageCircle } from "lucide-react";
import Image from "next/image";
import { getCloudinaryImageUrl, churchImages } from "@/lib/cloudinary-client";

export function LiveStreaming() {
  const [isLive, setIsLive] = useState(false);

  return (
      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-church-primary">
              Join Our{" "}<span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
              Community
            </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto mb-6" />
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay connected with our church family through live services, audio programs, and community updates
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Live Stream Section */}
            <div className="space-y-6">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isLive ? (
                        <div className="text-center text-white">
                          <div className="w-16 h-16 bg-church-primary rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                            <Play className="h-8 w-8 ml-1" />
                          </div>
                          <p className="text-lg font-semibold mb-2">LIVE NOW</p>
                          <p className="text-sm text-gray-300">Sunday Service</p>
                        </div>
                    ) : (
                        <div className="text-center text-white">
                          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Play className="h-8 w-8 ml-1" />
                          </div>
                          <p className="text-lg font-semibold mb-2">Stream Offline</p>
                          <p className="text-sm text-gray-300">Next service: Sunday 8:30 AM</p>
                        </div>
                    )}
                  </div>

                  {/* Live indicator */}
                  {isLive && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-church-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                  )}

                  {/* Viewer count */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    <Users className="h-4 w-4" />
                    <span>{isLive ? "127" : "0"} watching</span>
                  </div>
                </div>
              </div>

              {/* Service Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-2 border-church-primary/20 dark:border-church-primary/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-church-accent" />
                      Sunday Service
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>8:30 AM - 12:00 PM (WAT)</span>
                    </div>
                    <p className="text-sm text-gray-500">Video & Audio Available</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-church-accent/30 dark:border-church-accent/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-church-primary" />
                      Stewardship Radio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>Weekly Program</span>
                    </div>
                    <p className="text-sm text-gray-500">Audio Only</p>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    size="lg"
                    className="flex-1 rounded-full bg-church-primary hover:bg-church-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    onClick={() => window.open('https://web.facebook.com/groups/1873785202754614', '_blank')}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Live
                </Button>

                <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 rounded-full border-2 border-church-accent text-church-primary hover:bg-church-accent/10 dark:hover:bg-church-accent/20 transition-all duration-200"
                    onClick={() => window.open('https://web.facebook.com/groups/1873785202754614', '_blank')}
                >
                  <Volume2 className="h-5 w-5 mr-2" />
                  Audio Program
                </Button>
              </div>
            </div>

            {/* Facebook Community Section - Simplified */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-church-primary/5 to-church-accent/5 dark:from-church-primary/10 dark:to-church-accent/10 rounded-2xl p-8 border-2 border-church-accent/30 shadow-lg">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden p-1">
                    <Image
                      src="/images/CHURCH LOGO.png"
                      alt="TPWBM Logo"
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-church-primary dark:text-white text-center mb-4">
                  Join Our Facebook Community
                </h3>

                <p className="text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed">
                  Connect with fellow believers, get updates on church activities, and participate in discussions.
                </p>

                <div className="space-y-3">
                  <Button
                      size="lg"
                      className="w-full bg-church-primary hover:bg-church-primary-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      onClick={() => window.open('https://web.facebook.com/groups/1873785202754614', '_blank')}
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Join Facebook Group
                  </Button>

                  <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-2 border-church-accent text-church-primary hover:bg-church-accent/10 rounded-full transition-all duration-200"
                      onClick={() => window.open('https://web.facebook.com/groups/1873785202754614', '_blank')}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    View Community Posts
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-church-accent/20">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Stay connected with our church family through live services, audio programs, and community updates
                  </p>
                </div>
              </div>

              {/* Additional Info Card */}
              <Card className="border-2 border-church-accent/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-church-primary">
                    <Users className="h-5 w-5 text-church-accent" />
                    Community Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-church-accent rounded-full mt-2" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Join live discussions during Sunday services
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-church-accent rounded-full mt-2" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Access exclusive audio messages and teachings
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-church-accent rounded-full mt-2" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Connect with fellow believers worldwide
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
  );
}
