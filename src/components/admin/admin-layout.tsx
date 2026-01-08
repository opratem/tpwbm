"use client";

import type { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
      {/* Sidebar - handles its own safe areas */}
      <AdminSidebar />

      {/* Main content area */}
      <main
        className={`
          flex-1 overflow-y-auto overflow-x-hidden

          /* Mobile: account for fixed header */
          pt-14 sm:pt-16 lg:pt-0

          /* Safe area insets */
          pl-[env(safe-area-inset-left)]
          pr-[env(safe-area-inset-right)]
          pb-[env(safe-area-inset-bottom)]
        `}
      >
        {/* Content wrapper with responsive padding */}
        <div
          className={`
            /* Responsive padding */
            p-3 sm:p-4 md:p-6 lg:p-8

            /* Ensure minimum padding on all devices */
            min-h-full

            /* Extra bottom padding for mobile nav/gestures */
            pb-6 sm:pb-4 md:pb-6 lg:pb-8
          `}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
