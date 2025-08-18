// Predefined color palette for consistent assignment
// const COLOR_PALETTE = [
//   '#71C4D5', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444',
//   '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
//   '#14b8a6', '#eab308', '#f43f5e', '#8b5a2b', '#6b7280'
// ]

const COLOR_PALETTE = [
  '#CC3333', // Red
  '#CCCC33', // Yellow-Green
  '#33CC33', // Green
  '#33CCCC', // Cyan
  '#3333CC', // Blue
  '#CC33CC', // Magenta
  '#CC3399', // Rose
  '#9933CC', // Purple
  '#3366CC', // Indigo
  '#CC9933', // Orange
]

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
    borderColor: COLOR_PALETTE[0],
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

// Helper functions for consistent color assignment
export const getDeptColor = (dept: string, allDepartments: string[]): string => {
  const index = allDepartments.indexOf(dept)
  return COLOR_PALETTE[index % COLOR_PALETTE.length] || COLOR_PALETTE[COLOR_PALETTE.length - 1]
}

export const getDeptColors = (dept: string, allDepartments: string[]) => {
  const color = getDeptColor(dept, allDepartments)
  return { bg: color + '33', border: color }
}

// Dynamic color assignment for skills
export const getSkillColor = (skill: string, allSkills: string[]): string => {
  const index = allSkills.indexOf(skill)
  return COLOR_PALETTE[index % COLOR_PALETTE.length] || '#6b7280'
}
