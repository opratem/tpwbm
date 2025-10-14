import { NextRequest, NextResponse } from 'next/server';

interface PaymentData {
  email: string;
  amount: number;
  full_name: string;
  phone?: string;
  purpose: string;
  reference?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentData = await request.json();
    const { email, amount, full_name, phone, purpose } = body;

    if (!email || !amount || !full_name || !purpose) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `TPWBM_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Convert amount to kobo (Paystack uses kobo)
    const amountInKobo = Math.round(amount * 100);

    const paystackData = {
      email,
      amount: amountInKobo,
      reference,
      metadata: {
        full_name,
        phone: phone || '',
        purpose,
        church: 'The Prevailing Word Believers Ministry'
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
        { error: 'Payment initialization failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: result.data.authorization_url,
        access_code: result.data.access_code,
        reference: result.data.reference,
      }
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
