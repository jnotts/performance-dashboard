<template>
  <div class="chart-wrapper">
    <Radar v-if="chartData && chartOptions" :data="chartData" :options="chartOptions" />
    <div v-else class="chart-skeleton">
      <div class="empty-radar">
        <div class="radar-circles">
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
        </div>
        <div class="radar-lines">
          <div class="line horizontal"></div>
          <div class="line vertical"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
  type TooltipItem
} from 'chart.js'
import type { ApiResponse } from '@/utils/types'

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

// Accept data as prop
interface Props {
  data?: ApiResponse
}

const props = defineProps<Props>()

// Department colors for consistent styling
const departmentColors = {
  Sales: { bg: 'rgba(113, 196, 213, 0.2)', border: '#71C4D5' },
  Support: { bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981' },
  Engineering: { bg: 'rgba(139, 92, 246, 0.2)', border: '#8b5cf6' },
  Marketing: { bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b' },
  Operations: { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444' },
  default: { bg: 'rgba(107, 114, 128, 0.2)', border: '#6b7280' }
}

const chartData = computed((): ChartData<'radar'> | null => {
  if (!props.data?.insights.averageScoresByDepartment.length) return null

  const departmentStats = props.data.insights.averageScoresByDepartment
  const skillLabels = ['Communication', 'Problem\nSolving', 'Product\nKnowledge', 'Customer\nService']

  return {
    labels: skillLabels,
    datasets: departmentStats.map(dept => {
      const colors = departmentColors[dept.department as keyof typeof departmentColors] || departmentColors.default

      return {
        label: dept.department,
        data: [
          Math.round(dept.skillAverages.communication * 10) / 10,
          Math.round(dept.skillAverages.problemSolving * 10) / 10,
          Math.round(dept.skillAverages.productKnowledge * 10) / 10,
          Math.round(dept.skillAverages.customerService * 10) / 10
        ],
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 2,
        pointBackgroundColor: colors.border,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: colors.border,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      }
    })
  }
})

const chartOptions = computed((): ChartOptions<'radar'> => ({
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
      displayColors: true,
      callbacks: {
        title: (context: TooltipItem<'radar'>[]) => {
          return `${context[0].dataset.label} Department`
        },
        label: (context: TooltipItem<'radar'>) => {
          return `${context.label}: ${context.parsed.r}%`
        }
      }
    }
  },
  scales: {
    r: {
      beginAtZero: false,
      min: 60, // todo: make dynamic
      max: 100,
      grid: {
        color: 'rgba(107, 114, 128, 0.2)',
        lineWidth: 1
      },
      angleLines: {
        color: 'rgba(107, 114, 128, 0.2)',
        lineWidth: 1
      },
      pointLabels: {
        font: {
          size: 10,
          weight: 500,
        },

        color: '#374151',
        padding: 10
      },
      ticks: {
        stepSize: 10,
        color: '#9ca3af',
        font: {
          size: 10
        },
        backdropColor: 'rgba(255, 255, 255, 0.8)',
        backdropPadding: 2,
        callback: (value) => `${value}%`
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'point'
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  }
}))
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
}

.chart-skeleton {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-radar {
  position: relative;
  width: 200px;
  height: 200px;
}

.radar-circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.circle {
  position: absolute;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.circle:nth-child(1) { width: 200px; height: 200px; }
.circle:nth-child(2) { width: 133px; height: 133px; }
.circle:nth-child(3) { width: 66px; height: 66px; }

.radar-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.line {
  position: absolute;
  background: #e5e7eb;
}

.line.horizontal {
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
}

.line.vertical {
  left: 50%;
  top: 0;
  width: 1px;
  height: 100%;
}
</style>