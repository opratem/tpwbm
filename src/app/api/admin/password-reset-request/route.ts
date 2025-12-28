import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, passwordResetTokens, securityAuditLogs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import { getServerSession } from 'next-auth';
import {
  sanitizeEmail,
  checkRateLimit,
  rateLimiters,
  validateOrigin,
  getSecurityHeaders
} from '@/lib/security';
import { emailNotificationService } from '@/lib/email-notification';

// Enhanced security logging function
const logSecurityEvent = async (
  action: string,
  userId: string | null,
  adminId: string | null,
  success: boolean,
  ipAddress: string,
  userAgent: string,
  details: Record<string, any> = {},
  riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) => {
  try {
    await db.insert(securityAuditLogs).values({
      userId,
      adminId,
      action,
      resourceType: 'admin',
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

// Enhanced email sending function for admin resets
const sendAdminPasswordResetEmail = async (
  email: string,
  resetToken: string,
  userName: string,
  ipAddress: string,
  requesterName: string
) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${resetToken}`;

  console.log(`
    ================================
    ADMIN PASSWORD RESET EMAIL (SIMULATED)
    ================================
    To: ${email}
    Subject: URGENT: Admin Password Reset Request for TPWBM

    Hello ${userName},

    An admin password reset has been requested for your account at The Prevailing Word Believers Ministry.

    SECURITY DETAILS:
    - Requested by: ${requesterName}
    - IP Address: ${ipAddress}
    - Time: ${new Date().toISOString()}
    - This link expires in 15 minutes for security

    Click the link below to reset your password:
    ${resetUrl}

    IMPORTANT SECURITY NOTICE:
    - If you did not request this reset, your account may be compromised
    - Contact the technical team immediately if this was unauthorized
    - This is an admin account - extra security measures are in place

    This link will expire in 15 minutes.

    Blessings,
    The TPWBM Media Team
    ================================
  `);

  return true;
};

export async function POST(request: NextRequest) {
  try {
    // Validate origin
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }

    // Rate limiting - 3 attempts per hour
    const rateLimit = checkRateLimit(request, rateLimiters.passwordReset);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many password reset requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }

    const { email, adminRequesterId } = await request.json();

    // Get request metadata for security logging
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate and sanitize input
    if (!email) {
      await logSecurityEvent(
        'admin_password_reset_invalid_request',
        null,
        adminRequesterId,
        false,
        ipAddress,
        userAgent,
        { reason: 'missing_email' },
        'low'
      );

      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Sanitize email input
    const sanitizedEmail = sanitizeEmail(email);

    if (!sanitizedEmail) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Verify the requester is an admin (if provided)
    if (adminRequesterId) {
      const [requester] = await db
        .select({ role: users.role, name: users.name })
        .from(users)
        .where(eq(users.id, adminRequesterId))
        .limit(1);

      if (!requester || requester.role !== 'admin') {
        await logSecurityEvent(
          'admin_password_reset_unauthorized_request',
          null,
          adminRequesterId,
          false,
          ipAddress,
          userAgent,
          { requestedEmail: email },
          'high'
        );

        return NextResponse.json(
          { error: 'Unauthorized: Admin privileges required' },
          { status: 403 }
        );
      }
    }

    // Find the target user
    const [targetUser] = await db
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

    // Security response - don't reveal if user exists
    const standardResponse = {
      message: 'If an admin account with that email exists, we have sent password reset instructions.',
      success: true
    };

    // If user doesn't exist, is inactive, or is not an admin
    if (!targetUser || !targetUser.isActive || targetUser.role !== 'admin') {
      await logSecurityEvent(
        'admin_password_reset_invalid_target',
        targetUser?.id || null,
        adminRequesterId,
        false,
        ipAddress,
        userAgent,
        {
          requestedEmail: email,
          targetExists: !!targetUser,
          targetActive: targetUser?.isActive,
          targetRole: targetUser?.role
        },
        'medium'
      );

      return NextResponse.json(standardResponse);
    }

    // Check for recent reset attempts (rate limiting)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const [recentToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.userId, targetUser.id),
          eq(passwordResetTokens.tokenType, 'admin_reset'),
          eq(passwordResetTokens.status, 'active')
        )
      )
      .limit(1);

    if (recentToken && recentToken.createdAt > fifteenMinutesAgo) {
      await logSecurityEvent(
        'admin_password_reset_rate_limited',
        targetUser.id,
        adminRequesterId,
        false,
        ipAddress,
        userAgent,
        { reason: 'recent_token_exists' },
        'medium'
      );

      return NextResponse.json(standardResponse);
    }

    // Revoke any existing active tokens for this user
    await db
      .update(passwordResetTokens)
      .set({
        status: 'revoked',
        revokedAt: new Date(),
        securityNotes: `Revoked due to new admin reset request from IP: ${ipAddress}`
      })
      .where(
        and(
          eq(passwordResetTokens.userId, targetUser.id),
          eq(passwordResetTokens.status, 'active')
        )
      );

    // Generate secure reset token
    const resetToken = randomBytes(32).toString('hex');

    // Admin tokens expire in 15 minutes (much shorter than regular users)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Store the reset token with enhanced tracking
    await db.insert(passwordResetTokens).values({
      userId: targetUser.id,
      token: resetToken,
      tokenType: 'admin_reset',
      status: 'active',
      expiresAt,
      ipAddress,
      userAgent,
      adminRequesterId,
      securityNotes: `Admin password reset initiated from IP: ${ipAddress}`,
    });

    // Get requester name for email
    let requesterName = 'System Administrator';
    if (adminRequesterId) {
      const [requester] = await db
        .select({ name: users.name })
        .from(users)
        .where(eq(users.id, adminRequesterId))
        .limit(1);
      requesterName = requester?.name || requesterName;
    }

    try {
      // Use the secure email service instead
      await emailNotificationService.sendPasswordResetEmail(
        targetUser.email,
        targetUser.name || 'Administrator',
        resetToken
      );

      // Log successful request
      await logSecurityEvent(
        'admin_password_reset_requested',
        targetUser.id,
        adminRequesterId,
        true,
        ipAddress,
        userAgent,
        {
          targetEmail: targetUser.email,
          tokenExpiry: expiresAt.toISOString(),
          requesterName
        },
        'high'
      );

    } catch (emailError) {
      console.error('Failed to send admin password reset email:', emailError);

      // Log the email failure
      await logSecurityEvent(
        'admin_password_reset_email_failed',
        targetUser.id,
        adminRequesterId,
        false,
        ipAddress,
        userAgent,
        { error: String(emailError) },
        'medium'
      );
    }

    // Apply security headers
    const headers = getSecurityHeaders();

    return NextResponse.json(standardResponse, { headers });

  } catch (error) {
    console.error('Admin password reset error:', error);

    // Log the system error
    await logSecurityEvent(
      'admin_password_reset_system_error',
      null,
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
