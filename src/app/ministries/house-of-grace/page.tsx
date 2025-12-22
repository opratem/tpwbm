import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { MapPin, Clock, Phone, Mail, Users, Calendar } from "lucide-react";
import AnimatedSection from "@/components/ui/animated-section";

export default function HouseOfGracePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="mobile-text-3xl font-bold mb-6">
                TPWBM House of Grace
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                A Branch of The Prevailing Word Believers Ministry Inc.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="px-4 py-2 text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  Obantoko Branch
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-lg">
                  <Users className="h-5 w-5 mr-2" />
                  Growing Community
                </Badge>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Location & Contact Info */}
        <AnimatedSection>
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Location & Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Visit Us</h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">
                        Off Peace Avenue, Unity Estate<br />
                        Gbonagun, Obantoko<br />
                        Ogun State, Nigeria
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium">Service Times</p>
                      <p className="text-gray-600">
                        Sunday Service: 8:00 AM - 11:00 AM<br />
                        Wednesday Bible Study: 6:00 PM - 8:00 PM<br />
                        Friday Prayer Service: 6:00 PM - 8:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">+234 (0) 123 456 7890</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">houseofgrace@tpwbm.org</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Branch Pastor</p>
                      <p className="text-gray-600">Pastor [Name]</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* About Section */}
        <AnimatedSection>
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">About TPWBM House of Grace</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  TPWBM House of Grace is a vibrant branch of The Prevailing Word Believers Ministry,
                  strategically located in the heart of Obantoko community. We are committed to
                  spreading the Gospel of Jesus Christ and building a strong Christian community
                  in Unity Estate and surrounding areas.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Our mission is to provide a spiritual home where believers can grow in faith,
                  fellowship with one another, and serve the community with the love of Christ.
                  We welcome everyone - families, singles, young and old - to join us in worship
                  and fellowship.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-blue-600">Our Vision</h4>
                    <p className="text-gray-700">
                      To be a lighthouse of hope and transformation in Obantoko and beyond,
                      demonstrating God's love through practical ministry and community impact.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-blue-600">Our Mission</h4>
                    <p className="text-gray-700">
                      To equip believers for effective Christian living, provide spiritual
                      guidance, and serve our community with excellence and integrity.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Ministries & Programs */}
        <AnimatedSection>
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Ministries & Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Adult Ministry</h4>
                  <p className="text-gray-600 text-sm">
                    Bible studies, fellowship, and spiritual growth programs for adults
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Youth Ministry</h4>
                  <p className="text-gray-600 text-sm">
                    Dynamic programs designed to engage and empower young people
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Children's Ministry</h4>
                  <p className="text-gray-600 text-sm">
                    Fun and educational programs to build strong foundations in children
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-pink-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Women's Ministry</h4>
                  <p className="text-gray-600 text-sm">
                    Empowering women through fellowship, prayer, and community service
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Men's Ministry</h4>
                  <p className="text-gray-600 text-sm">
                    Building godly men through fellowship and accountability
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-teal-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Community Outreach</h4>
                  <p className="text-gray-600 text-sm">
                    Serving the Obantoko community through various outreach programs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Call to Action */}
        <AnimatedSection>
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="text-center py-12">
              <h3 className="text-3xl font-bold mb-4">Join Our Community</h3>
              <p className="text-xl mb-8 opacity-90">
                Experience the love of Christ and grow in faith at TPWBM House of Grace
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/contact"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="/events"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  View Events
                </a>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}
