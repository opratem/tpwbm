import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasMinistryPermission, type MinistryRole } from "@/lib/ministry";
import { rateLimit, RATE_LIMITS, getIdentifier } from "@/lib/rate-limit";

// Helper function to check if user has admin privileges (admin or super_admin)
const isAdminUser = (role: string | undefined | null) => {
  return role === "admin" || role === "super_admin";
};

export async function middleware(request: NextRequest) {
  // Validate NEXTAUTH_SECRET is configured
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error('CRITICAL: NEXTAUTH_SECRET is not configured in environment variables');
    return NextResponse.json(
      { error: 'Authentication service not configured' },
      { status: 503 }
    );
  }

  const { pathname } = request.nextUrl;

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    // Exclude internal NextAuth routes and notification streams from rate limiting
    const excludeFromRateLimit = [
      '/api/auth/_log',
      '/api/auth/session',
      '/api/auth/csrf',
      '/api/notifications/stream',
    ];

    const shouldSkipRateLimit = excludeFromRateLimit.some(route => pathname.startsWith(route));

    if (!shouldSkipRateLimit) {
      const identifier = getIdentifier(request);

      // Different rate limits for different API routes
      let rateLimitResponse: Response | null = null;

      if (pathname.startsWith('/api/auth/') || pathname.startsWith('/api/forgot-password')) {
        rateLimitResponse = rateLimit(identifier, RATE_LIMITS.AUTH);
      } else if (pathname.startsWith('/api/payments/')) {
        rateLimitResponse = rateLimit(identifier, RATE_LIMITS.PAYMENT);
      } else if (pathname.startsWith('/api/upload') || pathname.startsWith('/api/cloudinary/')) {
        rateLimitResponse = rateLimit(identifier, RATE_LIMITS.UPLOAD);
      } else if (pathname.startsWith('/api/contact') || pathname.includes('email')) {
        rateLimitResponse = rateLimit(identifier, RATE_LIMITS.EMAIL);
      } else {
        rateLimitResponse = rateLimit(identifier, RATE_LIMITS.API);
      }

      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    }
  }

  const token = await getToken({
    req: request,
    secret,
    secureCookie: process.env.NODE_ENV === 'production',
  });

  // Debug logging for production token issues
  if (process.env.NODE_ENV === 'production' && pathname.startsWith('/members')) {
    console.log('[Middleware] Path:', pathname, 'Token:', !!token, 'User:', token?.email);

    // Additional debugging for session issues
    if (!token && pathname !== '/members/login') {
      console.warn('[Middleware] No token found for protected route. NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    }
  }

  // Define protected routes
  const memberRoutes = [
    "/members/dashboard",
    "/members/profile",
    "/members/prayer",
    "/members/resources",
    "/members/events",
    "/members/groups",
    "/members/announcements",
  ];

  // Admin-only member routes (routes under /members that only admins can access)
  const adminOnlyMemberRoutes = [
    "/members/directory",
  ];

  const adminRoutes = [
    "/admin",
    "/admin/dashboard",
    "/admin/members",
    "/admin/content",
    "/admin/analytics",
    "/admin/announcements",
    "/admin/events",
    "/admin/media",
    "/admin/prayer-requests",
    "/admin/users",
    "/admin/blog",
    "/admin/youtube",
    "/admin/profile",
    "/admin/membership-requests",
    "/admin/notifications",
    "/admin/reset-password",
  ];

  // Super admin only routes - require super_admin role specifically
  const superAdminRoutes = [
    "/admin/super-admin",
  ];

  // Ministry-specific routes with required permissions
  const ministryRoutes = {
    "/admin/ministry/worship": "manage_worship",
    "/admin/ministry/youth": "manage_youth_ministry",
    "/admin/ministry/children": "manage_children_ministry",
    "/admin/ministry/women": "manage_womens_ministry",
    "/admin/ministry/men": "manage_mens_ministry",
    "/admin/ministry/music": "manage_music",
    "/admin/ministry/outreach": "manage_outreach",
    "/admin/ministry/finances": "manage_finances",
    "/admin/reports": "view_reports",
  };

  // Check if the route requires authentication
  const isProtectedRoute = memberRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminOnlyMemberRoute = adminOnlyMemberRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isSuperAdminRoute = superAdminRoutes.some((route) => pathname.startsWith(route));
  const isMinistryRoute = Object.keys(ministryRoutes).some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/members/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle admin-only member routes (e.g., /members/directory)
  if (isAdminOnlyMemberRoute) {
    if (!token) {
      const loginUrl = new URL("/members/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdminUser(token.role as string | undefined)) {
      return NextResponse.redirect(new URL("/members/dashboard", request.url));
    }
  }

  // Handle super admin only routes - require super_admin role specifically
  if (isSuperAdminRoute) {
    if (!token) {
      const loginUrl = new URL("/members/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Only super_admin can access, not regular admins
    if (token.role !== 'super_admin') {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // Handle admin routes
  if (isAdminRoute && (!token || !isAdminUser(token.role as string | undefined))) {
    if (!token) {
      const loginUrl = new URL("/members/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect(new URL("/members/dashboard", request.url));
  }

  // Handle ministry-specific routes
  if (isMinistryRoute && token) {
    const requiredPermission = Object.entries(ministryRoutes).find(([route]) =>
      pathname.startsWith(route)
    )?.[1];

    if (requiredPermission) {
      // Admin and super_admin users have access to all ministry routes
      if (isAdminUser(token.role as string | undefined)) {
        return NextResponse.next();
      }

      // Check ministry role permissions
      const hasPermission = hasMinistryPermission(
        token.ministryRole as MinistryRole | null | undefined,
        requiredPermission
      );

      if (!hasPermission) {
        // Redirect to member dashboard if no permission
        return NextResponse.redirect(new URL("/members/dashboard", request.url));
      }
    }
  }

  // Redirect authenticated users away from login page based on their role
  if (pathname === "/members/login" && token) {
    // Redirect admins/super_admins to admin dashboard, regular users to members dashboard
    if (isAdminUser(token.role as string | undefined)) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/members/dashboard", request.url));
  }

  // Redirect admin users from /members/dashboard to /admin/dashboard
  // This handles the case when NextAuth redirects to /members/dashboard after login
  if (pathname === "/members/dashboard" && token && isAdminUser(token.role as string | undefined)) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Redirect /admin to admin dashboard
  if (pathname === "/admin" && token && isAdminUser(token.role as string | undefined)) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Create response and add comprehensive security headers
  const response = NextResponse.next();

  // Security headers for all routes
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Content Security Policy for production (but skip for auth API routes to avoid blocking session fetches)
  if (process.env.NODE_ENV === 'production' && !pathname.startsWith('/api/auth/')) {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co https://www.youtube.com https://www.googletagmanager.com https://plausible.io",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://api.paystack.co https://www.googleapis.com https://*.cloudinary.com https://plausible.io",
      "frame-src 'self' https://js.paystack.co https://www.youtube.com https://www.facebook.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://api.paystack.co",
      "upgrade-insecure-requests",
    ].join('; ');

    response.headers.set("Content-Security-Policy", csp);
  }

  // Strict Transport Security for production (HTTPS only)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Protect member and admin routes
    "/members/((?!login|register|forgot-password).*)",
    "/admin/:path*",
    // Add security headers to API routes
    "/api/:path*",
  ],
};
