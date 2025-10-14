"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowLeft, Receipt, Share2, Heart, Gift, Users, Calendar, Sparkles, Star, Trophy } from 'lucide-react';
import Link from 'next/link';

interface PaymentInfo {
  reference: string;
  amount: number;
  email: string;
  status: string;
  paid_at: string;
  purpose: string;
  full_name: string;
  phone: string;
  gateway_response: string;
  channel: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const reference = searchParams.get('reference');

    if (reference) {
      verifyPayment(reference);
    } else {
      setError('No payment reference found');
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (paymentInfo) {
      setShowCelebration(true);
    }
  }, [paymentInfo]);

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch(`/api/payments/verify?reference=${reference}`);
      const result = await response.json();

      if (result.success) {
        setPaymentInfo(result.payment);
      } else {
        setError(result.message || 'Payment verification failed');
      }
    } catch (err) {
      setError('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = () => {
    if (!paymentInfo) return;

    const receiptContent = `
PAYMENT RECEIPT
===============

The Prevailing Word Believers Ministry
Church Offering Receipt

Transaction Reference: ${paymentInfo.reference}
Donor Name: ${paymentInfo.full_name}
Email: ${paymentInfo.email}
Phone: ${paymentInfo.phone}
Purpose: ${paymentInfo.purpose}
Amount: ₦${paymentInfo.amount.toLocaleString()}
Payment Method: ${paymentInfo.channel}
Date: ${new Date(paymentInfo.paid_at).toLocaleDateString()}
Status: ${paymentInfo.status}

Thank you for your generous contribution!
God bless you abundantly.

"Each of you should give what you have decided in your heart to give,
not reluctantly or under compulsion, for God loves a cheerful giver."
- 2 Corinthians 9:7
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TPWBM_Receipt_${paymentInfo.reference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const shareSuccess = async () => {
    if (!paymentInfo) return;

    const shareData = {
      title: 'I just gave to The Prevailing Word Believers Ministry',
      text: `I just contributed ₦${paymentInfo.amount.toLocaleString()} to support God's work at TPWBM. Join me in giving!`,
      url: window.location.origin + '/giving'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support native sharing
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const getImpactMessage = (amount: number) => {
    if (amount >= 50000) return "Your generous gift can support a month of ministry activities!";
    if (amount >= 20000) return "Your donation can help feed families in our community outreach!";
    if (amount >= 10000) return "Your gift can support our youth ministry programs!";
    if (amount >= 5000) return "Your offering can help with our weekly service needs!";
    return "Every gift makes a difference in God's kingdom!";
  };

  const getSuccessTitle = (purpose: string) => {
    const purposeMap: { [key: string]: string } = {
      'tithe': 'Tithe Received!',
      'general offering': 'Offering Received!',
      'building fund': 'Building Fund Gift Received!',
      'mission support': 'Mission Support Received!',
      'special project': 'Special Project Gift Received!',
      'thanksgiving offering': 'Thanksgiving Offering Received!'
    };

    const normalizedPurpose = purpose.toLowerCase();
    return purposeMap[normalizedPurpose] || 'Gift Received!';
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-6"></div>
              <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-emerald-600 animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg font-medium">Verifying your generous gift...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="max-w-md mx-auto border-red-200 shadow-xl">
            <CardHeader className="text-center bg-red-500 text-white rounded-t-lg">
              <CardTitle className="text-red-100 flex items-center justify-center">
                <Gift className="h-6 w-6 mr-2" />
                Payment Verification Issue
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6 p-6">
              <p className="text-gray-600">{error}</p>
              <Link href="/giving">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Giving Page
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-8">
        {/* Celebration Animation */}
        {showCelebration && (
            <div className="fixed inset-0 pointer-events-none z-50">
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-bounce"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    >
                      <Sparkles className="h-4 w-4 text-yellow-400 opacity-80" />
                    </div>
                ))}
              </div>
            </div>
        )}

        <div className="container mx-auto px-4 max-w-4xl">
          {/* Main Success Card */}
          <Card className="border-2 border-emerald-200 shadow-2xl mb-8 overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white rounded-t-lg py-12 relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="bg-white/20 p-6 rounded-full animate-pulse">
                      <CheckCircle className="h-20 w-20 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Trophy className="h-8 w-8 text-yellow-300 animate-bounce" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-4xl md:text-5xl font-bold mb-4">
                  {paymentInfo ? getSuccessTitle(paymentInfo.purpose) : 'Gift Received!'} 🎉
                </CardTitle>
                <p className="text-emerald-100 text-xl max-w-2xl mx-auto leading-relaxed">
                  Thank you for your generous heart and faithful giving. Your contribution is making a real difference in God's kingdom!
                </p>
              </div>
            </CardHeader>

            {paymentInfo && (
                <CardContent className="p-8 space-y-8">
                  {/* Impact Statement */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 p-6 rounded-xl text-center">
                    <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">Your Impact</h3>
                    <p className="text-yellow-700 text-lg font-medium">
                      {getImpactMessage(paymentInfo.amount)}
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-xl">
                      <h3 className="font-bold text-emerald-800 mb-4 flex items-center">
                        <Receipt className="h-5 w-5 mr-2" />
                        Payment Details
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Reference:</span>
                          <span className="font-mono text-gray-800 bg-white px-2 py-1 rounded">
                            {paymentInfo.reference}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-2xl text-emerald-600">
                            ₦{paymentInfo.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Purpose:</span>
                          <span className="text-gray-800 font-medium">{paymentInfo.purpose}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="text-gray-800 capitalize font-medium">{paymentInfo.channel}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Date:</span>
                          <span className="text-gray-800 font-medium">
                            {new Date(paymentInfo.paid_at).toLocaleDateString('en-NG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
                      <h4 className="font-bold text-blue-800 mb-4 flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Donor Information
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Name:</span>
                          <span className="text-gray-800 font-medium">{paymentInfo.full_name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Email:</span>
                          <span className="text-gray-800">{paymentInfo.email}</span>
                        </div>
                        {paymentInfo.phone && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Phone:</span>
                              <span className="text-gray-800">{paymentInfo.phone}</span>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Scripture */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 p-8 rounded-xl text-center">
                    <Heart className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                    <blockquote className="text-lg italic text-purple-800 mb-3 leading-relaxed">
                      "Give, and it will be given to you. A good measure, pressed down, shaken together and running over,
                      will be poured into your lap. For with the measure you use, it will be measured to you."
                    </blockquote>
                    <cite className="text-purple-600 font-semibold">Luke 6:38</cite>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                        onClick={generateReceipt}
                        variant="outline"
                        className="h-12 border-2 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-500 transition-all duration-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>

                    <Button
                        onClick={shareSuccess}
                        variant="outline"
                        className="h-12 border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-500 transition-all duration-300"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Impact
                    </Button>

                    <Link href="/giving">
                      <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 transition-all duration-300">
                        <Heart className="mr-2 h-4 w-4" />
                        Give Again
                      </Button>
                    </Link>

                    <Link href="/">
                      <Button variant="outline" className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </CardContent>
            )}
          </Card>

          {/* Next Steps Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-emerald-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Join Us This Sunday</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Experience worship and fellowship with our church family
                </p>
                <Link href="/services">
                  <Button variant="outline" size="sm" className="border-emerald-300 hover:bg-emerald-50">
                    Service Times
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Get Connected</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Join our ministries and find your place in our community
                </p>
                <Link href="/ministries/women">
                  <Button variant="outline" size="sm" className="border-blue-300 hover:bg-blue-50">
                    Explore Ministries
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Gift className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Stay Updated</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get updates on how your gifts are making a difference
                </p>
                <Link href="/announcements">
                  <Button variant="outline" size="sm" className="border-purple-300 hover:bg-purple-50">
                    View Updates
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Questions about your donation or need prayer support?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="mailto:giving@tpwbm.org" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors">
                giving@tpwbm.org
              </a>
              <span className="text-gray-400">|</span>
              <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors">
                Contact Us
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

function LoadingFallback() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
  );
}

export default function PaymentSuccessPage() {
  return (
      <Suspense fallback={<LoadingFallback />}>
        <PaymentSuccessContent />
      </Suspense>
  );
}
