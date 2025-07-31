# Supabase Migration Plan

## Overview
This document outlines the steps needed to migrate the current database implementation from Neon PostgreSQL to Supabase while maintaining compatibility with Drizzle ORM.

## Current Implementation
The application currently uses:
- Neon PostgreSQL as the database
- Drizzle ORM with `@neondatabase/serverless` adapter
- Environment variable `DATABASE_URL` for connection

## Migration Steps

### 1. Update Database Connection (`server/db.ts`)
Replace the current Neon-specific implementation with Supabase-compatible PostgreSQL connection:

```typescript
import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a PostgreSQL pool connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export the database instance
export const db = drizzle(pool, { schema });

// Export the pool for potential direct usage
export { pool };
```

### 2. Update Drizzle Configuration (`drizzle.config.ts`)
Update the configuration to work with Supabase PostgreSQL:

```typescript
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

### 3. Update Dependencies
The following changes to `package.json` are needed:

1. Remove `@neondatabase/serverless` dependency
2. Remove `ws` dependency (used for Neon WebSocket)
3. Ensure `pg` is installed (it should be as a dependency of `connect-pg-simple`)

### 4. Update Documentation (`DATABASE_SETUP.md`)
Update the documentation to reflect Supabase setup:

#### Option 1: Use Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Navigate to Project Settings > Database to get your connection details
4. Create a `.env` file in the root directory with:
   ```
   DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]"
   ```

### 5. Environment Variables
Update the `.env` file with Supabase connection string:
```
# Database
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[YOUR_PROJECT_ID].supabase.co:5432/postgres"
```

## Testing
After implementing these changes:
1. Verify database connection works
2. Test all CRUD operations through the API endpoints
3. Ensure migrations still work with `npm run db:push`
4. Verify the application functions as expected with Supabase backend

## Real-time Features
For real-time features using Supabase client:
1. Use `@supabase/supabase-js` for real-time subscriptions
2. Implement real-time updates for portfolio projects and products
3. Add real-time analytics or notifications if needed