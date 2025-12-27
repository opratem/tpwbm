import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { membershipRequests } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { notificationSender } from '@/lib/notification-broadcaster';
import bcrypt from 'bcryptjs';

const membershipRequestSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  birthDate: z.string().optional(),
  interests: z.string().optional(),
  previousChurch: z.string().optional(),
  referredBy: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = membershipRequestSchema.parse(body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Check if email already has a pending request
    const existingRequest = await db.query.membershipRequests.findFirst({
      where: (requests, { eq, and }) =>
        and(
          eq(requests.email, validatedData.email),
          eq(requests.status, 'pending')
        ),
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending membership request. Please wait for admin approval.' },
        { status: 400 }
      );
    }

    // Create membership request
    const [newRequest] = await db.insert(membershipRequests).values({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      hashedPassword: hashedPassword,
      phone: validatedData.phone || null,
      address: validatedData.address || null,
      city: validatedData.city || null,
      state: validatedData.state || null,
      zipCode: validatedData.zipCode || null,
      birthDate: validatedData.birthDate || null,
      interests: validatedData.interests || null,
      previousChurch: validatedData.previousChurch || null,
      referredBy: validatedData.referredBy || null,
      additionalInfo: validatedData.additionalInfo || null,
      status: 'pending',
    }).returning();

    // Send notification to admins about new membership request
    try {
      notificationSender.newMembershipRequest({
        requestId: newRequest.id,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        email: validatedData.email
      });
      console.log(`[MEMBERSHIP-REQUEST] Notification sent for new request: ${newRequest.id}`);
    } catch (error) {
      console.error('Failed to send membership request notification:', error);
      // Don't fail the request creation if notification fails
    }

    return NextResponse.json({
      success: true,
      message: 'Membership request submitted successfully! We will review your application and contact you soon.',
      requestId: newRequest.id,
    });
  } catch (error) {
    console.error('Error creating membership request:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit membership request. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch all membership requests (admin only)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let requests;

    if (status && status !== 'all') {
      requests = await db
        .select()
        .from(membershipRequests)
        .where(eq(membershipRequests.status, status as 'pending' | 'approved' | 'rejected' | 'cancelled'))
        .orderBy(desc(membershipRequests.createdAt));
    } else {
      requests = await db
        .select()
        .from(membershipRequests)
        .orderBy(desc(membershipRequests.createdAt));
    }

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching membership requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch membership requests' },
      { status: 500 }
    );
  }
}
