# ☕ Morning Coffee AI - AWS Bedrock Integration

A Next.js application that generates personalized coffee suggestions using AWS Bedrock's text generation models. The app takes a user's name as input and returns a comprehensive coffee recommendation including greeting, coffee type, reasoning, health facts, and confidence scores.

**🌏 Configured for AWS Sydney Region (ap-southeast-2)**

## Features

- **Personalized Coffee Suggestions**: AI-generated recommendations based on user input
- **AWS Bedrock Integration**: Uses Claude 3.5 Sonnet model for intelligent responses
- **Tool Call Support**: Implements structured tool calls for consistent output
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- **Real-time Generation**: Instant coffee suggestions with loading states
- **Error Handling**: Comprehensive error handling and user feedback

## Prerequisites

Before running this application, you need:

1. **AWS Account** with access to Amazon Bedrock in the **ap-southeast-2 (Sydney) region**
2. **Node.js** 18+ and npm/yarn
3. **AWS CLI** configured with appropriate credentials
4. **Bedrock Model Access** (Claude 3.5 Sonnet or similar) in Sydney region

## Setup Instructions

### 1. AWS Bedrock Setup

#### Enable Bedrock Access in Sydney Region
1. Go to the [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/) in the **ap-southeast-2 (Sydney) region**
2. Navigate to "Model access" in the left sidebar
3. Click "Manage model access"
4. Find "Claude 3.5 Sonnet" and click "Request access"
5. Wait for approval (usually takes a few minutes to hours)

#### Configure IAM Permissions
Create an IAM user or role with the following permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream"
            ],
            "Resource": [
                "arn:aws:bedrock:ap-southeast-2:*::foundation-model/anthropic.claude-3-5-sonnet-20241022-v1:0"
            ]
        }
    ]
}
```

#### Set Up AWS Credentials
Configure your AWS credentials using one of these methods:

**Option A: AWS CLI Configuration**
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and set region to ap-southeast-2
```

**Option B: Environment Variables**
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=ap-southeast-2
```

**Option C: AWS Credentials File**
Create `~/.aws/credentials`:
```ini
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```

Create `~/.aws/config`:
```ini
[default]
region = ap-southeast-2
```

### 2. Application Setup

#### Install Dependencies
```bash
cd ai/coffee
npm install
```

#### Environment Configuration
Create a `.env.local` file in the root directory:
```bash
# AWS Configuration
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Optional: Override default region for frontend
NEXT_PUBLIC_AWS_REGION=ap-southeast-2
```

#### Run the Application
```bash
# Development mode
npm run dev

# Build for production
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Enter Your Name**: Type your name in the input field
2. **Generate Suggestion**: Click "Get Coffee Suggestion"
3. **View Results**: See your personalized coffee recommendation including:
   - Morning greeting
   - Coffee type suggestion
   - Reasoning behind the choice
   - Related health fact
   - Confidence score

## Architecture

### Frontend Components
- **CoffeeForm**: Input form for user name
- **CoffeeResult**: Display component for AI-generated results
- **Main Page**: Orchestrates the user experience

### Backend API
- **`/api/coffee`**: Handles AWS Bedrock integration
- **Tool Call Implementation**: Structured output using Claude's tool calling feature
- **Error Handling**: Comprehensive error management

### AWS Integration
- **Bedrock Runtime Client**: Direct model invocation
- **Credential Management**: Secure AWS authentication
- **Model Selection**: Configurable model choice
- **Region Configuration**: Optimized for Sydney (ap-southeast-2)

## Customization

### Change the Model
To use a different Bedrock model, modify the `modelId` in `src/app/api/coffee/route.ts`:

```typescript
// Example: Use Claude 3 Haiku
modelId: 'anthropic.claude-3-haiku-20240307-v1:0'

// Example: Use Llama 2
modelId: 'meta.llama2-13b-chat-v1'
```

### Modify the Tool Call
Update the tool call structure in the API route to change the output format:

```typescript
const toolCall = {
  name: "your_custom_tool",
  description: "Your custom description",
  parameters: {
    // Your custom parameters
  }
}
```

### Update the Prompt
Modify the prompt in the API route to change the AI's behavior:

```typescript
const prompt = `Your custom prompt here for ${name}`
```

## Troubleshooting

### Common Issues

1. **"Access Denied" Error**
   - Ensure Bedrock model access is granted in the **ap-southeast-2 (Sydney) region**
   - Verify IAM permissions are correct
   - Check AWS credentials are properly configured

2. **"Model Not Found" Error**
   - Verify the model ID is correct
   - Ensure the model is available in the **ap-southeast-2 region**
   - Check if model access has been approved

3. **Credential Errors**
   - Verify AWS credentials are set correctly
   - Check if credentials have expired
   - Ensure the IAM user has the necessary permissions
   - Confirm you're using the correct region (ap-southeast-2)

### Debug Mode
Enable debug logging by setting the environment variable:
```bash
export DEBUG=aws-sdk:*
```

## Security Considerations

- **Never commit AWS credentials** to version control
- **Use IAM roles** instead of access keys when possible
- **Implement proper input validation** for production use
- **Consider rate limiting** for API endpoints
- **Monitor AWS usage** to control costs

## Cost Optimization

- **Model Selection**: Choose cost-effective models for your use case
- **Token Limits**: Set appropriate `max_tokens` values
- **Caching**: Implement response caching for repeated requests
- **Monitoring**: Use AWS CloudWatch to track usage and costs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues related to:
- **AWS Bedrock**: Check the [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- **Next.js**: Refer to the [Next.js Documentation](https://nextjs.org/docs)
- **Application**: Open an issue in the repository

## Region-Specific Notes

This application is specifically configured for the **AWS Sydney region (ap-southeast-2)**. If you need to use a different region:

1. Update `next.config.js` with your preferred region
2. Update `src/app/api/coffee/route.ts` with your preferred region
3. Ensure you have Bedrock access in your chosen region
4. Update IAM permissions to include your region
5. Update environment variables accordingly 