# Vercel Deployment Troubleshooting Guide

## Common Deployment Failures and Solutions

### 1. Build Configuration Issues

**Problem:** Build fails because of incorrect paths or configuration.

**Solutions to try:**

#### Option A: Use the minimal vercel.json
Replace the current `vercel.json` with this minimal configuration:

```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  }
}
```

#### Option B: Use the comprehensive vercel.json
```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/((?!api).*)\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$",
      "destination": "/$1"
    },
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "client/dist"
}
```

#### Option C: Use Vercel with separate build setup
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm run build",
        "outputDirectory": "client/dist"
      }
    },
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### 2. Dependency Issues

**Problem:** Build fails due to missing or incorrect dependencies.

**Solution:** Make sure these dependencies are correctly placed:

```json
{
  "dependencies": {
    "@vercel/node": "^3.0.0",
    "formidable": "^3.5.1"
  },
  "devDependencies": {
    "@types/formidable": "^3.4.5"
  }
}
```

### 3. Environment Variables Not Set

**Problem:** API functions fail because environment variables are missing.

**Solution:** In Vercel dashboard, add these environment variables:

**Required:**
- `DATABASE_URL`
- `VITE_SUPABASE_URL`  
- `VITE_SUPABASE_ANON_KEY`
- `NODE_ENV=production`

**Optional (for email):**
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `ADMIN_EMAIL`

### 4. API Function Import Errors

**Problem:** API functions can't import shared modules.

**Solution:** Check that your API functions use correct relative imports:

```typescript
// In api/portfolio-projects/index.ts
import { storage } from '../_lib/storage';
import { insertPortfolioProjectSchema } from '../../shared/schema';
```

### 5. Build Directory Issues

**Problem:** Vercel can't find the built files.

**Solutions:**

#### Update vite.config.ts:
```typescript
export default defineConfig({
  // ... other config
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "client", "dist"),
    emptyOutDir: true,
  },
});
```

#### Or create a client-specific package.json:
Create `client/package.json`:
```json
{
  "name": "celestiallights-client",
  "private": true,
  "scripts": {
    "build": "vite build"
  }
}
```

### 6. Step-by-Step Debugging

1. **Check Vercel Build Logs:**
   - Go to your Vercel dashboard
   - Click on your project
   - Go to "Functions" or "Deployments"
   - Click on the failed deployment
   - Check the build logs for specific errors

2. **Test Build Locally:**
   ```bash
   npm run build
   ```
   Check if this creates `client/dist/index.html`

3. **Test API Functions Locally:**
   Install Vercel CLI and test:
   ```bash
   npm install -g vercel
   vercel dev
   ```

### 7. Alternative Deployment Approach

If all else fails, try this simpler approach:

1. **Rename current vercel.json to vercel.backup.json**
2. **Create a new minimal vercel.json:**
   ```json
   {
     "functions": {
       "api/**/*.ts": {
         "runtime": "@vercel/node"
       }
     }
   }
   ```
3. **Let Vercel auto-detect the frontend build**
4. **Add environment variables manually in Vercel dashboard**

### 8. If Nothing Works - Split Deployment

Deploy frontend and backend separately:

**Frontend:**
- Deploy the `client` folder as a separate Vercel project
- Set build command to `npm run build` in client directory

**Backend:**
- Deploy only the `api` folder as a separate Vercel project
- Update frontend to call the API domain

## Quick Fix Commands

```bash
# Try these in order:

# 1. Minimal config
cp vercel-simple.json vercel.json

# 2. Test build locally
npm run build

# 3. Check output directory
ls client/dist

# 4. Commit and push
git add .
git commit -m "Fix deployment config"
git push origin main
```

## Get Help

If you're still having issues, share:
1. The exact error message from Vercel build logs
2. Which vercel.json configuration you're using
3. Whether `npm run build` works locally
4. Your current environment variables in Vercel dashboard
