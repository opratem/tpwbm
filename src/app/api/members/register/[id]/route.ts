import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { membershipRequests, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const reviewSchema = z.object({
  action: z.enum(['approve', 'reject']),
  reviewNotes: z.string().optional(),
  password: z.string().min(8).optional(), // For approved users
});

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate the request with better error handling
    let validatedData;
    try {
      validatedData = reviewSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const passwordError = error.issues.find(issue => issue.path.includes('password'));
        if (passwordError) {
          return NextResponse.json(
            {
              error: 'Password must be at least 8 characters long. Please enter a longer password or leave it empty to auto-generate one.'
            },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: 'Invalid request data. Please check your input and try again.' },
          { status: 400 }
        );
      }
      throw error;
    }

    const { action, reviewNotes, password } = validatedData;
    const { id } = await props.params;

    // Get the membership request
    const [membershipRequest] = await db
      .select()
      .from(membershipRequests)
      .where(eq(membershipRequests.id, id))
      .limit(1);

    if (!membershipRequest) {
      return NextResponse.json(
        { error: 'Membership request not found' },
        { status: 404 }
      );
    }

    if (membershipRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'This request has already been reviewed' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      // Check if email already exists
      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, membershipRequest.email),
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 400 }
        );
      }

      // Use the password the user chose during registration
      // Admin can override if needed by providing a new password
      let hashedPassword = membershipRequest.hashedPassword;
      let tempPassword = null;

      if (password) {
        // Admin is overriding with a new password
        hashedPassword = await bcrypt.hash(password, 10);
        tempPassword = password;
      }

      const [newUser] = await db.insert(users).values({
        name: `${membershipRequest.firstName} ${membershipRequest.lastName}`,
        email: membershipRequest.email,
        hashedPassword,
        phone: membershipRequest.phone,
        address: membershipRequest.address,
        interests: membershipRequest.interests,
        role: 'member',
        isActive: true,
        membershipDate: new Date(),
      }).returning();

      // Update membership request
      await db.update(membershipRequests)
        .set({
          status: 'approved',
          reviewedBy: session.user.id,
          reviewedAt: new Date(),
          reviewNotes,
          userId: newUser.id,
          updatedAt: new Date(),
        })
        .where(eq(membershipRequests.id, id));

      // TODO: Send welcome email to the user with login credentials

      return NextResponse.json({
        success: true,
        message: tempPassword
          ? 'Membership approved with new password'
          : 'Membership approved with user\'s chosen password',
        user: {
          id: newUser.id,
          email: newUser.email,
          tempPassword, // Only present if admin provided override password
        },
      });
    } else {
      // Reject the request
      await db.update(membershipRequests)
        .set({
          status: 'rejected',
          reviewedBy: session.user.id,
          reviewedAt: new Date(),
          reviewNotes,
          updatedAt: new Date(),
        })
        .where(eq(membershipRequests.id, id));

      return NextResponse.json({
        success: true,
        message: 'Membership request rejected',
      });
    }
  } catch (error) {
    console.error('Error reviewing membership request:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process membership request' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a membership request
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { id } = await props.params;

    await db.delete(membershipRequests).where(eq(membershipRequests.id, id));

    return NextResponse.json({
      success: true,
      message: 'Membership request deleted',
    });
  } catch (error) {
    console.error('Error deleting membership request:', error);
    return NextResponse.json(
      { error: 'Failed to delete membership request' },
      { status: 500 }
    );
  }
}
