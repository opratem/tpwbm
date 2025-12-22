"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, BookOpen, Users, Award, Play, Facebook, Instagram, ExternalLink } from "lucide-react";
import { getCloudinaryImageUrl, churchImages } from "@/lib/cloudinary-client";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { useState } from "react";

export default function PastorPage() {
  const [activeTab, setActiveTab] = useState("about");
  return (
      <div className="min-h-screen bg-background">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
        <PageHeader
          title="Pastor 'Tunde Olufemi"
          subtitle="The Presiding Pastor"
          description="A versatile preacher and teacher of the word, committed to raising a generation of believers who have understanding of the things of the Spirit and are rightly positioned to fulfil their part and purpose in destiny."
          backgroundImage="/images/background/pastor_background.jpg"
          minHeight="md"
          overlay="medium"
          blurBackground={true}
          backgroundPosition="50% 25%"
        />

        {/* Main Content */}
        <section className="mobile-section-spacing">
          <div className="container mobile-container mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="about">About Pastor</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="sermons">Sermons</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
                      About{" "}
                      <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                        Pastor
                      </span>
                    </CardTitle>
                    <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="mobile-text-base leading-relaxed text-gray-700">
                      Pastor 'Tunde Olufemi is a versatile preacher and teacher of the word. He is committed to raising a generation of believers who have understanding of the things of the Spirit and are rightly positioned to fulfil their part and purpose in destiny.
                    </p>
                    <p className="mobile-text-base leading-relaxed text-gray-700">
                      He is also an Author, Trainer and a Resource Person. He is the Convener of the Mobile Interdenominational Church Workers and Leaders Conferences. His Books and Resource Materials are in Circulation.
                    </p>
                    <p className="mobile-text-base leading-relaxed text-gray-700">
                      He is a graduate of the University of Nigeria Nsukka.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="text-center p-6 bg-secondary/10 rounded-lg">
                        <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="font-semibold mobile-text-lg mb-2">Author</h3>
                        <p className="text-gray-600">Over 20 published books and resources</p>
                      </div>
                      <div className="text-center p-6 bg-secondary/10 rounded-lg">
                        <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="font-semibold mobile-text-lg mb-2">Conference Convener</h3>
                        <p className="text-gray-600">Mobile Interdenominational Church Workers and Leaders Conferences</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-8">
                <div className="grid gap-8">
                  {/* Books Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                          Books
                        </span>
                      </CardTitle>
                      <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mt-2" />
                      <CardDescription>Published works by Pastor 'Tunde & Esther Olufemi</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Books with available content */}
                        <Link href="/resources/42-success-laws" className="flex items-center p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors group">
                          <BookOpen className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <span className="text-sm flex-1">42 Success Laws of Productive Church Workers</span>
                          <ExternalLink className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        <Link href="/resources/winning-church-workers" className="flex items-center p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors group">
                          <BookOpen className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <span className="text-sm flex-1">The Winning Church Workers and Leaders</span>
                          <ExternalLink className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        {/* Other books without links */}
                        {[
                          "Be a shining Star",
                          "Principles of Divine Healing",
                          "Rising Above Mediocrity",
                          "Excellence in Christian Service",
                          "Journey to Excellence",
                          "God's Strategic Plan for your Life",
                          "Partnership with God",
                          "Ministerial Ethics",
                          "Manifestation of the Sons of God",
                          "Breaking forth on every side",
                          "Isegun lori Awon Ogun to ndena Ogo (Iwe Adura)"
                        ].map((book, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <BookOpen className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                              <span className="text-sm">{book}</span>
                            </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resources for Pastors and Leaders */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
                        Resources for{" "}
                        <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                          Pastors and Leaders
                        </span>
                      </CardTitle>
                      <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                       ={[
                          "Competent, Fruitful & Fulfilling Ministers and Associate Ministers of Today",
                          "Understanding Your Spiritual Assignment",
                          "Rising Above Failure in Life and Ministry",
                          "Pursuing Your Purpose with Excellence",
                          "You must be a Finisher",
                          "How to escape the Dangers in Ministry",
                          "Building Excellent Relationships in the Ministry",
                          "A man of Vision and His family",
                          "How Evangelists can function within the Local Church Setting",
                          "Leading for Growth",
                          "Kingdom keys for Releasing Heavenly Treasures",
                          "Adding Virtue to Your Leadership Skill",
                          "The Ministers as Disciple Makers",
                          "Refresher Course Manual for Church and Ministry Heads, Workers and Staffs",
                          "The Concept of Excellent Leadership in Ministry",
                          "Pastoral Education",
                          "Effective Communication in Ministry"
                        ].map((resource, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <Users className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                              <span className="text-sm">{resource}</span>
                            </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Church Workers Training */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
                        Resources for{" "}
                        <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                          Church Workers Training
                        </span>
                      </CardTitle>
                      <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                       ={[
                          "Faithful and Committed Workers: the Urgent Need of the Present Day Church",
                          "The Dynamic Church Workers",
                          "Meaningful and Rewarding Service to the Lord",
                          "Acceptable and Profitable vessels in the Hands of God",
                          "Powerful, Progressive and Productive Workers",
                          "How to Witness and Win Souls",
                          "Teaching for Transformation",
                          "Building Capacity for Exploits",
                          "Functioning Effectively in the Teaching Ministry",
                          "Wasteful or Faithful Steward?",
                          "Dutiful, Productive and Profitable Workers",
                          "The Essentials of Church Growth",
                          "The Constant, Consistent and Committed Workers",
                          "Responsible, Resourceful and Relevant Workers",
                          "21st Century Church Workers: Builders or Destroyers?",
                          "The Informed and Transformed Church Workers",
                          "Skills for Effective and Efficient Service",
                          "The Fervent and Active Church Workers of the Last Days",
                          "Manners, Motives and Methods for Service",
                          "Church Workers and Leaders that make A Difference",
                          "Discover and Maintain Your Focus in Kingdom Service",
                          "Loyal and Disloyal Church Workers",
                          "How to Support and Strengthen Your Pastor",
                          "Traits of Great Supportive Church and Ministry Workers"
                        ].map((resource, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <Award className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                              <span className="text-sm">{resource}</span>
                            </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Audio CDs */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
                        Messages on{" "}
                        <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                          Audio CDs
                        </span>
                      </CardTitle>
                      <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                       ={[
                          "Strive for the Best",
                          "What Next, When Prayer seems to fail?",
                          "How to Make Your Marriage Work (for singles & married)",
                          "Women: Builders and not Destroyers",
                          "Agents of Destruction in Today's Church",
                          "Church Workers and Leaders, who are Builders with Christ"
                        ].map((audio, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <Play className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                              <span className="text-sm">{audio}</span>
                            </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Sermons Tab */}
              <TabsContent value="sermons" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
                      Pastor's{" "}
                      <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                        Sermons
                      </span>
                    </CardTitle>
                    <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mt-2" />
                    <CardDescription>Access all of Pastor 'Tunde Olufemi's messages and teachings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="mobile-text-lg font-semibold mb-4">Explore Complete Sermon Library</h3>
                      <p className="text-gray-600 mb-6">Visit our sermons page to watch, listen, and download Pastor's powerful messages and teachings.</p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                          <Link href="/sermons">
                            <Play className="mr-2 h-4 w-4" />
                            View All Sermons
                          </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                          <Link href="/audio-messages">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Audio Messages
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-8">
                <div className="max-w-4xl mx-auto">
                  {/* Hero Contact Section */}
                  <div className="text-center mb-12">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4">
                      Connect with{" "}
                      <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                        Pastor 'Tunde
                      </span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto mb-4" />
                    <p className="mobile-text-base text-gray-600 max-w-2xl mx-auto">
                      Reach out for spiritual guidance, ministry opportunities, or to invite Pastor 'Tunde for speaking engagements and conferences.
                    </p>
                  </div>

                  {/* Main Contact Card */}
                  <Card className="mb-8 overflow-hidden bg-gradient-to-r from-secondary/5 to-secondary/10 border-0 shadow-xl">
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Contact Methods */}
                        <div className="space-y-6">
                          <div className="flex items-start space-x-4 group">
                            <div className="bg-primary p-3 rounded-xl shadow-lg group-hover:bg-primary/90 transition-colors">
                              <Mail className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-medium text-primary mb-1 text-sm">Email</h3>
                              <a href="mailto:pastor@tpwbm.org" className="text-gray-700 hover:text-primary transition-colors font-medium">
                                tundeolufemi65@gmail.com
                              </a>
                            </div>
                          </div>

                          <div className="flex items-start space-x-4 group">
                            <div className="bg-primary p-3 rounded-xl shadow-lg group-hover:bg-primary/90 transition-colors">
                              <Phone className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-medium text-primary mb-1 text-sm">Phone</h3>
                              <p className="text-gray-700">+2348132675172</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-4 group">
                            <div className="bg-primary p-3 rounded-xl shadow-lg group-hover:bg-primary/90 transition-colors">
                              <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-medium text-primary mb-1 text-sm">Resources</h3>
                              <p className="text-gray-700">Books and materials available</p>
                            </div>
                          </div>
                        </div>

                        {/* Social Media & Quick Actions */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-medium text-primary mb-4 text-sm">Follow Pastor</h3>
                            <div className="flex flex-col space-y-3">
                              <a
                                  href="https://facebook.com/tunde.olufemi.1"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-100"
                              >
                                <div className="bg-primary p-2 rounded-lg group-hover:scale-110 transition-transform">
                                  <Facebook className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">Facebook</span>
                                <ExternalLink className="h-4 w-4 text-gray-400 ml-auto group-hover:text-primary transition-colors" />
                              </a>

                              <a
                                  href="https://instagram.com/past.tundeolufemmi"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-100"
                              >
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                  <Instagram className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-purple-600 transition-colors">Instagram</span>
                                <ExternalLink className="h-4 w-4 text-gray-400 ml-auto group-hover:text-purple-600 transition-colors" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ministry Focus */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                          Ministry Focus Areas
                        </span>
                      </CardTitle>
                      <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mt-2 mx-auto" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3 justify-center">
                       ={[
                          "Teaching & Preaching",
                          "Leadership Training",
                          "Church Workers Development",
                          "Conference Speaking",
                          "Marriage & Family Counseling",
                          "Youth Ministry"
                        ].map((focus, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="px-4 py-2 bg-secondary/20 text-primary hover:bg-secondary/30 transition-colors cursor-default"
                            >
                              {focus}
                            </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
  );
}
