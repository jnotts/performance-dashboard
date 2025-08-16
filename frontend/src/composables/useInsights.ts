import { useQuery } from '@tanstack/vue-query'
import { getInsights } from '../utils/api'
import type { FilterParams } from '../utils/types'
import type { ComputedRef } from 'vue'

export function useInsights(filtersRef?: ComputedRef<FilterParams>) {
  return useQuery({
    queryKey: ['insights', filtersRef],
    queryFn: () => getInsights(filtersRef?.value),
  })
}
