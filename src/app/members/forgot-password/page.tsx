"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Send,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        toast.success("Password reset instructions sent if account exists");
      } else {
        toast.error(data.error || "Failed to send reset email. Please try again.");
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container max-w-md py-20 space-y-8">
        <Card>
          <CardContent className="pt-8 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Check Your Email</h1>
              <p className="text-gray-500 dark:text-gray-400">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Next Steps:</h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-left">
                  <li>• Check your email inbox (and spam folder)</li>
                  <li>• Click the reset link in the email</li>
                  <li>• Follow the instructions to create a new password</li>
                  <li>• Return to the login page to sign in</li>
                </ul>
              </div>

              <Button asChild className="w-full">
                <Link href="/members/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-20 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Link href="/members/login" className="flex items-center gap-1 hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>

        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            No worries! We'll send you reset instructions.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                  Sending Reset Email...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reset Email
                </>
              )}
            </Button>

            <div className="pt-4 border-t text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                Remember your password?{" "}
                <Link
                  href="/members/login"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h3 className="font-semibold">Need Help?</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>If you're having trouble accessing your account:</p>
              <ul className="space-y-1 ml-4">
                <li>• Make sure you're using the email address associated with your account</li>
                <li>• Check your spam/junk folder for the reset email</li>
                <li>• Contact our church office at (555) 123-4567 for assistance</li>
                <li>• Email our tech support at tech@tpwbm.org</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
