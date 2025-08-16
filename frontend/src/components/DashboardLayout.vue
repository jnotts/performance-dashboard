<template>
  <div v-if="isLoading" class="loading-state">
    <div>Loading dashboard...</div>
  </div>

  <div v-else-if="error" class="error-state">
    <div>Error loading data: {{ error.message }}</div>
  </div>

  <div v-else class="dashboard-layout">
    <!-- Dashboard Header Component -->
    <DashboardHeader v-model:start-date="startDate" v-model:end-date="endDate"
      v-model:selected-department="selectedDepartment" />

    <!-- Compact stats cards -->
    <div class="stats-grid">
      <StatsCard title="Total Sessions" :value="totalSessions" />
      <StatsCard title="Pass Rate" :value="passRate" />
      <StatsCard title="Avg Score" :value="avgScore" />
      <StatsCard title="Departments" :value="departmentCount" />
    </div>

    <!-- Charts layout: 2 on top, smaller chart + AI insights below -->
    <div class="charts-container">
      <div class="charts-row-main">
        <ChartContainer title="Performance Trends" class="chart-main">
          <PerformanceTrendChart :data="data" />
        </ChartContainer>

        <ChartContainer title="Skills Comparison" class="chart-main">
          <SkillsRadarChart :data="data" />
        </ChartContainer>
      </div>

      <div class="charts-row-secondary">
        <ChartContainer title="Performance vs Time" class="chart-secondary">
          <PerformanceScatterChart :data="data" />
        </ChartContainer>

        <div class="ai-insights-container">
          <div class="ai-insights-header">
            <h3>AI Insights</h3>
            <div class="ai-status">
              <div class="ai-indicator"></div>
              <span>Analyzing...</span>
            </div>
          </div>
          <div class="ai-insights-content">
            <div class="insight-item">
              <div class="insight-icon">💡</div>
              <div class="insight-text">
                <p><strong>Engineering excelling:</strong> 95% average performance, +12% vs last month</p>
              </div>
            </div>
            <div class="insight-item">
              <div class="insight-icon">📈</div>
              <div class="insight-text">
                <p><strong>Improvement trend:</strong> All departments showing positive growth</p>
              </div>
            </div>
            <div class="insight-item">
              <div class="insight-icon">⚠️</div>
              <div class="insight-text">
                <p><strong>Focus area:</strong> Operations problem-solving scores need attention</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
import DashboardHeader from './DashboardHeader.vue'
import { useInsights } from '@/composables/useInsights';
import type { FilterParams } from '@/utils/types';

// Filter state
const selectedDepartment = ref('')
const startDate = ref('')
const endDate = ref('')

// Current filters
const currentFilters = computed(() => {
  const filters: FilterParams = {}
  if (selectedDepartment.value) filters.department = selectedDepartment.value
  if (startDate.value) filters.startDate = startDate.value
  if (endDate.value) filters.endDate = endDate.value
  return filters
})

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
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

/* Charts Container */
.charts-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.charts-row-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.charts-row-secondary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

.chart-main {
  min-height: 400px;
}

.chart-secondary {
  min-height: 350px;
}

/* AI Insights Container */
.ai-insights-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

.ai-insights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.ai-insights-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.ai-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.ai-insights-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 3px solid #71C4D5;
}

.insight-icon {
  font-size: 16px;
  margin-top: 2px;
}

.insight-text p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
}

.insight-text strong {
  color: #1f2937;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard-layout {
    padding: 16px;
  }

  .charts-row-main {
    grid-template-columns: 1fr;
  }

  .charts-row-secondary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
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