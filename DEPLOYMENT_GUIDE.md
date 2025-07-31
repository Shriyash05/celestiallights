# Deployment Guide for GoDaddy Hosting

## Prerequisites

1. **GoDaddy Hosting Account**: Ensure you have a GoDaddy hosting plan that supports Node.js
2. **Domain**: Your domain should be configured with GoDaddy
3. **Database**: Set up your Neon PostgreSQL database (free tier available)

## Environment Setup

### 1. Database Configuration
- Create a free Neon PostgreSQL database at [neon.tech](https://neon.tech)
- Copy your connection string
- Update your `.env` file with the database URL

### 2. Environment Variables
Create a `.env` file in your project root with:
```env
# Database
DATABASE_URL="your-neon-connection-string"

# Server Configuration
NODE_ENV="production"
PORT=5000

# Authentication
JWT_SECRET="your-secure-jwt-secret"
SESSION_SECRET="your-secure-session-secret"

# File Upload Configuration
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="52428800"

# Application Settings
APP_NAME="Celestial Lights Portfolio"
APP_URL="https://yourdomain.com"

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Build Process

### 1. Local Build
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test locally
npm start
```

### 2. Production Build
The build process creates:
- `dist/` - Server files
- `dist/public/` - Client files

## GoDaddy Deployment Steps

### 1. Upload Files
1. Connect to your GoDaddy hosting via FTP/SFTP
2. Upload the entire project folder to your hosting directory
3. Ensure all files are uploaded, including:
   - `dist/` folder
   - `package.json`
   - `.env` file
   - `public/uploads/` folder

### 2. Server Configuration
1. **Node.js Setup**: Ensure Node.js is enabled in your GoDaddy hosting control panel
2. **Port Configuration**: GoDaddy typically uses port 80/443, update your server configuration if needed
3. **Process Manager**: Consider using PM2 for process management

### 3. Database Setup
1. Run database migrations on your server:
   ```bash
   npm run db:push
   ```
2. Seed the database with sample data:
   ```bash
   npx tsx scripts/seed-data.ts
   ```

### 4. Domain Configuration
1. Point your domain to the hosting directory
2. Configure SSL certificate (recommended)
3. Set up any necessary redirects

## File Structure for Deployment

```
your-hosting-directory/
├── dist/                    # Built server files
├── public/                  # Static files
│   └── uploads/            # Uploaded files
├── package.json
├── package-lock.json
├── .env                     # Environment variables
└── node_modules/           # Dependencies
```

## Troubleshooting

### Common Issues
1. **Port Issues**: GoDaddy may require specific port configurations
2. **Environment Variables**: Ensure `.env` file is properly uploaded
3. **Database Connection**: Verify DATABASE_URL is correct
4. **File Permissions**: Ensure uploads directory has write permissions

### Logs
Check your hosting provider's error logs for debugging information.

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **SSL**: Always use HTTPS in production
3. **File Uploads**: Implement proper file validation
4. **Authentication**: Use strong secrets for JWT and sessions

## Performance Optimization

1. **Static Files**: Serve static files efficiently
2. **Database**: Optimize database queries
3. **Caching**: Implement appropriate caching strategies
4. **CDN**: Consider using a CDN for static assets

## Support

For GoDaddy-specific hosting issues, contact GoDaddy support. For application-specific issues, check the application logs and database connectivity. 