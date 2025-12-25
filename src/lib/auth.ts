import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, accounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { compare } from "bcryptjs";
import { emailNotificationService } from "@/lib/email-notification";

// 🚨 PRODUCTION VALIDATION - Warning only, don't block build
if (process.env.NODE_ENV === 'production') {
  const nextAuthUrl = process.env.NEXTAUTH_URL;

  if (!nextAuthUrl) {
    console.warn(
      '⚠️  WARNING: NEXTAUTH_URL is not set!\n' +
      'Set NEXTAUTH_URL in your deployment environment variables.\n' +
      'Example: NEXTAUTH_URL=https://tpwbm.com.ng'
    );
  } else if (nextAuthUrl.includes('localhost') || nextAuthUrl.includes('127.0.0.1')) {
    console.warn(
      '⚠️  WARNING: NEXTAUTH_URL is set to localhost in PRODUCTION!\n' +
      `Current value: ${nextAuthUrl}\n` +
      'This may cause authentication to fail.\n' +
      'Update NEXTAUTH_URL in deployment environment variables to your production domain.\n' +
      'Example: NEXTAUTH_URL=https://tpwbm.com.ng'
    );
  }

  if (!process.env.NEXTAUTH_SECRET) {
    console.warn(
      '⚠️  WARNING: NEXTAUTH_SECRET is not set!\n' +
      'Set NEXTAUTH_SECRET in your deployment environment variables.'
    );
  }
}

// Helper function to extract domain from NEXTAUTH_URL for cookie configuration
function extractDomainFromUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const hostname = new URL(url).hostname;

    // Warn if NEXTAUTH_URL is still localhost in production
    if (process.env.NODE_ENV === 'production' && hostname === 'localhost') {
      console.warn('⚠️  NEXTAUTH_URL is set to localhost in production!');
      console.warn('   This may cause authentication to fail.');
      console.warn('   Set NEXTAUTH_URL to your production domain in environment variables.');
      console.warn('   Example: https://tpwbm.com.ng');
    }

    // For domains like tpwbm.com.ng, return .tpwbm.com.ng
    // This allows cookies to work across all subdomains
    return `.${hostname}`;
  } catch (error) {
    console.error('Failed to extract domain from NEXTAUTH_URL:', error);
    return undefined;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  // Allow account linking for users with same email
  events: {
    async linkAccount({ user, account, profile }) {
      console.log("Account linked:", { userId: user.id, provider: account.provider });

      // Send email notification for account linking
      if (user.email && user.name && account.provider) {
        try {
          await emailNotificationService.sendAccountLinkedNotification(
              user.email,
              user.name,
              account.provider
          );
        } catch (error) {
          console.error("Failed to send account linking notification:", error);
        }
      }
    },
    async signIn({ user, account, profile, isNewUser }) {
      // Send email notification for new OAuth logins
      if (account?.provider !== "credentials" && user.email && user.name) {
        try {
          await emailNotificationService.sendLoginNotification(
              user.email,
              user.name,
              account?.provider || "unknown"
          );
        } catch (error) {
          console.error("Failed to send login notification:", error);
        }
      }
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          console.log("Attempting to authenticate user:", credentials.email);

          // Find user in database
          const [user] = await db
              .select()
              .from(users)
              .where(eq(users.email, credentials.email))
              .limit(1);

          if (!user) {
            console.log("User not found:", credentials.email);
            return null;
          }

          if (!user.hashedPassword) {
            console.log("User has no password set:", credentials.email);
            return null;
          }

          if (!user.isActive) {
            console.log("User is not active:", credentials.email);
            return null;
          }

          // Verify password
          const passwordMatch = await compare(credentials.password, user.hashedPassword);
          if (!passwordMatch) {
            console.log("Password mismatch for user:", credentials.email);
            return null;
          }

          console.log("Authentication successful for user:", credentials.email);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            ministryRole: user.ministryRole || undefined,
            ministryLevel: user.ministryLevel || undefined,
            image: user.image,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/members/login",
    signOut: "/",
    error: "/members/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      try {
        // Parse the URL to check if it's /admin or /admin/dashboard
        const parsedUrl = url.startsWith("/") ? url : new URL(url).pathname;

        // Redirect /admin and /admin/dashboard to unified dashboard
        if (parsedUrl === "/admin" || parsedUrl === "/admin/dashboard") {
          return `${baseUrl}/members/dashboard`;
        }

        // For direct URL redirects, allow them if they're from the same origin
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        if (new URL(url).origin === baseUrl) return url;

        // Default redirect - unified dashboard for all users
        return `${baseUrl}/members/dashboard`;
      } catch (error) {
        console.error("Redirect callback error:", error);
        return `${baseUrl}/members/dashboard`;
      }
    },
    async signIn({ user, account, profile }) {
      try {
        // Handle OAuth sign-ins (Google, Facebook)
        if (account?.provider === "google" || account?.provider === "facebook") {
          if (!user.email) return false;

          // Check if user exists
          const [existingUser] = await db
              .select()
              .from(users)
              .where(eq(users.email, user.email))
              .limit(1);

          if (!existingUser) {
            // User doesn't exist, create new user
            const newUser = await db.insert(users).values({
              email: user.email,
              name: user.name || "",
              image: user.image,
              role: "member",
              emailVerified: new Date(),
              isActive: true,
              membershipDate: new Date(),
            }).returning();

            console.log("Created new user via OAuth:", newUser[0].email);
            return true;
          }

          if (!existingUser.isActive) {
            // Don't allow inactive users to sign in
            console.log("User is inactive:", existingUser.email);
            return false;
          }

          // User exists, check if OAuth account is already linked
            const [existingAccount] = await db
                .select()
                .from(accounts)
                .where(and(
                    eq(accounts.userId, existingUser.id),
                    eq(accounts.provider, account.provider)
                ))
                .limit(1);

            if (!existingAccount) {
              // Link the OAuth account to existing user
              await db.insert(accounts).values({
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              });

              // Update user with OAuth profile info if missing
              await db
                  .update(users)
                  .set({
                    image: user.image || existingUser.image,
                    emailVerified: new Date(),
                    updatedAt: new Date()
                  })
                  .where(eq(users.id, existingUser.id));

              console.log("Linked OAuth account to existing user:", existingUser.email);

              // Send email notification for automatic account linking
              try {
                await emailNotificationService.sendAccountLinkedNotification(
                    existingUser.email,
                    existingUser.name || "Member",
                    account.provider
                );
              } catch (error) {
                console.error("Failed to send account linking notification:", error);
              }
            }

            return true;
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      try {
        // When user signs in, get their information from database
        if (user?.email) {
          const [dbUser] = await db
              .select()
              .from(users)
              .where(eq(users.email, user.email))
              .limit(1);

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.ministryRole = dbUser.ministryRole || undefined;
            token.ministryLevel = dbUser.ministryLevel || undefined;
            token.email = dbUser.email;
            // Ensure name is always set, fallback to email username or 'User'
            token.name = dbUser.name || dbUser.email?.split('@')[0] || 'User';
            token.picture = dbUser.image;
          }
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user && token) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
          session.user.ministryRole = token.ministryRole as string;
          session.user.ministryLevel = token.ministryLevel as string;
          session.user.email = token.email as string;
          // Ensure name is always a string, never undefined or null
          session.user.name = (token.name as string) || (token.email as string)?.split('@')[0] || 'User';
          session.user.image = token.picture as string;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Don't set domain in production to allow cookies to work on current hostname
        // This prevents issues when accessing via different domains (e.g., vercel.app vs custom domain)
        domain: undefined,
      },
    },
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error: (code, metadata) => {
      console.error("NextAuth Error:", code, metadata);
    },
    warn: (code) => {
      console.warn("NextAuth Warning:", code);
    },
    debug: (code, metadata) => {
      if (process.env.NODE_ENV === "development") {
        console.log("NextAuth Debug:", code, metadata);
      }
    },
  },
};
