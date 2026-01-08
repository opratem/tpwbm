import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, hasAdminAccess } from "@/lib/auth";
import { plausibleService, type AnalyticsData } from "@/lib/plausible";

// GET /api/admin/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || !hasAdminAccess(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    // Check if Plausible is configured
    if (!plausibleService.isConfigured()) {
      console.warn('Plausible Analytics not configured, returning fallback data');

      // Return fallback analytics data
      const fallbackData: AnalyticsData = {
        visitors: 1247,
        pageviews: 3456,
        bounceRate: 45.2,
        visitDuration: 180,
        topPages: [
          { page: '/', visitors: 456, pageviews: 789 },
          { page: '/sermons', visitors: 234, pageviews: 345 },
          { page: '/events', visitors: 123, pageviews: 167 },
          { page: '/about', visitors: 89, pageviews: 112 },
          { page: '/ministries', visitors: 78, pageviews: 98 }
        ],
        timeseriesData: [
          { date: '2025-06-01', visitors: 45, pageviews: 89 },
          { date: '2025-06-02', visitors: 52, pageviews: 103 },
          { date: '2025-06-03', visitors: 38, pageviews: 76 },
          { date: '2025-06-04', visitors: 61, pageviews: 125 },
          { date: '2025-06-05', visitors: 48, pageviews: 94 }
        ],
        topCountries: [
          { country: 'Nigeria', visitors: 890, percentage: 71.4 },
          { country: 'United States', visitors: 156, percentage: 12.5 },
          { country: 'United Kingdom', visitors: 89, percentage: 7.1 },
          { country: 'Canada', visitors: 67, percentage: 5.4 },
          { country: 'Germany', visitors: 45, percentage: 3.6 }
        ],
        topReferrers: [
          { source: 'Direct', visitors: 543, percentage: 43.5 },
          { source: 'Google', visitors: 234, percentage: 18.8 },
          { source: 'Facebook', visitors: 167, percentage: 13.4 },
          { source: 'YouTube', visitors: 89, percentage: 7.1 },
          { source: 'Instagram', visitors: 67, percentage: 5.4 }
        ]
      };

      return NextResponse.json({
        success: true,
        data: fallbackData,
        isConfigured: false,
        period,
        message: 'Plausible Analytics not configured. Showing sample data.'
      });
    }

    // Fetch real analytics data from Plausible
    const analyticsData = await plausibleService.getAnalyticsData(period);

    return NextResponse.json({
      success: true,
      data: analyticsData,
      isConfigured: true,
      period,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("[ANALYTICS-GET] Error:", error);

    // Return fallback data on error
    const fallbackData: AnalyticsData = {
      visitors: 0,
      pageviews: 0,
      bounceRate: 0,
      visitDuration: 0,
      topPages: [],
      timeseriesData: [],
      topCountries: [],
      topReferrers: []
    };

    return NextResponse.json({
      success: false,
      data: fallbackData,
      isConfigured: false,
      error: "Failed to fetch analytics data",
      message: "Unable to fetch analytics data. Please check your configuration."
    }, { status: 500 });
  }
}

// GET /api/admin/analytics/realtime - Get realtime visitor count
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || !hasAdminAccess(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    if (!plausibleService.isConfigured()) {
      return NextResponse.json({
        success: true,
        realtimeVisitors: Math.floor(Math.random() * 15) + 1, // Random fallback between 1-15
        isConfigured: false,
        message: 'Plausible Analytics not configured. Showing simulated data.'
      });
    }

    const realtimeVisitors = await plausibleService.getRealtimeVisitors();

    return NextResponse.json({
      success: true,
      realtimeVisitors,
      isConfigured: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("[REALTIME-ANALYTICS] Error:", error);

    return NextResponse.json({
      success: false,
      realtimeVisitors: 0,
      isConfigured: false,
      error: "Failed to fetch realtime data"
    }, { status: 500 });
  }
}
