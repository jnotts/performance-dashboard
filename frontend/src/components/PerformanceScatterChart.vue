<template>
  <div class="chart-wrapper">
    <div v-if="chartData && chartOptions" class="chart-container">
      <div class="chart-sub-header">
        <span class="chart-info">How do overall scores vary with completion time?</span>
      </div>
      <Scatter ref="chartRef" :data="chartData" :options="chartOptions" />
    </div>
    <div v-else>No data available</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Scatter } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
  type TooltipItem
} from 'chart.js'
import type { InsightsResponse } from '@/utils/types'
import { CHART_CONFIG, getDeptColor } from '@/utils/chartConfig'

// Register Chart.js components
ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend
)

// Accept data as prop
interface Props {
  data?: InsightsResponse
}

const props = defineProps<Props>()
const chartRef = ref()

// Functions to control all datasets
// const resetFilters = () => {
//   if (chartRef.value?.chart) {
//     const chart = chartRef.value.chart
//     chart.data.datasets.forEach((_: unknown, index: number) => {
//       chart.setDatasetVisibility(index, true)
//     })
//     chart.update()
//   }
// }


const chartData = computed((): ChartData<'scatter'> | null => {
  if (!props.data?.rawTrainingData.sessions) return null

  const sessions = props.data.rawTrainingData.sessions

  // Group by department for different colored datasets 
  const departmentGroups: { [key: string]: Array<{ x: number, y: number, pass: boolean }> } = {}

  // extract completionTime and overallScore
  sessions.forEach(session => {
    if (!departmentGroups[session.department]) {
      departmentGroups[session.department] = []
    }

    departmentGroups[session.department].push({
      x: session.completionTime,
      y: session.overallScore,
      pass: session.passed
    })
  })

  return {
    datasets: Object.entries(departmentGroups).map(([department, points]) => {
      const color = getDeptColor(department)
      return {
        label: department,
        data: points,
        pointStyle: points.map(point => point.pass ? 'circle' : 'crossRot'),
        backgroundColor: color + '80',
        borderColor: color,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderWidth: 1,
        pointHoverBorderWidth: 2,
        pointHoverBackgroundColor: color,
      }
    })
  }
})

const chartOptions = computed((): ChartOptions<'scatter'> => ({
  ...CHART_CONFIG.base,
  layout: { padding: { bottom: 30 } },
  plugins: {
    legend: {
      ...CHART_CONFIG.legend,
      position: 'bottom',
      labels: {
        ...CHART_CONFIG.legend.labels,
        generateLabels: (chart) => {
          const labels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart)

          // add pass/fail indicators to the legend
          labels.push(
            {
              text: 'Pass',
              fillStyle: '#6b7280',
              strokeStyle: '#6b7280',
              pointStyle: 'circle',
              // datasetIndex: -1,
              // index: -1
            },
            {
              text: 'Fail',
              fillStyle: '#6b7280',
              strokeStyle: '#6b7280',
              pointStyle: 'crossRot',
              // datasetIndex: -2,
              // index: -2
            }
          )
          return labels
        }
      },
      onHover: (event, legendItem, legend) => {
        legend.chart.canvas.style.cursor = 'pointer'
      },
      onLeave: (event, legendItem, legend) => {
        legend.chart.canvas.style.cursor = 'default'
      },
      // onClick: (event, legendItem, legend) => {
      //   // Only handle clicks for department datasets (not pass/fail indicators)
      //   if (legendItem.datasetIndex && legendItem.datasetIndex >= 0) {
      //     const chart = legend.chart
      //     chart.setDatasetVisibility(legendItem.datasetIndex, !chart.isDatasetVisible(legendItem.datasetIndex))
      //     chart.update()
      //   }
      // }
    },
    tooltip: {
      ...CHART_CONFIG.tooltip,
      callbacks: {
        title: () => 'Training Session',
        label: (context: TooltipItem<'scatter'>) => {
          const point = context.parsed
          return [
            `Department: ${context.dataset.label}`,
            `Completion Time: ${point.x} minutes`,
            `Overall Score: ${point.y}%`,
            `Status: ${point.y >= 70 ? 'Passed' : 'Failed'}`
          ]
        }
      }
    }
  },
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
      grid: CHART_CONFIG.grid,
      ticks: { ...CHART_CONFIG.ticks, callback: (value) => `${value}min` },
      title: { ...CHART_CONFIG.axisTitle, text: 'Completion Time (minutes)' }
    },
    y: {
      max: 100,
      grid: CHART_CONFIG.grid,
      ticks: { ...CHART_CONFIG.ticks, callback: (value) => `${value}%` },
      title: { ...CHART_CONFIG.axisTitle, text: 'Overall Score (%)' }
    }
  },
}))
</script>

<style scoped>
@import '@/styles/chartStyles.css';
</style>