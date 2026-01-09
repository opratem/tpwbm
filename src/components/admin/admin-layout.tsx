"use client";

import type { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="h-screen h-[100dvh] flex overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar - Desktop: flex item, Mobile: fixed header + sheet */}
      <AdminSidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-14 sm:pt-16 lg:pt-0">
        {/* Scrollable content container */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Content wrapper with responsive padding */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-full pb-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
