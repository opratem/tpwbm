"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { SkipToContent } from "@/components/shared/skip-to-content";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if we're on an admin route - admin pages have their own layout
  const isAdminRoute = pathname?.startsWith("/admin");

  // For admin routes, just render children without header/footer
  // AdminLayout handles its own fixed positioning
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col mobile-firm-page overflow-x-hidden">
      {/* Skip to main content for accessibility */}
      <SkipToContent />

      {/* Header with proper landmark */}
      <Header />

      {/* Main Content Area with proper landmark and ID for skip link */}
      <main
        id="main-content"
        className="flex-1 overflow-x-hidden"
        role="main"
        aria-label="Main content"
        tabIndex={-1}
      >
        {children}
      </main>

      {/* Footer with proper landmark */}
      <Footer />
    </div>
  );
}
