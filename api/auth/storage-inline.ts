// Inline storage module for auth API to avoid Vercel module resolution issues
import { 
  profiles,
  type Profile, type InsertProfile
} from "../../shared/schema.js";
import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../shared/schema.js";
import { eq } from "drizzle-orm";

// Database setup (inline from db.ts)
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const db = drizzle(pool, { schema });

// Profile methods (inline from storage.ts)
export const authStorage = {
  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.email, email));
    return profile || undefined;
  }
};
