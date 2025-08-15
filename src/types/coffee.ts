export interface CoffeeResponse {
  name: string
  greeting: string
  suggestedCoffee: string
  reasoning: string
  healthFact: string
  confidence_score: number
}

export interface CoffeeRequest {
  name: string
} 