<template>
  <div
    class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100"
  >
    <!-- 导航栏 -->
    <header
      class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 transition-all duration-300"
    >
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-quote-right text-2xl text-indigo-600 dark:text-indigo-400"></i>
          <h1 class="text-xl font-bold tracking-tight">夸克资源精选</h1>
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="toggleTheme"
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="切换主题"
          >
            <i class="fa-solid" :class="isDarkMode ? 'fa-sun' : 'fa-moon'"></i>
          </button>
          <button
            class="hidden md:flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <i class="fa-solid fa-download"></i>
            <span>获取夸克</span>
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <!-- 英雄区域 -->
      <section class="mb-16 text-center max-w-3xl mx-auto">
        <h2
          class="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
        >
          发现优质夸克资源
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          精选各类实用、高效的夸克相关资源网站，助力你更好地使用夸克浏览器，提升工作与学习效率
        </p>
        <div class="relative max-w-md mx-auto">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索资源..."
            class="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </section>

      <!-- 资源卡片网格 -->
      <section class="mb-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ResourceCard
            v-for="resource in filteredResources"
            :key="resource.id"
            :resource="resource"
          />
        </div>

        <!-- 空状态 -->
        <div v-if="filteredResources.length === 0" class="text-center py-16">
          <i class="fa-solid fa-search fa-3x text-gray-400 mb-4"></i>
          <p class="text-gray-500 dark:text-gray-400">未找到匹配的资源，请尝试其他搜索词</p>
        </div>
      </section>

      <!-- 推荐理由 -->
      <section class="mb-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h3 class="text-2xl font-bold mb-6 text-center">为什么选择这些夸克资源？</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4">
            <div
              class="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="fa-solid fa-check-circle text-2xl text-indigo-600 dark:text-indigo-400"></i>
            </div>
            <h4 class="font-semibold mb-2">精选优质</h4>
            <p class="text-gray-600 dark:text-gray-300">
              经过严格筛选，确保每一个资源都具有实用价值
            </p>
          </div>
          <div class="text-center p-4">
            <div
              class="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="fa-solid fa-bolt text-2xl text-green-600 dark:text-green-400"></i>
            </div>
            <h4 class="font-semibold mb-2">高效实用</h4>
            <p class="text-gray-600 dark:text-gray-300">提升夸克使用体验，让工作学习更有效率</p>
          </div>
          <div class="text-center p-4">
            <div
              class="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="fa-solid fa-sync text-2xl text-purple-600 dark:text-purple-400"></i>
            </div>
            <h4 class="font-semibold mb-2">持续更新</h4>
            <p class="text-gray-600 dark:text-gray-300">定期更新资源库，保持内容的新鲜与实用</p>
          </div>
        </div>
      </section>

      <!-- 订阅区域 -->
      <section
        class="mb-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white"
      >
        <div class="max-w-2xl mx-auto text-center">
          <h3 class="text-2xl font-bold mb-4">获取最新夸克资源更新</h3>
          <p class="mb-6 opacity-90">订阅我们的通讯，第一时间获取新的优质夸克资源推荐</p>
          <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="输入你的邮箱"
              class="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              class="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              订阅
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center gap-2 mb-4 md:mb-0">
            <i class="fa-solid fa-quote-right text-xl text-indigo-600 dark:text-indigo-400"></i>
            <span class="font-bold">夸克资源精选</span>
          </div>
          <div class="flex gap-6 mb-4 md:mb-0">
            <a
              href="#"
              class="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              <i class="fa-solid fa-github text-xl"></i>
            </a>
            <a
              href="#"
              class="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              <i class="fa-solid fa-twitter text-xl"></i>
            </a>
            <a
              href="#"
              class="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              <i class="fa-solid fa-envelope text-xl"></i>
            </a>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            &copy; {{ new Date().getFullYear() }} 夸克资源精选. 保留所有权利.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import ResourceCard from './components/ResourceCard.vue'

// 类型定义
interface Resource {
  id: number
  name: string
  description: string
  url: string
  rating: number
  logo: string
  tags: string[]
}

// 状态管理
const searchQuery = ref('')
const isDarkMode = ref(false)

// 主题切换
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

// 初始化主题
watchEffect(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDarkMode.value = prefersDark
  document.documentElement.classList.toggle('dark', prefersDark)
})

// 资源数据 - 移除了categoryId字段，更简洁
const resources: Resource[] = [
  {
    id: 1,
    name: '夸克精选插件库',
    description: '收集了各类适配夸克浏览器的优质插件，提升浏览器功能与效率',
    url: 'https://example.com/quark-plugins',
    rating: 4.8,
    logo: 'https://picsum.photos/id/1/40/40',
    tags: ['插件', '工具', '效率'],
  },
  {
    id: 2,
    name: '夸克云盘资源站',
    description: '分享精选夸克云盘资源链接，涵盖学习、工作、娱乐等多个领域',
    url: 'https://example.com/quark-cloud',
    rating: 4.6,
    logo: 'https://picsum.photos/id/2/40/40',
    tags: ['云盘', '资源', '分享'],
  },
  {
    id: 3,
    name: '夸克学习资料库',
    description: '整理各类优质学习资料，支持夸克直接打开与保存，学习更便捷',
    url: 'https://example.com/quark-study',
    rating: 4.9,
    logo: 'https://picsum.photos/id/3/40/40',
    tags: ['学习', '资料', '教育'],
  },
  {
    id: 4,
    name: '夸克效率工具箱',
    description: '集成多种实用工具，通过夸克快速访问，提升日常工作效率',
    url: 'https://example.com/quark-tools',
    rating: 4.5,
    logo: 'https://picsum.photos/id/4/40/40',
    tags: ['工具', '效率', '工作'],
  },
  {
    id: 5,
    name: '夸克影视资源站',
    description: '精选高清影视资源，适配夸克播放，提供优质观影体验',
    url: 'https://example.com/quark-movies',
    rating: 4.7,
    logo: 'https://picsum.photos/id/5/40/40',
    tags: ['影视', '娱乐', '视频'],
  },
  {
    id: 6,
    name: '夸克书签同步助手',
    description: '帮助你在多设备间同步夸克书签，支持导出与导入功能',
    url: 'https://example.com/quark-bookmarks',
    rating: 4.4,
    logo: 'https://picsum.photos/id/6/40/40',
    tags: ['工具', '同步', '书签'],
  },
]

// 筛选资源 - 仅保留搜索功能
const filteredResources = computed<Resource[]>(() => {
  if (!searchQuery.value.trim()) return resources

  const query = searchQuery.value.toLowerCase()
  return resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(query)),
  )
})
</script>

<style scoped>
/* 全局样式已通过Tailwind实现 */
</style>
