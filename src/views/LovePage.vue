<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300">
    <!-- 导航栏 -->
    <nav class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 class="text-xl md:text-2xl font-bold text-pink-600 dark:text-pink-400">
          <i class="fa fa-heart mr-2 animate-pulse"></i>To My Love
        </h1>
        <div class="flex items-center gap-4">
          <button @click="scrollToSection('memories')"
            class="hidden md:block hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
            我们的回忆
          </button>
          <button @click="scrollToSection('confession')"
            class="hidden md:block hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
            爱的告白
          </button>
          <button @click="scrollToSection('countdown')"
            class="hidden md:block hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
            重要日子
          </button>
          <button @click="scrollToSection('promises')"
            class="hidden md:block hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
            我们的约定
          </button>
          <button @click="toggleDarkMode"
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <i class="fa" :class="isDarkMode ? 'fa-sun-o' : 'fa-moon-o'"></i>
          </button>
        </div>
      </div>
    </nav>

    <!-- 英雄区域 -->
    <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-gradient-to-r from-pink-200/50 to-purple-200/50 dark:from-gray-900/70 dark:to-gray-800/70 z-10">
        </div>
        <div class="hearts-container absolute inset-0"></div>
      </div>

      <div class="container mx-auto px-4 z-20 text-center">
        <h1
          class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 animate-fade-in">
          亲爱的，我爱你
        </h1>
        <p class="text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed">
          每一天和你在一起都是上天的恩赐，感谢你出现在我的生命里，给我带来无尽的快乐和温暖。
        </p>
        <div class="flex justify-center">
          <button @click="scrollToSection('memories')"
            class="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            开始回忆之旅 <i class="fa fa-arrow-down ml-2"></i>
          </button>
        </div>
      </div>

      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button @click="scrollToSection('memories')" class="text-gray-600 dark:text-gray-300">
          <i class="fa fa-angle-double-down text-2xl"></i>
        </button>
      </div>
    </section>

    <!-- 回忆相册部分 -->
    <section id="memories" class="py-20 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">
          <i class="fa fa-photo mr-3 text-pink-600 dark:text-pink-400"></i>我们的美好回忆
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(memory, index) in memories" :key="index"
            class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <img :src="memory.url" :alt="memory.caption"
              class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110">
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div class="p-6 text-white">
                <h3 class="text-xl font-bold mb-2">{{ memory.caption }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 爱的告白部分 -->
    <section id="confession" class="py-20 bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">
          <i class="fa fa-heart mr-3 text-red-500 dark:text-red-400"></i>爱的告白
        </h2>

        <div
          class="max-w-3xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
          <div class="space-y-6 text-lg leading-relaxed">
            <p>亲爱的，</p>

            <p>还记得我们第一次见面的场景吗？从那一刻起，我的心就被你深深吸引。你的笑容像阳光一样温暖，你的声音像清泉一样悦耳，你的善良和智慧让我着迷。</p>

            <p>和你在一起的每一天，都是我生命中最美好的时光。无论是一起经历的欢声笑语，还是共同面对的困难挑战，都让我们的感情更加深厚。</p>

            <p>你教会了我什么是爱，什么是责任，什么是幸福。是你让我成为了更好的自己，让我的生活变得更加完整和有意义。</p>

            <p>我想告诉你，我爱你，不仅仅是因为你是谁，更是因为和你在一起时我是谁。我会永远珍惜你，爱护你，陪伴你走过人生的每一个阶段。</p>

            <p class="text-right font-bold text-pink-600 dark:text-pink-400 mt-10">永远爱你的人</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 倒计时部分 -->
    <section id="countdown"
      class="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">
          <i class="fa fa-calendar mr-3 text-purple-600 dark:text-purple-400"></i>我们的重要日子
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300">
            <h3 class="text-2xl font-bold mb-6 text-center text-pink-600 dark:text-pink-400">我们相遇</h3>
            <div class="countdown-display flex justify-center gap-4 md:gap-6">
              <div class="text-center">
                <div
                  class="text-2xl md:text-4xl font-bold bg-pink-100 dark:bg-pink-900/30 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  {{ daysTogether }}
                </div>
                <div class="text-sm md:text-base">天</div>
              </div>
              <div class="text-center">
                <div
                  class="text-2xl md:text-4xl font-bold bg-pink-100 dark:bg-pink-900/30 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  {{ monthsTogether }}
                </div>
                <div class="text-sm md:text-base">月</div>
              </div>
              <div class="text-center">
                <div
                  class="text-2xl md:text-4xl font-bold bg-pink-100 dark:bg-pink-900/30 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  {{ yearsTogether }}
                </div>
                <div class="text-sm md:text-base">年</div>
              </div>
            </div>
            <p class="text-center mt-6 text-gray-600 dark:text-gray-300">
              从 {{ firstMetDate }} 开始
            </p>
          </div>

          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300">
            <h3 class="text-2xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">下一个纪念日</h3>
            <div v-if="nextAnniversary" class="countdown-display flex justify-center gap-4 md:gap-6">
              <div class="text-center">
                <div
                  class="text-2xl md:text-4xl font-bold bg-purple-100 dark:bg-purple-900/30 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  {{ nextAnniversary.days }}
                </div>
                <div class="text-sm md:text-base">天</div>
              </div>
              <div class="text-center">
                <div
                  class="text-2xl md:text-4xl font-bold bg-purple-100 dark:bg-purple-900/30 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  {{ nextAnniversary.hours }}
                </div>
                <div class="text-sm md:text-base">时</div>
              </div>
              <div class="text-center">
                <div
                  class="text-2xl md:text-4xl font-bold bg-purple-100 dark:bg-purple-900/30 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  {{ nextAnniversary.minutes }}
                </div>
                <div class="text-sm md:text-base">分</div>
              </div>
            </div>
            <p class="text-center mt-6 text-gray-600 dark:text-gray-300">
              {{ nextAnniversary ? nextAnniversary.name : '我们的纪念日' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 我们的约定部分 -->
    <section id="promises" class="py-20 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">
          <i class="fa fa-handshake-o mr-3 text-blue-500 dark:text-blue-400"></i>我们的约定
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div
            class="bg-blue-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-start mb-4">
              <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                <i class="fa fa-smile-o text-2xl text-blue-600 dark:text-blue-400"></i>
              </div>
              <h3 class="text-xl font-bold">永远保持微笑</h3>
            </div>
            <p class="text-gray-700 dark:text-gray-300 pl-16">
              无论遇到什么困难，都要记得微笑面对。即使在生气的时候，也不要忘记对方的好。
            </p>
          </div>

          <div
            class="bg-green-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-start mb-4">
              <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                <i class="fa fa-comments-o text-2xl text-green-600 dark:text-green-400"></i>
              </div>
              <h3 class="text-xl font-bold">坦诚沟通</h3>
            </div>
            <p class="text-gray-700 dark:text-gray-300 pl-16">
              有任何想法和感受都要告诉对方，不隐瞒，不猜忌，用心倾听彼此的心声。
            </p>
          </div>

          <div
            class="bg-yellow-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-start mb-4">
              <div class="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full mr-4">
                <i class="fa fa-calendar-check-o text-2xl text-yellow-600 dark:text-yellow-400"></i>
              </div>
              <h3 class="text-xl font-bold">定期约会</h3>
            </div>
            <p class="text-gray-700 dark:text-gray-300 pl-16">
              再忙也要抽出时间陪伴对方，每月至少一次浪漫约会，保持爱情的新鲜感。
            </p>
          </div>

          <div
            class="bg-purple-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-start mb-4">
              <div class="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                <i class="fa fa-globe text-2xl text-purple-600 dark:text-purple-400"></i>
              </div>
              <h3 class="text-xl font-bold">一起旅行</h3>
            </div>
            <p class="text-gray-700 dark:text-gray-300 pl-16">
              每年至少一次长途旅行，一起探索未知的世界，创造更多美好的回忆。
            </p>
          </div>

          <div
            class="bg-red-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 md:col-span-2">
            <div class="flex items-start mb-4">
              <div class="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
                <i class="fa fa-heart text-2xl text-red-600 dark:text-red-400"></i>
              </div>
              <h3 class="text-xl font-bold">永远相爱</h3>
            </div>
            <p class="text-gray-700 dark:text-gray-300 pl-16">
              无论顺境还是逆境，富裕还是贫穷，健康还是疾病，都要彼此相爱，珍惜对方，直到永远。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-gray-100 dark:bg-gray-800 py-10">
      <div class="container mx-auto px-4 text-center">
        <p class="text-lg mb-4">
          <i class="fa fa-heart text-pink-600 dark:text-pink-400 animate-pulse"></i>
          永远爱你的老公
        </p>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          用我全部的爱制作 ❤️
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { parseISO } from 'date-fns'
interface NextAnniversary {
  name: string
  date: Date
  days: number
  hours: number
  minutes: number
}
// 状态管理
const isDarkMode = ref(false)

// 数据 - 使用提供的图片地址和描述
const memories = ref([
  { url: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEBBetouUtrkG2eeufdIoheM7-4cRU9bQACzh0AAnOcyVUTtCi0e2UXHTYE.jpg', caption: '我们的第一次旅行' },
  { url: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEBBexouUtsV-CtaSXlD3ApgbBFmHLBAQACzx0AAnOcyVW4mO2A3ekdtTYE.jpeg', caption: '那个难忘的夜晚' },
  { url: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEBBe1ouUtsbjZA2z1NSfY3YOVm-dXLuwAC0B0AAnOcyVVuKmvIgT1XpzYE.jpg', caption: '一起看的日落' },
  { url: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEBBe5ouUttoWt4nAtbvsRYD1f7fTd7DQAC0R0AAnOcyVUL48MmSbjJUzYE.jpg', caption: '笑得最开心的一天' },
  { url: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEBGQtouk_Ti3IGnHcOMmWJjC_yubvrpgACmR8AAi5q2VXlD5JecING6DYE.jpg', caption: '雨中漫步' },
  { url: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEBGQxouk_TlDdMjnYRLFTn3UKmr0j2iQACmh8AAi5q2VUzRjCBhrUqnTYE.jpg', caption: '一起看星星' },
  { url: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEBGQ1ouk_U307bbnrNpLhMZwT7ClNWfgACmx8AAi5q2VXxFVsnzKTB-zYE.jpg', caption: '庆祝我们的纪念日' },
  { url: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEBGQ5ouk_UNFMpsw7KBpW72G-m7on0DgACnB8AAi5q2VWHmVHbf4BYaTYE.jpg', caption: '未来还有更多故事' }
])

// 固定的纪念日数据
const anniversaries = ref([
  { name: '我们的纪念日', date: '2022-02-14' }
])

const firstMetDate = '2009-10-10'

// 计算属性 - 展示用的日期计算
const daysTogether = computed(() => {
  const firstMet = parseISO(firstMetDate)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - firstMet.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const monthsTogether = computed(() => {
  const firstMet = parseISO(firstMetDate)
  const today = new Date()
  return (today.getFullYear() - firstMet.getFullYear()) * 12 +
    (today.getMonth() - firstMet.getMonth()) +
    (today.getDate() >= firstMet.getDate() ? 1 : 0)
})

const yearsTogether = computed(() => {
  const firstMet = parseISO(firstMetDate)
  const today = new Date()
  let years = today.getFullYear() - firstMet.getFullYear()
  if (today.getMonth() < firstMet.getMonth() ||
    (today.getMonth() === firstMet.getMonth() && today.getDate() < firstMet.getDate())) {
    years--
  }
  return years
})

const nextAnniversary = computed<NextAnniversary | null>(() => {
  if (anniversaries.value.length === 0) return null

  const today = new Date()
  let closest: { name: string; date: Date } | null = null
  let minDiff = Infinity

  for (const ann of anniversaries.value) {
    const parsed = parseISO(ann.date) // parse to Date
    // 构建今年的纪念日日期
    let annDate = new Date(today.getFullYear(), parsed.getMonth(), parsed.getDate())

    // 如果今年已经过去，改为明年
    if (annDate.getTime() < today.getTime()) {
      annDate = new Date(today.getFullYear() + 1, parsed.getMonth(), parsed.getDate())
    }

    const diff = annDate.getTime() - today.getTime()
    if (diff < minDiff) {
      minDiff = diff
      closest = { name: ann.name, date: annDate }
    }
  }

  if (!closest) return null

  const days = Math.floor(minDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((minDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((minDiff % (1000 * 60 * 60)) / (1000 * 60))

  return {
    name: closest.name,
    date: closest.date,
    days,
    hours,
    minutes
  }
})

// 仅保留必要的方法
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark')
}

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 生命周期钩子
onMounted(() => {
  // 检查用户偏好的主题
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }

  // 添加爱心动画样式
  const style = document.createElement('style')
  style.textContent = `
    @keyframes float {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0.8;
      }
      100% {
        transform: translateY(-100px) rotate(10deg);
        opacity: 0;
      }
    }
    .animate-float {
      animation: float linear forwards;
      pointer-events: none;
      z-index: 1;
    }
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 1s ease-out forwards;
    }
  `
  document.head.appendChild(style)

  // 自动创建一些爱心
  setInterval(() => {
    if (Math.random() > 0.7) {
      createHeart()
    }
  }, 3000)
})

// 创建漂浮爱心效果（仅展示，无交互触发）
const createHeart = () => {
  const heartsContainer = document.querySelector('.hearts-container')
  if (!heartsContainer) return

  const heart = document.createElement('div')
  heart.innerHTML = '❤️'
  heart.className = 'absolute animate-float'
  heart.style.left = `${Math.random() * 100}%`
  heart.style.top = `${Math.random() * 100}%`
  heart.style.fontSize = `${Math.random() * 20 + 10}px`
  heart.style.opacity = `${Math.random() * 0.8 + 0.2}`
  heart.style.animationDuration = `${Math.random() * 3 + 2}s`
  heart.style.animationDelay = `${Math.random() * 2}s`

  heartsContainer.appendChild(heart)

  // 一段时间后移除爱心
  setTimeout(() => {
    heart.remove()
  }, 5000)
}

// 监听暗黑模式变化
watch(isDarkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<style scoped>
/* 基础样式补充 */
.hearts-container {
  overflow: hidden;
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #e9967a;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ff6347;
}

.dark ::-webkit-scrollbar-track {
  background: #333;
}

.dark ::-webkit-scrollbar-thumb {
  background: #555;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>
