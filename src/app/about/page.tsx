import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getCloudinaryLeaderImage } from "@/lib/leader-images";
import { getCloudinaryImageUrl } from "@/lib/cloudinary-client";

export const metadata = {
  title: "About Us | The Prevailing Word Believers Ministry Inc.",
  description: "Learn about our history, mission, values, and leadership at The Prevailing Word Believers Ministry Inc..",
};

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
        {/* Hero Section - Enhanced with gradient */}
        <section className="relative w-full py-8 md:py-12 bg-gradient-to-br from-church-primary-dark via-church-primary to-church-secondary text-white overflow-hidden">
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

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="mobile-text-3xl font-bold tracking-tighter text-white drop-shadow-2xl">
                  About Our Church
                </h1>
                <p className="mx-auto max-w-[800px] text-white mobile-text-lg font-light leading-relaxed drop-shadow-lg">
                  Discover our rich history, unwavering mission, and the values that have guided us since 1994.
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-8">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-white" />
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-white" />
              </div>
            </div>
          </div>
        </section>

        {/* Our History Section - Enhanced */}
        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                    Our{" "}
                    <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                      History
                    </span>
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full" />
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p className="mobile-text-base">
                    The Prevailing Word Believers Ministry Inc. was founded in 1994 by God's servant, Pastor Tunde Olufemi. <span className="font-semibold text-church-primary dark:text-church-accent">Pastor Tunde Olufemi</span>.
                  </p>
                  <p>
                    What began as a small gathering in the apartment of one of our members has blossomed into a vibrant congregation, guided by God's grace. Over the years, we have moved from a temporary location to our current, beautiful facility, where we continue to grow as a spiritual family.
                  </p>
                  <p>
                    Through decades of dedicated service, we have remained rooted in our core principles of faith, biblical service, and authentic community. As we continue to evolve, we remain committed to meeting the spiritual needs of our members and neighbors, always seeking to reflect God's love and truth.
                  </p>
                </div>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="bg-church-accent/20 dark:bg-church-accent/10 p-3 rounded-lg">
                    <span className="text-2xl font-bold text-church-primary dark:text-church-accent">30+</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Years of Service</p>
                  </div>
                  <div className="bg-church-accent/20 dark:bg-church-accent/10 p-3 rounded-lg">
                    <span className="text-2xl font-bold text-church-primary dark:text-church-accent">1994</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Founded</p>
                  </div>
                </div>
              </div>

              {/* Church History Image - Using Church2_g1vs2z */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                  <Image
                      src={churchHistoryImage}
                      alt="The Prevailing Word Believers Ministry Church"
                      width={600}
                      height={400}
                      className="object-cover w-full h-[400px] transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm">
                      Our Beautiful Church Home
                    </p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-church-accent/20 dark:bg-church-accent/10 rounded-full opacity-20" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-church-accent/30 dark:bg-church-accent/20 rounded-full opacity-30" />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission & Values Section - Enhanced */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                Our Mission &{" "}
                <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                  Values
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full" />
              <p className="mx-auto max-w-[800px] text-gray-500 md:text-xl dark:text-gray-400 leading-relaxed">
                These sacred principles guide every aspect of our ministry and community life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mission Card */}
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-church-accent/50 dark:hover:border-church-accent/50">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-church-primary to-church-primary-light rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white">Our Mission</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    To raise peculiar people in the knowledge of the things of the Spirit through the word, so that they will become mature, useful and ready for the coming King.
                  </p>
                </div>
              </div>

              {/* Vision Card */}
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-church-accent/50 dark:hover:border-church-accent/50">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-church-accent to-church-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white">Our Vision</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    To be a vibrant, growing church that transforms lives, strengthens families, and positively impacts our community through Christ's love.
                  </p>
                </div>
              </div>

              {/* Values Card */}
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-church-accent/50 dark:hover:border-church-accent/50">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-church-primary-light to-church-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white">Core Values</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-church-primary rounded-full mr-3" />
                      Biblical Teaching
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-church-primary rounded-full mr-3" />
                      Authentic Worship
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-church-primary rounded-full mr-3" />
                      Loving Community
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-church-primary rounded-full mr-3" />
                      Compassionate Service
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-church-primary rounded-full mr-3" />
                      Faithful Stewardship
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section - Enhanced */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="mobile-text-2xl font-bold tracking-tight">
                Our{" "}
                <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                  Leadership
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full" />
              <p className="mx-auto max-w-[800px] text-gray-500 md:text-xl dark:text-gray-400 leading-relaxed">
                Meet the dedicated servants who guide our spiritual journey with wisdom and love.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Pastor Tunde Olufemi */}
              <div className="flex flex-col items-center text-center space-y-6 group">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-church-accent/20 to-church-accent/30 dark:from-church-accent/10 dark:to-church-accent/20 flex items-center justify-center overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    {pastorTundeImage ? (
                        <Image
                            src={pastorTundeImage}
                            alt="Pastor Tunde Olufemi"
                            width={160}
                            height={160}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Photo</p>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-church-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white">Pastor Tunde Olufemi</h3>
                  <p className="text-church-primary dark:text-church-accent font-semibold">Presiding Pastor</p>
                  <p className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                    Serving since 1995
                  </p>
                </div>
              </div>

              {/* Pastor Esther Olufemi */}
              <div className="flex flex-col items-center text-center space-y-6 group">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-church-accent/20 to-church-accent/30 dark:from-church-accent/10 dark:to-church-accent/20 flex items-center justify-center overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    {pastorEstherImage ? (
                        <Image
                            src={pastorEstherImage}
                            alt="Pastor Esther Olufemi"
                            width={160}
                            height={160}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Photo</p>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-church-primary-dark rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white">Pastor Esther Olufemi</h3>
                  <p className="text-church-primary-dark dark:text-church-accent font-semibold">Pastor</p>
                  <p className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                    Serving since 1999
                  </p>
                </div>
              </div>

              {/* Deacon Sofowora */}
              <div className="flex flex-col items-center text-center space-y-6 group">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-church-accent/20 to-church-accent/30 dark:from-church-accent/10 dark:to-church-accent/20 flex items-center justify-center overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    {deaconSofoworaImage ? (
                        <Image
                            src={deaconSofoworaImage}
                            alt="Deacon Sofowora"
                            width={160}
                            height={160}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Photo</p>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-church-primary-dark rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white">Deacon Sofowora</h3>
                  <p className="text-church-primary-dark dark:text-church-accent font-semibold">Sunday School Director</p>
                  <p className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                    Serving since 2018
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <Button size="lg" className="bg-gradient-to-r from-church-primary to-church-primary-light hover:from-church-primary-dark hover:to-church-primary text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link href="/leadership">
                  View Complete Leadership Team
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Call to Action - Enhanced */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-r from-church-primary via-church-primary-light to-church-primary-dark text-white relative overflow-hidden">
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

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="mobile-text-2xl font-bold tracking-tighter text-white drop-shadow-2xl">
                  Join Us This Sunday
                </h2>
                <p className="mx-auto max-w-[700px] text-white md:text-xl leading-relaxed drop-shadow-lg">
                  We'd love to have you worship with us and become part of our loving church family. Experience God's presence with us.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="bg-white text-church-primary hover:bg-church-accent px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <Link href="/services">
                    Service Times
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-church-primary px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
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
