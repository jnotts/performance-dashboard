<template>
  <div class="dashboard-header">
    <div class="header-left">
      <h1 class="dashboard-title">Training Performance Dashboard</h1>
      <p class="dashboard-subtitle">{{ formatDate(new Date()) }}</p>
    </div>

    <div class="header-right">
      <div class="filter-row">
        <div class="date-range">
          <input v-model="localStartDate" type="date" />
          <span>-</span>
          <input v-model="localEndDate" type="date" />
        </div>
      </div>

      <div class="filter-row">
        <button v-if="hasFilters" @click="clearAllFilters" class="clear">
          Clear Filters
        </button>
        <button @click="setLast7Days" :class="{ active: isLast7DaysActiveLocal }">
          Last 7 days
        </button>
        <button @click="setThisMonth" :class="{ active: isThisMonthActiveLocal }">
          This month
        </button>
        <select class="dropdown" v-model="localSelectedDepartment">
          <option value="">All Departments</option>
          <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  startDate?: string
  endDate?: string
  selectedDepartment?: string
}

interface Emits {
  (e: 'update:startDate', value: string): void
  (e: 'update:endDate', value: string): void
  (e: 'update:selectedDepartment', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  startDate: '',
  endDate: '',
  selectedDepartment: ''
})

const emit = defineEmits<Emits>()

// Available departments
const departments = ['Sales', 'Support', 'Engineering', 'Marketing', 'Operations']

// Use computed properties that directly work with props/emits
const localStartDate = computed({
  get: () => props.startDate,
  set: (value) => emit('update:startDate', value)
})

const localEndDate = computed({
  get: () => props.endDate,
  set: (value) => emit('update:endDate', value)
})

const localSelectedDepartment = computed({
  get: () => props.selectedDepartment,
  set: (value) => emit('update:selectedDepartment', value)
})

// Track which quick filter is active based on current dates
const activeQuickFilter = computed(() => {
  if (!props.startDate || !props.endDate) return null

  const today = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate() - 7)
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const todayStr = formatDateForInput(today)
  const sevenDaysAgoStr = formatDateForInput(sevenDaysAgo)
  const firstOfMonthStr = formatDateForInput(firstOfMonth)

  if (props.startDate === sevenDaysAgoStr && props.endDate === todayStr) {
    return 'last7days'
  }
  if (props.startDate === firstOfMonthStr && props.endDate === todayStr) {
    return 'thismonth'
  }
  return null
})

// Filter state
const hasFilters = computed(() =>
  localSelectedDepartment.value || localStartDate.value || localEndDate.value
)

const clearAllFilters = () => {
  emit('update:selectedDepartment', '')
  emit('update:startDate', '')
  emit('update:endDate', '')
}

// Helper function to get local date string
const formatDateForInput = (date: Date) => {
  return date.toISOString().split('T')[0]
}

// Simple toggle functions
const setLast7Days = () => {
  if (activeQuickFilter.value === 'last7days') {
    // Clear if already active
    emit('update:startDate', '')
    emit('update:endDate', '')
  } else {
    // Set 7 days filter
    const today = new Date()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 7)

    emit('update:startDate', formatDateForInput(sevenDaysAgo))
    emit('update:endDate', formatDateForInput(today))
  }
}

const setThisMonth = () => {
  if (activeQuickFilter.value === 'thismonth') {
    // Clear if already active
    emit('update:startDate', '')
    emit('update:endDate', '')
  } else {
    // Set this month filter
    const today = new Date()
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    emit('update:startDate', formatDateForInput(firstOfMonth))
    emit('update:endDate', formatDateForInput(today))
  }
}

// Button active states
const isLast7DaysActiveLocal = computed(() => activeQuickFilter.value === 'last7days')
const isThisMonthActiveLocal = computed(() => activeQuickFilter.value === 'thismonth')

// Format date for display
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
}

.header-left {
  flex: 1;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.2;
}

.dashboard-subtitle {
  color: #6b7280;
  font-size: 14px;
  margin: 4px 0 0 0;
}

.header-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}

.filter-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
}

.date-range input {
  border: none;
  outline: none;
  background: transparent;
  color: #374151;
}

.filter-row select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
}

.filter-row button {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
}

.filter-row button:hover {
  background: #f9fafb;
  color: #374151;
}

.filter-row button.active {
  background: #71C4D5;
  border-color: #71C4D5;
  color: white;
}

.filter-row button.clear {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.filter-row button.clear:hover {
  background: #fecaca;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-right {
    width: 100%;
    align-items: flex-start;
  }

  .filter-row {
    flex-wrap: wrap;
  }
}
</style>