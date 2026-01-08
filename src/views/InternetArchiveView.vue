<template>
  <LocalToolsDetailComp
    :title="'互联网档案馆'"
    subtitle="互联网历史存档与资源库"
    :showSecurityBanner="false"
  >
    <div
      class="w-full min-h-[80vh] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-start pt-8 pb-8 px-4"
    >
      <!-- 页面标题 -->
      <h1
        class="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-slate-800 dark:text-white mb-8 text-center"
      >
        网站历史快照查询
      </h1>

      <!-- 搜索区域 -->
      <div class="w-full max-w-2xl transition-all duration-500 ease-in-out mb-8">
        <div class="space-y-4">
          <div class="relative">
            <input
              v-model="url"
              type="text"
              placeholder="输入网址（如：www.baidu.com）"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 shadow-sm"
            />
          </div>
          <div class="relative">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >选择时间戳（默认：2006-01-01）</label
            >
            <input
              v-model="dateInput"
              type="date"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-all duration-300 shadow-sm"
            />
          </div>
          <div class="relative">
            <button
              @click="searchSnapshot"
              class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              :disabled="!url || loading"
            >
              <span v-if="!loading">查询</span>
              <span v-else class="flex items-center justify-center gap-1">
                <svg
                  class="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                加载中
              </span>
            </button>
          </div>
        </div>
        <div
          class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg"
        >
          <p class="text-sm text-yellow-800 dark:text-yellow-300">
            <strong>提示：</strong>
            数据来源为国外网络档案馆，国内部分网站可能没有快照。若查询无结果，请尝试切换月份，或确保网站成立日期早于查询日期。
          </p>
        </div>
        <p v-if="error" class="mt-2 text-sm text-red-500 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- 结果展示区域 -->
      <div v-show="hasResults" class="w-full max-w-6xl animate-fadeIn">
        <!-- 快照信息 -->
        <div
          class="mb-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
        >
          <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">快照信息</h3>
          <div
            v-if="snapshotData.archived_snapshots && snapshotData.archived_snapshots.closest"
            class="space-y-4"
          >
            <div class="flex flex-col space-y-2">
              <span class="text-sm text-slate-500 dark:text-slate-400">可用快照:</span>
              <span class="text-slate-700 dark:text-slate-200">
                {{ snapshotData.archived_snapshots.closest.available ? '是' : '否' }}
              </span>
            </div>
            <div class="flex flex-col space-y-2">
              <span class="text-sm text-slate-500 dark:text-slate-400">快照时间:</span>
              <span class="text-slate-700 dark:text-slate-200">
                {{ new Date(snapshotData.archived_snapshots.closest.timestamp).toLocaleString() }}
              </span>
            </div>
            <div class="flex flex-col space-y-2">
              <span class="text-sm text-slate-500 dark:text-slate-400">快照URL:</span>
              <a
                :href="snapshotData.archived_snapshots.closest.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                {{ snapshotData.archived_snapshots.closest.url }}
              </a>
            </div>
          </div>
        </div>

        <!-- 页面内容展示 -->
        <div
          class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 relative"
        >
          <div
            class="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50"
          >
            <h3 class="text-lg font-semibold text-slate-800 dark:text-white">快照页面内容</h3>
          </div>
          <div class="p-4 h-[50vh] overflow-auto" style="overflow-y: auto; overflow-x: hidden">
            <div
              v-if="iframeLoading"
              class="absolute inset-0 bg-white dark:bg-slate-800 flex items-center justify-center z-10"
            >
              <div class="text-center">
                <div
                  class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
                ></div>
                <p class="text-slate-700 dark:text-slate-300">加载快照中...</p>
              </div>
            </div>
            <iframe
              v-if="snapshotData.archived_snapshots && snapshotData.archived_snapshots.closest"
              :key="snapshotData.archived_snapshots.closest.url"
              :src="snapshotData.archived_snapshots.closest.url"
              class="w-full h-full border-none"
              title="快照页面"
              @load="iframeLoading = false"
            ></iframe>
            <div
              v-else
              class="flex items-center justify-center h-full text-slate-500 dark:text-slate-400"
            >
              未找到快照页面
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!hasResults && searched" class="w-full max-w-2xl text-center py-12">
        <div class="text-slate-400 dark:text-slate-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <p class="text-slate-600 dark:text-slate-300">未查询到该网站的快照数据</p>
      </div>
    </div>
  </LocalToolsDetailComp>
</template>

<script setup lang="ts">
import LocalToolsDetailComp from '@/components/LocalToolsDetailComp.vue'
import { ref, type Ref } from 'vue'

// 定义数据类型
interface SnapshotData {
  archived_snapshots?: {
    closest?: {
      available: boolean
      url: string
      timestamp: string
      status: string
    }
  }
}

// 响应式数据
const url: Ref<string> = ref('')
const dateInput: Ref<string> = ref('')
const loading: Ref<boolean> = ref(false)
const iframeLoading: Ref<boolean> = ref(true)
const error: Ref<string> = ref('')
const searched: Ref<boolean> = ref(false)
const hasResults: Ref<boolean> = ref(false)
const snapshotData: Ref<SnapshotData> = ref({})

// 搜索快照
const searchSnapshot = async () => {
  // 重置状态
  error.value = ''
  loading.value = true
  iframeLoading.value = true
  searched.value = true
  hasResults.value = false
  snapshotData.value = {}

  try {
    // 简单的URL验证
    if (!url.value.trim()) {
      error.value = '请输入有效的网址'
      return
    }

    // 处理时间戳
    let timestamp = '20060101' // 默认值
    if (dateInput.value) {
      const date = new Date(dateInput.value)
      timestamp = date.toISOString().slice(0, 10).replace(/-/g, '')
    }

    // 调用接口获取数据
    const apiUrl = 'https://archive.org/wayback/available'
    const params = new URLSearchParams({
      url: url.value,
      timestamp: timestamp,
    })

    const response = await fetch(`${apiUrl}?${params}`)

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    // Convert HTTP URLs to HTTPS
    if (data.archived_snapshots?.closest?.url) {
      data.archived_snapshots.closest.url = data.archived_snapshots.closest.url.replace(
        /^http:/,
        'https:',
      )
    }
    snapshotData.value = data

    // 检查是否有数据
    if (data.archived_snapshots && data.archived_snapshots.closest) {
      hasResults.value = true
    } else {
      hasResults.value = false
    }
  } catch (err) {
    error.value = '查询失败，请稍后重试'
    console.error('查询快照失败:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 自定义动画 */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
