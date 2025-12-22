"use client";

import { Header } from "./header";
import { Footer } from "./footer";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with proper landmark */}
      <Header />

      {/* Main Content Area with proper landmark and ID for skip link */}
      <main
        id="main-content"
        className="flex-1"
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
