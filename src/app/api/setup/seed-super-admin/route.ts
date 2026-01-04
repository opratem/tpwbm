import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { SUPER_ADMIN_EMAIL } from '@/lib/constants';

// POST - Create or update super admin user
// This is a one-time setup endpoint
export async function POST(request: NextRequest) {
  try {
    // Check for setup secret to prevent unauthorized access
    const { secret } = await request.json();

    // Simple secret check - in production, use a proper env variable
    const setupSecret = process.env.SETUP_SECRET || 'tpwbm-setup-2024';

    if (secret !== setupSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if super admin already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, SUPER_ADMIN_EMAIL))
      .limit(1);

    const hashedPassword = await hash('superadmin123', 10);

    if (existingUser) {
      // Update existing user to super admin
      await db
        .update(users)
        .set({
          role: 'super_admin',
          hashedPassword,
          isActive: true,
          name: existingUser.name || 'Super Admin',
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id));

      return NextResponse.json({
        success: true,
        message: 'Super admin user updated',
        email: SUPER_ADMIN_EMAIL,
      });
    }

    // Create new super admin user
    const [newUser] = await db.insert(users).values({
      email: SUPER_ADMIN_EMAIL,
      name: 'Super Admin',
      role: 'super_admin',
      hashedPassword,
      isActive: true,
      emailVerified: new Date(),
      membershipDate: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Super admin user created',
      email: SUPER_ADMIN_EMAIL,
      userId: newUser.id,
    });
  } catch (error) {
    console.error('Error seeding super admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Check if super admin exists
export async function GET() {
  try {
    const [existingUser] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.email, SUPER_ADMIN_EMAIL))
      .limit(1);

    return NextResponse.json({
      exists: !!existingUser,
      user: existingUser ? {
        email: existingUser.email,
        role: existingUser.role,
        isActive: existingUser.isActive,
      } : null,
    });
  } catch (error) {
    console.error('Error checking super admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
