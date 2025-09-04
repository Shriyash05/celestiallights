# Fix 404 Error on /admin Route

## Problem
- Accessing `https://celestiallights.vercel.app/admin` shows 404 error
- React routes like `/admin`, `/portfolio`, `/products` don't work on direct access
- This is a common issue with Single Page Applications (SPAs) on Vercel

## Root Cause
Vercel was not configured to handle client-side routing properly. When you visit `/admin` directly, Vercel tries to find a file at that path instead of serving the React app.

## Solution Applied

### 1. Updated vercel.json with proper routing:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm run build",
        "outputDirectory": "client/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/.*\\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$",
      "dest": "/$0"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. How This Works:
- **API routes**: `/api/*` → API functions
- **Static assets**: CSS, JS, images → served directly
- **Everything else**: → `index.html` (React app handles routing)

### 3. Alternative Configuration (Simpler):

If the main config still causes issues, try `vercel-spa.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm run build",
        "outputDirectory": "client/dist"
      }
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Testing the Fix

After deployment, these should all work:
- ✅ `https://celestiallights.vercel.app/` (Home)
- ✅ `https://celestiallights.vercel.app/admin` (Admin panel)
- ✅ `https://celestiallights.vercel.app/portfolio` (Portfolio)
- ✅ `https://celestiallights.vercel.app/products` (Products)
- ✅ `https://celestiallights.vercel.app/api/products` (API endpoint)

## If Still Getting 404:

### Quick Fix Options:

1. **Try the SPA config:**
   ```bash
   cp vercel-spa.json vercel.json
   git add vercel.json
   git commit -m "Use SPA configuration"
   git push origin main
   ```

2. **Check build output:**
   - Ensure `client/dist/index.html` exists after build
   - Verify static assets are in `client/dist/`

3. **Verify in Vercel Dashboard:**
   - Go to your project settings
   - Check "Build & Development Settings"
   - Build Command: `npm run build`
   - Output Directory: `client/dist`

### Environment Variables Check:

Make sure these are set in Vercel dashboard:
- `DATABASE_URL` - Your PostgreSQL connection string
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `NODE_ENV=production`

## Admin Panel Access

Once routing is fixed, `/admin` should load, but you might need:
1. **Authentication**: Login through `/auth` first
2. **Admin Role**: Your user needs admin role in the database
3. **Environment Variables**: API functions need proper config

## Common Issues After Fix:

1. **Blank Page**: Check browser console for errors
2. **API Errors**: Verify environment variables
3. **Auth Issues**: Check Supabase configuration
4. **Database Errors**: Verify DATABASE_URL

The routing fix should resolve the 404 error immediately after deployment!
