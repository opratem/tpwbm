import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, accounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { provider, providerAccountId } = await req.json();

    if (!provider || !providerAccountId) {
      return NextResponse.json(
        { error: "Missing provider or account ID" },
        { status: 400 }
      );
    }

    // Get current user
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if account is already linked
    const [existingAccount] = await db
      .select()
      .from(accounts)
      .where(and(
        eq(accounts.userId, currentUser.id),
        eq(accounts.provider, provider)
      ))
      .limit(1);

    if (existingAccount) {
      return NextResponse.json(
        { message: "Account already linked" },
        { status: 200 }
      );
    }

    // Link the account
    await db.insert(accounts).values({
      userId: currentUser.id,
      type: "oauth",
      provider: provider,
      providerAccountId: providerAccountId,
    });

    return NextResponse.json(
      { message: "Account linked successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Account linking error:", error);
    return NextResponse.json(
      { error: "Failed to link account" },
      { status: 500 }
    );
  }
}
