"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

// This layout hides the main header and footer for admin pages
// The AdminLayout component in each admin page handles the admin-specific layout

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    redirect("/members/login");
  }

  return <>{children}</>;
}
