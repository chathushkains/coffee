#!/bin/bash

echo "☕ Setting up Morning Coffee AI Application"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cat > .env.local << EOF
# AWS Configuration
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Optional: Override default region for frontend
NEXT_PUBLIC_AWS_REGION=ap-southeast-2
EOF
    echo "📝 Please edit .env.local with your AWS credentials"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🚀 Setup complete! Next steps:"
echo "1. Edit .env.local with your AWS credentials"
echo "2. Ensure you have AWS Bedrock access configured in the ap-southeast-2 (Sydney) region"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "📚 See README.md for detailed setup instructions"
echo ""
echo "🌏 Note: This app is configured to use AWS Sydney region (ap-southeast-2)" 