<template>
  <div class="dashboard-layout">
    <div class="stats-grid">
      <StatsCard title="Total Sessions" :value="42" />
      <StatsCard title="Pass Rate" :value="'85%'" />
      <StatsCard title="Avg Score" :value="87.3" />
      <StatsCard title="Departments" :value="3" />
    </div>

    <div class="charts-grid">
      <ChartContainer title="Performance Trends">
        <div class="placeholder-chart">Line Chart - Performance over time</div>
      </ChartContainer>
      
      <ChartContainer title="Skills Comparison">
        <div class="placeholder-chart">Bar Chart - Skills by department</div>
      </ChartContainer>
      
      <ChartContainer title="Department Overview">
        <div class="placeholder-chart">Custom visualization placeholder</div>
      </ChartContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatsCard from './StatsCard.vue'
import ChartContainer from './ChartContainer.vue'
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

.charts-grid > :last-child {
  grid-column: 1 / -1;
}

.placeholder-chart {
  height: 300px;
  background: #f1f5f9;
  border: 2px dashed #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-style: italic;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid > :last-child {
    grid-column: 1;
  }
}
</style>