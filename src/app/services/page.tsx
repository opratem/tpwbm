"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { images } from "@/lib/images";
import { Calendar, Clock, MapPin, Users, Music, Heart, BookOpen } from "lucide-react";
import Events from "@/components/ui/events";

export default function ServicesPage() {
  return (
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="w-full py-8 md:py-12 relative overflow-hidden">
          {/* Background Image with Blur */}
          <div
              className="absolute inset-0 bg-cover bg-no-repeat"
              style={{"backgroundImage": "url('/images/background/service_background.jpeg')", "backgroundPosition": '50% 25%', "filter": 'blur(8px)', "transform": 'scale(1.1)'}}
          />

          {/* Enhanced overlay for depth and readability - using church colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(218_31%_18%)]/50 via-[hsl(218_31%_18%)]/30 to-[hsl(218_31%_18%)]/50" />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center text-white">
              <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-1000">
                <h1 className="mobile-text-3xl font-bold tracking-tighter text-white drop-shadow-2xl">
                  Worship Services & Special Programs
                </h1>
                <p className="mx-auto max-w-[800px] text-white mobile-text-lg font-light leading-relaxed drop-shadow-lg">
                  Join us for meaningful worship experiences and community events that strengthen our faith together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Times Section */}
        <section className="w-full py-16 md:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
                <h2 className="mobile-text-2xl font-bold tracking-tight">
                  Weekly{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                    Services
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 mobile-text-lg leading-relaxed">
                  Join us for multiple worship experiences designed to meet you wherever you are in your faith journey.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
              {/* Sunday Services */}
              <div className="space-y-8">
                <h3 className="mobile-text-lg font-bold text-center lg:text-left text-[hsl(218_31%_18%)] dark:text-[hsl(45_56%_55%)]">Sunday Services</h3>

                {/* Traditional Service Card */}
                <Card className="group shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white dark:bg-gray-800 overflow-hidden">
                  <div className="h-56 overflow-hidden relative">
                    <Image
                        src="/images/Sunday_Bible_School.jpeg"
                        alt="Sunday Bible School"
                        fill
                        style={{ objectFit: 'cover', filter: 'blur(4px)' }}
                        className="group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                    <div className="absolute top-5 right-5 bg-[hsl(218_31%_18%)]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Sunday Bible School
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h4 className="mobile-text-2xl font-bold mb-2 text-white drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)' }}>Sunday Bible School</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-white font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>8:30 AM - 9:30 AM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardDescription className="text-base">Sunday Bible School</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Join us for a Sunday School experience that speaks directly to where you are in life. Whether you're a child, teen, young adult, or adult, our classes address real-world challenges we all face at home, work, and in our communities.
                    </p>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-[hsl(218_31%_18%)]" />
                        <span>Age Appropriate Classes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-[hsl(218_31%_18%)]" />
                        <span>Practical Life Applications</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-[hsl(218_31%_18%)]" />
                        <span>Interactive Discussions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contemporary Service */}
                <Card className="group shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white dark:bg-gray-800 overflow-hidden">
                  <div className="h-56 overflow-hidden relative">
                    <Image
                        src="/images/Celebration_of_Jesus.jpeg"
                        alt="Celebration of Jesus"
                        fill
                        style={{ objectFit: 'cover', filter: 'blur(4px)' }}
                        className="group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                    <div className="absolute top-5 right-5 bg-[hsl(45_56%_55%)]/90 backdrop-blur-sm text-[hsl(218_31%_18%)] px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Celebration of Jesus
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h4 className="text-2xl font-bold mb-2 text-white drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)' }}>Celebration of Jesus</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-white font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>9:30 AM - 12:30 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardDescription className="text-base">Sunday Service: A Time of Worship, Prayer, and Powerful Messages</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Join us for a meaningful worship experience and powerful messages that speak to your life.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Music className="h-4 w-4 text-[hsl(45_56%_55%)]" />
                        <span>Royal Priesthood Voices</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-[hsl(45_56%_55%)]" />
                        <span>Life-Focused Messages</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-[hsl(45_56%_55%)]" />
                        <span>Prayer Sessions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-[hsl(45_56%_55%)]" />
                        <span>Everyone Welcome</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weekday Services */}
              <div className="space-y-8">
                <h3 className="mobile-text-lg font-bold text-center lg:text-left text-[hsl(218_31%_18%)] dark:text-[hsl(45_56%_55%)]">Weekday Services</h3>

                {/* Bible Study */}
                <Card className="group shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white dark:bg-gray-800 overflow-hidden">
                  <div className="h-56 overflow-hidden relative">
                    <Image
                        src="/images/Bible_Study.jpeg"
                        alt="Bible Study"
                        fill
                        style={{ objectFit: 'cover', filter: 'blur(4px)' }}
                        className="group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                    <div className="absolute top-5 right-5 bg-[hsl(218_31%_18%)]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Bible Study
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h4 className="text-2xl font-bold mb-2 text-white drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)' }}>Tuesday Evening Study</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-white font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>5:00 PM - 6:30 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardDescription className="text-base">Deep Scriptural Study</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Dive deeper into God's Word through interactive Bible study, group discussion, and practical application for daily living.
                    </p>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-[hsl(218_31%_18%)]" />
                        <span>Deep Bible Study with discussion</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-[hsl(218_31%_18%)]" />
                        <span>General Questions and Answers</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Thursday Soul Winning & Evangelism */}
                <Card className="group shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white dark:bg-gray-800 overflow-hidden">
                  <div className="h-56 overflow-hidden relative">
                    <Image
                        src="/images/gallery/Church1.jpg"
                        alt="Soul Winning & Evangelism"
                        fill
                        style={{ objectFit: 'cover', filter: 'blur(4px)' }}
                        className="group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute top-5 right-5 bg-[hsl(45_56%_55%)]/90 backdrop-blur-sm text-[hsl(218_31%_18%)] px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Soul Winning & Evangelism
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h4 className="text-2xl font-bold mb-2 text-white drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)' }}>Thursday Soul Winning & Evangelism Outreach</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-white font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>7:00 PM - 8:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardDescription className="text-base">Community Evangelism & Soul Winning</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Join us for evangelistic outreach as we share the Gospel and reach souls for Christ in our community and beyond.
                    </p>
                  </CardContent>
                </Card>

                {/* Special Services Info */}
                <div className="bg-gradient-to-r from-[hsl(45_56%_55%)]/20 to-[hsl(218_31%_18%)]/20 dark:from-[hsl(45_56%_55%)]/20 dark:to-[hsl(218_31%_18%)]/20 p-6 rounded-2xl">
                  <h4 className="mobile-text-lg font-bold mb-3 text-[hsl(218_31%_18%)] dark:text-[hsl(45_56%_55%)]">Special Services</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Gender Fellowship(First Sundays of Each Month)</li>
                    <li>• Monthly Youth Services</li>
                    <li>• Holiday and Special Event Services</li>
                    <li>• Baptism Services (quarterly)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center border-0 bg-gradient-to-br from-[hsl(218_31%_18%)]/10 to-[hsl(218_31%_18%)]/20 dark:from-[hsl(218_31%_18%)]/20 dark:to-[hsl(218_31%_18%)]/30">
                <MapPin className="h-8 w-8 text-[hsl(218_31%_18%)] mx-auto mb-3" />
                <h4 className="mobile-text-lg font-bold mb-2 text-[hsl(218_31%_18%)] dark:text-[hsl(45_56%_55%)]">Location</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Behind Asero Carwash,<br />
                  Opposite MRS Filling Station,<br />
                  Asero, Abeokuta.
                </p>
              </Card>

              <Card className="p-6 text-center border-0 bg-gradient-to-br from-[hsl(45_56%_55%)]/10 to-[hsl(45_56%_55%)]/20 dark:from-[hsl(45_56%_55%)]/20 dark:to-[hsl(45_56%_55%)]/30">
                <Users className="h-8 w-8 text-[hsl(45_56%_55%)] mx-auto mb-3" />
                <h4 className="mobile-text-lg font-bold mb-2 text-[hsl(218_31%_18%)] dark:text-[hsl(45_56%_55%)]">All Welcome</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Come as you are<br />
                  Children's programs available
                </p>
              </Card>

              <Card className="p-6 text-center border-0 bg-gradient-to-br from-[hsl(218_31%_18%)]/10 to-[hsl(45_56%_55%)]/20 dark:from-[hsl(218_31%_18%)]/20 dark:to-[hsl(45_56%_55%)]/30">
                <Heart className="h-8 w-8 text-[hsl(218_31%_18%)] mx-auto mb-3" />
                <h4 className="mobile-text-lg font-bold mb-2 text-[hsl(218_31%_18%)] dark:text-[hsl(45_56%_55%)]">First Time?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You are Welcome!<br />
                  We would love to have you be a part of us.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="w-full py-16 md:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
                <h2 className="mobile-text-2xl font-bold tracking-tight">
                  Upcoming{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                    Events
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 mobile-text-base md:text-lg lg:text-xl leading-relaxed">
                  Join us for special events that build community, strengthen faith, and serve others.
                </p>
              </div>
            </div>

            {/* Events Calendar Grid */}
            <div className="animate-fade-in-up-delay-1">
              <Events
                  limit={3}
                  category="all"
                  upcoming={true}
                  showHeader={false}
                  variant="card"
              />
            </div>

            {/* Monthly Events Calendar */}
            <div className="bg-gradient-to-r from-gray-50 to-[hsl(45_56%_55%)]/10 dark:from-gray-800 dark:to-[hsl(45_56%_55%)]/20 rounded-2xl p-8">
              <h3 className="mobile-text-2xl font-bold text-center mb-8">
                Monthly Events{" "}
                <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                  Calendar
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-[hsl(218_31%_18%)] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                    1st
                  </div>
                  <h4 className="mobile-text-base font-semibold mb-1 text-[hsl(218_31%_18%)] dark:text-[hsl(45_56%_55%)]">First Saturday</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Rain of Mercy: Early Morning Prayer Meeting</p>
                </div>
                <div className="text-center">
                  <div className="bg-[hsl(45_56%_55%)] text-[hsl(218_31%_18%)] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                    1st
                  </div>
                  <h4 className="mobile-text-base font-semibold mb-1 text-[hsl(218_31%_18%)] dark:text-[hsl(45_56%_55%)]">First Sunday</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Thanksgiving Service & Gender Fellowship</p>
                </div>
                <div className="text-center">
                  <div className="bg-[hsl(218_31%_18%)] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                    Last
                  </div>
                  <h4 className="mobile-text-base font-semibold mb-1 text-[hsl(218_31%_18%)] dark:text-[hsl(45_56%_55%)]">Last Friday</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Overcomers' Night Vigil</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Special Services Section */}
        <section className="w-full py-16 md:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="space-y-4">
                <h2 className="mobile-text-2xl font-bold tracking-tight">
                  Special{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                    Services
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed">
                  Throughout the year, we celebrate special occasions and milestones with meaningful services.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              {/* Special Programs */}
              <Card className="p-6 text-center border-0 bg-gradient-to-br from-[hsl(218_31%_18%)]/10 to-[hsl(45_56%_55%)]/10 dark:from-[hsl(218_31%_18%)]/20 dark:to-[hsl(45_56%_55%)]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-md">
                <div className="bg-gradient-to-r from-[hsl(218_31%_18%)] to-[hsl(45_56%_55%)] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h4 className="mobile-text-lg font-bold mb-3 text-[hsl(218_31%_18%)] dark:text-[hsl(45_56%_55%)]">Special Programs</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Fasting and Prayer 1st - 3rd of every month</li>
                  <li>General Workers Meeting - October 1st</li>
                  <li>Gender Fellowship - first Sunday of every month</li>
                  <li>3 Days of Wonders</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-16 md:py-24 relative overflow-hidden">
          {/* Background Image with Blur */}
          <div
              className="absolute inset-0 bg-cover bg-no-repeat"
              style={{"backgroundImage": "url('/images/background/service_background.jpeg')", "backgroundPosition": '50% 25%', "filter": 'blur(8px)', "transform": 'scale(1.1)'}}
          />

          {/* Enhanced overlay for depth and readability - using church colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(218_31%_18%)]/50 via-[hsl(218_31%_18%)]/30 to-[hsl(218_31%_18%)]/50" />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="mobile-text-2xl font-bold tracking-tight leading-tight max-w-3xl text-white drop-shadow-lg"
                    style={{
                      textShadow: '0 0 20px hsl(45 56% 55% / 0.5), 0 2px 4px rgba(0,0,0,0.8)',
                    }}>
                  Ready to{" "}
                  <span className="text-[hsl(45_56%_55%)]">Join Us?</span>
                </h2>
                <p className="mx-auto max-w-[600px] text-xl text-white font-light leading-relaxed drop-shadow-lg">
                  We'd love to welcome you to our church family. Come as you are and experience God's love in community.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="text-lg font-semibold px-8 py-4 rounded-full bg-white text-[hsl(218_31%_18%)] hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl" asChild>
                  <Link href="/contact">
                    Plan Your Visit
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg font-semibold px-8 py-4 rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-[hsl(218_31%_18%)] transform hover:scale-105 transition-all duration-200 shadow-xl" asChild>
                  <Link href="/about">
                    Learn More About Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}
