#!/bin/bash

# Morning Coffee AI - Deployment Script
# This script deploys the Next.js application to various free cloud hosting platforms

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to build the application
build_app() {
    print_status "Building the application..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm install
    
    # Build the application
    print_status "Building Next.js application..."
    npm run build
    
    print_success "Application built successfully"
}

# Function to deploy to Vercel (Recommended - Free tier)
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command_exists vercel; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Check if already logged in
    if ! vercel whoami >/dev/null 2>&1; then
        print_warning "Please log in to Vercel when prompted..."
        vercel login
    fi
    
    # Deploy
    print_status "Deploying application..."
    vercel --prod
    
    print_success "Deployment to Vercel completed!"
    print_status "Your app will be available at the URL shown above"
}

# Function to deploy to Netlify (Alternative free option)
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command_exists netlify; then
        print_status "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    # Check if already logged in
    if ! netlify status >/dev/null 2>&1; then
        print_warning "Please log in to Netlify when prompted..."
        netlify login
    fi
    
    # Create netlify.toml configuration
    cat > netlify.toml << EOF
[build]
  command = "npm run build"
  publish = ".next"
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
EOF
    
    # Deploy
    print_status "Deploying application..."
    netlify deploy --prod
    
    print_success "Deployment to Netlify completed!"
}

# Function to deploy to Railway (Alternative free option)
deploy_railway() {
    print_status "Deploying to Railway..."
    
    if ! command_exists railway; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Check if already logged in
    if ! railway whoami >/dev/null 2>&1; then
        print_warning "Please log in to Railway when prompted..."
        railway login
    fi
    
    # Create railway.json configuration
    cat > railway.json << EOF
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE"
  }
}
EOF
    
    # Deploy
    print_status "Deploying application..."
    railway up
    
    print_success "Deployment to Railway completed!"
}

# Function to create environment file template
create_env_template() {
    print_status "Creating environment file template..."
    
    cat > .env.local.template << EOF
# AWS Configuration
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Optional: AWS Session Token (if using temporary credentials)
# AWS_SESSION_TOKEN=your_session_token_here

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=Morning Coffee AI
NEXT_PUBLIC_APP_VERSION=0.1.0
EOF
    
    print_success "Environment template created: .env.local.template"
    print_warning "Please copy this file to .env.local and fill in your AWS credentials"
}

# Function to create deployment configuration files
create_deployment_configs() {
    print_status "Creating deployment configuration files..."
    
    # Create vercel.json
    cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "AWS_REGION": "@aws-region"
  }
}
EOF
    
    # Create .vercelignore
    cat > .vercelignore << EOF
.env.local
.env.production.local
.env.development.local
.env.test.local
node_modules
.next
.git
README.md
deploy.sh
EOF
    
    print_success "Deployment configuration files created"
}

# Function to show deployment options
show_menu() {
    echo
    echo "=========================================="
    echo "    Morning Coffee AI - Deployment"
    echo "=========================================="
    echo
    echo "Choose your deployment platform:"
    echo "1) Vercel (Recommended - Free tier, Next.js optimized)"
    echo "2) Netlify (Free tier, good for static sites)"
    echo "3) Railway (Free tier, good for full-stack apps)"
    echo "4) Create deployment configs only"
    echo "5) Exit"
    echo
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            deploy_netlify
            ;;
        3)
            deploy_railway
            ;;
        4)
            create_deployment_configs
            create_env_template
            ;;
        5)
            print_status "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            show_menu
            ;;
    esac
}

# Function to show post-deployment instructions
show_post_deployment_instructions() {
    echo
    echo "=========================================="
    echo "    Post-Deployment Instructions"
    echo "=========================================="
    echo
    echo "1. Set up your AWS credentials:"
    echo "   - Copy .env.local.template to .env.local"
    echo "   - Fill in your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
    echo "   - Ensure your AWS account has access to Bedrock in ap-southeast-2 region"
    echo
    echo "2. Configure environment variables in your hosting platform:"
    echo "   - AWS_REGION=ap-southeast-2"
    echo "   - AWS_ACCESS_KEY_ID=your_key"
    echo "   - AWS_SECRET_ACCESS_KEY=your_secret"
    echo
    echo "3. Test your application:"
    echo "   - Visit your deployed URL"
    echo "   - Try submitting a name to test the coffee API"
    echo
    echo "4. Monitor your application:"
    echo "   - Check the hosting platform's dashboard for logs"
    echo "   - Monitor AWS CloudWatch for Bedrock API usage"
    echo
}

# Main execution
main() {
    echo "=========================================="
    echo "    Morning Coffee AI - Deployment"
    echo "=========================================="
    echo
    
    # Check prerequisites
    check_prerequisites
    
    # Build the application
    build_app
    
    # Create deployment configs
    create_deployment_configs
    create_env_template
    
    # Show deployment menu
    show_menu
    
    # Show post-deployment instructions
    show_post_deployment_instructions
    
    print_success "Deployment process completed!"
}

# Run main function
main "$@" 