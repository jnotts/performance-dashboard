<template>
  <div class="chart-container">
    <div class="chart-header">
      <h2 class="chart-title">{{ title }}</h2>
    </div>
    <div class="chart-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<style scoped>
.chart-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.chart-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.chart-content {
  padding: 24px;
}
</style>