import { NextRequest, NextResponse } from 'next/server'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { fromEnv } from '@aws-sdk/credential-providers'

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Initialize Bedrock client with Sydney region
    const client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'ap-southeast-2',
      credentials: fromEnv(),
    })

    // Tool call configuration for coffee suggestion
    const toolCall = {
      name: "morning_coffee_greeting",
      description: "Send a personalized morning greeting with a coffee suggestion and related health fact.",
      input_schema: {
        type: "object",
        required: [
          "name",
          "greeting",
          "suggestedCoffee",
          "reasoning",
          "healthFact",
          "confidence_score"
        ],
        properties: {
          name: {
            type: "string",
            description: "Name of the person to greet."
          },
          greeting: {
            type: "string",
            description: "Personalized morning greeting message."
          },
          suggestedCoffee: {
            type: "string",
            description: "The type of coffee suggested."
          },
          reasoning: {
            type: "string",
            description: "Reasoning behind the coffee suggestion."
          },
          healthFact: {
            type: "string",
            description: "A health fact related to the suggested coffee."
          },
          confidence_score: {
            type: "number",
            description: "Confidence score of the suggested pairing, between 0 and 1."
          }
        }
      }
    }

    // Prepare the prompt for the model
    const prompt = `You are a coffee expert and morning person. Generate a personalized morning greeting and coffee suggestion for ${name}.

Please use the tool call to provide:
1. A warm, personalized morning greeting
2. A specific coffee type recommendation (e.g., "Ethiopian Yirgacheffe pour-over", "Dark roast espresso", "Light roast cold brew")
3. Clear reasoning for why this coffee is perfect for them
4. An interesting health fact related to coffee or the suggested type
5. A confidence score between 0 and 1 for your recommendation

Make it personal, warm, and informative.`

    const modelId = 'anthropic.claude-3-haiku-20240307-v1:0'
    
    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        tools: [toolCall],
        tool_choice: {
          type: 'tool',
          name: 'morning_coffee_greeting'
        }
      }),
    })

    const response = await client.send(command)
    
    if (!response.body) {
      throw new Error('No response body from Bedrock')
    }

    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    console.log('Full response body:', JSON.stringify(responseBody, null, 2))
    
    // Extract the tool call result - try different response formats
    let toolCallResult = null
    
    // Try different possible response structures
    if (responseBody.content?.[0]?.input) {
      toolCallResult = responseBody.content[0].input
    } else if (responseBody.content?.[0]?.tool_use?.input) {
      toolCallResult = responseBody.content[0].tool_use.input
    } else if (responseBody.content?.[0]?.tool_use?.content) {
      toolCallResult = responseBody.content[0].tool_use.content
    } else if (responseBody.choices?.[0]?.message?.tool_calls?.[0]?.function_call?.arguments) {
      toolCallResult = responseBody.choices[0].message.tool_calls[0].function_call.arguments
    } else if (responseBody.content?.[0]?.text) {
      // If no tool call, try to extract from text content
      toolCallResult = responseBody.content[0].text
    }
    
    if (!toolCallResult) {
      console.error('Response structure:', responseBody)
      throw new Error('No tool call result in response. Response structure may be different than expected.')
    }

    let coffeeData: CoffeeResponse
    
    // toolCallResult is already the parsed object, no need to parse again
    if (toolCallResult && typeof toolCallResult === 'object' && toolCallResult !== null) {
      // Validate that all required properties exist and are of correct types
      coffeeData = {
        name: typeof toolCallResult.name === 'string' ? toolCallResult.name : name,
        greeting: typeof toolCallResult.greeting === 'string' ? toolCallResult.greeting : 'Good morning!',
        suggestedCoffee: typeof toolCallResult.suggestedCoffee === 'string' ? toolCallResult.suggestedCoffee : 'Classic coffee',
        reasoning: typeof toolCallResult.reasoning === 'string' ? toolCallResult.reasoning : 'A great choice for any morning',
        healthFact: typeof toolCallResult.healthFact === 'string' ? toolCallResult.healthFact : 'Coffee is generally good for you in moderation',
        confidence_score: typeof toolCallResult.confidence_score === 'number' ? toolCallResult.confidence_score : 0.8
      }
    } else {
      // Fallback if toolCallResult is not in expected format
      coffeeData = {
        name: name,
        greeting: "Good morning!",
        suggestedCoffee: "Classic coffee",
        reasoning: "A great choice for any morning",
        healthFact: "Coffee is generally good for you in moderation",
        confidence_score: 0.8
      }
    }
    
    return NextResponse.json(coffeeData)
  } catch (error: any) {
    console.error('Error calling Bedrock:', error)
    
    // Handle specific AWS errors
    if (error.name === 'AccessDeniedException') {
      return NextResponse.json(
        { 
          error: 'Access denied to AWS Bedrock. Please check your credentials and model access.',
          details: 'Make sure you have access to Claude 3.5 Sonnet in your AWS Bedrock console in the ap-southeast-2 (Sydney) region.'
        },
        { status: 403 }
      )
    }
    
    if (error.name === 'ValidationException') {
      return NextResponse.json(
        { 
          error: 'Invalid request to AWS Bedrock. Please check the model ID and parameters.',
          details: error.message
        },
        { status: 400 }
      )
    }
    
    if (error.name === 'ThrottlingException') {
      return NextResponse.json(
        { 
          error: 'AWS Bedrock is currently throttling requests. Please try again later.',
          details: error.message
        },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate coffee suggestion',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
} 