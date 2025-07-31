# Quick Deployment Steps for GoDaddy

## 1. Prepare Your Local Files

```bash
# Run the deployment script
./deploy.sh
```

## 2. Upload to GoDaddy

Upload these files to your GoDaddy hosting root:

**Required Files:**
- `dist/` - Server files
- `dist-client/` - Client files  
- `public/` - Static assets
- `node_modules/` - Dependencies
- `package.json`
- `package-lock.json`
- `.env` (create from .env.example)
- `.htaccess`

## 3. GoDaddy cPanel Setup

1. **Create Node.js App:**
   - Node.js Version: 18.x+
   - Application Root: `/`
   - Startup File: `dist/index.js`
   - Application Mode: Production

2. **Environment Variables:**
   Add these in the Node.js app settings:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=your_supabase_url
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   SESSION_SECRET=secure_random_string
   ```

3. **File Permissions:**
   ```bash
   chmod 755 public/uploads
   ```

4. **Start Application:**
   Click "Restart" in the Node.js app section

## 4. Domain & SSL

1. Point domain to GoDaddy servers
2. Enable SSL certificate in cPanel
3. Test your website at your domain

## 5. Verify Deployment

- ✅ Website loads at your domain
- ✅ Admin panel accessible 
- ✅ File uploads work
- ✅ Database connections active
- ✅ Real-time updates functioning

## Troubleshooting

**App won't start?**
- Check Node.js version (18.x+)
- Verify environment variables
- Check startup file path

**Database issues?**
- Verify Supabase URL and keys
- Check connection limits

**File upload problems?**
- Verify uploads folder permissions
- Check disk space limits

Need help? Check the full guide: `DEPLOYMENT_GUIDE_GODADDY.md`