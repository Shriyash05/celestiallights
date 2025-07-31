# GoDaddy Deployment Guide for Celestial Lights Website

## Prerequisites

1. **GoDaddy Hosting Account** with Node.js support
2. **Domain Name** registered with GoDaddy
3. **Supabase Account** (already set up)
4. **FTP/SFTP Access** to your GoDaddy hosting

## Environment Setup

### 1. Environment Variables (.env)
Create a `.env` file on your server with:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres.kzoywkomnniqdrvccolg:Shriyash3005@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Supabase Configuration
VITE_SUPABASE_URL=https://kzoywkomnniqdrvccolg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6b3l3a29tbm5pcWRydmNjb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDMwNjYsImV4cCI6MjA2OTQ3OTA2Nn0.1JwLgjrzqj0ZV-u0Aum8J1LHLVXl1MkvCRpDu3UWNQE

# Application Configuration
NODE_ENV=production
PORT=3000

# Session Configuration
SESSION_SECRET=your_secure_session_secret_key_here_change_this

# Email Configuration (Optional - for contact forms)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Deployment Steps

### 1. Build the Application

```bash
# Install dependencies
npm install

# Build the production version
npm run build
```

### 2. Upload Files to GoDaddy

Upload these files/folders to your GoDaddy hosting root directory:

```
Root Directory/
├── dist/                   # Built server files
├── dist-client/           # Built client files  
├── public/                # Static assets and uploads
├── node_modules/          # Dependencies
├── package.json
├── package-lock.json
├── .env                   # Environment variables
└── uploads/               # Create this folder for file uploads
```

### 3. GoDaddy Configuration

#### A. Node.js Setup
1. Log into your GoDaddy cPanel
2. Go to **Software** → **Setup Node.js App**
3. Create new application:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/` (your domain root)
   - **Application URL**: Your domain name
   - **Application startup file**: `dist/index.js`

#### B. Environment Variables
In the Node.js app settings, add all environment variables from your `.env` file.

#### C. File Permissions
Set proper permissions for uploads folder:
```bash
chmod 755 public/uploads
```

### 4. Database Setup

Your Supabase database is already configured. Ensure:
1. **Real-time** is enabled for `portfolio_projects` and `products` tables
2. **Row Level Security (RLS)** is configured properly
3. **API keys** are valid and have proper permissions

### 5. Start the Application

In GoDaddy cPanel:
1. Go to your Node.js app
2. Click **Restart** to start the application
3. Your website should be available at your domain

## Custom Domain Configuration

### 1. DNS Setup
If using a custom domain:
1. Point your domain's A record to GoDaddy's server IP
2. Update any CNAME records as needed

### 2. SSL Certificate
Enable SSL in GoDaddy cPanel:
1. Go to **Security** → **SSL/TLS**
2. Enable **Let's Encrypt** SSL certificate

## Monitoring and Maintenance

### 1. Log Files
Check application logs in GoDaddy cPanel under Node.js App section.

### 2. File Uploads
Monitor the `public/uploads` folder size to ensure you don't exceed hosting limits.

### 3. Database Monitoring
Monitor your Supabase usage in the Supabase dashboard.

## Troubleshooting

### Common Issues:

1. **App won't start**
   - Check Node.js version compatibility
   - Verify all environment variables are set
   - Check file permissions

2. **Database connection issues**
   - Verify DATABASE_URL is correct
   - Check Supabase connection limits

3. **File upload issues**
   - Verify uploads folder exists and has proper permissions
   - Check disk space limits

4. **Real-time updates not working**
   - Verify Supabase real-time is enabled
   - Check WebSocket connections

## Performance Optimization

1. **Enable Gzip compression** in cPanel
2. **Configure caching** for static assets
3. **Monitor resource usage** in hosting dashboard
4. **Optimize images** before uploading

## Support

For hosting-specific issues, contact GoDaddy support.
For application issues, check the error logs and verify configuration.