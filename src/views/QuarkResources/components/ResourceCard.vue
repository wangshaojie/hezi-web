<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
  >
    <div class="p-6">
      <div class="flex items-start gap-4 mb-4">
        <img
          :src="resource.logo"
          :alt="resource.name"
          class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
        <div>
          <h3 class="font-bold text-lg mb-1">{{ resource.name }}</h3>
          <div class="flex items-center gap-1 text-amber-500 mb-1">
            <i class="fa-solid fa-star text-sm"></i>
            <span class="text-sm font-medium">{{ resource.rating }}</span>
          </div>
        </div>
      </div>

      <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {{ resource.description }}
      </p>

      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in resource.tags"
          :key="tag"
          class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
        >
          {{ tag }}
        </span>
      </div>

      <a
        :href="resource.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm transition-colors"
      >
        <span>访问网站</span>
        <i class="fa-solid fa-arrow-right text-xs"></i>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

// 资源类型定义 - 移除了categoryId
interface Resource {
  id: number
  name: string
  description: string
  url: string
  rating: number
  logo: string
  tags: string[]
}

const props = defineProps<{
  resource: Resource
}>()
</script>

<style scoped>
/* 组件样式已通过Tailwind实现 */
</style>
