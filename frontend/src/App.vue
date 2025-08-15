<template>
  <div id="app">
    <DashboardHeader />
    <main class="main-content">
      <DashboardLayout />
    </main>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from './components/DashboardHeader.vue'
import DashboardLayout from './components/DashboardLayout.vue'
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 24px;
}
</style>