# Fix Blank Page Issue

## Problem
The Vercel deployment shows a blank white page instead of the React application.

## Common Causes & Solutions

### 1. Build Output Directory Mismatch

**Problem:** Vercel can't find the built files because the output directory is incorrect.

**Current Solution Applied:**
- Created `client/package.json` with proper build script
- Added `client/vite.config.ts` with correct output directory
- Fixed main `vite.config.ts` build paths

**Verify:** Check that `client/dist/index.html` exists after build.

### 2. JavaScript Import Errors

**Problem:** React app fails to load due to import path issues.

**Check browser console for errors:**
- Press F12 in browser
- Go to Console tab
- Look for red error messages
- Common errors: "Failed to fetch", "Module not found"

### 3. Environment Variables Missing

**Problem:** React app crashes on load due to missing environment variables.

**Required Variables in Vercel Dashboard:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `DATABASE_URL` (for API functions)
- `NODE_ENV=production`

### 4. Build Configuration Issues

**Try these configurations in order:**

#### Option 1: Current SPA Configuration (vercel-spa.json)
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

#### Option 2: Client-Specific Build (vercel-client-build.json)
```bash
cp vercel-client-build.json vercel.json
git add vercel.json
git commit -m "Try client-specific build"
git push origin main
```

#### Option 3: Debug Configuration (vercel-debug.json)
```bash
cp vercel-debug.json vercel.json
git add vercel.json
git commit -m "Try debug configuration"
git push origin main
```

### 5. Manual Debugging Steps

#### Step 1: Check Build Locally
```bash
# If Node.js was installed
npm run build
# Check if client/dist/index.html exists
ls client/dist
```

#### Step 2: Check Vercel Build Logs
1. Go to Vercel dashboard
2. Click your project
3. Go to "Deployments"
4. Click the latest deployment
5. Check "Build Logs" for errors

#### Step 3: Check Runtime Logs
1. In Vercel dashboard, go to "Functions"
2. Look for any API function errors
3. Check if environment variables are set

#### Step 4: Browser Network Tab
1. Open browser dev tools (F12)
2. Go to Network tab
3. Refresh page
4. Look for failed requests (red status codes)
5. Check if index.html loads correctly

### 6. Quick Fixes to Try

#### Fix 1: Simplify Vercel Config
```bash
# Use minimal configuration
echo '{}' > vercel.json
git add vercel.json
git commit -m "Minimal config"
git push origin main
```

#### Fix 2: Update Build Settings in Vercel Dashboard
1. Go to Project Settings
2. Build & Development Settings
3. Build Command: `npm run build`
4. Output Directory: `client/dist`
5. Install Command: `npm install`

#### Fix 3: Check Base URL
Make sure your app doesn't have hardcoded URLs that don't work on Vercel.

### 7. Environment Variables Debug

Add these to Vercel environment variables for debugging:
```
NODE_ENV=production
VITE_SUPABASE_URL=https://kzoywkomnniqdrvccolg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6b3l3a29tbm5pcWRydmNjb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDMwNjYsImV4cCI6MjA2OTQ3OTA2Nn0.1JwLgjrzqj0ZV-u0Aum8J1LHLVXl1MkvCRpDu3UWNQE
DATABASE_URL=postgresql://postgres.kzoywkomnniqdrvccolg:Shriyash3005@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 8. Last Resort - Split Deployment

If nothing works, deploy frontend and backend separately:

#### Frontend Only:
1. Create new Vercel project
2. Connect only the `client` folder
3. Set build command: `npm run build`
4. Set output directory: `dist`

#### Backend Only:
1. Create another Vercel project
2. Connect only the `api` folder
3. Update frontend to call the API domain

### 9. Common Error Messages & Solutions

| Error | Solution |
|-------|----------|
| "Failed to fetch" | Check API endpoint URLs |
| "Module not found" | Fix import paths in code |
| "Unexpected token '<'" | HTML served instead of JS (routing issue) |
| "Cannot read property of undefined" | Missing environment variables |
| Network timeout | Check Vercel function limits |

### 10. Success Checklist

After deployment, verify:
- ✅ `https://celestiallights.vercel.app/` loads
- ✅ No errors in browser console
- ✅ Network tab shows successful requests
- ✅ `/admin` route works (no 404)
- ✅ `/api/products` returns data

The current configuration should resolve the blank page issue. If not, try the alternative configurations provided above.
