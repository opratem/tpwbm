"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Send,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function MemberRegistration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    birthDate: "",
    interests: "",
    previousChurch: "",
    referredBy: "",
    additionalInfo: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Password validation
    if (!formData.password) {
      toast.error("Please enter a password");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit to API
      const response = await fetch('/api/members/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      toast.success(data.message || "Registration request submitted successfully! We'll review your application and contact you soon.");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        birthDate: "",
        interests: "",
        previousChurch: "",
        referredBy: "",
        additionalInfo: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit registration. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 mobile-space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center mobile-space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center gap-2 mobile-text-xs sm:text-sm text-gray-500">
          <Link href="/members/login" className="flex items-center gap-1 hover:text-primary mobile-touch-target">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back to Login
          </Link>
        </div>
        <h1 className="mobile-text-2xl sm:text-3xl font-bold">Request Church Membership</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mobile-text-sm sm:text-base px-4 sm:px-0">
          We're excited that you're interested in joining our church family!
          Please fill out this form and we'll contact you soon.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="mobile-text-lg sm:text-xl">Membership Application</CardTitle>
          <CardDescription className="mobile-text-xs sm:text-sm">
            Please provide your information below. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Personal Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="mobile-text-base sm:text-lg font-semibold border-b pb-2">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Address Information</h3>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>

            {/* Password Setup */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Account Password</h3>
              <p className="text-sm text-muted-foreground">
                Choose a password for your account. You'll use this to access member resources after your application is approved.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter your password"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Password Requirements:</p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Make it memorable but secure</li>
                  <li>• You can change it anytime after logging in</li>
                </ul>
              </div>
            </div>

            {/* Church Background */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Church Background</h3>

              <div className="space-y-2">
                <Label htmlFor="previousChurch">Previous Church (if any)</Label>
                <Input
                  id="previousChurch"
                  name="previousChurch"
                  value={formData.previousChurch}
                  onChange={handleInputChange}
                  placeholder="Name of previous church"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referredBy">How did you hear about us?</Label>
                <Input
                  id="referredBy"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleInputChange}
                  placeholder="Friend, website, event, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Areas of Interest/Ministry</Label>
                <Textarea
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="e.g., Worship, Children's Ministry, Outreach, Bible Study..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Anything else you'd like us to know about you or your family..."
                  rows={4}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>

            {/* Information Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-sm">
              <h4 className="font-semibold text-primary dark:text-primary mb-2">What happens next?</h4>
              <ul className="space-y-1 text-primary/80 dark:text-primary/80">
                <li>• We'll review your application within 1-2 business days</li>
                <li>• A member of our pastoral team will contact you to schedule a meeting</li>
                <li>• We'll discuss membership expectations and answer any questions</li>
                <li>• Upon approval, you'll receive your member login credentials</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
