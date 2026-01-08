import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, accounts, sessions } from '@/lib/db/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAdminAccess(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      phone: users.phone,
      address: users.address,
      birthday: users.birthday,
      interests: users.interests,
      bio: users.bio,
      emailVerified: users.emailVerified,
    }).from(users);

    return NextResponse.json({ users: allUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAdminAccess(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      email,
      role,
      phone,
      temporaryPassword,
      ministryRole,
      ministryLevel,
      ministryDescription
    } = body;

    // Validate required fields
    if (!name || !email || !role || !temporaryPassword) {
      return NextResponse.json({
        error: 'Missing required fields: name, email, role, and temporaryPassword are required'
      }, { status: 400 });
    }

    // Validate role
    if (!['admin', 'member'].includes(role)) {
      return NextResponse.json({
        error: 'Invalid role. Must be admin or member'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({
        error: 'User with this email already exists'
      }, { status: 409 });
    }

    // Hash the temporary password
    const hashedPassword = await hash(temporaryPassword, 10);

    // Create new user
    const [newUser] = await db.insert(users).values({
      name,
      email,
      role: role as 'admin' | 'member',
      ministryRole: (ministryRole && ministryRole !== 'none') ? ministryRole : null,
      ministryLevel: (ministryLevel && ministryLevel !== 'none') ? ministryLevel : null,
      ministryDescription: ministryDescription || null,
      hashedPassword,
      phone: phone || null,
      emailVerified: new Date(), // Auto-verify admin-created accounts
      isActive: true,
      membershipDate: role === 'member' ? new Date() : null,
    }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      ministryRole: users.ministryRole,
      ministryLevel: users.ministryLevel,
      ministryDescription: users.ministryDescription,
      isActive: users.isActive,
      createdAt: users.createdAt,
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: newUser
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAdminAccess(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      userId,
      isActive,
      role,
      ministryRole,
      ministryLevel,
      ministryDescription
    } = body;

    if (!userId) {
      return NextResponse.json({
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Prevent admin from deactivating themselves
    if (session.user.id === userId && isActive === false) {
      return NextResponse.json({
        error: 'You cannot deactivate your own account'
      }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }
    if (role && ['admin', 'member'].includes(role)) {
      updateData.role = role;
    }
    if (ministryRole !== undefined) {
      updateData.ministryRole = (ministryRole && ministryRole !== 'none') ? ministryRole : null;
    }
    if (ministryLevel !== undefined) {
      updateData.ministryLevel = (ministryLevel && ministryLevel !== 'none') ? ministryLevel : null;
    }
    if (ministryDescription !== undefined) {
      updateData.ministryDescription = ministryDescription || null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        error: 'No valid fields to update'
      }, { status: 400 });
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        ministryRole: users.ministryRole,
        ministryLevel: users.ministryLevel,
        ministryDescription: users.ministryDescription,
        isActive: users.isActive,
      });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAdminAccess(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (session.user.id === userId) {
      return NextResponse.json({
        error: 'You cannot delete your own account'
      }, { status: 400 });
    }

    // Check if user exists
    const [userToDelete] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete associated accounts first (OAuth accounts)
    await db.delete(accounts).where(eq(accounts.userId, userId));

    // Delete associated sessions
    await db.delete(sessions).where(eq(sessions.userId, userId));

    // Delete the user
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({
      message: 'User permanently deleted successfully',
      deletedUser: {
        id: userToDelete.id,
        name: userToDelete.name,
        email: userToDelete.email
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
