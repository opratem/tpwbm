/**
 * API Route: Subscribe to Push Notifications
 * POST /api/notifications/push/subscribe
 *
 * Saves a push subscription for the authenticated user.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { savePushSubscription, isWebPushConfigured, getVapidPublicKey } from '@/lib/web-push';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!isWebPushConfigured()) {
      return NextResponse.json(
        { error: 'Push notifications are not configured on this server' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { subscription } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get('user-agent') || undefined;

    const success = await savePushSubscription(
      session.user.id,
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      },
      userAgent
    );

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Push subscription saved successfully',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[API] Push subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get VAPID public key for client-side subscription
export async function GET() {
  const publicKey = getVapidPublicKey();

  if (!publicKey) {
    return NextResponse.json(
      { error: 'Push notifications are not configured' },
      { status: 503 }
    );
  }

  return NextResponse.json({
    publicKey,
    configured: true,
  });
}
