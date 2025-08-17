import { useQuery } from '@tanstack/vue-query'
import { getAiInsights } from '../utils/api'
import { computed, type Ref } from 'vue'
import type { InsightsResponse } from '@/utils/types'

export function useAiInsights(insightsData: Ref<InsightsResponse | undefined>) {
  return useQuery({
    queryKey: ['ai-insights', insightsData],
    queryFn: async () => {
      console.log('Fetching AI insights...')

      if (!insightsData.value?.insights) {
        throw new Error('No insights data available')
      }
      const { insights, appliedFilters } = insightsData.value || {}

      const res = await getAiInsights({ insights, appliedFilters })
      return res?.insights || []
    },
    enabled: computed(() => !!insightsData.value),
    staleTime: 1000 * 60 * 20, // 20 minutes
    refetchOnWindowFocus: false,
    retry: 3,
  })
}
