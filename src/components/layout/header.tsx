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
  if (!name) return 'U';

  const words = name.trim().split(' ').filter(word => word.length > 0);

  if (words.length === 1) {
    // Single name: take first two characters if available
    return words[0].charAt(0).toUpperCase();
  } else if (words.length === 2) {
    // Two names: take first character of each
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  } else {
    // Three or more names: take first character of first and last name
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }
};

// Utility function to truncate name intelligently
const getDisplayName = (name: string | null | undefined, maxLength = 15): string => {
  if (!name) return 'User';

  if (name.length <= maxLength) return name;

  const words = name.trim().split(' ');
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
  return name.substring(0, maxLength - 1) + '…';
};

export function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});

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

  // Handle dropdown visibility
  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
      <header className={`sticky top-0 z-50 w-full border-b border-gray-800/20 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-xl' : 'bg-gray-900/90 backdrop-blur-sm'} transition-all duration-300`}>
        <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between pl-3 pr-2 sm:px-4 md:px-6 lg:px-6 max-w-none">
          {/* Logo Section - Fixed to show full name on desktop */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-auto min-w-0">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity duration-300 min-w-0">
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
              <div className="flex flex-col min-w-0">
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
          <nav className="hidden lg:flex gap-1 items-center flex-1 justify-center px-2 ml-4">
            {navigationItems.map((item) => (
                !item.children ? (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="px-2 py-2 text-sm font-semibold text-gray-200 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 tracking-wide uppercase"
                    >
                      {item.name}
                    </Link>
                ) : (
                    <DropdownMenu key={item.name} open={openDropdowns[item.name]} onOpenChange={() => toggleDropdown(item.name)}>
                      <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="px-2 py-2 text-sm font-semibold text-gray-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 transition-all duration-300 rounded-lg flex items-center gap-2 tracking-wide uppercase"
                        >
                          {item.name}
                          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                          align="center"
                          className="w-56 bg-gray-900/95 backdrop-blur-md border-gray-700/50 shadow-2xl rounded-xl"
                      >
                        {item.children.map((child) => (
                            <DropdownMenuItem key={child.name} asChild>
                              <Link
                                  href={child.href}
                                  className="w-full cursor-pointer text-gray-200 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white rounded-lg font-medium transition-all duration-200"
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
                <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse flex-shrink-0" />
            ) : session ? (
                <div className="flex items-center gap-1">
                  {/* Live Notifications */}
                  <LiveNotifications className="text-white hover:text-gray-200 flex-shrink-0" />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 max-w-[140px]">
                        <Avatar className="h-8 w-8 ring-2 ring-white/30 flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                            {getUserInitials(session.user.name)}
                          </div>
                        </Avatar>
                        <span className="text-sm font-semibold text-white hidden lg:block truncate min-w-0">{getDisplayName(session.user.name)}</span>
                        <ChevronDown className="h-4 w-4 text-gray-300 flex-shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-gray-900/95 backdrop-blur-md border-gray-700/50 shadow-2xl rounded-xl">
                      <DropdownMenuItem asChild>
                        <Link href="/members/dashboard" className="flex items-center gap-3 text-gray-200 hover:text-white focus:text-white rounded-lg font-medium">
                          <User className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/members/profile" className="flex items-center gap-3 text-gray-200 hover:text-white focus:text-white rounded-lg font-medium">
                          <Settings className="h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {session.user.role === "admin" && (
                          <DropdownMenuItem asChild>
                            <Link href="/admin/dashboard" className="flex items-center gap-3 text-gray-200 hover:text-white focus:text-white rounded-lg font-medium">
                              <Settings className="h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-gray-700/50" />
                      <DropdownMenuItem className="p-0">
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
                </div>
            ) : (
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hidden lg:flex px-6 py-2 rounded-xl bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold backdrop-blur-sm flex-shrink-0"
                >
                  <Link href="/members/login">Member Login</Link>
                </Button>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon" className="h-11 w-11 sm:h-12 sm:w-12 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 min-h-[44px] min-w-[44px] -mr-1 sm:mr-0">
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[340px] md:w-[400px] pt-16 sm:pt-20 bg-gray-900/95 backdrop-blur-md border-gray-700/50 overflow-y-auto max-h-screen">
                <Link href="/" className="flex items-center gap-3 mb-12" onClick={() => setIsMenuOpen(false)}>
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
                  <div className="flex flex-col">
                  <span className="text-lg font-bold text-white leading-tight">
                    The Prevailing Word
                  </span>
                    <span className="text-sm text-gray-300 font-medium">
                    Ministry Inc.
                  </span>
                  </div>
                </Link>

                <nav className="flex flex-col gap-3 flex-1 overflow-y-auto pb-4">
                  {navigationItems.map((item) => (
                      <div key={item.name} className="py-1">
                        {!item.children ? (
                            <Link
                                href={item.href}
                                className="text-base font-semibold transition-colors hover:text-white text-gray-200 block py-4 px-4 rounded-lg hover:bg-white/10 uppercase tracking-wide min-h-[48px] flex items-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                        ) : (
                            <div className="space-y-2">
                              <div
                                  className="text-base font-semibold flex items-center justify-between cursor-pointer py-4 px-4 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-all duration-200 uppercase tracking-wide min-h-[48px]"
                                  onClick={() => toggleDropdown(item.name)}
                              >
                                {item.name}
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${openDropdowns[item.name] ? 'rotate-180' : ''}`}
                                />
                              </div>

                              {openDropdowns[item.name] && (
                                  <div className="pl-6 space-y-1 border-l-2 border-white/20 ml-4">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.name}
                                            href={child.href}
                                            className="text-sm text-gray-300 hover:text-white block py-3 px-4 rounded-lg hover:bg-white/5 transition-all duration-200 font-medium min-h-[44px] flex items-center"
                                            onClick={() => setIsMenuOpen(false)}
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
                  <div className="border-t border-gray-700/50 pt-6 mt-6">
                    {session ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 pb-4">
                            <Avatar className="h-12 w-12 ring-2 ring-white/30">
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white">
                                {getUserInitials(session.user.name)}
                              </div>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-white">{getDisplayName(session.user.name)}</p>
                              <p className="text-sm text-gray-400">{session.user.email}</p>
                            </div>
                          </div>

                          <Link
                              href="/members/dashboard"
                              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-all duration-200"
                              onClick={() => setIsMenuOpen(false)}
                          >
                            <User className="h-5 w-5" />
                            Dashboard
                          </Link>

                          <Link
                              href="/members/profile"
                              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-all duration-200"
                              onClick={() => setIsMenuOpen(false)}
                          >
                            <Settings className="h-5 w-5" />
                            Profile
                          </Link>

                          {session.user.role === "admin" && (
                              <Link
                                  href="/admin/dashboard"
                                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-all duration-200"
                                  onClick={() => setIsMenuOpen(false)}
                              >
                                <Settings className="h-5 w-5" />
                                Admin Dashboard
                              </Link>
                          )}

                          <div className="mt-4" onClick={() => setIsMenuOpen(false)}>
                            <LogoutButton
                                variant="outline"
                                className="w-full justify-start bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400"
                                showConfirmation={true}
                                redirectTo="/"
                            />
                          </div>
                        </div>
                    ) : (
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300" asChild>
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
                  >
                    <X className="h-5 w-5" />
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
