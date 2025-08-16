<template>
  <div class="chart-wrapper">
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
        label: 'Average Score',
        data: sortedTrends.map(trend => Math.round(trend.averageScore * 10) / 10),
        borderColor: '#71C4D5',
        backgroundColor: 'rgba(113, 196, 213, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#71C4D5',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#5DB5C7',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      }
    ]
  }
})

const chartOptions = computed((): ChartOptions<'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          size: 10,
          weight: 500
        },
        color: '#374151'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#71C4D5',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        title: (context: TooltipItem<'line'>[]) => {
          return `Date: ${context[0].label}`
        },
        label: (context: TooltipItem<'line'>) => {
          const sessionCount = props.data?.insights.recentTrends.find(
            trend => new Date(trend.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            }) === context.label
          )?.sessionCount || 0

          return [
            `Average Score: ${context.parsed.y}`,
            `Sessions: ${sessionCount}`
          ]
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(107, 114, 128, 0.1)',
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
          weight: 500
        }
      },
      title: {
        display: true,
        text: 'Date',
        color: '#6b7280',
        font: {
          size: 14,
          weight: 'bold'
        },
      }
    },
    y: {
      beginAtZero: false,
      // min: 0, // todo: make dynamic
      max: 100,
      grid: {
        color: 'rgba(107, 114, 128, 0.1)',
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
          weight: 500
        },
        callback: (value) => `${value}%`
      },
      title: {
        display: true,
        text: 'Average Score',
        color: '#6b7280',
        font: {
          size: 14,
          weight: 'bold'
        },
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index' as const
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart' as const
  }
}))
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>