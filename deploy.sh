#!/bin/bash

# Deployment script for Celestial Lights Website
echo "🚀 Building Celestial Lights Website for Production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Create uploads directory if it doesn't exist
echo "📁 Setting up uploads directory..."
mkdir -p public/uploads
chmod 755 public/uploads

echo "✅ Build complete! Ready for deployment to GoDaddy."
echo ""
echo "Next steps:"
echo "1. Upload the following files/folders to your GoDaddy hosting:"
echo "   - dist/ (built server files)"
echo "   - dist-client/ (built client files)"
echo "   - public/ (static assets and uploads)"
echo "   - node_modules/ (dependencies)"
echo "   - package.json"
echo "   - package-lock.json"
echo "   - .env (create with your environment variables)"
echo ""
echo "2. Configure Node.js app in GoDaddy cPanel"
echo "3. Set startup file to: dist/index.js"
echo "4. Add environment variables in cPanel"
echo ""
echo "📋 See DEPLOYMENT_GUIDE_GODADDY.md for detailed instructions"