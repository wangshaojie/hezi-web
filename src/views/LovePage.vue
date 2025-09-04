<template>
  <div
    class="min-h-screen bg-gradient-to-br from-love-pink/10 to-love-purple/10 font-inter text-love-dark overflow-x-hidden">
    <!-- 页面顶部装饰 -->
    <div class="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-love-pink via-love-purple to-love-blue z-50"></div>

    <!-- 漂浮爱心装饰 -->
    <div v-for="(heart, index) in hearts" :key="index" :style="{
      top: `${heart.top}px`,
      left: `${heart.left}px`,
      animationDelay: `${heart.delay}s`,
      fontSize: `${heart.size}px`
    }" class="fixed text-love-pink opacity-30 animate-float pointer-events-none">
      ❤️
    </div>

    <!-- 主标题区域 -->
    <header
      class="relative pt-20 pb-32 px-4 md:px-8 flex flex-col items-center justify-center text-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-love-pink/20 rounded-full filter blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-love-purple/20 rounded-full filter blur-3xl"></div>
      </div>

      <h1
        class="text-[clamp(2.5rem,6vw,4.5rem)] font-dancing font-bold text-gradient bg-gradient-to-r from-love-pink to-love-purple mb-4 relative z-10 animate-float">
        致我最爱的人
      </h1>

      <p class="text-[clamp(1.1rem,3vw,1.5rem)] max-w-2xl mx-auto text-love-dark/80 mb-8 relative z-10">
        小白你好，每一天，每一刻，你都在我心中占据着最重要的位置
      </p>

      <div class="animate-heartbeat relative z-10">
        <span class="text-5xl md:text-6xl">❤️</span>
      </div>
    </header>

    <!-- 重要日期倒计时 -->
    <section class="py-16 px-4 md:px-8 bg-white/70 backdrop-blur-sm rounded-2xl mx-4 md:mx-16 shadow-lg">
      <h2 class="text-[clamp(1.5rem,3vw,2.5rem)] font-dancing text-center mb-12 text-love-purple">
        我们的美好时光
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <!-- 相识倒计时 -->
        <div class="bg-gradient-to-br from-white to-love-pink/5 p-6 rounded-xl shadow-md border border-love-pink/10">
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <i class="fa fa-calendar text-love-pink mr-2"></i>
            我们相识
          </h3>
          <div class="flex justify-center gap-4 md:gap-6">
            <div class="flex flex-col items-center">
              <span class="text-3xl md:text-4xl font-bold text-love-pink">{{ daysLoved }}</span>
              <span class="text-sm text-love-dark/70">天</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-3xl md:text-4xl font-bold text-love-pink">{{ monthsLoved }}</span>
              <span class="text-sm text-love-dark/70">月</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-3xl md:text-4xl font-bold text-love-pink">{{ yearsLoved }}</span>
              <span class="text-sm text-love-dark/70">年</span>
            </div>
          </div>
        </div>

        <!-- 下一个纪念日 -->
        <div
          class="bg-gradient-to-br from-white to-love-purple/5 p-6 rounded-xl shadow-md border border-love-purple/10">
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <i class="fa fa-gift text-love-purple mr-2"></i>
            距离下一个纪念日
          </h3>
          <div class="flex justify-center gap-4 md:gap-6">
            <div class="flex flex-col items-center">
              <span class="text-3xl md:text-4xl font-bold text-love-purple">{{ daysToAnniversary }}</span>
              <span class="text-sm text-love-dark/70">天</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-3xl md:text-4xl font-bold text-love-purple">{{ hoursToAnniversary }}</span>
              <span class="text-sm text-love-dark/70">时</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-3xl md:text-4xl font-bold text-love-purple">{{ minsToAnniversary }}</span>
              <span class="text-sm text-love-dark/70">分</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 照片墙 -->
    <section class="py-20 px-4 md:px-8">
      <h2 class="text-[clamp(1.5rem,3vw,2.5rem)] font-dancing text-center mb-12 text-love-purple">
        我们的回忆
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
        <div v-for="(photo, index) in photos" :key="index"
          class="group relative overflow-hidden rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl"
          @click="openPhotoModal(index)">
          <img :src="photo.url" :alt="photo.caption"
            class="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110">
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <p class="text-white p-3 text-sm md:text-base">{{ photo.caption }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 爱的留言 -->
    <section class="py-20 px-4 md:px-8 bg-gradient-to-r from-love-purple/10 to-love-blue/10">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-[clamp(1.5rem,3vw,2.5rem)] font-dancing mb-12 text-love-purple">
          我想对你说
        </h2>

        <div class="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-lg">
          <p class="text-lg md:text-xl leading-relaxed mb-6 font-dancing text-love-dark/90">
            "亲爱的，与你相伴的每一天都是我生命中最美好的时光。你的笑容照亮了我的生活，你的陪伴给了我无穷的力量。无论未来有多少挑战，我都愿意与你携手同行，直到永远。"
          </p>

          <div class="mt-8">
            <button @click="showRandomMessage"
              class="bg-gradient-to-r from-love-pink to-love-purple text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              点击查看更多情话
            </button>
          </div>

          <div v-if="showMessage" class="mt-6 p-4 bg-love-pink/10 rounded-lg animate-fadeIn">
            <p class="text-lg font-dancing text-love-dark/90">{{ currentMessage }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 照片查看模态框 -->
    <div v-if="isPhotoModalOpen" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      @click="closePhotoModal">
      <div class="relative max-w-4xl w-full" @click.stop>
        <button @click="closePhotoModal" class="absolute -top-12 right-0 text-white text-2xl">
          <i class="fa fa-times"></i>
        </button>
        <img :src="photos[currentPhotoIndex].url" :alt="photos[currentPhotoIndex].caption"
          class="w-full h-auto rounded-lg">
        <p class="text-white mt-4 text-center">{{ photos[currentPhotoIndex].caption }}</p>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="py-8 px-4 text-center text-love-dark/60">
      <p class="font-dancing text-xl">永远爱你的人 ❤️</p>
      <p class="text-sm mt-2">用爱制作于 {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 类型定义
interface Heart {
  top: number
  left: number
  delay: number
  size: number
}

interface Photo {
  url: string
  caption: string
}

// 漂浮爱心效果
const hearts = ref<Heart[]>([])

// 照片数据
const photos = ref<Photo[]>([
  { url: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEBBetouUtrkG2eeufdIoheM7-4cRU9bQACzh0AAnOcyVUTtCi0e2UXHTYE.jpg', caption: '我们的第一次旅行' },
  { url: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEBBexouUtsV-CtaSXlD3ApgbBFmHLBAQACzx0AAnOcyVW4mO2A3ekdtTYE.jpeg', caption: '那个难忘的夜晚' },
  { url: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEBBe1ouUtsbjZA2z1NSfY3YOVm-dXLuwAC0B0AAnOcyVVuKmvIgT1XpzYE.jpg', caption: '一起看的日落' },
  { url: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEBBe5ouUttoWt4nAtbvsRYD1f7fTd7DQAC0R0AAnOcyVUL48MmSbjJUzYE.jpg', caption: '笑得最开心的一天' },
  { url: 'https://picsum.photos/id/1066/800/600', caption: '雨中漫步' },
  { url: 'https://picsum.photos/id/1059/800/600', caption: '一起看星星' },
  { url: 'https://picsum.photos/id/1056/800/600', caption: '庆祝我们的纪念日' },
  { url: 'https://picsum.photos/id/1040/800/600', caption: '未来还有更多故事' }
])

// 照片模态框
const isPhotoModalOpen = ref(false)
const currentPhotoIndex = ref(0)

// 情话数据
const loveMessages = ref<string[]>([
  "你是我每天醒来的理由，也是我每晚入睡前的思念。",
  "如果说人生是一本书，那你就是我最美的篇章。",
  "我爱你，不仅因为你是谁，也因为和你在一起时我是谁。",
  "世界这么大，能遇见你，真好。",
  "和你在一起的每一刻，都是我生命中最珍贵的时光。",
  "你的拥抱是我最温暖的港湾。",
  "我想和你一起慢慢变老，看遍世间风景。",
  "你一笑，我世界里的所有阴霾都消失了。"
])

const currentMessage = ref('')
const showMessage = ref(false)

// 日期计算
const firstMetDate = ref<Date>(new Date('2020-02-14')) // 相识日期
const anniversaryDate = ref<Date>(new Date(`${new Date().getFullYear()}-12-25`)) // 纪念日

// 计算相识时间
const daysLoved = ref(0)
const monthsLoved = ref(0)
const yearsLoved = ref(0)

// 计算距离下一个纪念日
const daysToAnniversary = ref(0)
const hoursToAnniversary = ref(0)
const minsToAnniversary = ref(0)

// 初始化漂浮爱心
const initHearts = () => {
  hearts.value = []
  for (let i = 0; i < 15; i++) {
    hearts.value.push({
      top: Math.random() * window.innerHeight,
      left: Math.random() * window.innerWidth,
      delay: Math.random() * 5,
      size: 12 + Math.random() * 20
    })
  }
}

// 打开照片模态框
const openPhotoModal = (index: number) => {
  currentPhotoIndex.value = index
  isPhotoModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

// 关闭照片模态框
const closePhotoModal = () => {
  isPhotoModalOpen.value = false
  document.body.style.overflow = 'auto'
}

// 显示随机情话
const showRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * loveMessages.value.length)
  currentMessage.value = loveMessages.value[randomIndex]
  showMessage.value = true

  // 5秒后自动隐藏
  setTimeout(() => {
    showMessage.value = false
  }, 5000)
}

// 计算日期差
const calculateDateDifferences = () => {
  const now = new Date()

  // 计算相识时间
  const timeLoved = now.getTime() - firstMetDate.value.getTime()
  daysLoved.value = Math.floor(timeLoved / (1000 * 60 * 60 * 24))
  monthsLoved.value = Math.floor(daysLoved.value / 30)
  yearsLoved.value = Math.floor(monthsLoved.value / 12)

  // 计算距离下一个纪念日
  const nextAnniversary = new Date(anniversaryDate.value)

  // 如果今年的纪念日已过，计算明年的
  if (nextAnniversary < now) {
    nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1)
  }

  const timeToAnniversary = nextAnniversary.getTime() - now.getTime()
  daysToAnniversary.value = Math.floor(timeToAnniversary / (1000 * 60 * 60 * 24))
  const remainingHours = Math.floor((timeToAnniversary % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  hoursToAnniversary.value = remainingHours
  const remainingMins = Math.floor((timeToAnniversary % (1000 * 60 * 60)) / (1000 * 60))
  minsToAnniversary.value = remainingMins
}

// 页面加载时初始化
onMounted(() => {
  initHearts()
  calculateDateDifferences()

  // 每秒更新一次日期计算
  setInterval(calculateDateDifferences, 60000)

  // 窗口大小改变时重新计算爱心位置
  window.addEventListener('resize', initHearts)
})
</script>

<style scoped>
@keyframes float {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }

  14% {
    transform: scale(1.1);
  }

  28% {
    transform: scale(1);
  }

  42% {
    transform: scale(1.1);
  }

  70% {
    transform: scale(1);
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

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-heartbeat {
  animation: heartbeat 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.backdrop-blur {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
