<script setup lang="ts">
import LocalToolsDetailComp from '@/components/LocalToolsDetailComp.vue'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { ElNotification, ElTimePicker, ElDialog, ElButton, ElInput, ElSwitch, ElTag, ElIcon, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, VideoPlay, VideoPause, CircleClose, Bell } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

// 任务状态枚举
enum TaskStatus {
  PENDING = 'pending',    // 待开始
  RUNNING = 'running',    // 运行中
  COMPLETED = 'completed', // 已完成
  PAUSED = 'paused'       // 已暂停
}

// 任务接口定义
interface ReminderTask {
  id: string
  title: string
  description: string
  targetTime: string
  targetDate: Date | null
  totalSeconds: number
  remainingSeconds: number
  status: TaskStatus
  soundEnabled: boolean
  createdAt: Date
  completedAt?: Date
}

// 状态管理
const tasks = ref<ReminderTask[]>([])
const currentTask = ref<ReminderTask | null>(null)
const countdownInterval = ref<number | null>(null)
const soundEnabled = ref(true) // 全局声音开关
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editingTask = ref<ReminderTask | null>(null)

// 表单数据
const newTask = ref({
  title: '',
  description: '',
  targetTime: '',
  soundEnabled: true
})

let audio: HTMLAudioElement | null = null // 音频对象

// 计算属性
const runningTasks = computed(() => tasks.value.filter(task => task.status === TaskStatus.RUNNING))
const completedTasks = computed(() => tasks.value.filter(task => task.status === TaskStatus.COMPLETED))
const pendingTasks = computed(() => tasks.value.filter(task => task.status === TaskStatus.PENDING))

// 当前运行任务的倒计时显示
const currentCountdownDisplay = computed(() => {
  if (!currentTask.value || currentTask.value.remainingSeconds <= 0) return '00:00:00'

  const hours = Math.floor(currentTask.value.remainingSeconds / 3600)
  const minutes = Math.floor((currentTask.value.remainingSeconds % 3600) / 60)
  const seconds = currentTask.value.remainingSeconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 当前运行任务的目标时间显示
const currentTargetTimeDisplay = computed(() => {
  return currentTask.value?.targetDate ? dayjs(currentTask.value.targetDate).format('HH:mm:ss') : ''
})

// 格式化时间显示
const formatTimeDisplay = (seconds: number) => {
  if (seconds <= 0) return '00:00:00'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 任务管理功能
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 添加新任务
const addTask = () => {
  if (!newTask.value.title.trim()) {
    ElNotification({
      title: '提示',
      message: '请输入任务标题',
      type: 'warning',
    })
    return
  }

  if (!newTask.value.targetTime) {
    ElNotification({
      title: '提示',
      message: '请选择提醒时间',
      type: 'warning',
    })
    return
  }

  // 计算目标日期时间
  const [hours, minutes, seconds] = newTask.value.targetTime.split(':').map(Number)
  const now = dayjs()
  let target = now.set('hour', hours).set('minute', minutes).set('second', seconds)

  // 如果目标时间已经过去，则设置为明天
  if (target.isBefore(now)) {
    target = target.add(1, 'day')
  }

  const totalSeconds = Math.floor(target.diff(now, 'second'))

  if (totalSeconds <= 0) {
    ElNotification({
      title: '提示',
      message: '请选择一个未来的时间',
      type: 'warning',
    })
    return
  }

  const task: ReminderTask = {
    id: generateId(),
    title: newTask.value.title.trim(),
    description: newTask.value.description.trim(),
    targetTime: newTask.value.targetTime,
    targetDate: target.toDate(),
    totalSeconds,
    remainingSeconds: totalSeconds,
    status: TaskStatus.PENDING,
    soundEnabled: newTask.value.soundEnabled,
    createdAt: new Date()
  }

  tasks.value.unshift(task)
  saveTasksToStorage()

  // 自动开始新添加的任务
  startTask(task)

  // 重置表单
  newTask.value = {
    title: '',
    description: '',
    targetTime: '',
    soundEnabled: true
  }

  showAddDialog.value = false

  ElNotification({
    title: '成功',
    message: '任务添加成功并已开始倒计时',
    type: 'success',
  })
}

// 编辑任务
const editTask = (task: ReminderTask) => {
  editingTask.value = { ...task }
  newTask.value = {
    title: task.title,
    description: task.description,
    targetTime: task.targetTime,
    soundEnabled: task.soundEnabled
  }
  showEditDialog.value = true
}

// 保存编辑
const saveEdit = () => {
  if (!editingTask.value) return

  if (!newTask.value.title.trim()) {
    ElNotification({
      title: '提示',
      message: '请输入任务标题',
      type: 'warning',
    })
    return
  }

  if (!newTask.value.targetTime) {
    ElNotification({
      title: '提示',
      message: '请选择提醒时间',
      type: 'warning',
    })
    return
  }

  // 如果任务正在运行，先停止
  if (editingTask.value.status === TaskStatus.RUNNING) {
    stopTask(editingTask.value)
  }

  // 重新计算时间
  const [hours, minutes, seconds] = newTask.value.targetTime.split(':').map(Number)
  const now = dayjs()
  let target = now.set('hour', hours).set('minute', minutes).set('second', seconds)

  if (target.isBefore(now)) {
    target = target.add(1, 'day')
  }

  const totalSeconds = Math.floor(target.diff(now, 'second'))

  if (totalSeconds <= 0) {
    ElNotification({
      title: '提示',
      message: '请选择一个未来的时间',
      type: 'warning',
    })
    return
  }

  // 更新任务
  const taskIndex = tasks.value.findIndex(t => t.id === editingTask.value!.id)
  if (taskIndex !== -1) {
    tasks.value[taskIndex] = {
      ...editingTask.value,
      title: newTask.value.title.trim(),
      description: newTask.value.description.trim(),
      targetTime: newTask.value.targetTime,
      targetDate: target.toDate(),
      totalSeconds,
      remainingSeconds: totalSeconds,
      soundEnabled: newTask.value.soundEnabled,
      status: TaskStatus.PENDING
    }
  }

  saveTasksToStorage()

  // 重置表单
  newTask.value = {
    title: '',
    description: '',
    targetTime: '',
    soundEnabled: true
  }

  showEditDialog.value = false
  editingTask.value = null

  ElNotification({
    title: '成功',
    message: '任务更新成功',
    type: 'success',
  })
}

// 删除任务
const deleteTask = async (task: ReminderTask) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除任务"${task.title}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    // 如果任务正在运行，先停止
    if (task.status === TaskStatus.RUNNING) {
      stopTask(task)
    }

    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
      saveTasksToStorage()

      ElNotification({
        title: '成功',
        message: '任务删除成功',
        type: 'success',
      })
    }
  } catch {
    // 用户取消删除
  }
}

// 启动任务
const startTask = (task: ReminderTask) => {
  // 停止当前运行的任务
  if (currentTask.value && currentTask.value.status === TaskStatus.RUNNING) {
    stopTask(currentTask.value)
  }

  // 更新任务状态
  task.status = TaskStatus.RUNNING
  currentTask.value = task

  // 开始倒计时
  startCountdown()

  ElNotification({
    title: '提醒开始',
    message: `任务"${task.title}"已开始倒计时`,
    type: 'info',
  })
}

// 暂停任务
const pauseTask = (task: ReminderTask) => {
  task.status = TaskStatus.PAUSED
  if (currentTask.value?.id === task.id) {
    currentTask.value = null
    stopCountdown()
  }
  saveTasksToStorage()
}

// 停止任务
const stopTask = (task: ReminderTask) => {
  task.status = TaskStatus.PENDING
  task.remainingSeconds = task.totalSeconds

  if (currentTask.value?.id === task.id) {
    currentTask.value = null
    stopCountdown()
  }
  saveTasksToStorage()
}

// 完成任务
const completeTask = (task: ReminderTask) => {
  // 防止重复完成
  if (task.status === TaskStatus.COMPLETED) {
    return
  }

  task.status = TaskStatus.COMPLETED
  task.completedAt = new Date()

  if (currentTask.value?.id === task.id) {
    // 清理倒计时样式
    const displayElement = document.getElementById('current-countdown-display')
    if (displayElement) {
      displayElement.classList.remove('text-white')
      displayElement.classList.remove('bg-red-600')
      displayElement.classList.remove('px-4')
      displayElement.classList.remove('py-2')
      displayElement.classList.remove('rounded-lg')
      displayElement.classList.remove('animate-pulse')
      displayElement.classList.remove('shadow-lg')
    }

    currentTask.value = null
    stopCountdown()
  }

  saveTasksToStorage()

  ElNotification({
    title: '任务完成',
    message: `任务"${task.title}"已完成`,
    type: 'success',
  })
}

// 切换声音开关
const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
  if (!soundEnabled.value && audio) {
    stopSound()
  }
}

// 倒计时功能
const startCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }

  countdownInterval.value = setInterval(() => {
    if (!currentTask.value) {
      stopCountdown()
      return
    }

    if (currentTask.value.remainingSeconds <= 0) {
      // 立即停止倒计时，防止重复触发
      stopCountdown()
      triggerReminder()
    } else {
      currentTask.value.remainingSeconds--

      // 最后10秒高亮显示
      if (currentTask.value.remainingSeconds <= 10) {
        const displayElement = document.getElementById('current-countdown-display')
        if (displayElement) {
          displayElement.classList.add('text-white')
          displayElement.classList.add('bg-red-600')
          displayElement.classList.add('px-4')
          displayElement.classList.add('py-2')
          displayElement.classList.add('rounded-lg')
          displayElement.classList.add('animate-pulse')
          displayElement.classList.add('shadow-lg')
        }
      } else {
        // 恢复正常样式
        const displayElement = document.getElementById('current-countdown-display')
        if (displayElement) {
          displayElement.classList.remove('text-white')
          displayElement.classList.remove('bg-red-600')
          displayElement.classList.remove('px-4')
          displayElement.classList.remove('py-2')
          displayElement.classList.remove('rounded-lg')
          displayElement.classList.remove('animate-pulse')
          displayElement.classList.remove('shadow-lg')
        }
      }
    }
  }, 1000)
}

const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
}

// 触发提醒
const triggerReminder = () => {
  if (!currentTask.value) return

  // 播放声音
  if (currentTask.value.soundEnabled && soundEnabled.value) {
    playSound()
  }

  // 震动效果
  const body = document.body
  body.classList.add('animate-shake')
  setTimeout(() => {
    body.classList.remove('animate-shake')
  }, 3000)

  // 浏览器通知（只发送一次）
  if (Notification.permission === 'granted') {
    new Notification('时间到啦！', {
      body: currentTask.value.title,
      icon: '/favicon.ico'
    })
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('时间到啦！', {
          body: currentTask.value!.title,
          icon: '/favicon.ico'
        })
      }
    })
  }

  // 完成任务
  completeTask(currentTask.value)
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
  audio.play().catch((error: unknown) => {
    console.error('播放声音失败:', error)
    ElNotification({
      title: '提示',
      message: '声音播放失败，请检查浏览器设置',
      type: 'warning',
    })
  })

  // 5秒后自动停止声音
  setTimeout(() => {
    stopSound()
  }, 5000)
}

// 停止播放声音
const stopSound = () => {
  if (audio) {
    audio.pause()
    audio.currentTime = 0
  }
}

// 本地存储功能
const saveTasksToStorage = () => {
  try {
    localStorage.setItem('reminder-tasks', JSON.stringify(tasks.value))
  } catch (error) {
    console.error('保存任务失败:', error)
  }
}

const loadTasksFromStorage = () => {
  try {
    const stored = localStorage.getItem('reminder-tasks')
    if (stored) {
      const parsedTasks = JSON.parse(stored)
      // 转换日期对象
      parsedTasks.forEach((task: ReminderTask) => {
        if (task.targetDate) {
          task.targetDate = new Date(task.targetDate)
        }
        if (task.createdAt) {
          task.createdAt = new Date(task.createdAt)
        }
        if (task.completedAt) {
          task.completedAt = new Date(task.completedAt)
        }
      })
      tasks.value = parsedTasks
    }
  } catch (error) {
    console.error('加载任务失败:', error)
  }
}

// 获取任务状态标签类型
const getTaskStatusTagType = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.PENDING:
      return 'info'
    case TaskStatus.RUNNING:
      return 'success'
    case TaskStatus.PAUSED:
      return 'warning'
    case TaskStatus.COMPLETED:
      return 'success'
    default:
      return 'info'
  }
}

// 获取任务状态文本
const getTaskStatusText = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.PENDING:
      return '待开始'
    case TaskStatus.RUNNING:
      return '运行中'
    case TaskStatus.PAUSED:
      return '已暂停'
    case TaskStatus.COMPLETED:
      return '已完成'
    default:
      return '未知'
  }
}


// 权限检查和初始化
onMounted(() => {
  // 检查通知权限
  if (Notification.permission === 'default') {
    Notification.requestPermission()
  }

  // 加载保存的任务
  loadTasksFromStorage()
})

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  stopSound() // 确保组件卸载时停止声音
})

// 监听任务变化，自动保存
watch(tasks, () => {
  saveTasksToStorage()
}, { deep: true })
</script>

<template>
  <LocalToolsDetailComp title="多任务提醒" subtitle="管理多个定时提醒任务，需要打开浏览器提醒权限，点击地址栏后面的感叹号，选择允许" :showSecurityBanner="false">
    <!-- 主内容插槽content -->
    <template #content>
      <div class="mx-auto px-6 py-8">
        <!-- 顶部操作栏 -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-4">
            <h2 class="text-2xl font-bold text-gray-800">提醒任务</h2>
            <el-tag type="info" size="small">{{ tasks.length }} 个任务</el-tag>
          </div>
          <div class="flex items-center gap-2">
            <el-button @click="toggleSound" :type="soundEnabled ? 'primary' : 'default'">
              <el-icon>
                <Bell />
              </el-icon>
              {{ soundEnabled ? '声音开启' : '声音关闭' }}
            </el-button>
            <el-button type="primary" @click="showAddDialog = true">
              <el-icon>
                <Plus />
              </el-icon>
              添加任务
            </el-button>
          </div>
        </div>

        <!-- 当前运行任务显示 -->
        <div v-if="currentTask"
          class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 mb-6 text-white">
          <h3 class="text-xl font-bold mb-4">当前运行任务</h3>
          <div class="flex justify-between items-center">
            <div>
              <h4 class="text-lg font-semibold">{{ currentTask.title }}</h4>
              <p class="text-sm opacity-80">{{ currentTask.description }}</p>
            </div>
            <div class="text-right">
              <div class="text-4xl font-bold" id="current-countdown-display">{{ currentCountdownDisplay }}</div>
              <div class="text-sm opacity-80">目标时间: {{ currentTargetTimeDisplay }}</div>
            </div>
          </div>
        </div>

        <!-- 任务列表 -->
        <div class="space-y-4">
          <!-- 运行中的任务 -->
          <div v-if="runningTasks.length > 0" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">运行中 ({{ runningTasks.length }})</h3>
            <div class="space-y-3">
              <div v-for="task in runningTasks" :key="task.id"
                class="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <h4 class="text-lg font-semibold text-gray-800">{{ task.title }}</h4>
                      <el-tag :type="getTaskStatusTagType(task.status)" size="small">
                        {{ getTaskStatusText(task.status) }}
                      </el-tag>
                    </div>
                    <p class="text-gray-600 text-sm mb-2">{{ task.description }}</p>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                      <span>目标时间: {{ dayjs(task.targetDate).format('HH:mm:ss') }}</span>
                      <span>剩余: {{ formatTimeDisplay(task.remainingSeconds) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <el-button size="small" @click="pauseTask(task)" type="warning">
                      <el-icon>
                        <VideoPause />
                      </el-icon>
                      暂停
                    </el-button>
                    <el-button size="small" @click="stopTask(task)" type="danger">
                      <el-icon>
                        <CircleClose />
                      </el-icon>
                      停止
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 待开始的任务 -->
          <div v-if="pendingTasks.length > 0" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">待开始 ({{ pendingTasks.length }})</h3>
            <div class="space-y-3">
              <div v-for="task in pendingTasks" :key="task.id"
                class="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <h4 class="text-lg font-semibold text-gray-800">{{ task.title }}</h4>
                      <el-tag :type="getTaskStatusTagType(task.status)" size="small">
                        {{ getTaskStatusText(task.status) }}
                      </el-tag>
                    </div>
                    <p class="text-gray-600 text-sm mb-2">{{ task.description }}</p>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                      <span>目标时间: {{ dayjs(task.targetDate).format('HH:mm:ss') }}</span>
                      <span>总时长: {{ formatTimeDisplay(task.totalSeconds) }}</span>
                      <span>创建时间: {{ dayjs(task.createdAt).format('MM-DD HH:mm') }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <el-button size="small" @click="startTask(task)" type="success">
                      <el-icon>
                        <VideoPlay />
                      </el-icon>
                      开始
                    </el-button>
                    <el-button size="small" @click="editTask(task)" type="primary">
                      <el-icon>
                        <Edit />
                      </el-icon>
                      编辑
                    </el-button>
                    <el-button size="small" @click="deleteTask(task)" type="danger">
                      <el-icon>
                        <Delete />
                      </el-icon>
                      删除
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 已完成的任务 -->
          <div v-if="completedTasks.length > 0" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">已完成 ({{ completedTasks.length }})</h3>
            <div class="space-y-3">
              <div v-for="task in completedTasks" :key="task.id"
                class="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-400 opacity-75">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <h4 class="text-lg font-semibold text-gray-800">{{ task.title }}</h4>
                      <el-tag :type="getTaskStatusTagType(task.status)" size="small">
                        {{ getTaskStatusText(task.status) }}
                      </el-tag>
                    </div>
                    <p class="text-gray-600 text-sm mb-2">{{ task.description }}</p>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                      <span>完成时间: {{ dayjs(task.completedAt).format('MM-DD HH:mm') }}</span>
                      <span>目标时间: {{ dayjs(task.targetDate).format('HH:mm:ss') }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <el-button size="small" @click="deleteTask(task)" type="danger">
                      <el-icon>
                        <Delete />
                      </el-icon>
                      删除
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="tasks.length === 0" class="text-center py-12">
            <div class="text-gray-400 text-6xl mb-4">
              <i class="fa fa-bell-slash"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">还没有提醒任务</h3>
            <p class="text-gray-500 mb-4">点击"添加任务"创建您的第一个提醒</p>
            <el-button type="primary" @click="showAddDialog = true">
              <el-icon>
                <Plus />
              </el-icon>
              添加任务
            </el-button>
          </div>
        </div>

        <!-- 添加任务对话框 -->
        <el-dialog v-model="showAddDialog" title="添加提醒任务" width="500px">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">任务标题</label>
              <el-input v-model="newTask.title" placeholder="请输入任务标题" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">任务描述</label>
              <el-input v-model="newTask.description" type="textarea" placeholder="请输入任务描述（可选）" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">提醒时间</label>
              <el-time-picker v-model="newTask.targetTime" placeholder="选择时间" format="HH:mm:ss" value-format="HH:mm:ss"
                class="w-full" />
            </div>
            <div class="flex items-center gap-2">
              <el-switch v-model="newTask.soundEnabled" />
              <span class="text-sm text-gray-600">开启声音提醒</span>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-end gap-2">
              <el-button @click="showAddDialog = false">取消</el-button>
              <el-button type="primary" @click="addTask">添加</el-button>
            </div>
          </template>
        </el-dialog>

        <!-- 编辑任务对话框 -->
        <el-dialog v-model="showEditDialog" title="编辑提醒任务" width="500px">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">任务标题</label>
              <el-input v-model="newTask.title" placeholder="请输入任务标题" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">任务描述</label>
              <el-input v-model="newTask.description" type="textarea" placeholder="请输入任务描述（可选）" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">提醒时间</label>
              <el-time-picker v-model="newTask.targetTime" placeholder="选择时间" format="HH:mm:ss" value-format="HH:mm:ss"
                class="w-full" />
            </div>
            <div class="flex items-center gap-2">
              <el-switch v-model="newTask.soundEnabled" />
              <span class="text-sm text-gray-600">开启声音提醒</span>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-end gap-2">
              <el-button @click="showEditDialog = false">取消</el-button>
              <el-button type="primary" @click="saveEdit">保存</el-button>
            </div>
          </template>
        </el-dialog>

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
