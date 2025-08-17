<template>
  <div class="dashboard-layout">
    <!-- Dashboard Header Component -->
    <DashboardHeader v-model:start-date="startDate" v-model:end-date="endDate"
      v-model:selected-department="selectedDepartment" />

    <!-- Error state -->
    <div v-if="error" class="error-message">
      Error loading data: {{ error.message }}
    </div>

    <!-- Compact stats cards -->
    <div class="stats-grid" :class="{ 'loading': isLoading }">
      <StatsCard title="Total Sessions" :value="totalSessions" />
      <StatsCard title="Pass Rate" :value="passRate" />
      <StatsCard title="Avg Score" :value="avgScore" />
      <StatsCard title="Departments" :value="departmentCount" />
    </div>

    <!-- Charts quadrant layout -->
    <div class="quadrant" :class="{ 'loading': isLoading }">
      <ChartContainer title="Performance Trends" class="performance-trends">
        <PerformanceTrendChart :data="data" />
      </ChartContainer>

      <div class="ai-insights">
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

      <ChartContainer title="Skills Comparison" class="skills-comparison">
        <SkillsRadarChart :data="data" />
      </ChartContainer>

      <ChartContainer title="Performance vs Time" class="performance-scatter">
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
import DashboardHeader from './DashboardHeader.vue'
import { useInsights } from '@/composables/useInsights';
import type { FilterParams } from '@/utils/types';

// Filter state
const selectedDepartment = ref('')
const startDate = ref('')
const endDate = ref('')

// Current filters
const currentFilters = computed(() => ({
  department: selectedDepartment.value || undefined,
  startDate: startDate.value || undefined,
  endDate: endDate.value || undefined
}) as FilterParams)

// Fetch data with filters
const { data, isLoading, error } = useInsights(currentFilters);

// Computed stats for the cards with fallbacks
const totalSessions = computed(() => {
  if (isLoading.value && !data.value) return "Loading..."
  return data.value?.insights.totalSessions ?? 0
});

const passRate = computed(() => {
  if (isLoading.value && !data.value) return "Loading..."
  const rate = data.value?.insights.overallPassRate ?? 0;
  return `${Math.round(rate * 100)}%`;
});

const avgScore = computed(() => {
  if (isLoading.value && !data.value) return "Loading..."
  const avg = (data.value?.insights.averageScore ?? 0)
  return Math.round(avg * 10) / 10;
});

const departmentCount = computed(() => {
  if (isLoading.value && !data.value) return "Loading..."
  const departments = new Set(data.value?.rawTrainingData.sessions.map(s => s.department) ?? []);
  return departments.size;
});

</script>

<style scoped>
.dashboard-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  transition: opacity 0.3s ease;
}

.stats-grid.loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Quadrant Layout */
.quadrant {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: 16px;
  transition: opacity 0.3s ease;
}

.quadrant.loading {
  opacity: 0.6;
  pointer-events: none;
}

.performance-trends {
  grid-column: span 5;
}
.skills-comparison {
  grid-column: span 3;
}
.performance-scatter {
  grid-column: span 5;
}
/* AI Insights */
.ai-insights {
  grid-column: span 3;

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

  .quadrant {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .quad-1,
  .quad-2,
  .quad-3,
  .quad-4 {
    grid-area: auto;
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

.error-message {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
}
</style>