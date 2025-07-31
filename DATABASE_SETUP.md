# Database Setup Guide

## Quick Fix for Development

To get the application running quickly, you have a few options:

### Option 1: Use Neon (Recommended - Free)
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new PostgreSQL database
3. Copy the connection string from your dashboard
4. Create a `.env` file in the root directory with:
   ```
   DATABASE_URL="your-neon-connection-string-here"
   ```

### Option 2: Use Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `celestiallights`
3. Create a `.env` file with:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/celestiallights"
   ```

### Option 3: Use SQLite for Development (Quickest)
If you want to get started immediately without setting up PostgreSQL, you can modify the database configuration to use SQLite.

## After Setting Up DATABASE_URL

Once you have your `.env` file with the `DATABASE_URL`, run these commands:

```bash
# Push the database schema
npm run db:push

# Seed the database with sample data
npx tsx scripts/seed-data.ts

# Start the development server
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with these variables:

```env
# Required
DATABASE_URL="your-database-connection-string"

# Optional - for email functionality
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Database Schema

The application uses these main tables:
- `users` - User authentication
- `profiles` - User profile information
- `portfolio_projects` - Project showcase data
- `products` - Product catalog

The schema is defined in `shared/schema.ts` and will be automatically created when you run `npm run db:push`. 