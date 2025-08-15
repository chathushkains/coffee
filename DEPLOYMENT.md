# Deployment Guide - Morning Coffee AI

This guide will help you deploy the Morning Coffee AI application to various free cloud hosting platforms.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- AWS account with Bedrock access in ap-southeast-2 region
- AWS credentials (Access Key ID and Secret Access Key)

## Quick Deploy to Vercel (Recommended)

### Option 1: Using the deployment script

1. Make the script executable and run it:
```bash
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

2. Follow the prompts to log in to Vercel

3. Set up environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add the following:
     - `AWS_REGION` = `ap-southeast-2`
     - `AWS_ACCESS_KEY_ID` = `your_access_key`
     - `AWS_SECRET_ACCESS_KEY` = `your_secret_key`

### Option 2: Manual deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Build and deploy:
```bash
npm install
npm run build
vercel --prod
```

## Alternative Free Hosting Options

### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod
```

3. Set environment variables in Netlify dashboard

### Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Deploy:
```bash
railway login
railway up
```

3. Set environment variables in Railway dashboard

## Environment Variables

Create a `.env.local` file with:

```env
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

## AWS Setup

1. Ensure you have access to AWS Bedrock in the ap-southeast-2 region
2. Create an IAM user with Bedrock permissions
3. Generate Access Key ID and Secret Access Key
4. Attach the following policy to your IAM user:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel"
            ],
            "Resource": "arn:aws:bedrock:ap-southeast-2::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
        }
    ]
}
```

## Troubleshooting

### Common Issues

1. **Build errors**: Ensure Node.js 18+ is installed
2. **AWS access denied**: Check your credentials and Bedrock permissions
3. **Environment variables not working**: Verify they're set in your hosting platform's dashboard
4. **API errors**: Check AWS CloudWatch logs for Bedrock API calls

### Getting Help

- Check the browser console for client-side errors
- Check your hosting platform's logs
- Verify AWS credentials are correct
- Ensure Bedrock access is enabled in ap-southeast-2 region

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Netlify**: Free tier includes 100GB bandwidth/month  
- **Railway**: Free tier includes $5 credit/month
- **AWS Bedrock**: Pay-per-use pricing for API calls

## Security Notes

- Never commit `.env.local` files to version control
- Use environment variables for sensitive information
- Consider using AWS IAM roles instead of access keys in production
- Regularly rotate your AWS credentials

## GitHub Actions Deployment

If you want automatic deployment on code pushes:

1. Add these secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `ORG_ID`: Your Vercel organization ID
   - `PROJECT_ID`: Your Vercel project ID
   - `AWS_REGION`: ap-southeast-2

2. Push to main/master branch to trigger automatic deployment

## Support

For deployment issues:
- Check the hosting platform's documentation
- Review AWS CloudWatch logs
- Ensure all environment variables are properly set
- Verify your AWS Bedrock access permissions 