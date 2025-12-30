"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw, Heart, Building2, HelpCircle, Phone, Mail, MessageSquare, CreditCard, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelledPage() {
  const handleRetryPayment = () => {
    // Navigate back to giving page with focus on payment form
    window.location.href = '/giving#payment-form';
  };

  const copyBankDetails = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Bank details copied to clipboard!');
    });
  };

  const bankDetails = {
    bankName: "Polaris Bank Plc.",
    accountName: "The Prevailing Word Believers Ministry",
    accountNumber: "1771931129"
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Main Cancelled Card */}
          <Card className="border-2 border-orange-200 shadow-2xl mb-8 overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-t-lg py-12 relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="bg-white/20 p-6 rounded-full">
                      <XCircle className="h-20 w-20 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2">
                      <Heart className="h-8 w-8 text-red-300 animate-pulse" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-4xl md:text-5xl font-bold mb-4">
                  Payment Paused
                </CardTitle>
                <p className="text-orange-100 text-xl max-w-2xl mx-auto leading-relaxed">
                  No worries! Your payment was cancelled, but your heart to give is still valued. Let's help you complete your generous gift.
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* What Happened Section */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 p-6 rounded-xl">
                <div className="flex items-start">
                  <HelpCircle className="h-6 w-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-orange-800 mb-3">What happened?</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Your payment process was interrupted before completion. This is completely normal and happens for various reasons:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                          Payment window was closed
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                          Session timed out
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                          Network connection issue
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                          Chose to try a different method
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* No Charges Section */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 p-6 rounded-xl">
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">
                    <RefreshCw className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-800 mb-2">Good News - No Charges Made!</h4>
                    <p className="text-emerald-700 leading-relaxed">
                      Rest assured, no money has been deducted from your account.
                      You can try again whenever you're ready to complete your donation, or choose an alternative giving method below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Retry Button */}
              <div className="text-center">
                <Button
                    onClick={handleRetryPayment}
                    className="h-16 px-8 text-lg font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <RefreshCw className="mr-3 h-6 w-6" />
                  Try Online Payment Again
                </Button>
                <p className="text-gray-600 text-sm mt-3">
                  Click here to return to the giving page and try again
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Giving Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Bank Transfer Option */}
            <Card className="border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-blue-50 rounded-t-lg">
                <CardTitle className="text-xl text-blue-900 flex items-center">
                  <Building2 className="h-6 w-6 mr-3" />
                  Bank Transfer
                </CardTitle>
                <p className="text-blue-700">Transfer directly to our church account</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid gap-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-blue-800">Bank Name:</span>
                        <div className="flex items-center">
                          <span className="text-blue-900 font-semibold">{bankDetails.bankName}</span>
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyBankDetails(bankDetails.bankName)}
                              className="ml-2 h-6 w-6 p-0 hover:bg-blue-100"
                          >
                            📋
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-blue-800">Account Name:</span>
                        <div className="flex items-center">
                          <span className="text-blue-900 font-semibold text-right max-w-[200px]">{bankDetails.accountName}</span>
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyBankDetails(bankDetails.accountName)}
                              className="ml-2 h-6 w-6 p-0 hover:bg-blue-100"
                          >
                            📋
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-blue-800">Account Number:</span>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-blue-900">{bankDetails.accountNumber}</span>
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyBankDetails(bankDetails.accountNumber)}
                              className="ml-2 h-6 w-6 p-0 hover:bg-blue-100"
                          >
                            📋
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      💡 <strong>Tip:</strong> Use your full name as the transaction reference for easy identification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile/USSD Option */}
            <Card className="border-2 border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-purple-50 rounded-t-lg">
                <CardTitle className="text-xl text-purple-900 flex items-center">
                  <Smartphone className="h-6 w-6 mr-3" />
                  Mobile Payment
                </CardTitle>
                <p className="text-purple-700">Use your mobile money or USSD</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Popular Options:</h4>
                    <ul className="space-y-2 text-sm text-purple-700">
                      <li className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Bank USSD codes (*901#, *919#, etc.)
                      </li>
                      <li className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Mobile banking apps
                      </li>
                      <li className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        Visit any bank branch
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <Button
                        onClick={handleRetryPayment}
                        variant="outline"
                        className="w-full border-purple-300 hover:bg-purple-50 hover:border-purple-500"
                    >
                      Try Online Payment Instead
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help & Support Section */}
          <Card className="border-2 border-gray-200 mb-8">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-xl text-gray-900 flex items-center">
                <MessageSquare className="h-6 w-6 mr-3" />
                Need Help? We're Here for You
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900 mb-1">Email Support</h4>
                  <a href="mailto:giving@tpwbm.org" className="text-blue-600 hover:underline text-sm">
                    giving@tpwbm.org
                  </a>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-900 mb-1">Phone Support</h4>
                  <p className="text-green-600 text-sm">Available upon request</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-900 mb-1">General Help</h4>
                  <Link href="/contact" className="text-purple-600 hover:underline text-sm">
                    Contact Form
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Encouragement Section */}
          <Card className="border-2 border-emerald-200 mb-8">
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-emerald-900 mb-4">Your Heart to Give Matters</h3>
              <blockquote className="text-lg italic text-emerald-800 mb-4 max-w-2xl mx-auto leading-relaxed">
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion,
                for God loves a cheerful giver."
              </blockquote>
              <cite className="text-emerald-600 font-semibold">2 Corinthians 9:7</cite>
              <p className="text-gray-600 mt-4">
                Don't let a technical hiccup discourage your generous spirit. Every gift, big or small, makes a difference in God's kingdom.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Button
                onClick={handleRetryPayment}
                className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Link href="/giving">
              <Button variant="outline" className="w-full h-12 border-2 border-blue-300 hover:bg-blue-50 transition-all duration-300">
                <Heart className="h-4 w-4 mr-2" />
                Giving Options
              </Button>
            </Link>

            <Link href="/contact">
              <Button variant="outline" className="w-full h-12 border-2 border-purple-300 hover:bg-purple-50 transition-all duration-300">
                <MessageSquare className="h-4 w-4 mr-2" />
                Get Help
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Footer Links */}
          <div className="text-center">
            <p className="text-gray-600 mb-3">
              Need help with giving or have questions about our ministries?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="mailto:giving@tpwbm.org" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors">
                Email Support
              </a>
              <span className="text-gray-400">|</span>
              <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors">
                Contact Us
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/faq" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors">
                FAQs
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/members/prayer" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors">
                Prayer Requests
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
