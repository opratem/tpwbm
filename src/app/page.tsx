import type { Metadata } from 'next';
import { generateMetadata as genMeta, generateOrganizationSchema, siteConfig } from '@/lib/seo';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { images } from "@/lib/images";
import { getCloudinaryImageUrl } from "@/lib/cloudinary-client";
import Image from "next/image";
import Link from "next/link";
import Announcements from "@/components/ui/announcements";
import Events from "@/components/ui/events";
import { LiveStreaming } from "@/components/ui/live-streaming";
import { SpiritualQuotes } from "@/components/ui/spiritual-quotes";
import { YouTubeIntegration } from "@/components/ui/youtube-integration";
import {
  AnimatedSection,
  StaggeredContainer,
  ScrollToTop,
  AdvancedStaggeredContainer,
  GridRevealContainer,
  CascadingText,
  ImageReveal,
  CounterAnimation
} from "@/components/ui/animated-section";
import { NavigationSection, SmoothNavigation } from "@/components/ui/smooth-navigation";

// SEO Metadata
export const metadata: Metadata = genMeta({
  title: 'Home',
  description: siteConfig.description,
  keywords: [
    'Christian church',
    'Lagos church',
    'worship service',
    'Bible study',
    'Christian ministry Nigeria',
    'church events',
    'online sermons',
    'prayer ministry',
    'giving',
    'tithing',
    'church community',
  ],
  canonicalUrl: siteConfig.url,
  ogType: 'website',
});

// Enable static generation with ISR
export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-static';

export default function Home() {
  const navigationItems = [
    { id: 'hero', label: 'Home' },
    { id: 'welcome', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'ministries', label: 'Ministries' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'events', label: 'Events' },
  ];

  // JSON-LD Structured Data
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="flex flex-col min-h-screen smooth-scroll">
        <SmoothNavigation items={navigationItems} />
        <ScrollToTop />
        {/* Hero Section - Enhanced Mobile Responsiveness */}
        <NavigationSection
            id="hero"
            className="w-full py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 relative overflow-hidden min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh]"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
                src={images.themes.theme2025}
                alt="Church Theme 2025"
                fill
                priority
                className="bg-image-hero"
                style={{ zIndex: -1 }}
            />
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/65 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          <div className="container mobile-container relative z-10 h-full">
            <div className="flex flex-col items-center justify-center mobile-space-y-6 text-center h-full">
              <div className="flex flex-col mobile-space-y-4 text-white animate-in fade-in-50 slide-in-from-bottom-4 duration-1000">
                <h1 className="mobile-text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight max-w-5xl drop-shadow-2xl heading-hover-glow px-2">
                  <CascadingText
                      text="Welcome to"
                      className="text-white drop-shadow-lg block mb-2 sm:mb-0 sm:inline"
                      animation="slideUp"
                      delay={100}
                  />{" "}
                  <CascadingText
                      text="The Prevailing Word Believers"
                      className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 bg-clip-text text-transparent drop-shadow-lg font-extrabold block sm:inline"
                      animation="fadeIn"
                      delay={80}
                  />{" "}
                  <CascadingText
                      text="Ministry Inc."
                      className="text-white drop-shadow-lg font-extrabold block sm:inline"
                      animation="fadeIn"
                      delay={80}
                  />
                </h1>
                <div className="bg-black/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl mobile-card-spacing mx-auto max-w-[900px] border border-white/20">
                  <p className="mobile-text-base md:text-lg lg:text-xl text-white font-medium leading-relaxed drop-shadow-lg">
                    A place where value is added to life. Join us in worship and
                    fellowship as we grow together in faith.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:gap-4 lg:gap-6 animate-in fade-in-50 slide-in-from-bottom-6 duration-1000 delay-300 w-full max-w-2xl px-4 sm:px-6 md:px-0">
                <Button
                    size="lg"
                    variant="default"
                    className="magnetic-button mobile-button font-bold rounded-full bg-gradient-to-r from-church-primary to-church-primary-dark hover:from-church-primary-dark hover:to-church-primary text-white transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl border-2 border-church-primary w-full md:w-auto mobile-touch-target py-4 sm:py-5 md:py-3 text-base sm:text-lg md:text-base"
                    asChild
                >
                  <Link href="/services">Service Times</Link>
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="magnetic-button mobile-button font-bold rounded-full bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-church-primary transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl w-full md:w-auto mobile-touch-target py-4 sm:py-5 md:py-3 text-base sm:text-lg md:text-base"
                    asChild
                >
                  <Link href="/pastor">Meet Our Pastor</Link>
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="bouncy-hover mobile-button font-bold rounded-full bg-church-accent/20 backdrop-blur-sm border-2 border-church-accent text-yellow-100 hover:bg-church-accent hover:text-church-primary transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl w-full md:w-auto mobile-touch-target py-4 sm:py-5 md:py-3 text-base sm:text-lg md:text-base"
                    asChild
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 sm:h-3 bg-white rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </NavigationSection>

        {/* Welcome Message */}
        <AnimatedSection animation="fadeUp">
          <NavigationSection id="welcome" className="w-full mobile-section-spacing bg-gradient-to-b from-white via-gray-25 to-gray-50 dark:from-gray-950 dark:to-gray-900">
            <div className="container mobile-container">
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
                <AnimatedSection animation="slideLeft" delay={200} className="lg:w-1/2 mobile-space-y-6">
                  <div className="mobile-space-y-4">
                    <p className="section-subtitle text-church-primary dark:text-church-accent">Our Community</p>
                    <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl text-balance leading-tight text-church-primary dark:text-gray-100 tracking-tight">
                      A Church for{" "}
                      <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                    Everyone
                  </span>
                    </h2>
                    <div className="w-24 sm:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full" />
                  </div>
                  <div className="mobile-space-y-4 text-gray-700 dark:text-gray-300">
                    <p className="lead-text">
                      At The Prevailing Word Believers Ministry Inc., we
                      believe in creating a welcoming environment where people from
                      all walks of life can come together to worship, grow
                      spiritually, and build meaningful relationships.
                    </p>
                    <p className="mobile-text-base leading-relaxed">
                      Our mission is to share God's love with our community and
                      beyond, making disciples who live out their faith in everyday
                      life.
                    </p>
                  </div>
                  <Button
                      variant="outline"
                      size="lg"
                      className="mt-6 sm:mt-8 mobile-button rounded-full border-2 border-church-primary text-church-primary hover:bg-church-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl font-semibold dark:border-church-accent dark:text-church-accent dark:hover:bg-church-accent dark:hover:text-church-primary-dark"
                      asChild
                  >
                    <Link href="/about">About Our Church</Link>
                  </Button>
                </AnimatedSection>
                <AnimatedSection animation="slideRight" delay={400} className="lg:w-1/2 mt-8 sm:mt-12 lg:mt-0">
                  <ImageReveal
                      src={getCloudinaryImageUrl("Church4_jququz", { width: 800, height: 640, crop: 'fill', quality: 'auto', format: 'auto' })}
                      alt="Church community"
                      animation="clipPath"
                      containerClassName="relative aspect-[5/4] mobile-card overflow-hidden shadow-2xl group border border-gray-200/50"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 mobile-card" />
                </AnimatedSection>
              </div>
            </div>
          </NavigationSection>
        </AnimatedSection>

        {/* Service Times Section */}
        <AnimatedSection animation="fadeUp">
          <NavigationSection id="services" className="w-full mobile-section-spacing bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
            <div className="container mobile-container">
              <AnimatedSection animation="fadeUp" className="flex flex-col items-center justify-center mobile-content-spacing text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
                <div className="mobile-space-y-4">
                  <p className="section-subtitle text-church-primary dark:text-church-accent">Worship With Us</p>
                  <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl text-balance leading-tight max-w-4xl tracking-tight">
                    Join Us in{" "}
                    <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                  Worship
                </span>
                  </h2>
                  <div className="w-20 sm:w-24 md:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                  <p className="mx-auto max-w-3xl text-gray-700 dark:text-gray-300 lead-text px-4 sm:px-0">
                    Join Us as We fellowship, learn and grow together in God's presence
                  </p>
                </div>
              </AnimatedSection>

              <GridRevealContainer
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
                  delay={150}
                  animation="scaleStagger"
              >
                <Card className="enhanced-card group mobile-card border-0 bg-white dark:bg-gray-800 overflow-hidden transform hover:-translate-y-2">
                  <div className="h-28 sm:h-36 md:h-44 overflow-hidden relative">
                    <Image
                        src="/images/Sunday_Bible_School.jpeg"
                        alt="Sunday Bible School"
                        fill
                        style={{ objectFit: "cover", objectPosition: "center center", filter: "blur(4px)" }}
                        className="group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 bg-church-primary/90 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full mobile-text-xs font-semibold shadow-lg">
                      Sunday Bible School
                    </div>
                  </div>
                  <CardHeader className="p-2 sm:p-3 md:p-4 pb-1 sm:pb-2 pt-2 sm:pt-3">
                    <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                      Sunday Morning
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Sunday Bible School
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 md:p-4 pb-2 sm:pb-3">
                    <p className="text-sm sm:text-base md:text-lg font-bold text-church-primary bg-church-accent/20 dark:bg-church-accent/30 px-2 py-1 sm:py-2 rounded-lg inline-block">
                      8:30 AM - 9:30 AM
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs sm:text-sm">
                      Join Us for Sunday Bible School - Growing in Faith Together!
                    </p>
                  </CardContent>
                  <CardFooter className="border-t border-gray-100 dark:border-gray-700 p-2 sm:p-3 md:p-4 pt-2 sm:pt-3">
                    <Button
                        variant="ghost"
                        className="w-full mobile-button rounded-full hover:bg-church-accent/20 dark:hover:bg-church-accent/30 transition-colors duration-300 text-church-primary font-semibold mobile-touch-target"
                        asChild
                    >
                      <Link href="/services">Learn More</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="enhanced-card group mobile-card border-0 bg-white dark:bg-gray-800 overflow-hidden transform hover:-translate-y-2">
                  <div className="h-28 sm:h-36 md:h-44 overflow-hidden relative">
                    <Image
                        src="/images/Celebration_of_Jesus.jpeg"
                        alt="Celebration of Jesus"
                        fill
                        style={{ objectFit: "cover", objectPosition: "center center", filter: "blur(4px)" }}
                        className="group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 bg-church-accent/90 backdrop-blur-sm text-church-primary px-2 sm:px-3 py-1 sm:py-1.5 rounded-full mobile-text-xs font-semibold shadow-lg">
                      Celebration of Jesus
                    </div>
                  </div>
                  <CardHeader className="p-2 sm:p-3 md:p-4 pb-1 sm:pb-2 pt-2 sm:pt-3">
                    <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                      Sunday Morning
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Celebration of Jesus
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 md:p-4 pb-2 sm:pb-3">
                    <p className="text-sm sm:text-base md:text-lg font-bold text-church-primary bg-church-accent/20 dark:bg-church-accent/30 px-2 py-1 sm:py-2 rounded-lg inline-block">
                      9:30 AM - 12:00PM
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs sm:text-sm">
                      Celebrate Jesus with Us - Sunday Worship Experience!
                    </p>
                  </CardContent>
                  <CardFooter className="border-t border-gray-100 dark:border-gray-700 p-2 sm:p-3 md:p-4 pt-2 sm:pt-3">
                    <Button
                        variant="ghost"
                        className="w-full mobile-button rounded-full hover:bg-church-accent/20 dark:hover:bg-church-accent/30 transition-colors duration-300 text-church-primary font-semibold mobile-touch-target"
                        asChild
                    >
                      <Link href="/services">Learn More</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="enhanced-card group mobile-card border-0 bg-white dark:bg-gray-800 overflow-hidden transform hover:-translate-y-2">
                  <div className="h-28 sm:h-36 md:h-44 overflow-hidden relative">
                    <Image
                        src="/images/Bible_Study.jpeg"
                        alt="Midweek Bible Study"
                        fill
                        style={{ objectFit: "cover", objectPosition: "center center", filter: "blur(4px)" }}
                        className="group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 bg-church-primary/90 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                      Bible Study
                    </div>
                  </div>
                  <CardHeader className="p-2 sm:p-3 md:p-4 pb-1 sm:pb-2 pt-2 sm:pt-3">
                    <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                      Tuesday Evening
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Midweek Bible Study
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 md:p-4 pb-2 sm:pb-3">
                    <p className="text-sm sm:text-base md:text-lg font-bold text-church-primary bg-church-accent/20 dark:bg-church-accent/30 px-2 py-1 sm:py-2 rounded-lg inline-block">
                      5:00 PM - 6:30 PM
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs sm:text-sm">
                      Dive deeper into scripture through study and discussion.
                    </p>
                  </CardContent>
                  <CardFooter className="border-t border-gray-100 dark:border-gray-700 p-2 sm:p-3 md:p-4 pt-2 sm:pt-3">
                    <Button
                        variant="ghost"
                        className="w-full mobile-button rounded-full hover:bg-church-accent/20 dark:hover:bg-church-accent/30 transition-colors duration-300 text-church-primary font-semibold mobile-touch-target"
                        asChild
                    >
                      <Link href="/services">Learn More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </GridRevealContainer>
            </div>
          </NavigationSection>
        </AnimatedSection>

        {/* Announcements Section */}
        <AnimatedSection animation="fadeUp">
          <NavigationSection id="announcements" className="section-spacing bg-gradient-to-b from-white via-orange-25 to-gray-50">
            <div className="container mobile-container">
              <div className="text-center mb-12 sm:mb-16 md:mb-20 mobile-space-y-6 animate-fade-in-up">
                <p className="section-subtitle text-church-primary dark:text-church-accent">Latest Updates</p>
                <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl text-balance leading-tight max-w-4xl mx-auto tracking-tight">
                  Church{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                      Announcements
                    </span>
                </h2>
                <div className="w-24 sm:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                <p className="lead-text max-w-3xl mx-auto text-balance text-gray-700">
                  Stay informed about the latest news, events, and important updates from our church community.
                </p>
              </div>

              <div className="animate-fade-in-up-delay-1">
                <Announcements limit={3} variant="card" />
              </div>

              <div className="flex justify-center mt-12 sm:mt-16 animate-fade-in-up-delay-2">
                <Button
                    variant="default"
                    size="lg"
                    className="church-button-primary bg-church-primary text-white hover:bg-church-primary/90 mobile-button rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold"
                    asChild
                >
                  <Link href="/announcements">View All Announcements</Link>
                </Button>
              </div>
            </div>
          </NavigationSection>
        </AnimatedSection>

        {/* Upcoming Events Section */}
        <AnimatedSection animation="fadeUp">
          <NavigationSection id="events" className="section-spacing bg-gradient-to-b from-gray-50 via-green-25 to-white">
            <div className="container mobile-container">
              <div className="text-center mb-12 sm:mb-16 md:mb-20 mobile-space-y-6 animate-fade-in-up">
                <p className="section-subtitle text-church-primary dark:text-church-accent">What's Coming</p>
                <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl text-balance leading-tight max-w-4xl mx-auto tracking-tight">
                  Upcoming{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                      Events
                    </span>
                </h2>
                <div className="w-24 sm:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                <p className="lead-text max-w-3xl mx-auto text-balance text-gray-700">
                  Join us for these special events and become part of our growing
                  community.
                </p>
              </div>

              <div className="animate-fade-in-up-delay-1">
                <Events
                    limit={3}
                    category="all"
                    upcoming={true}
                    showHeader={false}
                    variant="card"
                />
              </div>

              <div className="flex justify-center mt-12 sm:mt-16 animate-fade-in-up-delay-2">
                <Button
                    variant="default"
                    size="lg"
                    className="church-button-primary bg-church-primary text-white hover:bg-church-primary/90 mobile-button rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold"
                    asChild
                >
                  <Link href="/events">View All Events</Link>
                </Button>
              </div>
            </div>
          </NavigationSection>
        </AnimatedSection>

        {/* Ministry Highlights */}
        <AnimatedSection animation="fadeUp">
          <NavigationSection id="ministries" className="section-spacing bg-gradient-to-b from-white via-purple-25 to-gray-50">
            <div className="container mobile-container">
              <AnimatedSection animation="fadeUp" className="text-center mb-12 sm:mb-16 md:mb-20 mobile-space-y-6">
                <p className="section-subtitle text-church-primary dark:text-church-accent">Get Involved</p>
                <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl text-balance leading-tight max-w-4xl mx-auto tracking-tight">
                  Our{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                      Ministries
                    </span>
                </h2>
                <div className="w-24 sm:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                <p className="lead-text max-w-3xl mx-auto text-balance text-gray-700">
                  Discover ways to get involved, grow in your faith, and serve
                  others in our community.
                </p>
              </AnimatedSection>

              <GridRevealContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10" delay={120} animation="rotateStagger">
                <div className="church-card group mobile-card-spacing flex flex-col items-center text-center animate-fade-in-up hover:shadow-xl transition-all duration-500">
                  <div className="floating-icon w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-church-accent/30 to-church-accent/50 rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-church-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mobile-text-lg font-bold mb-3 sm:mb-4 md:mb-5 text-gray-900 dark:text-gray-100">
                    Family Ministry
                  </h3>
                  <p className="mb-4 sm:mb-6 md:mb-8 leading-relaxed flex-grow mobile-text-sm text-gray-600 dark:text-gray-300">
                    Supporting families with resources, programs, and guidance for
                    all ages and life stages.
                  </p>
                  <Button
                      variant="ghost"
                      className="mt-auto rounded-full hover:bg-church-accent/20 dark:hover:bg-church-accent/30 transition-colors duration-300 text-church-primary font-semibold mobile-button"
                      asChild
                  >
                    <Link href="/ministries">Learn More</Link>
                  </Button>
                </div>

                <div className="church-card group mobile-card-spacing flex flex-col items-center text-center animate-fade-in-up-delay-1 hover:shadow-xl transition-all duration-500">
                  <div className="floating-icon w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-church-primary/20 to-church-primary/40 rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-church-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="mobile-text-lg font-bold mb-3 sm:mb-4 md:mb-5 text-gray-900 dark:text-gray-100">
                    Bible Study
                  </h3>
                  <p className="mb-4 sm:mb-6 md:mb-8 leading-relaxed flex-grow mobile-text-sm text-gray-600 dark:text-gray-300">
                    Dive deeper into scripture through various study groups,
                    classes, and theological discussions.
                  </p>
                  <Button
                      variant="ghost"
                      className="mt-auto rounded-full hover:bg-church-primary/20 dark:hover:bg-church-primary/30 transition-colors duration-300 text-church-accent font-semibold mobile-button"
                      asChild
                  >
                    <Link href="/ministries">Learn More</Link>
                  </Button>
                </div>

                <div className="church-card group mobile-card-spacing flex flex-col items-center text-center animate-fade-in-up-delay-2 hover:shadow-xl transition-all duration-500">
                  <div className="floating-icon w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-church-accent/30 to-church-accent/50 rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-church-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mobile-text-lg font-bold mb-3 sm:mb-4 md:mb-5 text-gray-900 dark:text-gray-100">
                    Outreach
                  </h3>
                  <p className="mb-4 sm:mb-6 md:mb-8 leading-relaxed flex-grow mobile-text-sm text-gray-600 dark:text-gray-300">
                    Serving our community and the world with the love of Christ
                    through various service projects.
                  </p>
                  <Button
                      variant="ghost"
                      className="mt-auto rounded-full hover:bg-church-accent/20 dark:hover:bg-church-accent/30 transition-colors duration-300 text-church-primary font-semibold mobile-button"
                      asChild
                  >
                    <Link href="/ministries">Learn More</Link>
                  </Button>
                </div>

                <div className="church-card group mobile-card-spacing flex flex-col items-center text-center animate-fade-in-up-delay-3 hover:shadow-xl transition-all duration-500">
                  <div className="floating-icon w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-church-primary/20 to-church-primary/40 rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-church-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>
                  <h3 className="mobile-text-lg font-bold mb-3 sm:mb-4 md:mb-5 text-gray-900 dark:text-gray-100">
                    Music Ministry
                  </h3>
                  <p className="mb-4 sm:mb-6 md:mb-8 leading-relaxed flex-grow mobile-text-sm text-gray-600 dark:text-gray-300">
                    Using the gift of music to enhance worship, praise, and create
                    meaningful spiritual experiences.
                  </p>
                  <Button
                      variant="ghost"
                      className="mt-auto rounded-full hover:bg-church-primary/20 dark:hover:bg-church-primary/30 transition-colors duration-300 text-church-accent font-semibold mobile-button"
                      asChild
                  >
                    <Link href="/ministries">Learn More</Link>
                  </Button>
                </div>
              </GridRevealContainer>
            </div>
          </NavigationSection>
        </AnimatedSection>

        {/* YouTube Integration Section */}
        <YouTubeIntegration />

        {/* Live Streaming Section */}
        <AnimatedSection animation="fadeUp">
          <LiveStreaming />
        </AnimatedSection>

        {/* Spiritual Quotes Section */}
        <AnimatedSection animation="fadeUp">
          <SpiritualQuotes />
        </AnimatedSection>

        {/* Church Stats Section */}
        <AnimatedSection animation="fadeUp">
          <section className="mobile-section-spacing bg-gradient-to-r from-church-primary via-church-accent to-church-primary text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="container mobile-container relative z-10">
              <div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="mobile-text-2xl font-bold mb-3 sm:mb-4">Our Growing Community</h2>
                <p className="mobile-text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
                  Experience the impact of faith and fellowship in our church family
                </p>
              </div>

              <GridRevealContainer
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
                  delay={200}
                  animation="fadeUpStagger"
              >
                <div className="text-center mobile-space-y-2">
                  <CounterAnimation
                      end={50}
                      suffix="+"
                      className="mobile-text-3xl font-bold text-church-accent block"
                      duration={2500}
                  />
                  <p className="mobile-text-sm text-white/80 leading-tight">Active Members</p>
                </div>

                <div className="text-center mobile-space-y-2">
                  <CounterAnimation
                      end={20}
                      suffix="+"
                      className="mobile-text-3xl font-bold text-church-accent block"
                      duration={2000}
                  />
                  <p className="mobile-text-sm text-white/80 leading-tight">Serving Community</p>
                </div>

                <div className="text-center mobile-space-y-2">
                  <CounterAnimation
                      end={15}
                      suffix="+"
                      className="mobile-text-3xl font-bold text-church-accent block"
                      duration={2200}
                  />
                  <p className="mobile-text-sm text-white/80 leading-tight">Families Blessed</p>
                </div>

                <div className="text-center mobile-space-y-2">
                  <CounterAnimation
                      end={10}
                      suffix="+"
                      className="mobile-text-3xl font-bold text-church-accent block"
                      duration={1800}
                  />
                  <p className="mobile-text-sm text-white/80 leading-tight">Ministry Programs</p>
                </div>
              </GridRevealContainer>
            </div>
          </section>
        </AnimatedSection>

        {/* Call to Action Section */}
        <section className="section-spacing church-gradient-hero text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 animate-float">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full glass-effect"></div>
            <div className="absolute top-40 right-20 w-24 h-24 rounded-full glass-effect"></div>
            <div className="absolute bottom-20 left-1/4 w-28 h-28 rounded-full glass-effect"></div>
            <div className="absolute bottom-10 right-1/3 w-20 h-20 rounded-full glass-effect"></div>
          </div>

          <div className="container mobile-container relative z-10">
            <div className="flex flex-col items-center justify-center mobile-space-y-8 text-center">
              <div className="mobile-space-y-6 animate-fade-in-up">
                <div className="mobile-space-y-4">
                  <p className="section-subtitle text-white/80">Join Our Family</p>
                  <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl text-balance leading-tight max-w-4xl text-white">
                    Become Part of Our Community
                  </h2>
                </div>
                <p className="lead-text mx-auto max-w-3xl text-white text-balance">
                  We'd love to have you join us for worship and become a part of
                  our growing church family. Experience God's love in action.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in-up-delay-2">
                <Button
                    size="lg"
                    variant="secondary"
                    className="magnetic-button mobile-button font-semibold rounded-full bg-white text-church-primary hover:bg-church-accent hover:text-church-primary-dark transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    asChild
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="bouncy-hover mobile-button font-semibold rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-church-primary transform hover:scale-105 transition-all duration-300 shadow-xl"
                    asChild
                >
                  <Link href="/members/login">Member Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
