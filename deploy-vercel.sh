#!/bin/bash

# Quick Vercel deployment script for Morning Coffee AI

set -e

echo "🚀 Deploying Morning Coffee AI to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "🌐 Your app is now live at the URL shown above"
echo ""
echo "📝 Next steps:"
echo "1. Set up environment variables in Vercel dashboard:"
echo "   - AWS_REGION=ap-southeast-2"
echo "   - AWS_ACCESS_KEY_ID=your_key"
echo "   - AWS_SECRET_ACCESS_KEY=your_secret"
echo "2. Ensure your AWS account has Bedrock access in ap-southeast-2 region"
echo "3. Test your coffee API!" 