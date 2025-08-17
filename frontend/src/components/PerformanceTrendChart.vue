<template>
  <div class="chart-wrapper">
    <div class="chart-sub-header">
      <span class="chart-info">Compare your team's performance over time and compare skill trends</span>
      <span class="legend-hint">💡 Click legend items to toggle departments</span>
    </div>
    <Line v-if="chartData && chartOptions" :data="chartData" :options="chartOptions" />
    <div v-else>No data available</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type TooltipItem,
  type ChartData
} from 'chart.js'
import type { ApiResponse } from '@/utils/types'
import { CHART_CONFIG } from '@/utils/chartConfig'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Accept data as prop
interface Props {
  data?: ApiResponse
}

const props = defineProps<Props>()

// Process data for chart
const chartData = computed((): ChartData<'line'> | null => {
  if (!props.data?.insights.recentTrends) return null
  const trends = props.data.insights.recentTrends

  // Sort by date to ensure proper line progression
  const sortedTrends = [...trends].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Skill colors
  const skillColors = {
    communication: '#10b981',
    problemSolving: '#8b5cf6',
    productKnowledge: '#f59e0b',
    customerService: '#ef4444'
  }

  // Get skill names from first trend item
  const skillNames = sortedTrends[0]?.skillAverages ? Object.keys(sortedTrends[0].skillAverages) : []

  return {
    labels: sortedTrends.map(trend => {
      const date = new Date(trend.date)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }),
    datasets: [
      {
        label: 'Overall Score',
        data: sortedTrends.map(trend => Math.round(trend.averageScore * 10) / 10),
        borderColor: '#1e3a8a',
        backgroundColor: '#1e3a8a10',
        fill: true,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#1e3a8a',
        pointHoverBorderWidth: 3,
        order: 1, // Render on top
      },
      // Add skill average lines (hidden by default)
      ...skillNames.map(skill => ({
        label: skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1'),
        data: sortedTrends.map(trend => Math.round(trend.skillAverages[skill as keyof typeof trend.skillAverages] * 10) / 10),
        borderColor: skillColors[skill as keyof typeof skillColors] || '#6b7280',
        backgroundColor: 'transparent',
        fill: false,
        borderWidth: 1,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 3,
        hidden: true, // Hide by default
        order: 2, // Render behind main line
      }))
    ]
  }
})

const chartOptions = computed((): ChartOptions<'line'> => ({
  ...CHART_CONFIG.base,
  layout: { padding: { bottom: 30 } },
  interaction: {
    intersect: false,
    mode: 'index' // better ux hover
  },
  plugins: {
    legend: { ...CHART_CONFIG.legend, position: 'bottom' },

    tooltip: {
      ...CHART_CONFIG.tooltip,
      displayColors: true,
      callbacks: {
        title: (context: TooltipItem<'line'>[]) => `Date: ${context[0].label}`,
        label: (context: TooltipItem<'line'>) => {
          return `${context.dataset.label}: ${context.parsed.y}%`
        },
        afterBody: (context: TooltipItem<'line'>[]) => {
          const sessionCount = props.data?.insights.recentTrends.find(
            trend => new Date(trend.date).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric'
            }) === context[0].label
          )?.sessionCount || 0
          return [`Sessions: ${sessionCount}`]
        }
      }
    }
  },
  scales: {
    x: {
      grid: CHART_CONFIG.grid,
      ticks: CHART_CONFIG.ticks,
      title: { ...CHART_CONFIG.axisTitle, text: 'Date' }
    },
    y: {
      beginAtZero: false,
      max: 100,
      grid: CHART_CONFIG.grid,
      ticks: { ...CHART_CONFIG.ticks, callback: (value) => `${value}%` },
      title: { ...CHART_CONFIG.axisTitle, text: 'Average Score' }
    }
  }
}))
</script>

<style scoped>
@import '@/styles/chartStyles.css';
</style>