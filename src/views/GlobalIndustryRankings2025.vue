<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
    <!-- 顶部导航栏 -->
    <header
      class="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 transition-all duration-300"
    >
      <div
        class="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2"
      >
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fa fa-bar-chart text-blue-600"></i>
          <span>全球各行业2025年11月排名前10数据展示</span>
        </h1>
        <div class="flex items-center space-x-2 text-sm">
          <span class="text-gray-500">数据更新:</span>
          <span class="font-medium text-blue-600">2025.10.29</span>
        </div>
      </div>
    </header>

    <!-- 主内容区：左侧悬浮菜单 + 右侧行业卡片 -->
    <main class="flex-grow container mx-auto px-4 py-8 relative">
      <!-- 左侧悬浮行业菜单 - 仅在中等屏幕及以上显示 -->
      <div class="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-40 w-48">
        <div class="bg-white rounded-xl shadow-md p-3 overflow-y-auto max-h-[80vh] scrollbar-hide">
          <h3 class="text-sm font-semibold text-gray-700 mb-2 px-2 flex items-center gap-1">
            <i class="fa fa-list-ul text-blue-500"></i>
            行业导航
          </h3>
          <ul class="space-y-1">
            <li v-for="industry in industries" :key="industry.id" :id="`menu-item-${industry.id}`">
              <button
                @click="scrollToIndustry(industry.id)"
                class="w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors duration-150 flex items-center gap-2"
                :class="
                  activeIndustryId === industry.id
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'hover:bg-gray-100 text-gray-600'
                "
              >
                <i class="fa fa-angle-right text-xs"></i>
                <span class="truncate">{{ industry.industry }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- 右侧行业卡片网格布局 - 每行2个，中等屏幕及以上添加左侧间距 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:ml-15">
        <!-- 每个行业一个卡片 - 添加ID用于定位 -->
        <div
          v-for="industry in industries"
          :key="industry.id"
          :id="`industry-card-${industry.id}`"
          :class="activeIndustryId === industry.id ? 'active-card' : ''"
          class="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 scroll-mt-24"
        >
          <!-- 卡片标题栏 -->
          <div
            class="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center"
          >
            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <i class="fa fa-industry text-blue-500"></i>
              {{ industry.name }}
            </h2>
            <div class="text-sm text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
              {{ industry.data.length }} 条记录
            </div>
          </div>

          <!-- 表格内容 -->
          <div class="p-1">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50">
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                  >
                    排名
                  </th>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    名称
                  </th>
                  <!-- 动态列：根据行业数据类型显示 -->
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ industry.valueLabel }}
                  </th>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                  >
                    国家/地区
                  </th>
                  <!-- 额外字段列 -->
                  <template v-for="field in industry.extraFields" :key="field.key">
                    <th
                      class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {{ field.label }}
                    </th>
                  </template>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="(item, idx) in industry.data"
                  :key="item.rank"
                  class="hover:bg-blue-50/50 transition-colors duration-150"
                  :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'"
                >
                  <td class="px-3 py-2.5 whitespace-nowrap">
                    <div class="flex items-center">
                      <span class="font-medium text-gray-900 flex items-center gap-1">
                        <span
                          class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white"
                          :class="item.rank <= 3 ? 'bg-yellow-500' : 'bg-gray-200 text-gray-700'"
                        >
                          {{ item.rank }}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td class="px-3 py-2.5">
                    <div
                      class="text-gray-900 truncate max-w-[120px] md:max-w-[180px]"
                      :title="item.company"
                    >
                      {{ item.company }}
                    </div>
                  </td>
                  <!-- 动态值显示 -->
                  <td class="px-3 py-2.5 whitespace-nowrap">
                    <div class="font-medium text-blue-600">
                      {{ item[industry.valueKey] }}
                    </div>
                  </td>
                  <td class="px-3 py-2.5 whitespace-nowrap">
                    <div class="text-gray-700 flex items-center gap-1">
                      <i :class="item.icon"></i>
                      {{ item.country }}
                    </div>
                  </td>
                  <!-- 额外字段显示 -->
                  <template v-for="field in industry.extraFields" :key="field.key">
                    <td class="px-3 py-2.5 whitespace-nowrap">
                      <div class="text-gray-700 text-xs md:text-sm">
                        {{ item[field.key] }}
                      </div>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 卡片底部 -->
          <div
            class="px-5 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100 flex justify-between"
          >
            <span>数据来源：全球行业研究中心</span>
            <a
              class="text-blue-500 cursor-pointer hover:underline"
              :href="industry.source_url"
              target="_blank"
              >查看详情 →</a
            >
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-white border-t border-gray-200 py-6 mt-12">
      <div class="container mx-auto px-4 md:ml-56">
        <p class="text-center text-sm text-gray-500">
          <i class="fa fa-copyright mr-1"></i>全球行业排名数据平台 2025 | 保留所有权利
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { industriesData } from '@/data/GlobalIndustryRankings2025'
import 'flag-icons/css/flag-icons.min.css'
import { ref, onMounted, watch } from 'vue'

// 定义数据类型
interface ExtraField {
  key: string
  label: string
}

interface Industry {
  id: string
  name: string
  industry: string
  valueKey: string
  valueLabel: string
  extraFields?: ExtraField[]
  source_url: string
  data: Array<{
    rank: number
    company: string
    country: string
    icon: string
    [key: string]: string | number // 支持动态字段
  }>
}

// 行业数据注册中心
const industries = industriesData as Industry[]
// 当前激活的行业ID（用于菜单高亮）
const activeIndustryId = ref<string>(industries[0]?.id || '')

// 滚动到指定行业卡片
const scrollToIndustry = (industryId: string) => {
  const targetElement = document.getElementById(`industry-card-${industryId}`)
  if (targetElement) {
    // 平滑滚动到目标元素，顶部留出导航栏高度的间距
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    // 更新激活的行业ID
    activeIndustryId.value = industryId
  }
}

// 监听滚动事件，更新当前激活的行业菜单
const updateActiveIndustryOnScroll = () => {
  const scrollPosition = window.scrollY + 100 // 偏移量，提前高亮

  // 遍历所有行业卡片，判断当前视口内的卡片
  industries.forEach((industry) => {
    const cardElement = document.getElementById(`industry-card-${industry.id}`)
    if (cardElement) {
      const cardTop = cardElement.offsetTop
      const cardBottom = cardTop + cardElement.offsetHeight

      // 如果滚动位置在卡片范围内，设置为激活状态
      if (scrollPosition >= cardTop && scrollPosition < cardBottom) {
        activeIndustryId.value = industry.id
      }
    }
  })
}

// 组件挂载后添加滚动监听
onMounted(() => {
  // 初始化激活第一个行业
  if (industries.length > 0) {
    activeIndustryId.value = industries[0].id
  }
  // 添加滚动事件监听
  window.addEventListener('scroll', updateActiveIndustryOnScroll)

  // 组件卸载时移除监听
  return () => {
    window.removeEventListener('scroll', updateActiveIndustryOnScroll)
  }
})

// 监听激活行业ID变化，同步更新菜单高亮
watch(activeIndustryId, (newId) => {
  const menuItems = document.querySelectorAll('[id^="menu-item-"]')
  menuItems.forEach((item) => {
    // 重置所有菜单项样式（仅保留样式更新，删除滚动相关代码）
    const button = item.querySelector('button')
    if (button) {
      button.classList.remove('bg-blue-100', 'text-blue-700', 'font-medium')
      button.classList.add('hover:bg-gray-100', 'text-gray-600')
    }
  })

  const activeMenuItem = document.getElementById(`menu-item-${newId}`)
  if (activeMenuItem) {
    const button = activeMenuItem.querySelector('button')
    if (button) {
      // 仅保留激活项样式更新，完全删除菜单容器滚动代码
      button.classList.remove('hover:bg-gray-100', 'text-gray-600')
      button.classList.add('bg-blue-100', 'text-blue-700', 'font-medium')
    }
  }
})
</script>

<style scoped>
/* 全局样式优化 */
* {
  box-sizing: border-box;
}

/* 表格样式优化 */
table {
  border-collapse: separate;
  border-spacing: 0;
}

/* 排名徽章样式 */
tbody tr td:first-child span {
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
}

/* --------------- 核心修改：左侧悬浮窗细滚动条样式 --------------- */
/* 针对左侧菜单容器的滚动条样式（webkit浏览器） */
.scrollbar-hide::-webkit-scrollbar {
  width: 3px; /* 滚动条宽度：细款设计 */
  height: 3px;
}
/* 滚动条轨道：浅灰色背景，低存在感 */
.scrollbar-hide::-webkit-scrollbar-track {
  background: rgba(243, 244, 246, 0.5); /* 与卡片背景色接近 */
  border-radius: 2px; /* 圆角过渡，更精致 */
}
/* 滚动条滑块：蓝色系渐变，hover时加深 */
.scrollbar-hide::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.4));
  border-radius: 2px; /* 滑块圆角，与轨道呼应 */
  transition: background 0.2s ease;
}
/* 滑块hover效果：加深透明度，保持风格统一 */
.scrollbar-hide::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.5));
}
/* 火狐浏览器兼容：细滚动条 + 半透明效果 */
.scrollbar-hide {
  scrollbar-width: thin; /* 细滚动条 */
  scrollbar-color: rgba(59, 130, 246, 0.4) rgba(243, 244, 246, 0.5); /* 滑块色 + 轨道色 */
}
/* ------------------------------------------------------------- */

/* 响应式调整 */
@media (max-width: 768px) {
  th,
  td {
    padding: 0.4rem 0.3rem !important;
  }

  .text-lg {
    font-size: 1rem;
  }

  td:nth-child(2) div {
    max-width: 100px;
  }
}

/* 动画效果 */
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

.bg-white.rounded-xl {
  animation: fadeIn 0.5s ease-out forwards;
}

.bg-white.rounded-xl:nth-child(2n) {
  animation-delay: 0.1s;
}

.bg-white.rounded-xl:nth-child(2n + 1) {
  animation-delay: 0.2s;
}

.active-card {
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* 行业菜单悬停效果增强 */
ul li button:hover i {
  transform: translateX(2px);
  transition: transform 0.15s ease;
}
</style>
