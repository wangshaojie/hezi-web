<template>
  <div
    class=" bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300">
    <!-- 导航栏 -->
    <header
      class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm transition-all duration-300">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fas fa-globe text-2xl text-blue-600 dark:text-blue-400"></i>
          <h1
            class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            WebCollection</h1>
        </div>

        <div class="flex items-center gap-4">
          <!-- 搜索框 -->
          <div class="relative hidden md:block">
            <input v-model="searchQuery" type="text" placeholder="搜索应用或网站..."
              class="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all duration-300">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>

          <!-- 移动端搜索按钮 -->
          <button class="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click="showMobileSearch = !showMobileSearch">
            <i class="fas fa-search"></i>
          </button>

          <!-- 主题切换 -->
          <button class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click="toggleTheme">
            <i class="fas" :class="isDarkMode ? 'fa-sun' : 'fa-moon'"></i>
          </button>
        </div>
      </div>

      <!-- 移动端搜索框 -->
      <div v-if="showMobileSearch" class="md:hidden px-4 pb-3">
        <input v-model="searchQuery" type="text" placeholder="搜索应用或网站..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">
        <i class="fas fa-search absolute left-7 top-[3.8rem] text-gray-400"></i>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <!-- 分类标签 -->
      <div class="mb-8 overflow-x-auto pb-2">
        <div class="flex gap-2 min-w-max">
          <button @click="activeCategory = 'all'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300" :class="activeCategory === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200/50 dark:shadow-blue-900/30'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm'">
            全部
          </button>
          <button @click="activeCategory = 'tools'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300" :class="activeCategory === 'tools'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200/50 dark:shadow-blue-900/30'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm'">
            工具类
          </button>
          <button @click="activeCategory = 'design'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300" :class="activeCategory === 'design'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200/50 dark:shadow-blue-900/30'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm'">
            设计类
          </button>
          <button @click="activeCategory = 'development'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300" :class="activeCategory === 'development'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200/50 dark:shadow-blue-900/30'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm'">
            开发类
          </button>
          <button @click="activeCategory = 'productivity'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300" :class="activeCategory === 'productivity'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200/50 dark:shadow-blue-900/30'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm'">
            生产力
          </button>
          <button @click="activeCategory = 'mine'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300" :class="activeCategory === 'mine'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200/50 dark:shadow-indigo-900/30'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm'">
            我的应用
          </button>
        </div>
      </div>

      <!-- 内容标题 -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold">
          {{ activeCategory === 'all' ? '所有应用与网站' :
            activeCategory === 'mine' ? '我的Web应用' :
              categoryNames[activeCategory] }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ activeCategory === 'all' ? '探索所有实用工具和应用' :
            activeCategory === 'mine' ? '我开发的Web应用集合' :
              categoryDescriptions[activeCategory] }}
        </p>
      </div>

      <!-- 应用卡片网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- 过滤后的应用 -->
        <template v-for="item in filteredItems" :key="item.id">
          <button @click="openInNewWindow(item.url)" class="group w-full">
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col transform hover:-translate-y-1">
              <!-- 应用图标 -->
              <div class="p-6 flex justify-center">
                <div class="w-16 h-16 rounded-full flex items-center justify-center" :class="item.category === 'mine'
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                  : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'">
                  <i class="fas text-2xl" :class="item.icon"></i>
                </div>
              </div>

              <!-- 应用信息 -->
              <div class="p-4 pb-6 flex-grow flex flex-col">
                <div class="flex justify-between items-start mb-2">
                  <h3
                    class="font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {{ item.name }}
                  </h3>
                  <span class="text-xs px-2 py-1 rounded-full" :class="item.category === 'mine'
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                    : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'">
                    {{ item.category === 'mine' ? '我的应用' : categoryLabels[item.category] }}
                  </span>
                </div>

                <p class="text-gray-500 dark:text-gray-400 text-sm mb-4 flex-grow">
                  {{ item.description }}
                </p>

                <!-- 访问按钮 -->
                <div class="mt-auto pt-2">
                  <span
                    class="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                    访问网站
                    <i class="fas fa-arrow-right ml-1 transform group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </div>
              </div>
            </div>
          </button>
        </template>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <i class="fas fa-search text-4xl text-gray-400"></i>
        </div>
        <h3 class="text-xl font-bold mb-2">未找到匹配项</h3>
        <p class="text-gray-500 dark:text-gray-400 max-w-md">
          尝试使用不同的搜索词或浏览其他分类，以找到您需要的应用或网站。
        </p>
        <button @click="resetFilters"
          class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
          查看所有内容
        </button>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-white dark:bg-gray-900 shadow-inner mt-16 py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center gap-2 mb-4 md:mb-0">
            <i class="fas fa-globe text-xl text-blue-600 dark:text-blue-400"></i>
            <span class="font-bold">WebCollection</span>
          </div>

          <div class="text-sm text-gray-500 dark:text-gray-400">
            &copy; {{ new Date().getFullYear() }} WebCollection. 收集实用网站与应用。
          </div>

          <div class="flex gap-4 mt-4 md:mt-0">
            <a href="#" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <i class="fas fa-github"></i>
            </a>
            <a href="#" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <i class="fas fa-twitter"></i>
            </a>
            <a href="#" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <i class="fas fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 路由实例
const router = useRouter()

// 类型定义
type CategoryType = 'all' | 'tools' | 'design' | 'development' | 'productivity' | 'mine'

// 状态管理
const searchQuery = ref('')
const activeCategory = ref<CategoryType>('all')
const showMobileSearch = ref(false)

// 应用数据类型
interface AppItem {
  id: number
  name: string
  description: string
  url: string
  category: CategoryType
  icon: string
}

// 应用数据
const items = ref<AppItem[]>([
  // 工具类
  {
    id: 1,
    name: '在线截图工具',
    description: '快速截取屏幕内容并进行标注和分享',
    url: 'https://shoteasy.fun/zh-cn/take-a-screenshot/',
    category: 'tools',
    icon: 'fa-crop'
  },
  {
    id: 2,
    name: 'PDF转换器',
    description: '在线转换PDF与其他格式文件，支持批量处理',
    url: 'https://tools.pdf24.org/zh/all-tools',
    category: 'tools',
    icon: 'fa-file-pdf'
  },
  {
    id: 3,
    name: '密码生成器',
    description: '创建高强度随机密码，保障账户安全',
    url: 'https://www.avast.com/zh-cn/random-password-generator#pc',
    category: 'tools',
    icon: 'fa-key'
  },

  // 设计类
  {
    id: 4,
    name: '配色方案工具',
    description: '生成和谐的色彩组合，适用于设计和开发',
    url: 'https://coolors.co/palettes/trending',
    category: 'design',
    icon: 'fa-palette'
  },
  {
    id: 5,
    name: '图标库',
    description: '海量免费矢量图标，可直接下载使用',
    url: 'https://www.flaticon.com/',
    category: 'design',
    icon: 'fa-icons'
  },
  {
    id: 6,
    name: '原型设计工具',
    description: '快速创建交互式UI原型，用于产品演示',
    url: 'https://wireframe.cc/',
    category: 'design',
    icon: 'fa-pen-tool'
  },

  // 开发类
  {
    id: 7,
    name: '代码在线运行',
    description: '支持多种编程语言的在线代码编辑和运行',
    url: '/code-runner',
    category: 'development',
    icon: 'fa-code'
  },

  // 生产力
  {
    id: 11,
    name: '在线Markdown',
    description: '创建和管理笔记，支持富文本和Markdown',
    url: 'https://markdown-editor.github.io/',
    category: 'productivity',
    icon: 'fa-sticky-note'
  },
  // 我的应用
  {
    id: 14,
    name: '我的设备',
    description: '',
    url: '/my-device',
    category: 'mine',
    icon: 'fa-bookmark'
  },
  {
    id: 15,
    name: '数据可视化工具',
    description: '将数据转换为直观的图表和图形',
    url: '/data-visualization',
    category: 'mine',
    icon: 'fa-chart-line'
  },

  // 本地工具
  {
    id: 16,
    name: '小红书封面生成器',
    description: '一键生成小红书封面，小红书模板，一键生成',
    url: '/xiaohongshu-temp',
    category: 'mine',
    icon: 'fa-image'
  },
  {
    id: 17,
    name: '图片加水印',
    description: '给图片添加水印，文字，图片，自定义水印，自定义位置',
    url: '/watermark',
    category: 'mine',
    icon: 'fa-stamp'
  },
  {
    id: 18,
    name: 'PDF转图片',
    description: '将PDF文件转换为图片，支持批量转换',
    url: '/pdf-to-image',
    category: 'mine',
    icon: 'fa-file-image'
  },
  {
    id: 19,
    name: '抽奖',
    description: '抽奖工具，支持抽奖，抽奖结果导出',
    url: '/raffle',
    category: 'mine',
    icon: 'fa-gift'
  },
  {
    id: 20,
    name: 'OCR识别图片文字',
    description: 'OCR识别图片文字，支持批量识别',
    url: '/ocr-page',
    category: 'mine',
    icon: 'fa-font'
  },
  {
    id: 21,
    name: '定时提醒',
    description: '定时提醒，支持定时提醒',
    url: '/reminder',
    category: 'mine',
    icon: 'fa-bell'
  },
  {
    id: 22,
    name: '工资核算',
    description: '工资核算，支持工资核算',
    url: '/salary-calculation',
    category: 'mine',
    icon: 'fa-calculator'
  },
  {
    id: 23,
    name: '爱情计算器',
    description: '爱情计算器，支持爱情计算',
    url: '/love-page',
    category: 'mine',
    icon: 'fa-heart'
  },
  {
    id: 24,
    name: '国家统计局数据可视化',
    description: '国家统计局数据可视化，支持国家统计局数据可视化',
    url: '/national-statistics',
    category: 'mine',
    icon: 'fa-chart-line'
  }
])

// 分类配置
const categoryNames = {
  tools: '工具类网站',
  design: '设计资源',
  development: '开发工具',
  productivity: '生产力应用',
  mine: '我的Web应用'
}

const categoryLabels = {
  all: "全部",
  tools: '工具',
  design: '设计',
  development: '开发',
  productivity: '生产力'
}

const categoryDescriptions = {
  tools: '各种实用工具，帮助解决日常问题',
  design: '设计相关资源和工具，提升创意工作效率',
  development: '程序员常用开发工具和资源',
  productivity: '提高工作和学习效率的应用'
}

// 过滤显示的项目
const filteredItems = computed(() => {
  return items.value.filter(item => {
    // 分类过滤
    const categoryMatch = activeCategory.value === 'all' || item.category === activeCategory.value

    // 搜索过滤
    const searchMatch = searchQuery.value === '' ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    return categoryMatch && searchMatch
  })
})

// 深色模式状态
const isDarkMode = computed(() => {
  return document.documentElement.classList.contains('dark')
})

// 打开新窗口的方法
const openInNewWindow = (path: string) => {
  // 如果是http开头的URL，直接打开外部链接
  if (path.startsWith('http')) {
    window.open(path, '_blank')
  } else {
    // 生成完整URL
    const fullPath = window.location.origin + router.resolve(path).href
    // 在新窗口打开
    window.open(fullPath, '_blank')
  }
}

// 切换主题模式
const toggleTheme = () => {
  document.documentElement.classList.toggle('dark')
}

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = ''
  activeCategory.value = 'all'
}

// 检查用户偏好的主题
onMounted(() => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark')
  }
})
</script>

<style>
@layer base {
  html {
    scroll-behavior: smooth;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
