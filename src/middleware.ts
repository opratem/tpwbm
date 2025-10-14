import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasMinistryPermission, type MinistryRole } from "@/lib/ministry";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "YourSuperSecretKeyGoesHere",
  });

  const { pathname } = request.nextUrl;

  // Define protected routes
  const memberRoutes = [
    "/members/dashboard",
    "/members/profile",
    "/members/prayer",
    "/members/resources",
    "/members/events",
    "/members/groups",
    "/members/announcements",
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
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isMinistryRoute = Object.keys(ministryRoutes).some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/members/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle admin routes
  if (isAdminRoute && (!token || token.role !== "admin")) {
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
      // Admin users have access to all ministry routes
      if (token.role === "admin") {
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

  // Redirect authenticated users away from login page
  if (pathname === "/members/login" && token) {
    // Redirect based on user role
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/members/dashboard", request.url));
  }

  // Add security headers
  const response = NextResponse.next();

  // Security headers for admin and member areas
  if (isProtectedRoute || isAdminRoute || isMinistryRoute) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  }

  return response;
}

export const config = {
  matcher: [
    // Only protect member and admin routes
    "/members/((?!login|register|forgot-password).*)",
    "/admin/:path*",
  ],
};
