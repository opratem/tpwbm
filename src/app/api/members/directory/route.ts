import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only authenticated users can view the directory
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can access member directory
    if (!hasAdminAccess(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Fetch all active members with limited information for privacy
    const allMembers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      address: users.address,
      birthday: users.birthday,
      interests: users.interests,
      bio: users.bio,
      image: users.image,
      role: users.role,
      ministryRole: users.ministryRole,
      membershipDate: users.membershipDate,
    })
    .from(users)
    .where(eq(users.isActive, true));

    return NextResponse.json({ members: allMembers });
  } catch (error) {
    console.error('Error fetching member directory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
