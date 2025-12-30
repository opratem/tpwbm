"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Calendar,
  BookOpen,
  Users,
  Megaphone,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const memberNavItems = [
  {
    title: "Dashboard",
    href: "/members/dashboard",
    icon: LayoutDashboard,
    description: "Overview & quick access",
  },
  {
    title: "My Profile",
    href: "/members/profile",
    icon: User,
    description: "Edit your information",
  },
  {
    title: "Prayer Requests",
    href: "/members/prayer",
    icon: MessageSquare,
    description: "Submit & view prayers",
  },
  {
    title: "Events",
    href: "/events",
    icon: Calendar,
    description: "Church events & RSVP",
  },
  {
    title: "Resources",
    href: "/members/resources",
    icon: BookOpen,
    description: "Sermons & materials",
  },
  {
    title: "Announcements",
    href: "/announcements",
    icon: Megaphone,
    description: "Church updates",
  },
];

export function MembersSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      toast.success("Logging out...");
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  // Get user initials for avatar
  const getInitials = (name?: string | null) => {
    if (!name || typeof name !== 'string') return "M";
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length === 0) return "M";

    try {
      const words = trimmedName.split(" ").filter(word => word && word.length > 0);
      if (words.length === 0) return "M";

      return words
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    } catch (error) {
      console.error("Error getting initials:", error);
      return "M";
    }
  };

  return (
    <div
      className={cn(
        "sticky top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header with User Profile */}
      <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 ring-2 ring-church-accent/50">
              <AvatarFallback className="bg-gradient-to-br from-church-accent to-amber-500 text-church-primary font-bold">
                {getInitials(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-white truncate">
                {session?.user?.name || "Member"}
              </h2>
              <p className="text-xs text-slate-400 truncate">
                {session?.user?.email || ""}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-700/50 flex-shrink-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {memberNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-gradient-to-r from-church-accent to-amber-500 text-church-primary shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-church-primary" : "text-slate-400 group-hover:text-white"
                )}
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    isActive ? "text-church-primary font-semibold" : ""
                  )}>
                    {item.title}
                  </p>
                  <p className={cn(
                    "text-xs truncate",
                    isActive ? "text-church-primary/80" : "text-slate-400"
                  )}>
                    {item.description}
                  </p>
                </div>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-700/50",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </Button>

        {!isCollapsed && (
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 text-center">
              <Heart className="h-3 w-3 inline mr-1" />
              Member Portal
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
