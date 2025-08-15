'use client'

import { useState } from 'react'

interface CoffeeFormProps {
  onSubmit: (name: string) => void
  loading: boolean
}

export default function CoffeeForm({ onSubmit, loading }: CoffeeFormProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-amber-600 text-2xl">☕</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Get Your Coffee Suggestion
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Tell us your name and we'll craft the perfect coffee experience just for you
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-3">
            Your Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all duration-200 text-slate-900 placeholder-slate-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
              required
              disabled={loading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-slate-400">👋</span>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </div>
          ) : (
            'Get Coffee Suggestion'
          )}
        </button>
      </form>
      
      <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
          <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-amber-600 text-sm">✨</span>
          </span>
          What you'll get
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm text-slate-700">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span>Personalized morning greeting</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-slate-700">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span>Coffee type recommendation</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-slate-700">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span>Reasoning behind the suggestion</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-slate-700">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span>Related health fact</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-slate-700">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span>Confidence score</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          Powered by AWS Bedrock • Claude 3.5 Sonnet
        </p>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <span className="text-blue-600 text-sm">ℹ️</span>
          <div className="text-left">
            <p className="text-blue-800 text-sm font-medium mb-1">AWS Setup Required</p>
            <p className="text-blue-700 text-xs leading-relaxed">
              Make sure you have AWS credentials configured and access to Claude 3.5 Sonnet in your AWS Bedrock console.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 