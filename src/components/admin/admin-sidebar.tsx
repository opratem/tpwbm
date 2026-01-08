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
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveNotifications } from "@/components/ui/live-notifications";
import { useState, useEffect } from "react";
import { SUPER_ADMIN_EMAIL } from "@/lib/constants";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

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

// Navigation content component (shared between mobile and desktop)
function NavigationContent({
  navItems,
  pathname,
  isSuperAdmin,
  isCollapsed = false,
  onItemClick,
}: {
  navItems: typeof adminNavItems;
  pathname: string;
  isSuperAdmin: boolean;
  isCollapsed?: boolean;
  onItemClick?: () => void;
}) {
  return (
    <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 sm:space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        const isSuperAdminLink = item.href === "/admin/super-admin";

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 group relative min-h-[44px]",
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
                  "text-xs truncate hidden sm:block",
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
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Check if current user is super admin
  const isSuperAdmin = session?.user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
    && session?.user?.role === 'super_admin';

  // Build navigation items - add super admin link if user is super admin
  const navItems = isSuperAdmin
    ? [...adminNavItems, superAdminNavItem]
    : adminNavItems;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 flex items-center justify-between px-3 sm:px-4 pt-safe safe-area-inset-left safe-area-inset-right">
        <div className="flex items-center gap-2 sm:gap-3">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 h-10 w-10 min-h-[44px] min-w-[44px]"
                aria-label="Open admin menu"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] sm:w-[320px] p-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 safe-area-inset-top safe-area-inset-bottom safe-area-inset-left"
            >
              {/* Mobile Sheet Header */}
              <div className="p-4 sm:p-6 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center",
                    isSuperAdmin
                      ? "bg-gradient-to-br from-amber-500 to-amber-600"
                      : "bg-gradient-to-br from-church-primary to-church-accent"
                  )}>
                    {isSuperAdmin ? (
                      <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    ) : (
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {isSuperAdmin ? "Super Admin" : "Admin Panel"}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {isSuperAdmin ? "Elevated Access" : "Management Console"}
                    </p>
                  </div>
                </div>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50 h-9 w-9"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>

              {/* Mobile Navigation */}
              <NavigationContent
                navItems={navItems}
                pathname={pathname}
                isSuperAdmin={isSuperAdmin}
                onItemClick={() => setIsMobileOpen(false)}
              />

              {/* Mobile Footer */}
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
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              isSuperAdmin
                ? "bg-gradient-to-br from-amber-500 to-amber-600"
                : "bg-gradient-to-br from-church-primary to-church-accent"
            )}>
              {isSuperAdmin ? (
                <Crown className="h-4 w-4 text-white" />
              ) : (
                <Shield className="h-4 w-4 text-white" />
              )}
            </div>
            <span className="text-sm sm:text-base font-semibold text-white">
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </span>
          </div>
        </div>

        <LiveNotifications className="text-slate-400 hover:text-white" showConnectionStatus={false} />
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex sticky top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 flex-col",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Desktop Header */}
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

        {/* Desktop Navigation */}
        <NavigationContent
          navItems={navItems}
          pathname={pathname}
          isSuperAdmin={isSuperAdmin}
          isCollapsed={isCollapsed}
        />

        {/* Desktop Footer */}
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
    </>
  );
}
