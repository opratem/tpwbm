"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  MessageSquare,
  Megaphone,
  FileText,
  Calendar,
  Image,
  Youtube,
  Settings,
  Key,
  Shield,
  ChevronLeft,
  ChevronRight,
  Bell,
  ShieldAlert,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveNotifications } from "@/components/ui/live-notifications";
import { useState } from "react";
import { SUPER_ADMIN_EMAIL } from "@/lib/constants";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "User management & overview",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Manage all users",
  },
  {
    title: "Membership Requests",
    href: "/admin/membership-requests",
    icon: UserCheck,
    description: "Approve or reject member requests",
  },
  {
    title: "Prayer Requests",
    href: "/admin/prayer-requests",
    icon: MessageSquare,
    description: "Manage prayer requests",
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: Megaphone,
    description: "Create & manage announcements",
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: FileText,
    description: "Manage blog posts",
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: Calendar,
    description: "Create & manage events",
  },
  {
    title: "Media Gallery",
    href: "/admin/media",
    icon: Image,
    description: "Upload & manage media",
  },
  {
    title: "YouTube",
    href: "/admin/youtube",
    icon: Youtube,
    description: "Manage YouTube content",
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    description: "Manage & send notifications",
  },
  {
    title: "My Profile",
    href: "/admin/profile",
    icon: Settings,
    description: "Admin profile settings",
  },
  {
    title: "Reset Password",
    href: "/admin/reset-password",
    icon: Key,
    description: "Reset user passwords",
  },
];

// Super admin only nav item
const superAdminNavItem = {
  title: "Super Admin",
  href: "/admin/super-admin",
  icon: ShieldAlert,
  description: "Password management & promotions",
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check if current user is super admin
  const isSuperAdmin = session?.user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
    && session?.user?.role === 'super_admin';

  // Build navigation items - add super admin link if user is super admin
  const navItems = isSuperAdmin
    ? [...adminNavItems, superAdminNavItem]
    : adminNavItems;

  return (
    <div
      className={cn(
        "sticky top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isSuperAdmin
                ? "bg-gradient-to-br from-amber-500 to-amber-600"
                : "bg-gradient-to-br from-church-primary to-church-accent"
            )}>
              {isSuperAdmin ? (
                <Crown className="h-6 w-6 text-white" />
              ) : (
                <Shield className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isSuperAdmin ? "Super Admin" : "Admin Panel"}
              </h2>
              <p className="text-xs text-slate-400">
                {isSuperAdmin ? "Elevated Access" : "Management Console"}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <LiveNotifications className="text-slate-400 hover:text-white" showConnectionStatus={!isCollapsed} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isSuperAdminLink = item.href === "/admin/super-admin";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? isSuperAdminLink
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                    : "bg-gradient-to-r from-church-primary to-church-primary-light text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50",
                isSuperAdminLink && !isActive && "hover:bg-amber-500/20"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : isSuperAdminLink ? "text-amber-400 group-hover:text-amber-300" : "text-slate-400 group-hover:text-white"
                )}
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm truncate",
                    isActive ? "text-white" : "",
                    isSuperAdminLink && !isActive && "text-amber-400"
                  )}>
                    {item.title}
                  </p>
                  <p className={cn(
                    "text-xs truncate",
                    isSuperAdminLink ? "text-amber-400/70" : "text-slate-400"
                  )}>
                    {item.description}
                  </p>
                </div>
              )}
              {isActive && (
                <div className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full",
                  isSuperAdminLink ? "bg-amber-300" : "bg-white"
                )} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700/50">
          <div className={cn(
            "rounded-lg p-3",
            isSuperAdmin ? "bg-amber-500/10" : "bg-slate-800/50"
          )}>
            <p className={cn(
              "text-xs",
              isSuperAdmin ? "text-amber-400" : "text-slate-400"
            )}>
              {isSuperAdmin ? (
                <>
                  <Crown className="h-3 w-3 inline mr-1" />
                  Super admin privileges active
                </>
              ) : (
                <>
                  <Shield className="h-3 w-3 inline mr-1" />
                  Full admin access
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
