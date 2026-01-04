import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, securityAuditLogs } from '@/lib/db/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { isSuperAdmin, generateTemporaryPassword, getClientIp } from '@/lib/security-helpers';

// GET - Fetch all users with detailed info for super admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only super admin can access this endpoint
    if (!session?.user || !isSuperAdmin(session.user.email, session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized - Super Admin access required' }, { status: 401 });
    }

    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      ministryRole: users.ministryRole,
      ministryLevel: users.ministryLevel,
      ministryDescription: users.ministryDescription,
      isActive: users.isActive,
      membershipDate: users.membershipDate,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      phone: users.phone,
      address: users.address,
      birthday: users.birthday,
      interests: users.interests,
      bio: users.bio,
      emailVerified: users.emailVerified,
      hasPassword: users.hashedPassword,
    }).from(users);

    // Transform to indicate if user has password set (without exposing the hash)
    const usersWithPasswordStatus = allUsers.map(user => ({
      ...user,
      hasPassword: !!user.hasPassword,
    }));

    return NextResponse.json({ users: usersWithPasswordStatus });
  } catch (error) {
    console.error('Error fetching users for super admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Reset user password (super admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only super admin can access this endpoint
    if (!session?.user || !isSuperAdmin(session.user.email, session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized - Super Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, action, customPassword } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Find the user
    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent super admin from modifying their own password through this interface
    if (targetUser.email?.toLowerCase() === session.user.email?.toLowerCase()) {
      return NextResponse.json({
        error: 'Cannot reset your own password through this interface'
      }, { status: 400 });
    }

    if (action === 'reset-password') {
      // Generate or use custom password
      const newPassword = customPassword || generateTemporaryPassword();
      const hashedPassword = await hash(newPassword, 10);

      // Update user password
      await db
        .update(users)
        .set({
          hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      // Log the action
      await db.insert(securityAuditLogs).values({
        userId: userId,
        adminId: session.user.id,
        action: 'super_admin_password_reset',
        resourceType: 'user',
        resourceId: userId,
        ipAddress: getClientIp(request),
        userAgent: request.headers.get('user-agent') || undefined,
        success: true,
        details: {
          reason: 'Password reset by super admin for member assistance',
          metadata: {
            targetUserEmail: targetUser.email,
            targetUserName: targetUser.name || 'Unknown',
          },
        },
        riskLevel: 'high',
      });

      return NextResponse.json({
        success: true,
        message: 'Password reset successfully',
        temporaryPassword: newPassword,
        user: {
          id: targetUser.id,
          name: targetUser.name,
          email: targetUser.email,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in super admin user action:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update user role (promote/demote to admin)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only super admin can access this endpoint
    if (!session?.user || !isSuperAdmin(session.user.email, session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized - Super Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, role, isActive } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Find the user
    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent modification of super admin's own account
    if (targetUser.email?.toLowerCase() === session.user.email?.toLowerCase()) {
      return NextResponse.json({
        error: 'Cannot modify your own account through this interface'
      }, { status: 400 });
    }

    // Prevent creating another super admin
    if (role === 'super_admin') {
      return NextResponse.json({
        error: 'Cannot assign super_admin role. Only one super admin is allowed.'
      }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    const oldValues: Record<string, unknown> = {};

    if (role && ['admin', 'member', 'visitor'].includes(role)) {
      oldValues.role = targetUser.role;
      updateData.role = role;
    }

    if (typeof isActive === 'boolean') {
      oldValues.isActive = targetUser.isActive;
      updateData.isActive = isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    updateData.updatedAt = new Date();

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
      });

    // Log the action
    await db.insert(securityAuditLogs).values({
      userId: userId,
      adminId: session.user.id,
      action: 'super_admin_user_update',
      resourceType: 'user',
      resourceId: userId,
      ipAddress: getClientIp(request),
      userAgent: request.headers.get('user-agent') || undefined,
      success: true,
      details: {
        oldValue: JSON.stringify(oldValues),
        newValue: JSON.stringify(updateData),
        metadata: {
          targetUserEmail: targetUser.email,
          changes: Object.keys(updateData).filter(k => k !== 'updatedAt').join(', '),
        },
      },
      riskLevel: role === 'admin' ? 'high' : 'medium',
    });

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user as super admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
