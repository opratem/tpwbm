"use client";

import { useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { AuthProvider } from "@/components/auth/auth-provider";
import { MediaPlayerProvider } from "@/contexts/MediaPlayerContext";
import { MiniPlayer } from "@/components/ui/mini-player";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <div className="antialiased">
      <MediaPlayerProvider>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
          <MiniPlayer />
        </AuthProvider>
      </MediaPlayerProvider>
    </div>
  );
}
