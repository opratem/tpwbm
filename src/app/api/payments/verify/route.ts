import { type NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  rateLimiters,
  validateOrigin,
  sanitizeString,
  getSecurityHeaders
} from '@/lib/security';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    // Validate origin
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }

    // Rate limiting
    const rateLimit = checkRateLimit(request, rateLimiters.payment);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate Paystack configuration
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error('PAYSTACK_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    // Sanitize reference
    const sanitizedReference = sanitizeString(reference);

    // Validate reference format
    if (!sanitizedReference.startsWith('TPWBM_')) {
      return NextResponse.json(
        { error: 'Invalid payment reference format' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(sanitizedReference)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Paystack verification error:', result);
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 500 }
      );
    }

    const { data } = result;

    // Check if payment was successful
    if (data.status === 'success') {
      // Validate the payment data
      const paymentInfo = {
        reference: sanitizeString(data.reference),
        amount: data.amount / 100, // Convert from kobo to naira
        email: data.customer.email,
        status: data.status,
        paid_at: data.paid_at,
        purpose: data.metadata?.purpose || 'General Offering',
        full_name: data.metadata?.full_name || data.customer.email,
        phone: data.metadata?.phone || '',
        gateway_response: data.gateway_response,
        channel: data.channel
      };

      // Apply security headers
      const headers = getSecurityHeaders();

      return NextResponse.json({
        success: true,
        payment: paymentInfo
      }, { headers });
    }

    return NextResponse.json({
      success: false,
      message: 'Payment was not successful',
      status: data.status
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint is for webhook verification from Paystack
    // Verify webhook signature
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      console.error('Missing Paystack signature');
      return NextResponse.json(
        { error: 'Invalid webhook request' },
        { status: 401 }
      );
    }

    const body = await request.text();

    // Verify signature if secret is configured
    if (process.env.PAYSTACK_SECRET_KEY) {
      const hash = crypto
        .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
        .update(body)
        .digest('hex');

      if (hash !== signature) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Parse the verified webhook data
    const event = JSON.parse(body);

    // Handle the webhook event
    if (event.event === 'charge.success') {
      const { data } = event;

      console.log('Payment webhook received:', {
        reference: data.reference,
        amount: data.amount / 100,
        email: data.customer.email,
        status: data.status,
      });

      // Here you could save the payment to your database
      // TODO: Save payment record to database

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, message: 'Event received' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
