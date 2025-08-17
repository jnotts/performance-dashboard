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
import { CHART_CONFIG, getDeptColors } from '@/utils/chartConfig'

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


const chartData = computed((): ChartData<'radar'> | null => {
  if (!props.data?.insights.averageScoresByDepartment.length) return null

  const departmentStats = props.data.insights.averageScoresByDepartment
  const skillLabels = ['Communication', 'Problem\nSolving', 'Product\nKnowledge', 'Customer\nService']

  return {
    labels: skillLabels,
    datasets: departmentStats.map(dept => {
      const colors = getDeptColors(dept.department)

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
  ...CHART_CONFIG.base,
  plugins: {
    legend: { ...CHART_CONFIG.legend, position: 'bottom' },
    tooltip: {
      ...CHART_CONFIG.tooltip,
      callbacks: {
        title: (context: TooltipItem<'radar'>[]) => `${context[0].dataset.label} Department`,
        label: (context: TooltipItem<'radar'>) => `${context.label}: ${context.parsed.r}%`
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
  }
}))
</script>

<style scoped>
@import '@/styles/chartStyles.css';

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

.circle:nth-child(1) {
  width: 200px;
  height: 200px;
}

.circle:nth-child(2) {
  width: 133px;
  height: 133px;
}

.circle:nth-child(3) {
  width: 66px;
  height: 66px;
}

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