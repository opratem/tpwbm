"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Lock, Loader2, Heart, Shield, CheckCircle2, Gift, Smartphone, Building2 } from 'lucide-react';
import { usePaystack } from '@/hooks/usePaystack';

const GIVING_PURPOSES = [
  { value: 'tithe', label: 'Tithe', description: '10% of your income', icon: Heart },
  { value: 'offering', label: 'General Offering', description: 'Freewill gift to God', icon: Heart },
  { value: 'building_fund', label: 'Building Fund', description: 'Church infrastructure', icon: Building2 },
  { value: 'mission_support', label: 'Mission Support', description: 'Evangelism and outreach', icon: Heart },
  { value: 'special_project', label: 'Special Project', description: 'Specific ministry needs', icon: Heart },
  { value: 'thanksgiving', label: 'Thanksgiving Offering', description: 'Gratitude offering', icon: Heart },
];

const PRESET_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

interface PaymentFormProps {
  className?: string;
}

export function PaymentForm({ className }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    amount: '',
    purpose: '',
  });
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const { initiatePayment, loading, error } = usePaystack();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    setFormData(prev => ({ ...prev, amount: value }));
  };

  const validateForm = () => {
    const { full_name, email, amount, purpose } = formData;

    if (!full_name.trim()) return 'Full name is required';
    if (!email.trim()) return 'Email is required';
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) < 100) return 'Amount must be at least ₦100';
    if (!purpose) return 'Please select a giving purpose';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    const paymentConfig = {
      email: formData.email.trim(),
      amount: Number(formData.amount),
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim(),
      purpose: GIVING_PURPOSES.find(p => p.value === formData.purpose)?.label || formData.purpose,
    };

    await initiatePayment(paymentConfig);
  };

  const selectedPurpose = GIVING_PURPOSES.find(p => p.value === formData.purpose);
  const isStepComplete = (step: number) => {
    if (step === 1) return formData.full_name && formData.email;
    if (step === 2) return formData.purpose;
    if (step === 3) return formData.amount;
    return false;
  };

  return (
      <Card className={`${className} bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1`}>
        <CardHeader className="bg-church-primary text-white rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <CardTitle className="text-xl md:text-2xl font-bold flex items-center mb-2">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <Heart className="h-8 w-8" />
              </div>
              Online Giving
            </CardTitle>
            <p className="text-white/90 mobile-text-base">
              Give securely with multiple payment options
            </p>
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center text-white/90">
                <Shield className="h-4 w-4 mr-2" />
                <span className="mobile-text-sm">256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center text-white/90">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <span className="mobile-text-sm">Instant Receipt</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentStep >= step
                          ? 'bg-church-accent text-church-primary shadow-lg'
                          : isStepComplete(step)
                              ? 'bg-church-accent/20 text-church-primary border-2 border-church-accent'
                              : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isStepComplete(step) && currentStep > step ?
                        <CheckCircle2 className="h-5 w-5" /> :
                        step
                    }
                  </div>
                  {step < 3 && (
                      <div className={`w-20 h-1 mx-2 rounded transition-all duration-300 ${
                          currentStep > step || isStepComplete(step + 1)
                              ? 'bg-church-accent'
                              : 'bg-gray-200'
                      }`} />
                  )}
                </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Personal Information */}
            <div className={`space-y-6 transition-all duration-500 ${currentStep === 1 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="flex items-center mb-4">
                <Gift className="h-6 w-6 text-church-accent mr-3" />
                <h3 className="mobile-text-xl font-semibold text-church-primary">Personal Information</h3>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Label htmlFor="full_name" className="text-sm font-medium text-church-text-muted mb-2 block">Full Name *</Label>
                  <Input
                      id="full_name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-church-accent focus:ring-church-accent/20 transition-all duration-300"
                      required
                  />
                  {formData.full_name && (
                      <CheckCircle2 className="absolute right-3 top-10 h-5 w-5 text-church-accent" />
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Label htmlFor="email" className="text-sm font-medium text-church-text-muted mb-2 block">Email Address *</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-church-accent focus:ring-church-accent/20 transition-all duration-300"
                        required
                    />
                    {formData.email && formData.email.includes('@') && (
                        <CheckCircle2 className="absolute right-3 top-10 h-5 w-5 text-church-accent" />
                    )}
                  </div>
                  <div className="relative">
                    <Label htmlFor="phone" className="text-sm font-medium text-church-text-muted mb-2 block">Phone Number <span className="text-gray-500">(Optional)</span></Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="080xxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-church-accent focus:ring-church-accent/20 transition-all duration-300"
                    />
                    <Smartphone className="absolute right-3 top-10 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {isStepComplete(1) && (
                  <Button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full h-12 bg-church-primary hover:bg-church-primary-dark text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Continue to Purpose Selection
                  </Button>
              )}
            </div>

            {/* Step 2: Giving Purpose */}
            <div className={`space-y-6 transition-all duration-500 ${currentStep === 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-church-accent mr-3" />
                <h3 className="text-xl font-semibold text-church-text">Purpose of Giving</h3>
              </div>

              <div className="grid gap-3">
                {GIVING_PURPOSES.map((purpose) => {
                  const IconComponent = purpose.icon;
                  return (
                      <div
                          key={purpose.value}
                          onClick={() => handleInputChange('purpose', purpose.value)}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                              formData.purpose === purpose.value
                                  ? 'border-church-accent bg-church-accent/10 shadow-lg'
                                  : 'border-gray-200 hover:border-church-accent bg-white hover:bg-church-accent/10'
                          }`}
                      >
                        <div className="flex items-center">
                          <IconComponent className="h-5 w-5 text-church-accent mr-3" />
                          <div className="flex-1">
                            <div className="font-semibold text-church-text">{purpose.label}</div>
                            <div className="text-sm text-church-text-muted">{purpose.description}</div>
                          </div>
                          {formData.purpose === purpose.value && (
                              <CheckCircle2 className="h-5 w-5 text-church-accent" />
                          )}
                        </div>
                      </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 h-12 border-2 border-gray-300 rounded-xl"
                >
                  Back
                </Button>
                {isStepComplete(2) && (
                    <Button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="flex-1 h-12 bg-church-primary hover:bg-church-primary-dark text-white rounded-xl font-semibold transition-all duration-300"
                    >
                      Continue to Amount
                    </Button>
                )}
              </div>
            </div>

            {/* Step 3: Amount Selection */}
            <div className={`space-y-6 transition-all duration-500 ${currentStep === 3 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="flex items-center mb-4">
                <Gift className="h-6 w-6 text-church-accent mr-3" />
                <h3 className="text-xl font-semibold text-church-text">Select Amount</h3>
              </div>

              <div className="space-y-6">
                {/* Preset Amounts */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PRESET_AMOUNTS.map((amount) => (
                      <Button
                          key={amount}
                          type="button"
                          variant={selectedAmount === amount ? "default" : "outline"}
                          className={`h-16 text-lg font-semibold rounded-xl border-2 transition-all duration-300 ${
                              selectedAmount === amount
                                  ? 'bg-church-accent hover:bg-church-accent/90 border-church-accent text-church-primary shadow-lg transform scale-105'
                                  : 'border-gray-200 hover:border-church-accent hover:bg-church-accent/10 hover:scale-105'
                          }`}
                          onClick={() => handleAmountSelect(amount)}
                      >
                        ₦{amount.toLocaleString()}
                      </Button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="relative">
                  <Label htmlFor="custom_amount" className="text-sm font-medium text-church-text-muted mb-2 block">Or enter custom amount</Label>
                  <div className="relative">
                    <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="custom_amount"
                        type="number"
                        placeholder="Enter amount in Naira"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="h-12 pl-10 border-2 border-gray-200 rounded-xl focus:border-church-accent focus:ring-church-accent/20 transition-all duration-300"
                        min="100"
                    />
                  </div>
                </div>

                {/* Selected Amount Display */}
                {formData.amount && (
                    <div className="bg-gradient-to-r from-church-accent/10 to-church-primary/10 p-6 rounded-xl border-2 border-church-accent/30">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-church-primary">Amount to give:</span>
                        <Badge variant="secondary" className="text-2xl px-4 py-2 bg-church-accent text-church-primary">
                          ₦{Number(formData.amount).toLocaleString()}
                        </Badge>
                      </div>
                      {selectedPurpose && (
                          <div className="mt-2 text-church-text">
                            Purpose: <span className="font-semibold">{selectedPurpose.label}</span>
                          </div>
                      )}
                    </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 h-12 border-2 border-gray-300 rounded-xl"
                >
                  Back
                </Button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            {/* Security Notice */}
            <div className="bg-gradient-to-r from-church-surface to-church-surface-hover border-2 border-church-accent/20 p-6 rounded-xl">
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-church-accent mr-3 mt-0.5" />
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-church-primary mb-1">Secure Payment Guaranteed</h4>
                  <p className="text-sm text-church-text-muted">
                    Your payment is processed securely by Paystack with bank-level encryption. We never store your card details.
                  </p>
                  <div className="flex items-center mt-3 space-x-4 text-xs text-church-accent">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      SSL Protected
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      PCI Compliant
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Instant Receipt
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            {currentStep === 3 && (
                <Button
                    type="submit"
                    disabled={loading || !formData.amount || !formData.email || !formData.full_name || !formData.purpose}
                    className="w-full h-16 text-lg font-bold bg-gradient-to-r from-church-primary via-church-primary-dark to-church-accent hover:from-church-primary-dark hover:via-church-primary hover:to-church-accent/90 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        Processing Your {selectedPurpose?.label || 'Gift'}...
                      </>
                  ) : (
                      <>
                        <Heart className="mr-3 h-6 w-6" />
                        Give ₦{formData.amount ? Number(formData.amount).toLocaleString() : '0'} with Love
                      </>
                  )}
                </Button>
            )}
          </form>
        </CardContent>
      </Card>
  );
}
