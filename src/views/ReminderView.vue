<script setup lang="ts">
import LocalToolsDetailComp from '@/components/LocalToolsDetailComp.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ElNotification, ElTimePicker } from 'element-plus'
import dayjs from 'dayjs'

// 状态管理
const reminderText = ref('')
const reminderTime = ref('')
const isRunning = ref(false)
const isReminding = ref(false)
const countdownInterval = ref(null)
const totalSeconds = ref(0)
const targetDate = ref(null)
const soundEnabled = ref(true) // 声音开关状态
let audio = null // 音频对象

// 计算倒计时显示格式
const countdownDisplay = computed(() => {
  if (totalSeconds.value <= 0) return '00:00:00'

  const hours = Math.floor(totalSeconds.value / 3600)
  const minutes = Math.floor((totalSeconds.value % 3600) / 60)
  const seconds = totalSeconds.value % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 目标时间显示
const targetTimeDisplay = computed(() => {
  return targetDate.value ? dayjs(targetDate.value).format('HH:mm:ss') : ''
})

// 切换声音开关
const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
  if (!soundEnabled.value && audio) {
    stopSound()
  }
}

// 播放提示音
const playSound = () => {
  if (!soundEnabled.value) return

  // 创建新的音频元素
  if (!audio) {
    audio = new Audio('/sounds/5c8939744225627391.mp3')
    audio.loop = true // 循环播放
  }

  // 播放音频
  audio.play().catch((error) => {
    console.error('播放声音失败:', error)
    ElNotification({
      title: '提示',
      message: '声音播放失败，请检查浏览器设置',
      type: 'warning',
    })
  })
}

// 停止播放声音
const stopSound = () => {
  if (audio) {
    audio.pause()
    audio.currentTime = 0
  }
}

// 开始倒计时
const startReminder = () => {
  if (!reminderText.value.trim()) {
    ElNotification({
      title: '提示',
      message: '请输入提醒内容',
      type: 'warning',
    })
    return
  }

  if (!reminderTime.value) {
    ElNotification({
      title: '提示',
      message: '请选择提醒时间',
      type: 'warning',
    })
    return
  }

  // 计算目标日期时间
  const [hours, minutes, seconds] = reminderTime.value.split(':').map(Number)
  const now = dayjs()
  let target = now.set('hour', hours).set('minute', minutes).set('second', seconds)

  // 如果目标时间已经过去，则设置为明天
  if (target.isBefore(now)) {
    target = target.add(1, 'day')
  }

  targetDate.value = target.toDate()

  // 计算总秒数
  totalSeconds.value = Math.floor(target.diff(now, 'second'))

  if (totalSeconds.value <= 0) {
    ElNotification({
      title: '提示',
      message: '请选择一个未来的时间',
      type: 'warning',
    })
    return
  }

  isRunning.value = true

  // 开始倒计时
  countdownInterval.value = setInterval(() => {
    if (totalSeconds.value <= 0) {
      clearInterval(countdownInterval.value)
      triggerReminder()
    } else {
      totalSeconds.value--

      // 最后10秒高亮显示
      if (totalSeconds.value <= 10) {
        const displayElement = document.getElementById('countdown-display')
        if (displayElement) {
          displayElement.classList.add('text-red-500')
          displayElement.classList.add('animate-pulse')
        }
      }
    }
  }, 1000)
}

// 触发提醒
const triggerReminder = () => {
  isReminding.value = true
  isRunning.value = false

  // 播放声音
  playSound()

  // 震动效果
  const body = document.body
  body.classList.add('animate-shake')
  setTimeout(() => {
    body.classList.remove('animate-shake')
  }, 3000)

  // 系统通知
  if (Notification.permission === 'granted') {
    new Notification('时间到啦！', {
      body: reminderText.value,
    })
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('时间到啦！', {
          body: reminderText.value,
        })
      }
    })
  }
}

// 停止提醒
const stopReminder = () => {
  isReminding.value = false
  stopSound() // 停止声音
  resetForm()
}

// 重置表单
const resetForm = () => {
  reminderText.value = ''
  reminderTime.value = ''
  isRunning.value = false
  clearInterval(countdownInterval.value)
  countdownInterval.value = null
  totalSeconds.value = 0
  targetDate.value = null

  // 移除倒计时高亮
  const displayElement = document.getElementById('countdown-display')
  if (displayElement) {
    displayElement.classList.remove('text-red-500')
    displayElement.classList.remove('animate-pulse')
  }
}

// 权限检查
onMounted(() => {
  // 检查通知权限
  if (Notification.permission === 'default') {
    Notification.requestPermission()
  }
})

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  stopSound() // 确保组件卸载时停止声音
})
</script>

<template>
  <LocalToolsDetailComp title="定时提醒" subtitle="设置时间，到点提醒" :showSecurityBanner="false">
    <!-- 主内容插槽content -->
    <template #content>
      <div class="mx-auto px-6 py-8">
        <div class="flex justify-between items-center mb-4"></div>

        <!-- 设置提醒时间 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">提醒内容</label>
            <input
              v-model="reminderText"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入提醒内容"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">选择提醒时间</label>
            <el-time-picker
              v-model="reminderTime"
              placeholder="选择时间"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              class="w-full"
            >
            </el-time-picker>
          </div>

          <el-button
            @click="startReminder"
            :disabled="isRunning || !reminderTime"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            设置提醒
          </el-button>
          <el-button
            @click="toggleSound"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <i :class="soundEnabled ? 'fa fa-volume-up' : 'fa fa-volume-off'"></i>
            <span>{{ soundEnabled ? '开启声音' : '关闭声音' }}</span>
          </el-button>
        </div>

        <!-- 倒计时显示 -->
        <div
          v-if="isRunning"
          class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-8 mb-6 text-white"
        >
          <h2 class="text-xl font-bold mb-4">距离提醒还剩</h2>
          <div class="flex justify-center">
            <div class="text-6xl font-bold" id="countdown-display">{{ countdownDisplay }}</div>
          </div>
          <div class="mt-4 text-center">
            <span class="text-sm opacity-80">提醒内容: {{ reminderText }}</span>
          </div>
          <div class="mt-4 text-center">
            <span class="text-sm opacity-80">目标时间: {{ targetTimeDisplay }}</span>
          </div>
        </div>

        <!-- 强提醒弹窗 -->
        <div
          v-if="isReminding"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            class="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full transform transition-all scale-100 opacity-100"
          >
            <div class="text-center">
              <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4"
              >
                <i class="fa fa-bell text-red-500 text-3xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">时间到！</h3>
              <p class="text-gray-600 mb-6">{{ reminderText }}</p>
              <button
                @click="stopReminder"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </LocalToolsDetailComp>
</template>

<style scoped>
/* 添加动画效果 */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.5s;
  animation-iteration-count: 3;
}

.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
