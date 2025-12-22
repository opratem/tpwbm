import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, passwordResetTokens, securityAuditLogs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Security logging function
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

// Validate password strength for admin accounts
const validateAdminPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeated characters');
  }

  if (/123|abc|qwerty|password/i.test(password)) {
    errors.push('Password cannot contain common sequences');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// GET: Verify token validity
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!token) {
      await logSecurityEvent(
        'admin_password_reset_verify_no_token',
        null,
        null,
        false,
        ipAddress,
        userAgent,
        {},
        'low'
      );

      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }

    // Find the reset token
    const [resetToken] = await db
      .select({
        id: passwordResetTokens.id,
        userId: passwordResetTokens.userId,
        tokenType: passwordResetTokens.tokenType,
        status: passwordResetTokens.status,
        expiresAt: passwordResetTokens.expiresAt,
        userName: users.name,
        userEmail: users.email,
        userRole: users.role,
      })
      .from(passwordResetTokens)
      .innerJoin(users, eq(passwordResetTokens.userId, users.id))
      .where(
        and(
          eq(passwordResetTokens.token, token),
          eq(passwordResetTokens.tokenType, 'admin_reset'),
          eq(passwordResetTokens.status, 'active')
        )
      )
      .limit(1);

    if (!resetToken) {
      await logSecurityEvent(
        'admin_password_reset_verify_invalid_token',
        null,
        null,
        false,
        ipAddress,
        userAgent,
        { token: `${token.substring(0, 8)}...` },
        'medium'
      );

      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 404 }
      );
    }

    // Check if token has expired
    if (new Date() > resetToken.expiresAt) {
      await logSecurityEvent(
        'admin_password_reset_verify_expired_token',
        resetToken.userId,
        null,
        false,
        ipAddress,
        userAgent,
        { expiresAt: resetToken.expiresAt.toISOString() },
        'medium'
      );

      // Mark token as expired
      await db
        .update(passwordResetTokens)
        .set({ status: 'expired' })
        .where(eq(passwordResetTokens.id, resetToken.id));

      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 410 }
      );
    }

    // Verify this is actually an admin account
    if (resetToken.userRole !== 'admin') {
      await logSecurityEvent(
        'admin_password_reset_verify_non_admin_target',
        resetToken.userId,
        null,
        false,
        ipAddress,
        userAgent,
        { targetRole: resetToken.userRole },
        'high'
      );

      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 403 }
      );
    }

    // Log successful verification
    await logSecurityEvent(
      'admin_password_reset_verify_success',
      resetToken.userId,
      null,
      true,
      ipAddress,
      userAgent,
      {
        targetEmail: resetToken.userEmail,
        expiresAt: resetToken.expiresAt.toISOString()
      },
      'medium'
    );

    return NextResponse.json({
      valid: true,
      email: resetToken.userEmail,
      name: resetToken.userName,
      expiresAt: resetToken.expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Admin password reset verification error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred' },
      { status: 500 }
    );
  }
}

// POST: Actually reset the password
export async function POST(request: NextRequest) {
  try {
    const { token, newPassword, confirmPassword } = await request.json();

    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate inputs
    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Validate admin password strength
    const passwordValidation = validateAdminPassword(newPassword);
    if (!passwordValidation.valid) {
      await logSecurityEvent(
        'admin_password_reset_weak_password',
        null,
        null,
        false,
        ipAddress,
        userAgent,
        { errors: passwordValidation.errors },
        'low'
      );

      return NextResponse.json(
        {
          error: 'Password does not meet security requirements',
          details: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Find and validate the reset token
    const [resetToken] = await db
      .select({
        id: passwordResetTokens.id,
        userId: passwordResetTokens.userId,
        tokenType: passwordResetTokens.tokenType,
        status: passwordResetTokens.status,
        expiresAt: passwordResetTokens.expiresAt,
        adminRequesterId: passwordResetTokens.adminRequesterId,
        userName: users.name,
        userEmail: users.email,
        userRole: users.role,
      })
      .from(passwordResetTokens)
      .innerJoin(users, eq(passwordResetTokens.userId, users.id))
      .where(
        and(
          eq(passwordResetTokens.token, token),
          eq(passwordResetTokens.tokenType, 'admin_reset'),
          eq(passwordResetTokens.status, 'active')
        )
      )
      .limit(1);

    if (!resetToken) {
      await logSecurityEvent(
        'admin_password_reset_invalid_token',
        null,
        null,
        false,
        ipAddress,
        userAgent,
        { token: `${token.substring(0, 8)}...` },
        'high'
      );

      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 404 }
      );
    }

    // Check expiration
    if (new Date() > resetToken.expiresAt) {
      await logSecurityEvent(
        'admin_password_reset_expired_token',
        resetToken.userId,
        resetToken.adminRequesterId,
        false,
        ipAddress,
        userAgent,
        { expiresAt: resetToken.expiresAt.toISOString() },
        'medium'
      );

      await db
        .update(passwordResetTokens)
        .set({ status: 'expired' })
        .where(eq(passwordResetTokens.id, resetToken.id));

      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 410 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password
    await db
      .update(users)
      .set({
        hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, resetToken.userId));

    // Mark the token as used
    await db
      .update(passwordResetTokens)
      .set({
        status: 'used',
        usedAt: new Date()
      })
      .where(eq(passwordResetTokens.id, resetToken.id));

    // Revoke all other active tokens for this user for security
    await db
      .update(passwordResetTokens)
      .set({
        status: 'revoked',
        revokedAt: new Date(),
        securityNotes: 'Revoked due to successful password reset'
      })
      .where(
        and(
          eq(passwordResetTokens.userId, resetToken.userId),
          eq(passwordResetTokens.status, 'active')
        )
      );

    // Log successful password reset
    await logSecurityEvent(
      'admin_password_reset_success',
      resetToken.userId,
      resetToken.adminRequesterId,
      true,
      ipAddress,
      userAgent,
      {
        targetEmail: resetToken.userEmail,
        resetTime: new Date().toISOString()
      },
      'high'
    );

    console.log(`
      ================================
      ADMIN PASSWORD RESET SUCCESSFUL
      ================================
      Admin: ${resetToken.userEmail}
      Time: ${new Date().toISOString()}
      IP: ${ipAddress}
      Requester: ${resetToken.adminRequesterId || 'Self-initiated'}
      ================================
    `);

    return NextResponse.json({
      success: true,
      message: 'Admin password has been successfully reset'
    });

  } catch (error) {
    console.error('Admin password reset error:', error);

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
