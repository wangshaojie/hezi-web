<template>
  <HomeNav />
  <main class="ml-64 flex-1 p-5 bg-gray-50">
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import HomeNav from './components/HomeNav.vue'
</script>
