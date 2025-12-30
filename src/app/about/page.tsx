import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getCloudinaryLeaderImage } from "@/lib/leader-images";
import { getCloudinaryImageUrl } from "@/lib/cloudinary-client";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/ui/page-header";

// Enable static generation with ISR
export const revalidate = 86400; // Revalidate once per day
export const dynamic = 'force-static';

export default function AboutPage() {
  // Get leader images
  const pastorTundeImage = getCloudinaryLeaderImage("Pastor Tunde Olufemi");
  const pastorEstherImage = getCloudinaryLeaderImage("Pastor Esther Olufemi");
  const deaconSofoworaImage = getCloudinaryLeaderImage("Dn. Sam. O Sofowora");

  // Get church history image from Cloudinary
  const churchHistoryImage = getCloudinaryImageUrl("Church2_g1vs2z", {
    width: 600,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section - Enhanced with gradient */}
      <PageHeader
        title="About Our Church"
        description="Discover our rich history, unwavering mission, and the values that have guided us since 1994."
        backgroundImage="/images/background/about_background.jpg"
        minHeight="sm"
        overlay="medium"
        blurBackground={true}
      />

      {/* Our History Section - Enhanced */}
      <section className="w-full mobile-section-spacing bg-gray-50 dark:bg-gray-900">
        <div className="container mobile-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            <div className="mobile-space-y-6">
              <div className="mobile-space-y-4">
                <h2 className="mobile-text-2xl font-bold tracking-tight">
                  Our{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                    History
                  </span>
                </h2>
                <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full" />
              </div>
              <div className="mobile-space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="mobile-text-base">
                  The Prevailing Word Believers Ministry Inc. was founded in 1994 by God's servant, <span className="font-semibold text-church-primary dark:text-church-accent">Pastor Tunde Olufemi</span>.
                </p>
                <p className="mobile-text-base">
                  What began as a small gathering in the apartment of one of our members has blossomed into a vibrant congregation, guided by God's grace. Over the years, we have moved from a temporary location to our current, beautiful facility, where we continue to grow as a spiritual family.
                </p>
                <p className="mobile-text-base">
                  Through decades of dedicated service, we have remained rooted in our core principles of faith, biblical service, and authentic community. As we continue to evolve, we remain committed to meeting the spiritual needs of our members and neighbors, always seeking to reflect God's love and truth.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
                <div className="bg-church-accent/20 dark:bg-church-accent/10 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl w-full sm:w-auto">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-church-primary dark:text-church-accent block">30+</span>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">Years of Service</p>
                </div>
                <div className="bg-church-accent/20 dark:bg-church-accent/10 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl w-full sm:w-auto">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-church-primary dark:text-church-accent block">1994</span>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">Founded</p>
                </div>
              </div>
            </div>

            {/* Church History Image - Using Church2_g1vs2z */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl group">
                <Image
                  src={churchHistoryImage}
                  alt="The Prevailing Word Believers Ministry Church"
                  width={600}
                  height={400}
                  className="object-cover w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
                  <p className="text-xs sm:text-sm md:text-base font-medium bg-black/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg backdrop-blur-sm">
                    Our Beautiful Church Home
                  </p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-church-accent/20 dark:bg-church-accent/10 rounded-full opacity-20" />
              <div className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-church-accent/30 dark:bg-church-accent/20 rounded-full opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values Section - Enhanced */}
      <section className="w-full mobile-section-spacing">
        <div className="container mobile-container">
          <div className="flex flex-col items-center justify-center mobile-space-y-4 text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="mobile-text-2xl font-bold tracking-tight">
              Our Mission &{" "}
              <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full" />
            <p className="mx-auto max-w-[800px] text-gray-500 mobile-text-base dark:text-gray-400 leading-relaxed px-4 sm:px-0">
              These sacred principles guide every aspect of our ministry and community life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Mission Card */}
            <div className="group bg-white dark:bg-gray-800 p-6 sm:p-7 md:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-church-accent/50 dark:hover:border-church-accent/50">
              <div className="mobile-space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-church-primary to-church-primary-light rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mobile-text-sm">
                  To raise peculiar people in the knowledge of the things of the Spirit through the word, so that they will become mature, useful and ready for the coming King.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group bg-white dark:bg-gray-800 p-6 sm:p-7 md:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-church-accent/50 dark:hover:border-church-accent/50">
              <div className="mobile-space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-church-accent to-church-accent rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mobile-text-sm">
                  To be a vibrant, growing church that transforms lives, strengthens families, and positively impacts our community through Christ's love.
                </p>
              </div>
            </div>

            {/* Values Card */}
            <div className="group bg-white dark:bg-gray-800 p-6 sm:p-7 md:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-church-accent/50 dark:hover:border-church-accent/50 sm:col-span-2 lg:col-span-1">
              <div className="mobile-space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-church-primary-light to-church-accent rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white">Core Values</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-2 sm:space-y-2.5">
                  <li className="flex items-center mobile-text-sm">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-church-primary rounded-full mr-2 sm:mr-3 flex-shrink-0" />
                    Biblical Teaching
                  </li>
                  <li className="flex items-center mobile-text-sm">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-church-primary rounded-full mr-2 sm:mr-3 flex-shrink-0" />
                    Authentic Worship
                  </li>
                  <li className="flex items-center mobile-text-sm">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-church-primary rounded-full mr-2 sm:mr-3 flex-shrink-0" />
                    Loving Community
                  </li>
                  <li className="flex items-center mobile-text-sm">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-church-primary rounded-full mr-2 sm:mr-3 flex-shrink-0" />
                    Compassionate Service
                  </li>
                  <li className="flex items-center mobile-text-sm">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-church-primary rounded-full mr-2 sm:mr-3 flex-shrink-0" />
                    Faithful Stewardship
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section - Enhanced */}
      <section className="w-full mobile-section-spacing bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mobile-container">
          <div className="flex flex-col items-center justify-center mobile-space-y-4 text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="mobile-text-2xl font-bold tracking-tight">
              Our{" "}
              <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                Leadership
              </span>
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full" />
            <p className="mx-auto max-w-[800px] text-gray-500 mobile-text-base dark:text-gray-400 leading-relaxed px-4 sm:px-0">
              Meet the dedicated servants who guide our spiritual journey with wisdom and love.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {/* Pastor Tunde Olufemi */}
            <div className="flex flex-col items-center text-center mobile-space-y-6 group">
              <div className="relative">
                <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-church-accent/20 to-church-accent/30 dark:from-church-accent/10 dark:to-church-accent/20 flex items-center justify-center overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  {pastorTundeImage ? (
                    <Image
                      src={pastorTundeImage}
                      alt="Pastor Tunde Olufemi"
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Photo</p>
                  )}
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-church-primary rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="mobile-space-y-2">
                <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white">Pastor Tunde Olufemi</h3>
                <p className="text-church-primary dark:text-church-accent font-semibold mobile-text-sm">Presiding Pastor</p>
                <p className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  Serving since 1995
                </p>
              </div>
            </div>

            {/* Pastor Esther Olufemi */}
            <div className="flex flex-col items-center text-center mobile-space-y-6 group">
              <div className="relative">
                <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-church-accent/20 to-church-accent/30 dark:from-church-accent/10 dark:to-church-accent/20 flex items-center justify-center overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  {pastorEstherImage ? (
                    <Image
                      src={pastorEstherImage}
                      alt="Pastor Esther Olufemi"
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Photo</p>
                  )}
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-church-primary-dark rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="mobile-space-y-2">
                <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white">Pastor Esther Olufemi</h3>
                <p className="text-church-primary-dark dark:text-church-accent font-semibold mobile-text-sm">Pastor</p>
                <p className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  Serving since 1999
                </p>
              </div>
            </div>

            {/* Deacon Sofowora */}
            <div className="flex flex-col items-center text-center mobile-space-y-6 group sm:col-span-2 lg:col-span-1">
              <div className="relative">
                <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-church-accent/20 to-church-accent/30 dark:from-church-accent/10 dark:to-church-accent/20 flex items-center justify-center overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  {deaconSofoworaImage ? (
                    <Image
                      src={deaconSofoworaImage}
                      alt="Deacon Sofowora"
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Photo</p>
                  )}
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-church-primary-dark rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="mobile-space-y-2">
                <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white">Deacon Sofowora</h3>
                <p className="text-church-primary-dark dark:text-church-accent font-semibold mobile-text-sm">Sunday School Director</p>
                <p className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  Serving since 2018
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12 md:mt-16">
            <Button size="lg" className="bg-gradient-to-r from-church-primary to-church-primary-light hover:from-church-primary-dark hover:to-church-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mobile-touch-target mobile-text-sm w-full sm:w-auto" asChild>
              <Link href="/leadership">
                View Complete Leadership Team
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="w-full mobile-section-spacing bg-gradient-to-r from-church-primary via-church-primary-light to-church-primary-dark text-white relative overflow-hidden">
        {/* Background Image with Blur */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background/about_background.jpg')",
            backgroundPosition: '50% 25%',
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        />

        {/* Enhanced overlay for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-church-primary/50 via-church-primary-light/30 to-church-primary-dark/50" />

        <div className="container mobile-container relative z-10">
          <div className="flex flex-col items-center justify-center mobile-space-y-8 text-center">
            <div className="mobile-space-y-4">
              <h2 className="mobile-text-2xl font-bold tracking-tighter text-white drop-shadow-2xl">
                Join Us This Sunday
              </h2>
              <p className="mx-auto max-w-[700px] text-white mobile-text-base leading-relaxed drop-shadow-lg px-4 sm:px-0">
                We'd love to have you worship with us and become part of our loving church family. Experience God's presence with us.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <Button size="lg" variant="secondary" className="bg-white text-church-primary hover:bg-church-accent px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mobile-touch-target mobile-text-sm w-full sm:w-auto" asChild>
                <Link href="/services">
                  Service Times
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-church-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mobile-touch-target mobile-text-sm w-full sm:w-auto" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
