import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ArrowLeft, BookOpen, Download, Award } from "lucide-react";
import { getCloudinaryImageUrl, churchImages } from "@/lib/cloudinary-client";

export default function WinningChurchWorkersPage() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Header */}
        <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-8 md:py-12 relative overflow-hidden">
          {/* Background Image with Blur */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${getCloudinaryImageUrl(churchImages.resources.winningChurch, { width: 1200, height: 800, crop: 'fill' })}')`,
              filter: 'blur(6px)',
              transform: 'scale(1.1)',
              opacity: 0.4
            }}
          />

          {/* Enhanced overlay for depth and readability - Made more transparent */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-800/20 to-purple-900/30" />

          <div className="container mx-auto px-4 relative z-10">
            <Link href="/pastor" className="inline-flex items-center text-blue-200 hover:text-white mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pastor's Page
            </Link>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="mobile-text-3xl font-bold mb-4 text-white drop-shadow-2xl">
                  The Winning Church Workers and Leaders
                </h1>
                <p className="text-xl text-blue-100 mb-4">
                  By Rev. Tunde Olufemi
                </p>
                <p className="text-blue-50 leading-relaxed">
                  A comprehensive guide for church workers and leaders on running the race set before them by God with the mandate to win.
                </p>
              </div>

              <div className="flex justify-center">
                <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
                  <Image
                      src={getCloudinaryImageUrl(churchImages.resources.winningChurch, { width: 400, height: 500, crop: 'fill' })}
                      alt="The Winning Church Workers and Leaders book cover"
                      fill
                      className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900 flex items-center">
                  <Award className="h-6 w-6 mr-3" />
                  Book Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    Many Workers in the church are more committed to their secular jobs than to their Christian ministries. The reason for this is not far-fetched. Their wrong perception of who God is and lack of proper orientation on the assignment they have, continue the main problem.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    This book has adequately addressed these problems. It portrays Christians and especially Church Workers as athletes who are running the race set before them by God with the mandate to win the race. The kind of race is that of purpose in destiny that has to be discovered because life purpose is not a personal decision but a personal discovery.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    The book presents specific functions of different Church Workers and Leaders in details thereby making it a manual to guide them in their functions. It also gives the details of how Workers can transform their potentials to excellence so that their work for the Lord may be done excellently.
                  </p>

                  <p className="text-gray-700 leading-relaxed font-semibold">
                    It is a companion for Pastors, Leaders and Workers.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Themes</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Running the Christian race to win</li>
                      <li>• Discovering life purpose in destiny</li>
                      <li>• Proper orientation for ministry assignments</li>
                      <li>• Transforming potentials to excellence</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Target Audience</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Pastors and Ministry Leaders</li>
                      <li>• Church Workers and Volunteers</li>
                      <li>• Christian Leaders seeking excellence</li>
                      <li>• Anyone in Kingdom service</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">What You'll Learn</h3>
                  <p className="text-gray-700">
                    This manual provides detailed guidance on the specific functions of different church workers and leaders, helping you understand your role and excel in your service to God. Learn how to transform your potential into excellence and ensure your work for the Lord is done with distinction.
                  </p>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Download className="mr-2 h-5 w-5" />
                    Request Full Copy
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/pastor">
                      <BookOpen className="mr-2 h-5 w-5" />
                      More Resources
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
  );
}
