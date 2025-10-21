"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentForm } from "@/components/ui/payment-form";
import {
  Heart,
  Building2,
  Copy,
  CreditCard,
  Smartphone,
  Gift,
  Users,
  Church,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

export default function GivingPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const bankDetails = {
    bankName: "Polaris Bank Plc.",
    accountName: "The Prevailing Word Believers Ministry",
    accountNumber: "1771931129"
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        {/* Hero Section */}
        <section className="relative text-white mobile-section-spacing overflow-hidden min-h-[45vh] sm:min-h-[50vh] md:min-h-[55vh]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://cdn.prod.website-files.com/5f6b9a421d5a61e1d0cd9e3d/688cb0c35e70efa79104f99c_recurring-giving_kelly-sikkema-XX2WTbLr3r8-unsplash.jpeg"
              alt="Giving with Love Background"
              fill
              className="object-cover blur-sm"
              priority
            />
            {/* Light overlay for text readability - using church colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(218_31%_18%)]/70 via-black/40 to-[hsl(218_31%_18%)]/60"></div>
          </div>

          <div className="container mobile-container mx-auto text-center relative z-10 h-full flex items-center justify-center">
            <div className="max-w-3xl mx-auto mobile-space-y-6 w-full px-4 sm:px-0">
              <Heart className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-church-accent mx-auto drop-shadow-lg animate-in fade-in slide-in-from-top duration-1000 delay-200" />
              <h1 className="mobile-text-3xl font-bold text-white drop-shadow-lg animate-in fade-in slide-in-from-top duration-1000 delay-400"
                  style={{
                    textShadow: '0 0 30px rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.7), 0 0 15px hsl(45 56% 55% / 0.3)'
                  }}>
                Give with a Cheerful Heart
              </h1>
              <p className="mobile-text-base text-white font-light leading-relaxed drop-shadow-lg animate-in fade-in slide-in-from-top duration-1000 delay-600"
                 style={{
                   textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.3)'
                 }}>
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-800">
                <Badge variant="secondary" className="mobile-text-sm px-3 py-2 bg-white/95 text-church-primary shadow-lg transform hover:scale-105 transition-all duration-300 mobile-touch-target">
                  <Gift className="h-4 w-4 mr-2" />
                  Tithes & Offerings
                </Badge>
                <Badge variant="secondary" className="mobile-text-sm px-3 py-2 bg-white/95 text-church-primary shadow-lg transform hover:scale-105 transition-all duration-300 mobile-touch-target">
                  <Church className="h-4 w-4 mr-2" />
                  Building Fund
                </Badge>
                <Badge variant="secondary" className="mobile-text-sm px-3 py-2 bg-white/95 text-church-primary shadow-lg transform hover:scale-105 transition-all duration-300 mobile-touch-target">
                  <Users className="h-4 w-4 mr-2" />
                  Mission Support
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mobile-section-spacing">
          <div className="container mobile-container mx-auto max-w-4xl">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="mobile-text-2xl font-bold tracking-tight text-church-primary dark:text-church-accent mb-3 sm:mb-4">
                Ways to{" "}
                <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                  Give
                </span>
              </h2>
              <p className="mobile-text-base text-gray-600 dark:text-gray-300 px-4 sm:px-0">
                Choose the method that works best for you to support God's work
              </p>
            </div>

            <div className="grid gap-8">
              {/* Online Payment Platform */}
              <PaymentForm />

              {/* Bank Transfer */}
              <Card className="border-2 border-church-accent/30">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-church-primary flex items-center">
                    <Building2 className="h-6 w-6 mr-3" />
                    Bank Transfer
                  </CardTitle>
                  <p className="text-gray-600">Transfer directly to our church account</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-church-accent/10 p-6 rounded-lg">
                    <div className="grid gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Bank Name</label>
                          <p className="text-lg font-semibold text-gray-900">{bankDetails.bankName}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(bankDetails.bankName, 'bankName')}
                            className="flex items-center gap-2"
                        >
                          {copiedField === 'bankName' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                              <Copy className="h-4 w-4" />
                          )}
                          {copiedField === 'bankName' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Account Name</label>
                          <p className="text-lg font-semibold text-gray-900">{bankDetails.accountName}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(bankDetails.accountName, 'accountName')}
                            className="flex items-center gap-2"
                        >
                          {copiedField === 'accountName' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                              <Copy className="h-4 w-4" />
                          )}
                          {copiedField === 'accountName' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Account Number</label>
                          <p className="text-2xl font-bold text-church-primary">{bankDetails.accountNumber}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(bankDetails.accountNumber, 'accountNumber')}
                            className="flex items-center gap-2"
                        >
                          {copiedField === 'accountNumber' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                              <Copy className="h-4 w-4" />
                          )}
                          {copiedField === 'accountNumber' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-church-accent/20 border border-church-accent/30 p-4 rounded-lg">
                    <h4 className="text-base md:text-lg font-semibold text-church-primary mb-2">Important Note:</h4>
                    <p className="text-church-primary/80">
                      Please use your full name as the transaction reference so we can properly acknowledge your giving.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Giving Guidelines */}
              <Card className="bg-church-primary/5 border-church-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-church-primary flex items-center">
                    <Heart className="h-6 w-6 mr-3" />
                    Giving Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-church-primary mb-3">Types of Giving</h4>
                      <ul className="space-y-2 text-church-primary/80">
                        <li>• <strong>Tithes:</strong> 10% of your income</li>
                        <li>• <strong>Offerings:</strong> Freewill gifts to God</li>
                        <li>• <strong>Building Fund:</strong> Support for church infrastructure</li>
                        <li>• <strong>Mission Support:</strong> Evangelism and outreach</li>
                        <li>• <strong>Special Projects:</strong> Specific ministry needs</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-church-primary mb-3">Giving Principles</h4>
                      <ul className="space-y-2 text-church-primary/80">
                        <li>• Give with a cheerful heart</li>
                        <li>• Give as you have purposed</li>
                        <li>• Give consistently and faithfully</li>
                        <li>• Give with thanksgiving</li>
                        <li>• Give to honor God</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-[hsl(var(--church-primary))]">Need Help with Giving?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you have any questions about giving or need assistance with your donation, please contact us:
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline">
                    Email: prevailingword95@gmail.com
                  </Button>
                  <Button variant="outline">
                    Phone: Available upon request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
  );
}
