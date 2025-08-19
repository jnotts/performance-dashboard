<template>
  <div class="dashboard-layout">
    <!-- Dashboard Header Component -->
    <DashboardHeader v-model:start-date="startDate" v-model:end-date="endDate"
      v-model:selected-department="selectedDepartment" :departments="availableDepartments"
      @export-to-p-d-f="handleExportToPDF" />

    <!-- Error state -->
    <div v-if="insightsError" class="error-message">
      Error loading insightData: {{ insightsError.message }}
    </div>

    <!-- Compact stats cards -->
    <div class="stats-grid" :class="{ 'loading': insightsLoading }">
      <StatsCard title="Total Sessions" :value="totalSessions" icon="📊" />
      <StatsCard title="Pass Rate" :value="passRate" icon="✅" />
      <StatsCard title="Avg Score" :value="avgScore" icon="🎯" />
      <StatsCard title="Top Performing Skill" :value="topSkill" icon="🏆" />
    </div>

    <!-- Charts quadrant layout -->
    <div class="quadrant" :class="{ 'loading': insightsLoading }">
      <div class="ai-insights">
        <div class="ai-insights-header">
          <h3>AI Insights</h3>
          <div class="ai-status">
            <div class="ai-indicator"></div>
            <span v-if="aiInsightsLoading">Analyzing...</span>
            <!-- <span v-else-if="aiInsightsError"></span> -->
            <span v-else-if="aiInsights">Analyzed!</span>
          </div>
        </div>
        <div class="ai-insights-content">
          <!-- Loading state -->
          <div v-if="aiInsightsLoading" class="insight-item">
            <div class="insight-icon">⏳</div>
            <div class="insight-text">
              <p>Generating AI insights for your team...</p>
            </div>
          </div>

          <!-- AI insights loop -->
          <div v-else-if="aiInsights" v-for="(insight, index) in aiInsights" :key="index" class="insight-item">
            <div class="insight-icon">{{ getInsightIcon(index) }}</div>
            <div class="insight-text">
              <p>{{ insight }}</p>
            </div>
          </div>

          <!-- Error state -->
          <div v-else-if="aiInsightsError" class="insight-item error">
            <div class="insight-icon">❌</div>
            <div class="insight-text">
              <p>Failed to generate AI insights</p>
            </div>
          </div>

          <!-- Fallback empty state -->
          <div v-else class="insight-item">
            <div class="insight-icon">💭</div>
            <div class="insight-text">
              <p>No insights available yet</p>
            </div>
          </div>
        </div>
      </div>

      <ChartContainer title="Performance Trends" class="performance-trends">
        <PerformanceTrendChart :data="insightData" />
      </ChartContainer>

      <ChartContainer title="Performance vs Time" class="performance-scatter">
        <PerformanceScatterChart :data="insightData" />
      </ChartContainer>

      <ChartContainer title="Skills Comparison" class="skills-comparison">
        <SkillsRadarChart :data="insightData" />
      </ChartContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import StatsCard from './StatsCard.vue'
import ChartContainer from './ChartContainer.vue'
import PerformanceTrendChart from './PerformanceTrendChart.vue'
import SkillsRadarChart from './SkillsRadarChart.vue'
import PerformanceScatterChart from './PerformanceScatterChart.vue'
import DashboardHeader from './DashboardHeader.vue'
import { useInsights } from '@/composables/useInsights';
import type { FilterParams } from '@/utils/types';
import { useAiInsights } from '@/composables/useAiInsights';
import html2pdf from 'html2pdf.js';

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

watch(currentFilters, () => {
  console.log('Filters updated:', currentFilters.value)
})

// Fetch insightData with filters
const {
  data: insightData,
  isLoading: insightsLoading,
  error: insightsError
} = useInsights(currentFilters);

const {
  data: aiInsights,
  isLoading: aiInsightsLoading,
  error: aiInsightsError
} = useAiInsights(insightData);

// Computed stats for the cards with fallbacks
const totalSessions = computed(() => {
  if (insightsLoading.value && !insightData.value) return "Loading..."
  return insightData.value?.insights.totalSessions ?? 0
});

const passRate = computed(() => {
  if (insightsLoading.value && !insightData.value) return "Loading..."
  const rate = insightData.value?.insights.overallPassRate ?? 0;
  return `${Math.round(rate * 100)}%`;
});

const avgScore = computed(() => {
  if (insightsLoading.value && !insightData.value) return "Loading..."
  const avg = (insightData.value?.insights.averageScore ?? 0)
  return Math.round(avg * 10) / 10;
});

const topSkill = computed(() => {
  if (insightsLoading.value && !insightData.value) return "Loading..."
  const topSkills = insightData.value?.insights.topPerformingSkills ?? [];
  if (topSkills.length === 0) return "None";
  const skill = topSkills[0].skill; // ordered in the backend
  return skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1'); // format from camelCase to Title Case
});

// Available departments from metadata
const availableDepartments = computed(() => {
  return insightData.value?.metadata.departments ?? [];
});

// Function to get different icons for each insight
const getInsightIcon = (index: number) => {
  const icons = ['💡', '📈', '⚠️'];
  return icons[index % icons.length];
};

// Export to PDF functionality - TODO: move to utility function/composable
const handleExportToPDF = async () => {
  // Wait for any loading states to complete
  if (insightsLoading.value || aiInsightsLoading.value) {
    alert('Please wait for data to finish loading before exporting.');
    return;
  }

  try {
    const element = document.querySelector('.main-content') as HTMLElement;
    if (!element) {
      console.error('Dashboard element not found');
      return;
    }

    // Store original scroll position
    const originalScrollTop = window.pageYOffset;

    // Add class to remove box shadows for PDF export
    document.body.classList.add('pdf-export');

    // Scroll to top to ensure proper capture
    window.scrollTo(0, 0);

    // Wait for any animations/rendering to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate filename with current date and filters
    const today = new Date().toISOString().split('T')[0];
    const deptSuffix = selectedDepartment.value ? `-${selectedDepartment.value}` : '';
    const filename = `training-dashboard-${today}${deptSuffix}.pdf`;

    // Get the full content height
    const elementHeight = element.scrollHeight;
    const elementWidth = element.scrollWidth;

    const opt = {
      margin: [0.2, 0.2, 0.2, 0.2],
      filename,
      image: { type: 'jpeg', quality: 0.85 },
      html2canvas: {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: elementWidth + 100,
        height: elementHeight,
        windowWidth: 1900,
        windowHeight: elementHeight,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'px',
        format: [elementWidth + 100, elementHeight + 50],
        orientation: elementWidth > elementHeight ? 'landscape' : 'portrait'
      }
    };

    await html2pdf().set(opt).from(element).save();

    // Remove PDF export class and restore original scroll position
    document.body.classList.remove('pdf-export');
    window.scrollTo(0, originalScrollTop);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    alert('Failed to export PDF. Please try again.');
    // Remove PDF export class and restore scroll position on error
    document.body.classList.remove('pdf-export');
    window.scrollTo(0, window.pageYOffset);
  }
};

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
  margin-bottom: 16px;
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
  font-size: 16px;
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
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.insight-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
}

.insight-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.insight-icon {
  font-size: 20px;
  line-height: 1;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
  margin-top: 1px;
}

.insight-text {
  flex: 1;
}

.insight-text p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  font-weight: 400;
}

.insight-text strong {
  color: #1e293b;
  font-weight: 600;
}

.insight-item.error {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  border-color: #fca5a5;
}

.insight-item.error::before {
  background: linear-gradient(to bottom, #ef4444, #dc2626);
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


  .performance-trends,
  .skills-comparison,
  .performance-scatter,
  .ai-insights {
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