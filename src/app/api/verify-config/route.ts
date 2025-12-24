import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),

    // Critical Auth Configuration
    nextauth_url: {
      configured: !!process.env.NEXTAUTH_URL,
      value: process.env.NEXTAUTH_URL || 'NOT SET',
      isLocalhost: process.env.NEXTAUTH_URL?.includes('localhost') ||
                   process.env.NEXTAUTH_URL?.includes('127.0.0.1'),
      warning: process.env.NODE_ENV === 'production' &&
               (process.env.NEXTAUTH_URL?.includes('localhost') ||
                process.env.NEXTAUTH_URL?.includes('127.0.0.1'))
        ? '🚨 CRITICAL: NEXTAUTH_URL is set to localhost in PRODUCTION!'
        : null
    },

    nextauth_secret: {
      configured: !!process.env.NEXTAUTH_SECRET,
      length: process.env.NEXTAUTH_SECRET?.length || 0,
      value: process.env.NEXTAUTH_SECRET ? '***SET***' : 'NOT SET'
    },

    // Database
    database: {
      configured: !!process.env.DATABASE_URL,
      value: process.env.DATABASE_URL ? '***SET***' : 'NOT SET'
    },

    // Payment
    paystack: {
      public_key: !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      secret_key: !!process.env.PAYSTACK_SECRET_KEY
    },

    // Media
    cloudinary: {
      configured: !!(process.env.CLOUDINARY_CLOUD_NAME &&
                     process.env.CLOUDINARY_API_KEY &&
                     process.env.CLOUDINARY_API_SECRET),
      cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME
    },

    // OAuth
    google_oauth: {
      configured: !!(process.env.GOOGLE_CLIENT_ID &&
                     process.env.GOOGLE_CLIENT_SECRET)
    },

    facebook_oauth: {
      configured: !!(process.env.FACEBOOK_CLIENT_ID &&
                     process.env.FACEBOOK_CLIENT_SECRET)
    },

    // Email
    email: {
      configured: !!process.env.RESEND_API_KEY,
      from_email: process.env.FROM_EMAIL || 'NOT SET'
    },

    // YouTube
    youtube: {
      configured: !!process.env.YOUTUBE_API_KEY
    }
  };

  // Overall status
  const criticalIssues: string[] = [];

  if (!checks.nextauth_url.configured) {
    criticalIssues.push('NEXTAUTH_URL is not set');
  }

  if (checks.nextauth_url.isLocalhost && process.env.NODE_ENV === 'production') {
    criticalIssues.push('NEXTAUTH_URL is set to localhost in production');
  }

  if (!checks.nextauth_secret.configured) {
    criticalIssues.push('NEXTAUTH_SECRET is not set');
  }

  if (!checks.database.configured) {
    criticalIssues.push('DATABASE_URL is not set');
  }

  const overallStatus = criticalIssues.length === 0 ? 'OK' : 'CRITICAL_ERRORS';

  return NextResponse.json({
    status: overallStatus,
    criticalIssues,
    checks,
    recommendations: overallStatus === 'CRITICAL_ERRORS' ? [
      'Fix critical issues immediately',
      'Update environment variables in Vercel',
      'Redeploy after updating variables',
      'Clear browser cookies and test again'
    ] : [
      'Configuration looks good!',
      'Test login functionality',
      'Monitor logs for any errors'
    ]
  }, {
    status: overallStatus === 'OK' ? 200 : 500
  });
}
