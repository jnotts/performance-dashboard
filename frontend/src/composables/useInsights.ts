import { useQuery } from '@tanstack/vue-query'
import { getInsights } from '../services/api'

export function useInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: getInsights,
  })
}
