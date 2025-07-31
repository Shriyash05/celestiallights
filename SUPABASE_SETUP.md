# Supabase Setup Guide

## Overview
This project uses Supabase as its backend database with Drizzle ORM for database operations. This guide will help you set up Supabase for local development.

## Prerequisites
- Node.js v18 or higher
- A Supabase account (free tier available at [supabase.com](https://supabase.com))

## Setting Up Supabase

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Choose a name for your project (e.g., "celestial-lights")
4. Select a region closest to you
5. Set a secure database password
6. Click "Create Project"

### 2. Get Your Connection String
1. Once your project is ready, go to "Project Settings" > "Database"
2. Scroll down to "Connection String"
3. Copy the "Connection string" for "postgres" (not the pooled connection)
4. It should look like: `postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-ID].supabase.co:5432/postgres`

### 3. Configure Your Environment
Create or update your `.env` file in the project root with your connection string:

```env
# Database
# Supabase PostgreSQL connection string
# Format: postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
# To get your connection string:
# 1. Go to your Supabase project dashboard
# 2. Navigate to Settings > Database
# 3. Find your connection string under "Connection string"
# 4. Replace [YOUR-PASSWORD] with your actual database password
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-ID].supabase.co:5432/postgres"

# Other environment variables...
```

### 4. Set Up Database Schema
Run the following commands to set up your database schema:

```bash
# Push the database schema
npm run db:push

# Seed the database with sample data
npx tsx scripts/seed-data.ts
```

## Database Schema

The application uses these main tables:
- `users` - User authentication
- `profiles` - User profile information
- `portfolio_projects` - Project showcase data
- `products` - Product catalog

The schema is defined in `shared/schema.ts` and will be automatically created when you run `npm run db:push`.

## Real-time Features

This project is configured to use both:
1. Drizzle ORM for traditional database operations
2. Supabase client for real-time features

To use real-time features, you can use the `@supabase/supabase-js` client:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)
```

## Troubleshooting

### Connection Issues
- Ensure your DATABASE_URL is correctly formatted
- Check that your Supabase project is not paused
- Verify your database password is correct

### Schema Issues
- If you encounter schema errors, try running `npm run db:push` again
- Make sure your Supabase database is empty before pushing the schema for the first time

### Authentication
For admin access in the application:
- Email: admin@celestiallights.com
- Password: admin123

Or:
- Email: info.celestiallight@gmail.com
- Password: celestial2024

## Additional Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)