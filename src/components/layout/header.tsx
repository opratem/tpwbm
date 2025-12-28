"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { getCloudinaryImageUrl, churchImages } from "@/lib/cloudinary-client";
import { LiveNotifications } from "@/components/ui/live-notifications";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Service Times", href: "/services" },
  { name: "Live Streaming", href: "/live-streaming" },
  {
    name: "Media & Resources",
    href: "#",
    children: [
      { name: "Gallery", href: "/gallery" },
      { name: "Events", href: "/events" },
      { name: "Announcements", href: "/announcements" },
      { name: "Sermons", href: "/sermons" },
      { name: "Audio Messages", href: "/audio-messages" },
    ]
  },
  {
    name: "Articles",
    href: "#",
    children: [
      { name: "FAQ", href: "/faq" },
      { name: "Blog", href: "/blog" },
    ]
  },
  {
    name: "Ministries",
    href: "#",
    children: [
      { name: "The Presiding Pastor", href: "/pastor" },
      { name: "Leadership", href: "/leadership" },
      { name: "Music Ministry", href: "/ministries/music" },
      { name: "ICWC", href: "/ministries/icwlc" },
      { name: "Children", href: "/ministries/children" },
      { name: "Youth", href: "/ministries/youth" },

    ]
  },
  { name: "Giving", href: "/giving" },
  { name: "Contact", href: "/contact" },
];

// Utility function to get user initials
const getUserInitials = (name: string | null | undefined): string => {
  // Handle all falsy cases and invalid strings
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return 'U';
  }

  try {
    const trimmedName = name.trim();
    if (!trimmedName) return 'U';

    const words = trimmedName.split(' ').filter(word => word && word.length > 0);

    if (words.length === 0) return 'U';

    if (words.length === 1) {
      // Single name: take first character
      return words[0].charAt(0).toUpperCase();
    } else if (words.length === 2) {
      // Two names: take first character of each
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    } else {
      // Three or more names: take first character of first and last name
      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }
  } catch (error) {
    console.error('Error getting user initials:', error, 'Name value:', name);
    return 'U';
  }
};

// Utility function to truncate name intelligently
const getDisplayName = (name: string | null | undefined, maxLength = 15): string => {
  // Handle all falsy cases and invalid strings
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
      // Try to show first name and first letter of last name
      const firstName = words[0];
      const lastInitial = words[words.length - 1].charAt(0);
      const shortened = `${firstName} ${lastInitial}.`;

      if (shortened.length <= maxLength) return shortened;

      // If still too long, just show first name
      return firstName.length <= maxLength ? firstName : firstName.substring(0, maxLength - 1) + '…';
    }

    // Single name case
    return trimmedName.substring(0, maxLength - 1) + '…';
  } catch (error) {
    console.error('Error getting display name:', error, 'Name value:', name);
    return 'User';
  }
};

export function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
  const [mobileOpenMenus, setMobileOpenMenus] = useState<{[key: string]: boolean}>({});

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle dropdown visibility for desktop
  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Handle dropdown visibility for mobile
  const toggleMobileMenu = (name: string) => {
    setMobileOpenMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
      <header
        role="banner"
        aria-label="Site header"
        className={`sticky top-0 z-50 w-full border-b border-gray-800/20 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-xl' : 'bg-gray-900/90 backdrop-blur-sm'} transition-all duration-300`}
      >
        <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between pl-3 pr-2 sm:px-4 md:px-6 lg:px-6 max-w-none">
          {/* Logo Section - Fixed to show full name on desktop */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-auto min-w-0">
            <Link
              href="/"
              className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity duration-300 min-w-0"
              aria-label="The Prevailing Word Believers Ministry Inc. - Home"
            >
              {/* Church logo */}
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-full bg-white/10 p-1.5 sm:p-2 backdrop-blur-sm flex-shrink-0">
                <ImageWithFallback
                    src="/images/CHURCH%20LOGO.png"
                    alt="The Prevailing Word Believers Ministry Logo"
                    width={48}
                    height={48}
                    priority
                    className="object-contain"
                    fallbackSrc={getCloudinaryImageUrl(churchImages.logo, { width: 48, height: 48, crop: 'fit' })}
                />
              </div>
              <div className="flex flex-col min-w-0" aria-hidden="true">
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white leading-tight whitespace-nowrap">
                  <span className="block sm:hidden">The Prevailing Word Believers</span>
                  <span className="hidden sm:block lg:hidden">The Prevailing Word Believers</span>
                  <span className="hidden lg:block">The Prevailing Word Believers</span>
                </span>
                <span className="text-xs sm:text-sm md:text-base text-gray-300 font-medium whitespace-nowrap">
                  Ministry Inc.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered with proper spacing */}
          <nav
            className="hidden lg:flex gap-1 items-center flex-1 justify-center px-2 ml-4"
            role="navigation"
            aria-label="Main navigation"
          >
            {navigationItems.map((item) => (
                !item.children ? (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="px-2 py-2 text-sm font-semibold text-gray-200 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 tracking-wide uppercase"
                        aria-label={`Navigate to ${item.name}`}
                    >
                      {item.name}
                    </Link>
                ) : (
                    <DropdownMenu key={item.name} open={openDropdowns[item.name]} onOpenChange={() => toggleDropdown(item.name)}>
                      <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="px-2 py-2 text-sm font-semibold text-gray-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 transition-all duration-300 rounded-lg flex items-center gap-2 tracking-wide uppercase"
                            aria-label={`${item.name} menu`}
                            aria-expanded={openDropdowns[item.name]}
                            aria-haspopup="true"
                        >
                          {item.name}
                          <ChevronDown className="h-4 w-4 transition-transform duration-200" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                          align="center"
                          className="w-56 bg-gray-900/95 backdrop-blur-md border-gray-700/50 shadow-2xl rounded-xl"
                          role="menu"
                          aria-label={`${item.name} submenu`}
                      >
                        {item.children.map((child) => (
                            <DropdownMenuItem key={child.name} asChild>
                              <Link
                                  href={child.href}
                                  className="w-full cursor-pointer text-gray-200 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white rounded-lg font-medium transition-all duration-200"
                                  role="menuitem"
                                  aria-label={`Navigate to ${child.name}`}
                              >
                                {child.name}
                              </Link>
                            </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                )
            ))}
          </nav>

          {/* User Authentication & Mobile Menu Section */}
          <div className="flex items-center justify-end gap-1 flex-shrink-0 min-w-0">
            {status === "loading" ? (
                <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse flex-shrink-0" aria-label="Loading user information" role="status" />
            ) : session ? (
                <div className="flex items-center gap-1">
                  {/* Live Notifications */}
                  <LiveNotifications className="text-white hover:text-gray-200 flex-shrink-0" />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 max-w-[140px]"
                        aria-label={`User menu for ${session.user.name}`}
                        aria-haspopup="true"
                      >
                        <Avatar className="h-8 w-8 ring-2 ring-white/30 flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-br from-church-primary via-church-primary-light to-church-accent flex items-center justify-center text-sm font-bold text-white">
                            {getUserInitials(session.user.name)}
                          </div>
                        </Avatar>
                        <span className="text-sm font-semibold text-white hidden lg:block truncate min-w-0">{getDisplayName(session.user.name)}</span>
                        <ChevronDown className="h-4 w-4 text-gray-300 flex-shrink-0" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-gray-900/95 backdrop-blur-md border-gray-700/50 shadow-2xl rounded-xl"
                      role="menu"
                      aria-label="User account menu"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href={session.user.role === 'admin' ? "/admin/dashboard" : "/members/dashboard"}
                          className="flex items-center gap-3 text-gray-200 hover:text-white focus:text-white rounded-lg font-medium"
                          role="menuitem"
                        >
                          <User className="h-4 w-4" aria-hidden="true" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={session.user.role === 'admin' ? "/admin/profile" : "/members/profile"}
                          className="flex items-center gap-3 text-gray-200 hover:text-white focus:text-white rounded-lg font-medium"
                          role="menuitem"
                        >
                          <Settings className="h-4 w-4" aria-hidden="true" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700/50" />
                      <DropdownMenuItem className="p-0 focus:bg-transparent">
                        <LogoutButton
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 focus:text-red-300 rounded-lg font-medium h-auto px-3 py-2"
                            showConfirmation={true}
                            redirectTo="/"
                            aria-label="Sign out of your account"
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            ) : (
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hidden lg:flex px-6 py-2 rounded-xl bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold backdrop-blur-sm flex-shrink-0"
                    aria-label="Go to member login page"
                >
                  <Link href="/members/login">Member Login</Link>
                </Button>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 sm:h-12 sm:w-12 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 min-h-[44px] min-w-[44px] -mr-1 sm:mr-0"
                  aria-label="Open navigation menu"
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-navigation"
                >
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[340px] md:w-[400px] pt-16 sm:pt-20 bg-gray-900/95 backdrop-blur-md border-gray-700/50 overflow-y-auto max-h-screen"
                id="mobile-navigation"
                role="dialog"
                aria-label="Mobile navigation menu"
              >
                <Link
                  href="/"
                  className="flex items-center gap-3 mb-12"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="The Prevailing Word Believers Ministry Inc. - Home"
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10 p-2">
                    <ImageWithFallback
                        src="/images/CHURCH%20LOGO.png"
                        alt="The Prevailing Word Believers Ministry Logo"
                        width={40}
                        height={40}
                        priority
                        className="object-contain"
                        fallbackSrc={getCloudinaryImageUrl("tpwbm/CHURCH_LOGO", { width: 40, height: 40, crop: 'fit' })}
                    />
                  </div>
                  <div className="flex flex-col" aria-hidden="true">
                  <span className="text-lg font-bold text-white leading-tight">
                    The Prevailing Word
                  </span>
                    <span className="text-sm text-gray-300 font-medium">
                    Ministry Inc.
                  </span>
                  </div>
                </Link>

                <nav
                  className="flex flex-col gap-3 flex-1 overflow-y-auto pb-4"
                  role="navigation"
                  aria-label="Mobile navigation"
                >
                  {navigationItems.map((item) => (
                      <div key={item.name} className="py-1">
                        {!item.children ? (
                            <Link
                                href={item.href}
                                className="text-base font-semibold transition-colors hover:text-white text-gray-200 block py-4 px-4 rounded-lg hover:bg-white/10 uppercase tracking-wide min-h-[48px] flex items-center"
                                onClick={() => setIsMenuOpen(false)}
                                aria-label={`Navigate to ${item.name}`}
                            >
                              {item.name}
                            </Link>
                        ) : (
                            <div className="space-y-2">
                              <button
                                  className="text-base font-semibold flex items-center justify-between cursor-pointer py-4 px-4 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-all duration-200 uppercase tracking-wide min-h-[48px] w-full text-left"
                                  onClick={() => toggleMobileMenu(item.name)}
                                  aria-label={`${item.name} menu`}
                                  aria-expanded={mobileOpenMenus[item.name]}
                                  aria-controls={`mobile-submenu-${item.name}`}
                              >
                                {item.name}
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${mobileOpenMenus[item.name] ? 'rotate-180' : ''}`}
                                    aria-hidden="true"
                                />
                              </button>

                              {mobileOpenMenus[item.name] && (
                                  <div
                                    className="pl-6 space-y-1 border-l-2 border-white/20 ml-4"
                                    id={`mobile-submenu-${item.name}`}
                                    role="menu"
                                    aria-label={`${item.name} submenu`}
                                  >
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.name}
                                            href={child.href}
                                            className="text-sm text-gray-300 hover:text-white block py-3 px-4 rounded-lg hover:bg-white/5 transition-all duration-200 font-medium min-h-[44px] flex items-center"
                                            onClick={() => setIsMenuOpen(false)}
                                            role="menuitem"
                                            aria-label={`Navigate to ${child.name}`}
                                        >
                                          {child.name}
                                        </Link>
                                    ))}
                                  </div>
                              )}
                            </div>
                        )}
                      </div>
                  ))}

                  {/* Mobile Member Authentication */}
                  <div className="border-t border-gray-700/50 pt-6 mt-6" role="region" aria-label="User account section">
                    {session ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 pb-4">
                            <Avatar className="h-12 w-12 ring-2 ring-white/30">
                              <div className="w-full h-full bg-gradient-to-br from-church-primary via-church-primary-light to-church-accent flex items-center justify-center text-lg font-bold text-white">
                                {getUserInitials(session.user.name)}
                              </div>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-white">{getDisplayName(session.user.name)}</p>
                              <p className="text-sm text-gray-400">{session.user.email}</p>
                            </div>
                          </div>

                          <Link
                              href={session.user.role === 'admin' ? "/admin/dashboard" : "/members/dashboard"}
                              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-all duration-200"
                              onClick={() => setIsMenuOpen(false)}
                              aria-label="Go to dashboard"
                          >
                            <User className="h-5 w-5" aria-hidden="true" />
                            Dashboard
                          </Link>

                          <Link
                              href={session.user.role === 'admin' ? "/admin/profile" : "/members/profile"}
                              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-all duration-200"
                              onClick={() => setIsMenuOpen(false)}
                              aria-label="Go to profile"
                          >
                            <Settings className="h-5 w-5" aria-hidden="true" />
                            Profile
                          </Link>

                          <div className="mt-4">
                            <LogoutButton
                                variant="outline"
                                className="w-full justify-start bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400"
                                showConfirmation={true}
                                redirectTo="/"
                                aria-label="Sign out of your account"
                            />
                          </div>
                        </div>
                    ) : (
                        <Button
                          className="w-full bg-gradient-to-r from-[hsl(218,31%,18%)] to-[hsl(218,31%,25%)] hover:from-[hsl(45,56%,55%)] hover:to-[hsl(45,56%,48%)] text-white font-semibold py-3 rounded-xl transition-all duration-300 border-2 border-[hsl(45,56%,55%)]/30 hover:border-[hsl(45,56%,55%)]"
                          asChild
                          aria-label="Go to member login page"
                        >
                          <Link href="/members/login" onClick={() => setIsMenuOpen(false)}>
                            Member Login
                          </Link>
                        </Button>
                    )}
                  </div>
                </nav>

                <div className="absolute top-4 right-4">
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMenuOpen(false)}
                      className="h-10 w-10 text-gray-400 hover:text-white hover:bg-white/10"
                      aria-label="Close navigation menu"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Close panel</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
  );
}
