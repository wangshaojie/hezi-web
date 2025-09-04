<script setup lang="ts">
import HomeFooter from '@/layouts/components/HomeFooter.vue'
import { ref } from 'vue'

// 本站工具
const localTools = ref([
  {
    id: 1,
    title: '小红书封面生成器',
    description: '一键生成小红书封面，小红书模板，一键生成',
    gradient: 'from-gray-400 to-gray-500',
    url: '/xiaohongshu-temp',
  },
  {
    id: 2,
    title: '图片加水印',
    description: '给图片添加水印，文字，图片，自定义水印，自定义位置',
    gradient: 'from-gray-400 to-gray-500',
    url: '/watermark',
  },
  {
    id: 3,
    title: 'PDF转图片',
    description: '将PDF文件转换为图片，支持批量转换',
    gradient: 'from-gray-400 to-gray-500',
    url: '/pdf-to-image',
  },
  {
    id: 4,
    title: '抽奖',
    description: '抽奖工具，支持抽奖，抽奖结果导出',
    gradient: 'from-gray-400 to-gray-500',
    url: '/raffle',
  },
  {
    id: 5,
    title: 'OCR识别图片文字',
    description: 'OCR识别图片文字，支持批量识别',
    gradient: 'from-gray-400 to-gray-500',
    url: '/ocr-page',
  },
  {
    id: 6,
    title: '定时提醒',
    description: '定时提醒，支持定时提醒',
    gradient: 'from-gray-400 to-gray-500',
    url: '/reminder',
  },
  {
    id: 7,
    title: '工资核算',
    description: '工资核算，支持工资核算',
    gradient: 'from-gray-400 to-gray-500',
    url: '/salary-calculation',
  },
])

const designResources = ref([
  {
    id: 1,
    title: 'Dribbble',
    description: '设计师作品展示平台，寻找灵感的好地方',
    gradient: 'from-purple-400 to-blue-500',
    url: '#',
  },
  {
    id: 2,
    title: 'Behance',
    description: 'Adobe旗下的创意作品展示平台',
    gradient: 'from-pink-400 to-red-500',
    url: '#',
  },
  {
    id: 3,
    title: 'Awwwards',
    description: '评选最佳网页设计的权威网站',
    gradient: 'from-yellow-400 to-orange-500',
    url: '#',
  },
  {
    id: 4,
    title: 'UI Movement',
    description: '每日精选UI动效设计',
    gradient: 'from-green-400 to-teal-500',
    url: '#',
  },
])

const devTools = ref([
  {
    id: 1,
    title: 'GitHub',
    description: '全球最大的代码托管平台',
    gradient: 'from-blue-400 to-indigo-500',
    url: '#',
  },
  {
    id: 2,
    title: 'CodePen',
    description: '前端开发者的游乐场',
    gradient: 'from-purple-400 to-pink-500',
    url: '#',
  },
  {
    id: 3,
    title: 'Stack Overflow',
    description: '开发者问答社区',
    gradient: 'from-yellow-400 to-amber-500',
    url: '#',
  },
])

const learningPlatforms = ref([
  {
    id: 1,
    title: 'Coursera',
    description: '世界顶尖大学在线课程',
    gradient: 'from-indigo-400 to-purple-500',
    url: '#',
  },
  {
    id: 2,
    title: 'Udemy',
    description: '海量实用技能课程',
    gradient: 'from-blue-400 to-cyan-500',
    url: '#',
  },
  {
    id: 3,
    title: 'Khan Academy',
    description: '免费优质教育资源',
    gradient: 'from-green-400 to-emerald-500',
    url: '#',
  },
])

const navigateToDetail = (item: { url: string; id: number }) => {
  if (item.url === 'detail') {
    window.open(`/detail/${item.id}`, '_blank')
  } else {
    window.open(item.url, '_blank')
  }
}
</script>

<template>
  <!-- 搜索栏 -->
  <div class="mb-8">
    <div class="relative max-w-2xl">
      <el-input
        type="text"
        placeholder="搜索优质网站..."
        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- 内容板块 -->
  <div class="space-y-12">
    <!-- 设计资源板块 -->
    <section>
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="w-2 h-6 bg-blue-500 mr-3"></span>
        设计资源
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="item in designResources"
          :key="item.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          @click="navigateToDetail(item)"
        >
          <div class="h-40 bg-gradient-to-r" :class="item.gradient"></div>
          <div class="p-5">
            <h3 class="text-xl font-semibold mb-2">{{ item.title }}</h3>
            <p class="text-gray-600 mb-4">{{ item.description }}</p>
            <a :href="item.url" class="text-blue-500 font-medium hover:underline">访问网站 →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 开发工具板块 -->
    <section>
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="w-2 h-6 bg-green-500 mr-3"></span>
        开发工具
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="item in devTools"
          :key="item.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          @click="navigateToDetail(item)"
        >
          <div class="h-40 bg-gradient-to-r" :class="item.gradient"></div>
          <div class="p-5">
            <h3 class="text-xl font-semibold mb-2">{{ item.title }}</h3>
            <p class="text-gray-600 mb-4">{{ item.description }}</p>
            <a :href="item.url" class="text-blue-500 font-medium hover:underline">访问网站 →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 学习平台板块 -->
    <section>
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="w-2 h-6 bg-red-500 mr-3"></span>
        学习平台
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="item in learningPlatforms"
          :key="item.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          @click="navigateToDetail(item)"
        >
          <div class="h-40 bg-gradient-to-r" :class="item.gradient"></div>
          <div class="p-5">
            <h3 class="text-xl font-semibold mb-2">{{ item.title }}</h3>
            <p class="text-gray-600 mb-4">{{ item.description }}</p>
            <a :href="item.url" class="text-blue-500 font-medium hover:underline">访问网站 →</a>
          </div>
        </div>
      </div>
    </section>
    <!-- 本站工具 -->
    <section>
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="w-2 h-6 bg-red-500 mr-3"></span>
        本站工具
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="item in localTools"
          :key="item.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          @click="navigateToDetail(item)"
        >
          <div class="h-40 bg-gradient-to-r" :class="item.gradient"></div>
          <div class="p-5">
            <h3 class="text-xl font-semibold mb-2">{{ item.title }}</h3>
            <p class="text-gray-600 mb-4">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- 底部 -->
  <HomeFooter />
</template>
