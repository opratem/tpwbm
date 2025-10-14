import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
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
      // Here you could save the payment details to your database
      const paymentInfo = {
        reference: data.reference,
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

      return NextResponse.json({
        success: true,
        payment: paymentInfo
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Payment was not successful',
        status: data.status
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
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

    return NextResponse.json(result);

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
