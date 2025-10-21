import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { getCloudinaryImageUrl } from "@/lib/cloudinary-client";
import { churchImages } from "@/lib/cloudinary-client";

export const metadata: Metadata = {
  title: "Member Login | The Prevailing Word Believers Ministry",
  description: "Sign in to access member resources and information at The Prevailing Word Believers Ministry",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-yellow-900/10 dark:to-gray-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-yellow-200/20 dark:bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-white/20 dark:bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-md">
        {/* Glass-morphism container */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/50 rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8">
          {/* Church Logo and Branding */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6">
              <ImageWithFallback
                src="/images/CHURCH%20LOGO.png"
                alt="TPWBM Logo"
                width={80}
                height={80}
                className="mx-auto rounded-full shadow-lg ring-4 ring-white/50 dark:ring-gray-700/50 w-16 h-16 sm:w-20 sm:h-20"
                fallbackSrc={getCloudinaryImageUrl(churchImages.logo, { width: 80, height: 80, crop: 'fit' })}
              />
            </div>
            <h1 className="mobile-text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mobile-text-xs sm:text-sm">
              Sign in to your member account
            </p>
          </div>

          <Suspense fallback={
            <div className="w-full space-y-4 sm:space-y-6">
              <div className="animate-pulse space-y-3 sm:space-y-4">
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-9 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-9 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-9 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          }><LoginForm /></Suspense>
        </div>

        {/* Subtitle */}
        <p className="text-center mt-4 sm:mt-6 mobile-text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          The Prevailing Word Believers Ministry
        </p>
      </div>
    </div>
  );
}
