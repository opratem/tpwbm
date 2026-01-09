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
  Home,
  LogOut,
  User,
  ExternalLink,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/components/auth/logout-button";
import { Avatar } from "@/components/ui/avatar";

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

// Utility function to get user initials
const getUserInitials = (name: string | null | undefined): string => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return 'U';
  }
  try {
    const trimmedName = name.trim();
    if (!trimmedName) return 'U';
    const words = trimmedName.split(' ').filter(word => word && word.length > 0);
    if (words.length === 0) return 'U';
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } else if (words.length === 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    } else {
      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }
  } catch (error) {
    console.error('Error getting user initials:', error, 'Name value:', name);
    return 'U';
  }
};

// Utility function to truncate name intelligently
const getDisplayName = (name: string | null | undefined, maxLength = 15): string => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return 'User';
  }
  try {
    const trimmedName = name.trim();
    if (!trimmedName) return 'User';
    if (trimmedName.length <= maxLength) return trimmedName;
    const words = trimmedName.split(' ').filter(word => word && word.length > 0);
    if (words.length === 0) return 'User';
    if (words.length >= 2) {
      const firstName = words[0];
      const lastInitial = words[words.length - 1].charAt(0);
      const shortened = `${firstName} ${lastInitial}.`;
      if (shortened.length <= maxLength) return shortened;
      return firstName.length <= maxLength ? firstName : firstName.substring(0, maxLength - 1) + '…';
    }
    return trimmedName.substring(0, maxLength - 1) + '…';
  } catch (error) {
    console.error('Error getting display name:', error, 'Name value:', name);
    return 'User';
  }
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
      {/* Back to Site link - always show at top */}
      <Link
        href="/"
        onClick={onItemClick}
        className={cn(
          "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 group relative min-h-[44px] mb-4 border border-dashed border-slate-600/50 hover:border-church-primary/50",
          "text-slate-400 hover:text-white hover:bg-slate-700/50"
        )}
        title={isCollapsed ? "Back to Site" : undefined}
      >
        <Home className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-church-primary" />
        {!isCollapsed && (
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <p className="font-medium text-sm truncate">Back to Site</p>
            <ExternalLink className="h-3 w-3 text-slate-500" />
          </div>
        )}
      </Link>

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
            title={isCollapsed ? item.title : undefined}
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

              {/* Mobile User Profile Section */}
              {session && (
                <div className="p-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10 ring-2 ring-slate-600">
                      <div className="w-full h-full bg-gradient-to-br from-church-primary via-church-primary-light to-church-accent flex items-center justify-center text-sm font-bold text-white">
                        {getUserInitials(session.user.name)}
                      </div>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {getDisplayName(session.user.name)}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/admin/profile"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 w-full py-2 px-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm">My Profile</span>
                    </Link>
                    <LogoutButton
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                      showConfirmation={true}
                      redirectTo="/"
                    />
                  </div>
                </div>
              )}

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

        <div className="flex items-center gap-2">
          {/* Quick Home button for mobile */}
          <Link
            href="/"
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/50 transition-all"
            aria-label="Back to main site"
          >
            <Home className="h-5 w-5" />
          </Link>
          <LiveNotifications className="text-slate-400 hover:text-white" showConnectionStatus={false} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 flex-col flex-shrink-0 relative",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Desktop Header */}
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between min-h-[72px]">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
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
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white truncate">
                  {isSuperAdmin ? "Super Admin" : "Admin Panel"}
                </h2>
                <p className="text-xs text-slate-400 truncate">
                  {isSuperAdmin ? "Elevated Access" : "Management Console"}
                </p>
              </div>
            </div>
          ) : (
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center mx-auto",
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
          )}
          <div className={cn("flex items-center gap-2", isCollapsed && "absolute top-4 right-2")}>
            {!isCollapsed && <LiveNotifications className="text-slate-400 hover:text-white" showConnectionStatus={!isCollapsed} />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50 h-8 w-8"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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

        {/* Desktop User Profile Section */}
        {session && (
          <div className={cn(
            "border-t border-slate-700/50 p-3",
            isCollapsed ? "flex justify-center" : ""
          )}>
            {isCollapsed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-lg hover:bg-slate-700/50"
                    aria-label="User menu"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-slate-600">
                      <div className="w-full h-full bg-gradient-to-br from-church-primary via-church-primary-light to-church-accent flex items-center justify-center text-sm font-bold text-white">
                        {getUserInitials(session.user.name)}
                      </div>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="end"
                  className="w-56 bg-slate-900/95 backdrop-blur-md border-slate-700/50 shadow-2xl rounded-xl"
                >
                  <div className="px-3 py-2 border-b border-slate-700/50">
                    <p className="text-sm font-medium text-white">{getDisplayName(session.user.name)}</p>
                    <p className="text-xs text-slate-400">{session.user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/"
                      className="flex items-center gap-3 text-slate-300 hover:text-white focus:text-white rounded-lg font-medium"
                    >
                      <Home className="h-4 w-4" />
                      Back to Site
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin/profile"
                      className="flex items-center gap-3 text-slate-300 hover:text-white focus:text-white rounded-lg font-medium"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700/50" />
                  <DropdownMenuItem
                    className="p-0 focus:bg-transparent"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <LogoutButton
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-3 text-red-400 hover:text-red-300 focus:text-red-300 rounded-lg font-medium h-auto px-3 py-2"
                      showConfirmation={true}
                      redirectTo="/"
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-slate-600 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-church-primary via-church-primary-light to-church-accent flex items-center justify-center text-sm font-bold text-white">
                      {getUserInitials(session.user.name)}
                    </div>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {getDisplayName(session.user.name)}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <LogoutButton
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                  showConfirmation={true}
                  redirectTo="/"
                />
              </div>
            )}
          </div>
        )}

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
