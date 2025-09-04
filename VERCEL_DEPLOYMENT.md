# Vercel Deployment Guide for Celestial Lights

This document provides instructions for deploying the Celestial Lights website on Vercel with both frontend and backend functionality.

## Project Structure

The project has been restructured for Vercel deployment:

```
celestiallights/
├── api/                          # Serverless API functions
│   ├── _lib/                     # Shared utilities for API functions
│   │   ├── db.ts                 # Database connection
│   │   └── storage.ts            # Storage layer
│   ├── auth/
│   │   └── check-admin.ts        # Admin authentication check
│   ├── portfolio-projects/
│   │   ├── index.ts              # GET/POST portfolio projects
│   │   ├── featured.ts           # GET featured projects
│   │   └── [id].ts               # GET/PUT/DELETE project by ID
│   ├── products/
│   │   ├── index.ts              # GET/POST products
│   │   ├── featured.ts           # GET featured products
│   │   └── [id].ts               # GET/PUT/DELETE product by ID
│   ├── upload.ts                 # File upload handler
│   └── send-quote-email.ts       # Quote email sender
├── client/                       # Frontend React application
│   ├── src/                      # React source code
│   ├── public/                   # Static assets
│   └── index.html                # Main HTML file
├── shared/                       # Shared TypeScript schemas
├── server/                       # Legacy server files (kept for reference)
├── vercel.json                   # Vercel deployment configuration
└── package.json                  # Project dependencies and scripts
```

## Environment Variables

Make sure to set the following environment variables in your Vercel dashboard:

### Required Variables
- `DATABASE_URL` - PostgreSQL connection string (Supabase)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NODE_ENV` - Set to "production"
- `SESSION_SECRET` - Random string for session encryption

### Optional Email Variables (for quote requests)
- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP server port (default: 587)
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_SECURE` - Set to "true" for SSL (default: false)
- `ADMIN_EMAIL` - Email to receive quote requests

### Business Information
- `BUSINESS_NAME` - Your business name (default: "Celestial Lights")
- `BUSINESS_EMAIL` - Your business email
- `BUSINESS_PHONE` - Your business phone number

## Deployment Steps

### 1. Prepare Your Repository

1. Ensure all changes are committed to your Git repository
2. Push your code to GitHub, GitLab, or Bitbucket

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your repository
4. Vercel will automatically detect the configuration from `vercel.json`
5. Add your environment variables in the project settings
6. Deploy!

#### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel --prod
   ```

### 3. Configure Environment Variables

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all the required variables listed above
4. Redeploy if necessary

## API Endpoints

After deployment, your API will be available at:

- `https://your-domain.vercel.app/api/portfolio-projects` - Portfolio projects
- `https://your-domain.vercel.app/api/portfolio-projects/featured` - Featured projects
- `https://your-domain.vercel.app/api/portfolio-projects/[id]` - Individual project
- `https://your-domain.vercel.app/api/products` - Products
- `https://your-domain.vercel.app/api/products/featured` - Featured products
- `https://your-domain.vercel.app/api/products/[id]` - Individual product
- `https://your-domain.vercel.app/api/upload` - File upload
- `https://your-domain.vercel.app/api/send-quote-email` - Quote requests
- `https://your-domain.vercel.app/api/auth/check-admin` - Admin check

## Build Configuration

The project uses the following build configuration in `vercel.json`:

```json
{
  "version": 2,
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/client/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "npm install"
}
```

## Local Development

For local development with the new structure:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env` file

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` and API functions can be tested using tools like Postman or curl.

## Database Migrations

If you need to run database migrations:

```bash
npm run db:push
```

## Troubleshooting

### Common Issues

1. **API functions not working**: Check that environment variables are set correctly
2. **File uploads failing**: Ensure Supabase credentials are configured
3. **Database connection errors**: Verify DATABASE_URL is correct
4. **Build failures**: Check that all dependencies are listed in package.json

### Logs and Debugging

- Check Vercel function logs in your dashboard under the "Functions" tab
- Use `console.log` statements in your API functions for debugging
- Monitor the "Runtime Logs" section for error details

## Performance Considerations

- API functions are serverless and cold start on first request
- Database connections are pooled for efficiency  
- Static assets are served from Vercel's CDN
- Consider implementing caching for frequently accessed data

## Security

- API functions include CORS headers for cross-origin requests
- Database queries use parameterized statements to prevent SQL injection
- File uploads are validated and stored in Supabase Storage
- Admin authentication uses Supabase Auth

## Support

For deployment issues:
- Check Vercel documentation: https://vercel.com/docs
- Review API function logs in Vercel dashboard
- Ensure all environment variables are properly configured
