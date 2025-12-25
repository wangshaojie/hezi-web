<template>
  <div
    class="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center text-white overflow-hidden"
  >
    <!-- 装饰性背景元素 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
      <!-- 欢迎标题（带动画） -->
      <h1
        class="text-[clamp(2.5rem,8vw,5rem)] font-bold mb-6 tracking-tight animate-fade-in"
        :style="{ animationDelay: '0.2s' }"
      >
        欢迎来到我的首页
      </h1>

      <!-- 副标题 -->
      <p
        class="text-[clamp(1rem,3vw,1.25rem)] text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in"
        :style="{ animationDelay: '0.4s' }"
      >
        探索无限可能，开启全新体验。我致力于为大家提供最好的服务和最棒的体验。
      </p>

      <!-- 操作按钮组 -->
      <div
        class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
        :style="{ animationDelay: '0.6s' }"
      >
        <button
          class="px-8 py-3 bg-white text-indigo-600 rounded-full font-medium hover:bg-white/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
          @click="handleGetStarted"
        >
          立即开始
        </button>
        <button
          class="px-8 py-3 bg-transparent border border-white/80 text-white rounded-full font-medium hover:bg-white/10 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
          @click="handleLearnMore"
        >
          了解更多
        </button>
      </div>
    </div>

    <!-- 底部信息 -->
    <footer
      class="absolute bottom-6 text-white/70 text-sm animate-fade-in"
      :style="{ animationDelay: '0.8s' }"
    >
      <p>© 2025 小王的助手 · 所有权利保留</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 按钮点击事件处理
const handleGetStarted = () => {
  // 这里可以添加跳转逻辑
  alert('开始探索之旅！')
}

const handleLearnMore = () => {
  // 这里可以添加跳转逻辑
  alert('了解更多关于我们的信息！')
}
</script>

<style scoped>
/* 自定义淡入动画 */
.animate-fade-in {
  animation: fadeIn 0.8s ease forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
