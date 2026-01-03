import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  savePushSubscription,
  removePushSubscription,
  getUserSubscriptions,
  getPublicVapidKey,
  isWebPushConfigured,
} from '@/lib/web-push-service';

/**
 * GET /api/push-subscriptions - Get user's subscriptions and VAPID public key
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const response: {
      vapidPublicKey: string;
      isConfigured: boolean;
      subscriptions: Array<{
        id: string;
        deviceName: string | null;
        createdAt: Date;
        lastUsed: Date | null;
      }>;
    } = {
      vapidPublicKey: getPublicVapidKey(),
      isConfigured: isWebPushConfigured(),
      subscriptions: [],
    };

    if (session?.user?.id) {
      const subs = await getUserSubscriptions(session.user.id);
      response.subscriptions = subs.map((s) => ({
        id: s.id,
        deviceName: s.deviceName,
        createdAt: s.createdAt,
        lastUsed: s.lastUsed,
      }));
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting push subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to get push subscriptions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/push-subscriptions - Subscribe to push notifications
 */
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
    const { subscription, deviceName } = body;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get('user-agent') || undefined;

    const result = await savePushSubscription(
      session.user.id,
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      },
      userAgent,
      deviceName
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to save subscription' },
        { status: 500 }
      );
    }

    console.log(`[PUSH-API] New subscription for user ${session.user.email}`);

    return NextResponse.json({
      success: true,
      subscriptionId: result.subscriptionId,
      message: 'Push notifications enabled successfully',
    });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save push subscription' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/push-subscriptions - Unsubscribe from push notifications
 */
export async function DELETE(request: NextRequest) {
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
        { error: 'Endpoint required' },
        { status: 400 }
      );
    }

    const success = await removePushSubscription(session.user.id, endpoint);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to remove subscription' },
        { status: 500 }
      );
    }

    console.log(`[PUSH-API] Subscription removed for user ${session.user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Push notifications disabled successfully',
    });
  } catch (error) {
    console.error('Error removing push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to remove push subscription' },
      { status: 500 }
    );
  }
}
