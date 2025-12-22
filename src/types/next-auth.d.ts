import NextAuth, { type DefaultSession, type DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      ministryRole?: string;
      ministryLevel?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
    ministryRole?: string;
    ministryLevel?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    ministryRole?: string;
    ministryLevel?: string;
  }
}
