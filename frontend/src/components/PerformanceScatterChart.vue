<template>
  <div class="chart-wrapper">
    <div v-if="chartData && chartOptions" class="chart-container">
      <div class="legend-controls">
        <span class="legend-hint">💡 Click legend items to toggle departments</span>
        <button @click="resetFilters" class="legend-btn">Reset Legend</button>
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
import { useInsights } from '@/composables/useInsights'

// Register Chart.js components
ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend
)

const { data } = useInsights()
const chartRef = ref()

// Functions to control all datasets
const resetFilters = () => {
  if (chartRef.value?.chart) {
    const chart = chartRef.value.chart
    chart.data.datasets.forEach((_: unknown, index: number) => {
      chart.setDatasetVisibility(index, true)
    })
    chart.update()
  }
}

// Department colors for consistent styling
const departmentColors = {
  Sales: '#3b82f6',
  Support: '#10b981',
  Engineering: '#8b5cf6',
  Marketing: '#f59e0b',
  Operations: '#ef4444',
  default: '#6b7280'
}

const chartData = computed((): ChartData<'scatter'> | null => {
  if (!data.value?.rawTrainingData.sessions) return null

  const sessions = data.value.rawTrainingData.sessions

  // Group by department for different colored datasets 
  const departmentGroups: { [key: string]: Array<{ x: number, y: number }> } = {}

  // extract completionTime and overallScore
  sessions.forEach(session => {
    if (!departmentGroups[session.department]) {
      departmentGroups[session.department] = []
    }

    departmentGroups[session.department].push({
      x: session.completionTime,
      y: session.overallScore
    })
  })

  return {
    datasets: Object.entries(departmentGroups).map(([department, points]) => ({
      label: department,
      data: points,
      backgroundColor: (departmentColors[department as keyof typeof departmentColors] || departmentColors.default) + '80',
      borderColor: departmentColors[department as keyof typeof departmentColors] || departmentColors.default,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBorderWidth: 1,
      pointHoverBorderWidth: 2,
      pointHoverBorderColor: '#ffffff',
    }))
  }
})

const chartOptions = computed((): ChartOptions<'scatter'> => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      // right: 20,
      bottom: 40
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          size: 12,
          weight: 500
        },
        color: '#374151',
      },
      onHover: (event, legendItem, legend) => {
        legend.chart.canvas.style.cursor = 'pointer'
      },
      onLeave: (event, legendItem, legend) => {
        legend.chart.canvas.style.cursor = 'default'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#3b82f6',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
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
      grid: {
        color: 'rgba(107, 114, 128, 0.1)',
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
          weight: 500
        },
        callback: (value) => `${value}min`
      },
      title: {
        display: true,
        text: 'Completion Time (minutes)',
        color: '#374151',
        font: {
          size: 14,
          weight: 600
        }
      }
    },
    y: {
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
        text: 'Overall Score (%)',
        color: '#374151',
        font: {
          size: 14,
          weight: 600
        }
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
  },
  elements: {
    point: {
      hoverBackgroundColor: (context) => {
        const score = context.parsed.y
        return score >= 70 ? '#10b981' : '#ef4444' // Green for pass, red for fail
      }
    }
  }
}))
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 450px;
  width: 100%;
}

.chart-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.legend-controls {
  display: flex;
  gap: 4px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.legend-hint {
  font-size: 11px;
  color: #6b7280;
  font-style: italic;
}

.legend-btn {
  padding: 6px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.legend-btn:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
  color: #334155;
}

.legend-btn:active {
  transform: translateY(1px);
}

/* .chart-container>div:last-child {
  flex: 1;
  min-height: 0;
} */
</style>