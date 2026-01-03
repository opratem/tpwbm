/**
 * API Route: Unsubscribe from Push Notifications
 * POST /api/notifications/push/unsubscribe
 *
 * Removes a push subscription for the authenticated user.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { removePushSubscription } from '@/lib/web-push';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    const success = await removePushSubscription(session.user.id, endpoint);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Push subscription removed successfully',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to remove subscription' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[API] Push unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
