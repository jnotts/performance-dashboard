<template>
  <div class="stats-card">
    <h3 class="stats-title">{{ title }}</h3>
    <div class="stats-value">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
}

defineProps<Props>()
</script>

<style scoped>
.stats-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
  height: 100%;
}

.stats-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.stats-title {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.stats-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}
</style>