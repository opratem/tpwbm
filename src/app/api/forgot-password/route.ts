import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, passwordResetTokens, securityAuditLogs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import {
  checkRateLimit,
  rateLimiters,
  sanitizeEmail,
  getSecurityHeaders
} from '@/lib/security';
import { z } from 'zod';

// Validation schema
const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
});

// Security logging function
const logSecurityEvent = async (
  action: string,
  userId: string | null,
  success: boolean,
  ipAddress: string,
  userAgent: string,
  details: Record<string, any> = {},
  riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
) => {
  try {
    await db.insert(securityAuditLogs).values({
      userId,
      adminId: null,
      action,
      resourceType: 'user',
      resourceId: userId || 'unknown',
      ipAddress,
      userAgent,
      success,
      details,
      riskLevel,
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Simple email simulation - in production, use a proper email service like SendGrid, Resend, etc.
const sendPasswordResetEmail = async (email: string, resetToken: string, userName: string) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/members/reset-password?token=${resetToken}`;

  console.log(`
    ================================
    PASSWORD RESET EMAIL (SIMULATED)
    ================================
    To: ${email}
    Subject: Reset your password for TPWBM

    Hello ${userName},

    You requested a password reset for your account at The Prevailing Word Believers Ministry.

    Click the link below to reset your password:
    ${resetUrl}

    This link will expire in 1 hour.

    If you didn't request this password reset, please ignore this email.

    Blessings,
    The TPWBM Media Team
    ================================
  `);

  return true;
};

export async function POST(request: NextRequest) {
  try {
    // Apply security headers
    const securityHeaders = getSecurityHeaders();

    // Rate limiting - 3 attempts per hour to prevent email bombing
    const rateLimit = checkRateLimit(request, rateLimiters.passwordReset);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: 'Too many password reset requests. Please try again later.',
          retryAfter
        },
        {
          status: 429,
          headers: {
            ...securityHeaders,
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          }
        }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const validation = ForgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      // Return generic message to prevent email enumeration
      return NextResponse.json(
        { message: 'If an account exists with that email, a reset link has been sent.' },
        { status: 200, headers: securityHeaders }
      );
    }

    const { email } = validation.data;

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);

    // Get request metadata for security logging
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!sanitizedEmail) {
      await logSecurityEvent(
        'password_reset_invalid_request',
        null,
        false,
        ipAddress,
        userAgent,
        { reason: 'missing_email' }
      );

      // Return generic message to prevent email enumeration
      return NextResponse.json(
        { message: 'If an account exists with that email, a reset link has been sent.' },
        { status: 200, headers: securityHeaders }
      );
    }

    // Find user with this email
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.email, sanitizedEmail.toLowerCase().trim()))
      .limit(1);

    // Always return success to prevent email enumeration attacks
    const response = {
      message: 'If an account with that email exists, we have sent password reset instructions.',
      success: true
    };

    // If user doesn't exist or is inactive, still return success but log it
    if (!user || !user.isActive) {
      await logSecurityEvent(
        'password_reset_invalid_target',
        user?.id || null,
        false,
        ipAddress,
        userAgent,
        {
          requestedEmail: email,
          userExists: !!user,
          userActive: user?.isActive
        }
      );

      return NextResponse.json(response);
    }

    // Check for recent reset attempts (rate limiting)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const [recentToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.userId, user.id),
          eq(passwordResetTokens.tokenType, 'regular_reset'),
          eq(passwordResetTokens.status, 'active')
        )
      )
      .limit(1);

    if (recentToken && recentToken.createdAt > oneHourAgo) {
      await logSecurityEvent(
        'password_reset_rate_limited',
        user.id,
        false,
        ipAddress,
        userAgent,
        { reason: 'recent_token_exists' }
      );

      return NextResponse.json(response); // Still return success
    }

    // Revoke any existing active tokens for this user
    await db
      .update(passwordResetTokens)
      .set({
        status: 'revoked',
        revokedAt: new Date(),
        securityNotes: `Revoked due to new reset request from IP: ${ipAddress}`
      })
      .where(
        and(
          eq(passwordResetTokens.userId, user.id),
          eq(passwordResetTokens.status, 'active')
        )
      );

    // Generate a secure reset token
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour for regular users

    // Store the reset token in the database
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token: resetToken,
      tokenType: 'regular_reset',
      status: 'active',
      expiresAt,
      ipAddress,
      userAgent,
      securityNotes: `Regular password reset requested from IP: ${ipAddress}`,
    });

    try {
      // Send the password reset email
      await sendPasswordResetEmail(user.email, resetToken, user.name || 'Member');

      // Log successful request
      await logSecurityEvent(
        'password_reset_requested',
        user.id,
        true,
        ipAddress,
        userAgent,
        {
          userEmail: user.email,
          userRole: user.role,
          tokenExpiry: expiresAt.toISOString()
        }
      );

    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);

      // Log the email failure
      await logSecurityEvent(
        'password_reset_email_failed',
        user.id,
        false,
        ipAddress,
        userAgent,
        { error: String(emailError) }
      );
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Forgot password error:', error);

    // Log the system error
    await logSecurityEvent(
      'password_reset_system_error',
      null,
      false,
      'unknown',
      'unknown',
      { error: String(error) },
      'critical'
    );

    return NextResponse.json(
      { error: 'An internal error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
