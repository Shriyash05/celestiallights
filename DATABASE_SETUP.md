# Database Setup for Celestial Lights Website

## Current Database Configuration

The application is configured to use **Supabase PostgreSQL** database.

### Connection Details
- **Database URL**: `postgresql://postgres.kzoywkomnniqdrvccolg:Shriyash3005@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`
- **Supabase Project URL**: `https://kzoywkomnniqdrvccolg.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6b3l3a29tbm5pcWRydmNjb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDMwNjYsImV4cCI6MjA2OTQ3OTA2Nn0.1JwLgjrzqj0ZV-u0Aum8J1LHLVXl1MkvCRpDu3UWNQE`

## Database Schema

The database contains the following tables:

### 1. `portfolio_projects`
```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- description (TEXT)
- category (VARCHAR)
- location (VARCHAR)
- features (TEXT[])
- images (TEXT[])
- videos (TEXT[])
- imageUrl (VARCHAR) - Legacy field
- videoUrl (VARCHAR) - Legacy field  
- isFeatured (BOOLEAN)
- isPublished (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 2. `products`
```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- description (TEXT)
- category (VARCHAR)
- images (TEXT[])
- imageUrl (VARCHAR) - Legacy field
- powerConsumption (VARCHAR)
- lumensOutput (VARCHAR)
- colorTemperature (VARCHAR)
- beamAngle (VARCHAR)
- ipRating (VARCHAR)
- material (VARCHAR)
- dimensions (JSONB)
- warrantyPeriod (VARCHAR)
- mountingType (VARCHAR)
- controlType (VARCHAR)
- bodyColor (VARCHAR)
- certifications (TEXT[])
- technicalSpecifications (TEXT[])
- isFeatured (BOOLEAN)
- isPublished (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 3. `quotes`
```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- projectType (VARCHAR)
- projectDescription (TEXT)
- budget (VARCHAR)
- timeline (VARCHAR)
- location (VARCHAR)
- status (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 4. `users` (Admin)
```sql
- id (UUID, Primary Key)
- username (VARCHAR)
- email (VARCHAR)
- password_hash (VARCHAR)
- role (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Real-time Configuration

**Important**: For real-time functionality to work, ensure the following tables have real-time enabled in Supabase:

### Enable Real-time
1. Go to Supabase Dashboard
2. Navigate to Database > Replication
3. Enable real-time for:
   - `portfolio_projects`
   - `products`
   - `quotes`

### Real-time Events
The application listens for:
- INSERT events (new items added)
- UPDATE events (items modified)
- DELETE events (items removed)

## Database Migrations

To push schema changes:
```bash
# Set your database URL
export DATABASE_URL="postgresql://postgres.kzoywkomnniqdrvccolg:Shriyash3005@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Push schema changes
npm run db:push
```

## Row Level Security (RLS)

The database uses Row Level Security policies. Current configuration:
- **Products**: Public read access, admin write access
- **Portfolio Projects**: Public read access, admin write access  
- **Quotes**: Admin access only
- **Users**: Admin access only

## Backup and Monitoring

- **Automatic Backups**: Enabled daily in Supabase
- **Connection Pooling**: Configured via Supabase
- **Monitoring**: Available in Supabase Dashboard

## For Production Deployment

Make sure to:
1. ✅ Set environment variables in GoDaddy
2. ✅ Verify real-time is enabled for all tables
3. ✅ Check RLS policies are correctly configured
4. ✅ Monitor connection limits in Supabase dashboard