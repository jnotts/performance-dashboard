<template>
  <header class="dashboard-header">
    <div class="header-content">
      <h1 class="title">Training Performance Dashboard</h1>
      <div class="header-actions">
        <!-- Future: Add date filters, department selector, etc. -->
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Header component logic will go here
</script>

<style scoped>
.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}
</style>