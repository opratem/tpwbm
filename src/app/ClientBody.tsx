"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { AuthProvider } from "@/components/auth/auth-provider";
import { MediaPlayerProvider } from "@/contexts/MediaPlayerContext";
import { MiniPlayer } from "@/components/ui/mini-player";
import { SkipToContent } from "@/components/shared/skip-to-content";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { ScrollProgress } from "@/components/ui/scroll-progress";

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
            <MainLayout>{children}</MainLayout>
            <MiniPlayer />
          </AuthProvider>
        </MediaPlayerProvider>
        <Toaster richColors position="top-right" />
      </>
    </ThemeProvider>
  );
}
