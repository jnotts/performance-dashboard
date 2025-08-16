<template>
  <div v-if="isLoading" class="loading-state">
    <div>Loading dashboard...</div>
  </div>

  <div v-else-if="error" class="error-state">
    <div>Error loading data: {{ error.message }}</div>
  </div>

  <div v-else class="dashboard-layout">
    <!-- Simple inline filters -->
    <div class="filters">
      <select v-model="selectedDepartment" class="filter-select">
        <option value="">All Departments</option>
        <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
      </select>

      <input v-model="startDate" type="date" class="filter-input" placeholder="Start date" />

      <input v-model="endDate" type="date" class="filter-input" placeholder="End date" />

      <button v-if="hasFilters" @click="clearFilters" class="clear-btn">
        Clear Filters
      </button>
    </div>

    <div class="stats-grid">
      <StatsCard title="Total Sessions" :value="totalSessions" />
      <StatsCard title="Pass Rate" :value="passRate" />
      <StatsCard title="Avg Score" :value="avgScore" />
      <StatsCard title="Departments" :value="departmentCount" />
    </div>

    <div class="charts-grid">
      <ChartContainer title="Performance Trends">
        <PerformanceTrendChart :data="data" />
      </ChartContainer>

      <ChartContainer title="Skills Comparison">
        <SkillsRadarChart :data="data" />
      </ChartContainer>

      <ChartContainer title="Performance vs Time Correlation">
        <PerformanceScatterChart :data="data" />
      </ChartContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import StatsCard from './StatsCard.vue'
import ChartContainer from './ChartContainer.vue'
import PerformanceTrendChart from './PerformanceTrendChart.vue'
import SkillsRadarChart from './SkillsRadarChart.vue'
import PerformanceScatterChart from './PerformanceScatterChart.vue'
import { useInsights } from '@/composables/useInsights';
import type { FilterParams } from '@/utils/types';

// Filter state
const selectedDepartment = ref('')
const startDate = ref('')
const endDate = ref('')

// Available departments
const departments = ['Sales', 'Support', 'Engineering', 'Marketing', 'Operations']

// Current filters
const currentFilters = computed(() => {
  const filters: FilterParams = {}
  if (selectedDepartment.value) filters.department = selectedDepartment.value
  if (startDate.value) filters.startDate = startDate.value
  if (endDate.value) filters.endDate = endDate.value
  return filters
})

const hasFilters = computed(() => selectedDepartment.value || startDate.value || endDate.value)

const clearFilters = () => {
  selectedDepartment.value = ''
  startDate.value = ''
  endDate.value = ''
}

// Fetch data with filters
const { data, isLoading, error } = useInsights(currentFilters);

// Computed stats for the cards
const totalSessions = computed(() => data.value?.insights.totalSessions ?? 0);
const passRate = computed(() => {
  const rate = data.value?.insights.overallPassRate ?? 0;
  return `${Math.round(rate * 100)}%`;
});
const avgScore = computed(() => {
  const avg = (data.value?.insights.averageScore ?? 0)
  return Math.round(avg * 10) / 10;
});

const departmentCount = computed(() => {
  const departments = new Set(data.value?.rawTrainingData.sessions.map(s => s.department) ?? []);
  return departments.size;
});

</script>

<style scoped>
.dashboard-layout {
  max-width: 1200px;
  margin: 0 auto;
}

.filters {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.filter-select,
.filter-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.clear-btn {
  padding: 8px 16px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #fecaca;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 24px;
}

/* .charts-grid> :last-child {
  grid-column: 1 / -1;
} */


@media (max-width: 991px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  /* .charts-grid> :last-child {
    grid-column: 1;
  } */
}

.loading-state,
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: 18px;
  color: #64748b;
}

.error-state {
  color: #dc2626;
}
</style>