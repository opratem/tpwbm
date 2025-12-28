import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ArrowLeft, BookOpen, Download } from "lucide-react";
import { getCloudinaryImageUrl, churchImages } from "@/lib/cloudinary-client";

export default function FortyTwoSuccessLawsPage() {
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
            backgroundImage: `url('${getCloudinaryImageUrl(churchImages.resources.successLaws, { width: 1200, height: 800, crop: 'fill' })}')`,
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
                42 Success Laws of Productive Church Workers
              </h1>
              <p className="text-xl text-blue-100 mb-4">
                By Rev. Tunde Olufemi
              </p>
              <p className="text-blue-50 leading-relaxed">
                A comprehensive guide highlighting success laws that must be obeyed for effectiveness and productivity in Kingdom assignments.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
                <Image
                  src={getCloudinaryImageUrl(churchImages.resources.successLaws, { width: 400, height: 500, crop: 'fill' })}
                  alt="42 Success Laws of Productive Church Workers book cover"
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
                <BookOpen className="h-6 w-6 mr-3" />
                Book Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Effectiveness and Productivity are the hallmark to any assignment. It usually forms the basis upon which one is rewarded which is why you see people put in their best to be effective and productive.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  A productive worker has result at the ultimate goal for what he does for the Church or Ministry. For this goal to be realized, certain laws must be in place because satisfactory progress and productivity anchors on certain fundamental laws.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  The book has highlighted success laws, that we must be obey for us to be effective and productive in our Kingdom assignments.
                </p>

                <p className="text-gray-700 leading-relaxed font-semibold">
                  In a companion for all Church or Members, Workers, Leaders and Ministers
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">About This Resource</h3>
                <p className="text-gray-700">
                  This book serves as an essential guide for anyone involved in church ministry, providing practical laws and principles that lead to success in Kingdom work. Whether you're a church worker, leader, or minister, these success laws will help you maximize your effectiveness in serving God.
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
