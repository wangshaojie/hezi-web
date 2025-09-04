<template>
  <nav class="w-64 bg-white shadow-md p-4 fixed h-full">
    <div class="flex justify-between items-center">
      <div class="text-2xl font-bold text-gray-800 mb-8">优质导航</div>
      <router-link to="/" class="text-blue-500 hover:text-blue-700 text-sm font-medium">
        返回首页
      </router-link>
    </div>
    <ul class="space-y-3">
      <li>
        <a href="#" class="block px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium"
          >设计资源</a
        >
      </li>
      <li>
        <a href="#" class="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">开发工具</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">学习平台</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">效率工具</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">创意灵感</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">新闻资讯</a>
      </li>
    </ul>
    <div class="mt-8 pt-4 border-t border-gray-200">
      <p class="text-sm text-gray-500">© 2025 优质导航</p>
    </div>
  </nav>
</template>

<style scoped>
.gradient-text {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(90deg, #6366f1, #8b5cf6);
}
</style>
