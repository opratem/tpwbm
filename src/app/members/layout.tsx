"use client";

import { usePathname } from "next/navigation";
import { MembersLayout } from "@/components/members/members-layout";
import type { ReactNode } from "react";

interface MembersRootLayoutProps {
  children: ReactNode;
}

export default function MembersRootLayout({ children }: MembersRootLayoutProps) {
  const pathname = usePathname();

  // Pages that should NOT have the sidebar layout (public-facing member pages)
  const publicPages = [
    "/members/login",
    "/members/register",
    "/members/forgot-password",
  ];

  const isPublicPage = publicPages.some(page => pathname === page);

  // If it's a public page, render without the members layout
  if (isPublicPage) {
    return <>{children}</>;
  }

  // For authenticated member pages, wrap with MembersLayout
  return <MembersLayout>{children}</MembersLayout>;
}
