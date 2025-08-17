// Department colors - single source of truth
const DEPT_COLORS = {
  Sales: '#71C4D5',
  Support: '#10b981',
  Engineering: '#8b5cf6',
  Marketing: '#f59e0b',
  Operations: '#ef4444',
  default: '#6b7280',
} as const

// Shared chart configurations
export const CHART_CONFIG = {
  base: {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: 'easeInOutQuart' as const },
    interaction: { intersect: false, mode: 'point' as const },
  },
  tooltip: {
    backgroundColor: '#000000cc',
    titleColor: '#ffffff',
    bodyColor: '#ffffff',
    borderColor: DEPT_COLORS.Sales,
    borderWidth: 1,
    cornerRadius: 8,
    displayColors: true,
  },
  legend: {
    labels: {
      padding: 20,
      usePointStyle: true,
      font: { size: 10, weight: 500 },
      color: '#374151',
    },
  },
  grid: { color: '#6b728019', lineWidth: 1 },
  ticks: { color: '#6b7280', font: { size: 12, weight: 500 } },
  axisTitle: { display: true, color: '#374151', font: { size: 14, weight: 600 } },
}

// Helper functions
export const getDeptColor = (dept: string): string =>
  DEPT_COLORS[dept as keyof typeof DEPT_COLORS] || DEPT_COLORS.default

export const getDeptColors = (dept: string) => {
  const color = getDeptColor(dept)
  return { bg: color + '33', border: color }
}
