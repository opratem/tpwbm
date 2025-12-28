"use client";

import type { ReactNode } from "react";
import { MembersSidebar } from "./members-sidebar";

interface MembersLayoutProps {
  children: ReactNode;
}

export function MembersLayout({ children }: MembersLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <MembersSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
