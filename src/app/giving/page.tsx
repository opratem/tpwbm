"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
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
  CheckCircle,
  Shield,
  Lock,
  TrendingUp
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
        <PageHeader
          title="Give with Love"
          description="Your generosity helps us spread God's love and support our mission to serve the community."
          backgroundImage="https://cdn.prod.website-files.com/5f6b9a421d5a61e1d0cd9e3d/688cb0c35e70efa79104f99c_recurring-giving_kelly-sikkema-XX2WTbLr3r8-unsplash.jpeg"
          minHeight="sm"
          overlay="medium"
          blurBackground={true}
        />

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
              {/* Trust & Security Banner */}
              <Card className="border-2 border-green-500/30 bg-green-50/50 dark:bg-green-900/10">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center sm:text-left">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                      <span className="text-sm sm:text-base font-semibold text-green-800 dark:text-green-300">
                        Secure & Encrypted
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                      <span className="text-sm sm:text-base font-semibold text-green-800 dark:text-green-300">
                        100% Confidential
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                      <span className="text-sm sm:text-base font-semibold text-green-800 dark:text-green-300">
                        Tax Deductible
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 my-6 sm:my-8">
                <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-church-primary dark:text-church-accent mb-2">
                    500+
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">Lives Impacted Weekly</p>
                </Card>
                <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-church-primary dark:text-church-accent mb-2">
                    30+
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">Years of Ministry</p>
                </Card>
                <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-church-primary dark:text-church-accent mb-2">
                    100%
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">Goes to Ministry</p>
                </Card>
              </div>

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
