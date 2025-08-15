'use client'

import { useState } from 'react'
import CoffeeForm from '@/components/CoffeeForm'
import CoffeeResult from '@/components/CoffeeResult'
import ErrorBoundary from '@/components/ErrorBoundary'
import { CoffeeResponse } from '@/types/coffee'

export default function Home() {
  const [result, setResult] = useState<CoffeeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  const handleCoffeeRequest = async (name: string) => {
    setLoading(true)
    setError(null)
    setErrorDetails(null)
    
    try {
      const response = await fetch('/api/coffee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()
      console.log('Raw API response:', response)
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      console.log('API Response data:', data)

      if (!response.ok) {
        console.error('API returned error status:', response.status)
        console.error('Error data:', data)
        throw new Error(data.error || 'Failed to generate coffee suggestion')
      }
      
      // Ensure all required properties exist and are of correct types
      if (data && typeof data === 'object') {
        const validatedData = {
          name: typeof data.name === 'string' ? data.name : 'Unknown',
          greeting: typeof data.greeting === 'string' ? data.greeting : 'Good morning!',
          suggestedCoffee: typeof data.suggestedCoffee === 'string' ? data.suggestedCoffee : 'Classic coffee',
          reasoning: typeof data.reasoning === 'string' ? data.reasoning : 'A great choice for any morning',
          healthFact: typeof data.healthFact === 'string' ? data.healthFact : 'Coffee is generally good for you in moderation',
          confidence_score: typeof data.confidence_score === 'number' ? data.confidence_score : 0.8
        }
        console.log('Validated data:', validatedData)
        console.log('Setting result state with:', validatedData)
        setResult(validatedData)
        console.log('Result state should now be set')
      } else {
        throw new Error('Invalid data structure received from API')
      }
    } catch (err) {
      console.error('Caught error in handleCoffeeRequest:', err)
      console.error('Error type:', typeof err)
      console.error('Error constructor:', err?.constructor?.name)
      
      if (err instanceof Error) {
        console.error('Error message:', err.message)
        console.error('Error stack:', err.stack)
        setError(err.message)
        // Try to extract additional error details if available
        try {
          const errorData = JSON.parse(err.message)
          if (errorData.details) {
            setErrorDetails(errorData.details)
          }
        } catch {
          // If parsing fails, it's a regular error message
        }
      } else {
        console.error('Non-Error object:', err)
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  // Debug current state values
  console.log('Current state values - loading:', loading, 'error:', error, 'result:', result)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-white border-b border-slate-200/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">☕</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Morning Coffee AI</h1>
                  <p className="text-sm text-slate-600">by Insighture</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
             
              {/* AWS Bedrock Logo */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">Powered by</p>
                  <p className="text-lg font-bold text-orange-600">AWS Bedrock</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Your Perfect
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent"> Coffee</span>
              <br />
              Awaits
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Experience personalized coffee recommendations powered by cutting-edge AI. 
              Get your morning ritual curated just for you.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 backdrop-blur-sm">
            <CoffeeForm onSubmit={handleCoffeeRequest} loading={loading} />
          </div>
          
          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 backdrop-blur-sm min-h-[600px]">
            {/* Debug rendering conditions */}
            <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
              <strong>Debug Info:</strong> loading={String(loading)}, error={String(error)}, result={result ? 'exists' : 'null'}
            </div>
            
            {loading && (
              <div className="text-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-6"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-amber-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }}></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Brewing Your Perfect Coffee</h3>
                <p className="text-slate-600">Our AI is crafting a personalized recommendation just for you...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm">⚠️</span>
                  </div>
                  <h3 className="font-semibold text-red-900">Something went wrong</h3>
                </div>
                <p className="text-red-700 mb-3">Error: {error}</p>
                {errorDetails && (
                  <div className="bg-red-100 rounded-lg p-3">
                    <p className="text-red-800 text-sm font-medium">Details:</p>
                    <p className="text-red-700 text-sm">{errorDetails}</p>
                  </div>
                )}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Need help?</strong> Check your AWS credentials and ensure you have access to Claude 3.5 Sonnet in AWS Bedrock.
                  </p>
                </div>
              </div>
            )}
            
            {result && (
              <ErrorBoundary>
                {/* Add safety check to ensure result is properly structured */}
                {result && typeof result === 'object' && 'greeting' in result ? (
                  <CoffeeResult result={result} />
                ) : (
                  <div className="text-center py-16 text-red-500">
                    <h3 className="text-lg font-semibold mb-2">Invalid Data Structure</h3>
                    <p>Received unexpected data format from API</p>
                    <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                )}
              </ErrorBoundary>
            )}
            
            {!loading && !error && !result && (
              <div className="text-center py-16 text-slate-500">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">☕</span>
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">Ready for Your Coffee?</h3>
                <p className="text-slate-500">Enter your name to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Morning Coffee AI?</h3>
            <p className="text-lg text-slate-600">Experience the future of personalized coffee recommendations</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 text-xl">🤖</span>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">AI-Powered</h4>
              <p className="text-slate-600">Advanced machine learning algorithms understand your preferences</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 text-xl">⚡</span>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Real-time</h4>
              <p className="text-slate-600">Instant recommendations powered by AWS Bedrock</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 text-xl">🎯</span>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Personalized</h4>
              <p className="text-slate-600">Every suggestion is tailored specifically for you</p>
            </div>
          </div>
        </div>

        {/* Insighture Branding Section */}
        <div className="mt-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">I</span>
              </div>
              <h3 className="text-4xl font-bold text-slate-900">Insighture</h3>
            </div>
            
            <p className="text-xl text-slate-700 mb-6 max-w-3xl mx-auto">
              We are innovators at heart. Our team thrives on transforming complex challenges into seamless solutions. 
              With a passion for pushing boundaries, we are dedicated to building effective and happy development teams.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">☁️</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Cloud & DevOps</h4>
                <p className="text-slate-600">Seamless cloud migration and modern infrastructure</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">🤖</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">AI & ML</h4>
                <p className="text-slate-600">Cutting-edge AI solutions and machine learning</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">⚡</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Quality Engineering</h4>
                <p className="text-slate-600">Performance testing and automation excellence</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-orange-500 text-lg">☁️</span>
                <span className="text-slate-700 font-medium">AWS Bedrock</span>
              </div>
              <div className="text-slate-400">•</div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500 text-lg">⚡</span>
                <span className="text-slate-700 font-medium">Next.js</span>
              </div>
              <div className="text-slate-400">•</div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500 text-lg">🤖</span>
                <span className="text-slate-700 font-medium">AI-Powered</span>
              </div>
            </div>
            
            <a 
              href="https://www.insighture.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Learn More About Insighture</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">I</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Insighture</h3>
              </div>
              <p className="text-slate-300 mb-2">Product engineering at scale</p>
              <p className="text-slate-400 text-sm">Cloud. DevOps. AI.</p>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-orange-400">☁️</span>
                <span className="text-slate-300">AWS Bedrock</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">⚡</span>
                <span className="text-slate-300">Next.js</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">🤖</span>
                <span className="text-slate-300">AI-Powered</span>
              </div>
            </div>
            
            <div className="border-t border-slate-700 pt-6">
              <p className="text-slate-400 mb-2">Built with ❤️ by Insighture</p>
              <p className="text-slate-500 text-sm">
                <a 
                  href="https://www.insighture.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Visit Insighture.com
                </a>
                {' • '}
                <a 
                  href="https://www.insighture.com/services" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Our Services
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 