import type { ApiResponse, FilterParams } from '../utils/types'

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

// Helper function to build query string from filter params
function buildQueryString(filters?: FilterParams): string {
  if (!filters) return ''
  
  const params = new URLSearchParams()
  
  if (filters.department) {
    params.append('department', filters.department)
  }
  
  if (filters.startDate) {
    params.append('startDate', filters.startDate)
  }
  
  if (filters.endDate) {
    params.append('endDate', filters.endDate)
  }
  
  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

// API functions
export async function getInsights(filters?: FilterParams): Promise<ApiResponse> {
  const queryString = buildQueryString(filters)
  return fetchWithErrorHandling<ApiResponse>(`/api/insights${queryString}`)
}