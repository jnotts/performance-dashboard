<template>
  <div v-if="isLoading" class="loading-state">
    <div>Loading dashboard...</div>
  </div>

  <div v-else-if="error" class="error-state">
    <div>Error loading data: {{ error.message }}</div>
  </div>

  <div v-else class="dashboard-layout">
    <div class="stats-grid">
      <StatsCard title="Total Sessions" :value="totalSessions" />
      <StatsCard title="Pass Rate" :value="passRate" />
      <StatsCard title="Avg Score" :value="avgScore" />
      <StatsCard title="Departments" :value="departmentCount" />
    </div>

    <div class="charts-grid">
      <ChartContainer title="Performance Trends">
        <PerformanceTrendChart />
      </ChartContainer>

      <ChartContainer title="Skills Comparison">
        <SkillsRadarChart />
      </ChartContainer>

      <ChartContainer title="Performance vs Time Correlation">
        <PerformanceScatterChart />
      </ChartContainer>

      <!-- <ChartContainer title="Performance vs Time Correlation">
        <PerformanceScatterChart />
      </ChartContainer> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import StatsCard from './StatsCard.vue'
import ChartContainer from './ChartContainer.vue'
import PerformanceTrendChart from './PerformanceTrendChart.vue'
import SkillsRadarChart from './SkillsRadarChart.vue'
import PerformanceScatterChart from './PerformanceScatterChart.vue'
import { useInsights } from '@/composables/useInsights';
import { computed } from 'vue';

const { data, isLoading, error } = useInsights();

// Computed stats for the cards
const totalSessions = computed(() => data.value?.insights.totalSessions ?? 0);
const passRate = computed(() => {
  const rate = data.value?.insights.overallPassRate ?? 0;
  return `${Math.round(rate * 100)}%`; // nearest %
});
const avgScore = computed(() => {
  const avg = (data.value?.insights.averageScore ?? 0)
  return Math.round(avg * 10) / 10; // 1dp
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