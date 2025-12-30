"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { AuthProvider } from "@/components/auth/auth-provider";
import { MediaPlayerProvider } from "@/contexts/MediaPlayerContext";
import { MiniPlayer } from "@/components/ui/mini-player";
import { SkipToContent } from "@/components/shared/skip-to-content";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { NotificationProvider } from "@/components/shared/notification-provider";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <>
        <SkipToContent />
        <ScrollProgress />
        <MediaPlayerProvider>
          <AuthProvider>
            <NotificationProvider>
              <MainLayout>{children}</MainLayout>
              <MiniPlayer />
            </NotificationProvider>
          </AuthProvider>
        </MediaPlayerProvider>
        <Toaster richColors position="top-right" />
      </>
    </ThemeProvider>
  );
}
