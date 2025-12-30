import { type NextRequest, NextResponse } from 'next/server';
import {
  sanitizeEmail,
  sanitizeString,
  sanitizePhone,
  checkRateLimit,
  rateLimiters,
  canSubmit,
  submissionTrackers,
  validateOrigin,
  getSecurityHeaders
} from '@/lib/security';
import { z } from 'zod';

const PaymentSchema = z.object({
  email: z.string().email('Invalid email address'),
  amount: z.number().positive('Amount must be positive').min(100, 'Minimum amount is ₦100'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().optional(),
  purpose: z.string().min(3, 'Purpose is required').max(200),
  reference: z.string().optional(),
});

type PaymentData = z.infer<typeof PaymentSchema>;

export async function POST(request: NextRequest) {
  try {
    // Validate origin
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }

    // Rate limiting - 3 payment requests per 5 minutes
    const rateLimit = checkRateLimit(request, rateLimiters.payment);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many payment requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          }
        }
      );
    }

    // Prevent duplicate submissions
    if (!canSubmit(request, submissionTrackers.payment)) {
      return NextResponse.json(
        { error: 'Please wait before submitting another payment request' },
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

    const body: PaymentData = await request.json();

    // Validate with Zod schema
    const validation = PaymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid payment data',
          details: validation.error.errors.map(e => e.message)
        },
        { status: 400 }
      );
    }

    const { email, amount, full_name, phone, purpose } = validation.data;

    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedName = sanitizeString(full_name);
    const sanitizedPhone = phone ? sanitizePhone(phone) : '';
    const sanitizedPurpose = sanitizeString(purpose);

    // Additional validation
    if (!sanitizedEmail || !sanitizedName || !sanitizedPurpose) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Validate amount (prevent manipulation)
    if (amount > 10000000) { // Max ₦10 million
      return NextResponse.json(
        { error: 'Amount exceeds maximum allowed' },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `TPWBM_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Convert amount to kobo (Paystack uses kobo)
    const amountInKobo = Math.round(amount * 100);

    const paystackData = {
      email: sanitizedEmail,
      amount: amountInKobo,
      reference,
      metadata: {
        full_name: sanitizedName,
        phone: sanitizedPhone,
        purpose: sanitizedPurpose,
        church: 'The Prevailing Word Believers Ministry',
        timestamp: new Date().toISOString(),
      },
      callback_url: `${process.env.NEXTAUTH_URL}/payments/success`,
      cancel_action: `${process.env.NEXTAUTH_URL}/payments/cancelled`
    };

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Paystack error:', result);
      return NextResponse.json(
        { error: 'Payment initialization failed. Please try again.' },
        { status: 500 }
      );
    }

    // Apply security headers
    const headers = getSecurityHeaders();

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: result.data.authorization_url,
        access_code: result.data.access_code,
        reference: result.data.reference,
      }
    }, { headers });

  } catch (error) {
    console.error('Payment initialization error:', error);

    // Don't expose internal errors
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
