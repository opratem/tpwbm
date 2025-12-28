import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function GET() {
  try {
    // Simple query to test connection
    const userCount = await db.select().from(users).limit(1);

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: userCount.length
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
