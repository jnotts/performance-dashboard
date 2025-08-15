import type { ApiResponse } from '../types/types'

// API configuration
const API_BASE_URL = 'http://localhost:3001'

// Generic fetch with error handling
async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// API functions
export async function getInsights(): Promise<ApiResponse> {
  return fetchWithErrorHandling<ApiResponse>('/api/insights')
}

// Future: Add more endpoints as needed
// export async function getInsightsByDepartment(department: string): Promise<ApiResponse> {
//   return fetchWithErrorHandling<ApiResponse>(`/api/insights?department=${department}`)
// }