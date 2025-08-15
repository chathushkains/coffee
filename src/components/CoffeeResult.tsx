import { CoffeeResponse } from '@/types/coffee'

interface CoffeeResultProps {
  result: CoffeeResponse
}

export default function CoffeeResult({ result }: CoffeeResultProps) {
  // Debug logging to see what's being passed
  console.log('CoffeeResult received result:', result)
  console.log('Result type:', typeof result)
  console.log('Result keys:', Object.keys(result))
  
  const confidenceColor = result.confidence_score >= 0.8 
    ? 'text-emerald-600' 
    : result.confidence_score >= 0.6 
    ? 'text-amber-600' 
    : 'text-red-600'

  const confidenceBg = result.confidence_score >= 0.8 
    ? 'bg-emerald-50 border-emerald-200' 
    : result.confidence_score >= 0.6 
    ? 'bg-amber-50 border-amber-200' 
    : 'bg-red-50 border-red-200'

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-emerald-600 text-2xl">🎉</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Your Coffee Suggestion
        </h2>
        <p className="text-slate-600">
          Here's your personalized coffee experience
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Greeting Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">🌅</span>
            </div>
            <h3 className="font-semibold text-blue-900">Morning Greeting</h3>
          </div>
          <p className="text-blue-800 leading-relaxed">{result.greeting}</p>
        </div>
        
        {/* Coffee Recommendation Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-amber-600 text-sm">☕</span>
            </div>
            <h3 className="font-semibold text-amber-900">Recommended Coffee</h3>
          </div>
          <p className="text-amber-800 font-semibold text-lg">{result.suggestedCoffee}</p>
        </div>
        
        {/* Reasoning Card */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-sm">💭</span>
            </div>
            <h3 className="font-semibold text-purple-900">Why This Coffee?</h3>
          </div>
          <p className="text-purple-800 leading-relaxed">{result.reasoning}</p>
        </div>
        
        {/* Health Fact Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">💚</span>
            </div>
            <h3 className="font-semibold text-green-900">Health Fact</h3>
          </div>
          <p className="text-green-800 leading-relaxed">{result.healthFact}</p>
        </div>
        
        {/* Confidence Score Card */}
        <div className={`${confidenceBg} border rounded-2xl p-6`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              result.confidence_score >= 0.8 
                ? 'bg-emerald-100' 
                : result.confidence_score >= 0.6 
                ? 'bg-amber-100' 
                : 'bg-red-100'
            }`}>
              <span className={`text-sm ${
                result.confidence_score >= 0.8 
                  ? 'text-emerald-600' 
                  : result.confidence_score >= 0.6 
                  ? 'text-amber-600' 
                  : 'text-red-600'
              }`}>
                {result.confidence_score >= 0.8 ? '🎯' : result.confidence_score >= 0.6 ? '🤔' : '⚠️'}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900">Confidence Score</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">AI Confidence</span>
              <span className={`font-bold text-2xl ${confidenceColor}`}>
                {(result.confidence_score * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Low</span>
                <span>High</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                    result.confidence_score >= 0.8 
                      ? 'bg-emerald-500' 
                      : result.confidence_score >= 0.6 
                      ? 'bg-amber-500' 
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${result.confidence_score * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-center">
              <p className={`text-sm font-medium ${
                result.confidence_score >= 0.8 
                  ? 'text-emerald-700' 
                  : result.confidence_score >= 0.6 
                  ? 'text-amber-700' 
                  : 'text-red-700'
              }`}>
                {result.confidence_score >= 0.8 
                  ? 'Excellent recommendation!' 
                  : result.confidence_score >= 0.6 
                  ? 'Good suggestion' 
                  : 'Consider alternatives'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-2">
          <span className="text-slate-600 text-sm">✨</span>
          <span className="text-slate-700 text-sm font-medium">AI Generated</span>
        </div>
      </div>
    </div>
  )
} 