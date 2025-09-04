<template>
  <div class="w-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
    <!-- 主容器 -->
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <!-- 双栏布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          <!-- 插画区 -->
          <div class="hidden lg:block relative bg-gradient-to-r from-indigo-600 to-purple-700">
            <div class="absolute inset-0 flex items-center justify-center p-8">
              <div class="text-white text-center">
                <svg class="w-64 h-64 mx-auto" viewBox="0 0 200 200" fill="none">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="white"
                    stroke-width="4"
                    stroke-dasharray="15 5"
                  />
                  <path
                    d="M50 150L150 50M50 50L150 150"
                    stroke="white"
                    stroke-width="6"
                    stroke-linecap="round"
                  />
                </svg>
                <p class="mt-6 text-xl font-light opacity-90">页面迷失在数字宇宙中</p>
              </div>
            </div>
          </div>

          <!-- 内容区 -->
          <div class="p-12 flex flex-col justify-center">
            <div class="mb-8">
              <h1 class="text-7xl font-black text-gray-800 mb-4">404</h1>
              <h2 class="text-4xl font-bold text-gray-700 mb-4">页面未找到</h2>
              <p class="text-gray-500 text-lg leading-relaxed">
                您寻找的内容可能已被移至新位置或暂时不可用
              </p>
            </div>

            <div>
              <el-button
                type="primary"
                size="large"
                @click="$router.push('/')"
                class="w-full md:w-auto px-8 flex items-center justify-center"
              >
                <el-icon class="mr-2 shrink-0" style="font-size: 1.2em; vertical-align: middle">
                  <home-filled />
                </el-icon>
                返回首页
              </el-button>
              <el-button
                type="default"
                size="large"
                @click="$router.go(-1)"
                class="w-full md:w-auto px-8 flex items-center justify-center"
              >
                <el-icon class="mr-2 shrink-0" style="font-size: 1.2em; vertical-align: middle">
                  <arrow-left />
                </el-icon>
                返回上一页
              </el-button>
            </div>

            <div class="mt-12 pt-6 border-t border-gray-100">
              <p class="text-sm text-gray-400">
                遇到问题？<a
                  href="mailto:support@example.com"
                  class="text-blue-500 hover:underline ml-1"
                  >联系我们</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HomeFilled, ArrowLeft } from '@element-plus/icons-vue'
</script>
