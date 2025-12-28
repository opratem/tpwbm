"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  Chrome,
  Facebook
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") || undefined;

  useEffect(() => {
    // Check for error in URL params (from failed auth redirect)
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "OAuthCallback":
          setError("There was an issue with social login. Please try again.");
          break;
        case "OAuthCreateAccount":
          setError("Could not create account with social login. Please try again.");
          break;
        case "EmailCreateAccount":
          setError("Could not create account with this email. Please try again.");
          break;
        case "Callback":
          setError("Authentication callback failed. Please try again.");
          break;
        case "OAuthAccountNotLinked":
          setError("This email is already registered with a password. We're linking your accounts now - please try the social login again.");
          break;
        case "EmailSignin":
          setError("Failed to send sign-in email. Please try again.");
          break;
        case "CredentialsSignin":
          setError("Invalid credentials. Please check your email and password.");
          break;
        case "SessionRequired":
          setError("Please sign in to access this page.");
          break;
        default:
          setError("Authentication failed. Please try again.");
      }
      toast.error("Authentication failed. Please check your credentials.");
    }

    // Load remember me preference
    const savedEmail = localStorage.getItem("loginEmail");
    const savedRemember = localStorage.getItem("rememberMe") === "true";
    if (savedRemember && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("loginEmail", email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("loginEmail");
        localStorage.removeItem("rememberMe");
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (result?.error) {
        // Parse the error to provide specific and helpful feedback
        let errorMessage = "Login failed. Please try again.";
        let specificError = "";

        if (result.error.includes('EMAIL_NOT_FOUND')) {
          specificError = "Email Not Found";
          errorMessage = "We couldn't find an account with this email address. Please check your email or click 'Register' to create a new account.";
        } else if (result.error.includes('INCORRECT_PASSWORD')) {
          specificError = "Incorrect Password";
          errorMessage = "The password you entered is incorrect. Please try again or click 'Forgot Password?' below to reset it.";
        } else if (result.error.includes('ACCOUNT_INACTIVE')) {
          specificError = "Account Pending Approval";
          errorMessage = "Your account has been registered but is awaiting approval from the church administrator. Please contact the church office or wait for approval confirmation via email.";
        } else if (result.error.includes('NO_PASSWORD_SET')) {
          specificError = "Social Login Required";
          errorMessage = "This account was created using Google or Facebook login. Please use the social login buttons above to sign in.";
        } else if (result.error.includes('MISSING_CREDENTIALS')) {
          specificError = "Missing Information";
          errorMessage = "Please enter both your email address and password.";
        } else {
          specificError = "Login Failed";
          errorMessage = "Unable to log in at this time. Please verify your email and password are correct, then try again.";
        }

        setError(errorMessage);
        toast.error(specificError, {
          description: errorMessage,
          duration: 8000,
        });
      } else {
        toast.success("Successfully logged in!");

        // Get the session to check user role
        const sessionResponse = await fetch("/api/auth/session");
        const session = await sessionResponse.json();

        // Determine redirect URL based on role and callbackUrl
        let redirectUrl = callbackUrl;
        if (!redirectUrl) {
          // No callback URL, redirect based on role
          redirectUrl = session?.user?.role === "admin"
            ? "/admin/dashboard"
            : "/members/dashboard";
        }

        // Force a hard redirect to ensure session is fully loaded
        window.location.href = redirectUrl;
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      toast.error("Login failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setSocialLoading(provider);
    setError("");

    try {
      const result = await signIn(provider, {
        redirect: true,
        callbackUrl: callbackUrl,
      });

      if (result?.error) {
        setError(`Failed to sign in with ${provider}. Please try again.`);
        toast.error(`${provider} login failed. Please try again.`);
        setSocialLoading(null);
      }
      // If successful, NextAuth will handle the redirect
    } catch (error) {
      setError(`An error occurred during ${provider} login.`);
      toast.error(`${provider} login failed. Please try again.`);
      setSocialLoading(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Social Login Section */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full relative transition-all duration-200 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 border-gray-200/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50"
          onClick={() => handleSocialLogin("google")}
          disabled={socialLoading !== null || isLoading}
        >
          {socialLoading === "google" ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Chrome className="h-4 w-4 mr-2 text-red-600" />
          )}
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full relative transition-all duration-200 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 border-gray-200/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50"
          onClick={() => handleSocialLogin("facebook")}
          disabled={socialLoading !== null || isLoading}
        >
          {socialLoading === "facebook" ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          )}
          Continue with Facebook
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300/50 dark:border-gray-600/50" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Login Form */}
      <Card className="border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 shadow-none">
        <CardContent className="pt-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || socialLoading !== null}
                  className="!pl-12 pr-10 transition-all duration-200 focus:ring-2 focus:ring-accent bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-600/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/members/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || socialLoading !== null}
                  className="!pl-12 pr-10 transition-all duration-200 focus:ring-2 focus:ring-accent bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-600/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || socialLoading !== null}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading || socialLoading !== null}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading || socialLoading !== null}
              size="lg"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing in...</>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-gray-200/50 dark:border-gray-600/50 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Need access to member resources?{" "}
              <Link
                href="/members/register"
                className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 font-medium transition-colors duration-200"
              >
                Request Membership
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
