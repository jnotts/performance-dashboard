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
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
}

.stats-title {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stats-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}
</style>