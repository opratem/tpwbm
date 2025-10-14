// Instructions: Update the database connection to use the correct Neon serverless configuration

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const connection = neon(process.env.DATABASE_URL);
export const db = drizzle(connection, { schema });

export * from './schema';
