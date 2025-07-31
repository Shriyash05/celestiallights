import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Create a PostgreSQL pool connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export the database instance
export const db = drizzle(pool, { schema });

// Export the pool for potential direct usage
export { pool };