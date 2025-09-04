<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
    <div class="container mx-auto px-4 py-8">
      <!-- 顶部标题 -->
      <header class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-2">幸运大抽奖</h1>
        <p class="text-xl opacity-80">年度盛典 · 精彩无限</p>
      </header>

      <!-- 主内容区 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧抽奖配置区 -->
        <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 class="text-2xl font-semibold mb-6 flex items-center">
            <el-icon class="mr-2">
              <Setting />
            </el-icon>
            抽奖配置
          </h2>

          <!-- 用户导入 -->
          <div class="mb-8">
            <h3 class="text-lg mb-3 flex items-center">
              <el-icon class="mr-1">
                <User />
              </el-icon>
              参与人员
            </h3>
            <el-upload class="upload-demo" drag action="#" :auto-upload="false" :on-change="handleFileUpload"
              :show-file-list="false" accept=".xlsx,.xls">
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text text-gray-600">点击或拖拽Excel文件到此处</div>
              <template #tip>
                <div class="el-upload__tip text-gray-500">支持Excel格式，需包含"姓名"列</div>
              </template>
            </el-upload>
            <div v-if="users.length > 0" class="mt-4 text-sm">
              已导入 <span class="text-yellow-300">{{ users.length }}</span> 位参与者
            </div>
          </div>

          <!-- 奖项设置 -->
          <div>
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg flex items-center">
                <el-icon class="mr-1">
                  <Trophy />
                </el-icon>
                奖项设置
              </h3>
              <el-button @click="addPrize" type="primary" size="small" circle>
                <el-icon>
                  <Plus />
                </el-icon>
              </el-button>
            </div>

            <div class="space-y-4">
              <div v-for="(prize, index) in prizes" :key="index"
                class="bg-white/10 p-4 rounded-lg transition-all hover:bg-white/15">
                <div class="flex items-start gap-3">
                  <div class="flex-1">
                    <el-input v-model="prize.name" placeholder="奖项名称" class="mb-2" clearable />
                    <el-input v-model="prize.description" placeholder="奖品描述" class="mb-2" clearable type="textarea"
                      :rows="2" />
                    <div class="flex items-center gap-4">
                      <div class="flex items-center">
                        <span class="text-sm mr-2">中奖人数:</span>
                        <el-input-number v-model="prize.count" :min="1" :max="100" size="small" />
                      </div>
                      <el-checkbox v-model="prize.drawOneByOne" label="逐个抽取" />
                    </div>
                  </div>
                  <el-button @click="removePrize(index)" type="danger" size="small" text circle>
                    <el-icon>
                      <Close />
                    </el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 中间参与名单区 -->
        <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 class="text-2xl font-semibold mb-6 flex items-center">
            <el-icon class="mr-2">
              <List />
            </el-icon>
            参与名单
          </h2>

          <div class="h-[1000px] overflow-hidden flex flex-col">
            <div class="mb-4 flex justify-between items-center gap-4">
              <div class="flex-1">
                <el-input v-model="searchQuery" placeholder="搜索姓名..." clearable>
                  <template #prefix>
                    <el-icon>
                      <Search />
                    </el-icon>
                  </template>
                </el-input>
              </div>
              <div class="text-sm whitespace-nowrap">
                总计: {{ filteredUsers.length }} / 中奖: {{ winners.length }}
              </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar">
              <el-table :data="filteredUsers" height="100%" style="width: 100%" stripe empty-text="暂无数据或未导入名单">
                <el-table-column prop="name" label="姓名" min-width="120">
                  <template #default="{ row }">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <img :src="row.avatar" class="w-full h-full object-cover" />
                      </div>
                      <span>{{ row.name }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="prize" label="奖项">
                  <template #default="{ row }">
                    <el-tag v-if="row.prize" :type="getPrizeTagType(row.prize)" size="small" effect="dark">
                      {{ row.prize }}
                    </el-tag>
                    <span v-else class="text-gray-400">-</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>

        <!-- 右侧抽奖结果区 -->
        <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 class="text-2xl font-semibold mb-6 flex items-center">
            <el-icon class="mr-2">
              <Star />
            </el-icon>
            抽奖结果
          </h2>

          <div class="space-y-4">
            <div v-for="prize in prizes" :key="prize.name" class="bg-black/20 rounded-lg p-4">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-medium">{{ prize.name }}</h3>
                <span class="text-sm text-gray-400">
                  {{ getPrizeWinners(prize.name).length }}/{{ prize.count }}
                </span>
              </div>
              <div class="space-y-2">
                <div v-for="winner in getPrizeWinners(prize.name)" :key="winner.name"
                  class="bg-white/5 p-2 rounded-lg text-sm">
                  {{ winner?.name || '-' }}
                </div>
                <div v-if="getPrizeWinners(prize.name).length === 0" class="text-center text-gray-400 py-2">
                  暂无中奖记录
                </div>
              </div>
            </div>
          </div>
          <el-button type="primary" class="mt-4" @click="exportWinners">导出结果</el-button>
        </div>
      </div>

      <!-- 开始活动按钮 -->
      <div class="flex justify-center mt-8">
        <el-button @click="openDrawDialog" type="success" size="large">开始活动</el-button>
      </div>
    </div>

    <!-- 抽奖弹窗 -->
    <el-dialog v-model="showDrawDialog" title="选择奖项" width="80%" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false" class="draw-dialog">
      <div class="flex gap-8">
        <!-- 左侧奖项列表 -->
        <div class="w-64">
          <div class="text-lg font-bold mb-4">奖项列表</div>
          <div class="space-y-2">
            <div v-for="(prize, index) in prizes" :key="prize.name" class="prize-item"
              :class="{ 'prize-item-active': selectedPrize === index }" @click="selectPrize(index)">
              <div class="flex items-center justify-between">
                <span>{{ prize.name }}</span>
                <el-tag :type="prize.completed ? 'success' : 'warning'" size="small">
                  {{ prize.completed ? '已完成' : '进行中' }}
                </el-tag>
              </div>
              <div class="text-sm text-gray-400 mt-1">
                已抽取 {{ getPrizeWinners(prize.name).length }}/{{ prize.count }}
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧抽奖动画和结果展示 -->
        <div class="flex-1">
          <div v-if="drawing" class="text-center">
            <div class="text-4xl font-bold text-yellow-400 mb-2">
              {{ currentPrizeName }}
            </div>
            <div class="text-sm text-gray-300 mb-8">
              正在抽取第 {{ currentWinnerIndex + 1 }} / {{ currentPrizeCount }} 位
            </div>

            <div class="relative h-96 mb-8">
              <div class="drawing-container">
                <div class="coin-flip">
                  <div class="coin-front">
                    <img :src="currentDrawAvatar" class="avatar-image" />
                  </div>
                  <div class="coin-back">
                    <img :src="currentDrawAvatar" class="avatar-image" />
                  </div>
                </div>
                <div class="drawing-glow"></div>
              </div>
            </div>
          </div>
          <div v-else-if="showWinnerResult" class="text-center">
            <div class="text-4xl font-bold text-yellow-400 mb-2">
              {{ currentPrizeName }}
            </div>
            <div class="text-sm text-gray-300 mb-8">
              恭喜以下 {{ currentWinnerIndex + 1 }} 位获奖者
            </div>

            <div class="winners-grid">
              <div v-for="(winner, index) in currentWinnersList" :key="index" class="winner-item">
                <div class="winner-avatar">
                  <img :src="winner.avatar" class="avatar-image" />
                </div>
                <div class="winner-name">{{ winner.name }}</div>
              </div>
            </div>

            <div class="mt-8">
              <el-button v-if="hasRemainingSlots" type="primary" @click="continueDraw" class="continue-btn">
                继续抽取
              </el-button>
              <el-button @click="closeWinnerDialog" class="close-btn"> 关闭 </el-button>
            </div>
          </div>
          <div v-else class="text-center">
            <template v-if="selectedPrize !== null">
              <div class="mb-8">
                <div class="text-3xl font-bold text-yellow-400 mb-2">
                  {{ currentPrizeName }}
                </div>
                <div class="text-sm text-gray-400 mb-4">
                  剩余名额: {{ currentPrizeCount - currentWinnerIndex }}
                </div>
                <div class="bg-white/5 rounded-lg p-4 mb-6">
                  <div class="text-lg font-medium mb-2">已中奖名单</div>
                  <div class="space-y-2">
                    <div v-for="winner in getPrizeWinners(currentPrizeName)" :key="winner.name"
                      class="text-sm bg-white/10 p-2 rounded">
                      {{ winner.name }}
                    </div>
                    <div v-if="getPrizeWinners(currentPrizeName).length === 0" class="text-gray-400">
                      暂无中奖记录
                    </div>
                  </div>
                </div>
              </div>
              <el-button type="primary" size="large" class="!h-16 !text-xl" @click="startDraw"
                :disabled="!canStartDraw">
                开始抽奖
              </el-button>
            </template>
            <div v-else class="text-gray-400">请选择要抽取的奖项</div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDrawDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import {
  Setting,
  User,
  Trophy,
  Plus,
  Close,
  List,
  Search,
  Star,
  UploadFilled,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 类型定义
interface User {
  name: string
  avatar: string
  won: boolean
  prize: string
}

interface Prize {
  name: string
  count: number
  completed: boolean
  description: string
  drawOneByOne: boolean
}

// 数据
const users = ref<User[]>([])
const prizes = ref<Prize[]>([
  { name: '特等奖', count: 1, completed: false, description: '', drawOneByOne: true },
  { name: '一等奖', count: 3, completed: false, description: '', drawOneByOne: true },
  { name: '二等奖', count: 5, completed: false, description: '', drawOneByOne: true },
  { name: '三等奖', count: 10, completed: false, description: '', drawOneByOne: true },
])
const winners = ref<User[]>([])
const searchQuery = ref('')
const selectedPrize = ref<number | null>(null)
const drawing = ref(false)
const currentDrawName = ref('')
const currentWinnerIndex = ref(0)
const currentPrizeCount = ref(0)
const progress = ref(0)
const showDrawDialog = ref(false)
const showWinnerResult = ref(false)
const currentDrawAvatar = ref('')
const currentWinnersList = ref<User[]>([])

// 计算属性
const filteredUsers = computed(() => {
  return users.value.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const currentPrizeName = computed(() => {
  return selectedPrize.value !== null ? prizes.value[selectedPrize.value].name : ''
})

const canStartDraw = computed(() => {
  if (selectedPrize.value === null) return false
  const prize = prizes.value[selectedPrize.value]
  const availableUsers = users.value.filter((user) => !user.won)
  const remainingSlots = prize.count - getPrizeWinners(prize.name).length
  return availableUsers.length > 0 && remainingSlots > 0 && !prize.completed
})

const hasRemainingSlots = computed(() => {
  if (!selectedPrize.value) return false
  const prize = prizes.value[selectedPrize.value]
  const currentWinners = winners.value.filter((w) => w.prize === prize.name).length
  return currentWinners < prize.count
})

// 方法
const handleFileUpload = async (file: { raw: File }) => {
  try {
    const data = await readExcelFile(file.raw) // 使用 file.raw 获取原始文件对象
    if (data && data.length > 0) {
      // 检查数据格式
      const firstRow = data[0]
      if (!firstRow.name) {
        ElMessage.error('Excel 文件格式不正确，请确保 A2 开始为姓名！')
        return
      }

      users.value = data
      ElMessage.success(`成功导入 ${users.value.length} 名参与者`)
    } else {
      ElMessage.warning('Excel 文件为空或格式不正确')
    }
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败，请检查文件格式是否正确')
  }
}

const readExcelFile = (file: File) => {
  return new Promise<User[]>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          reject(new Error('文件读取失败'))
          return
        }
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // 将 Excel 数据转换为 JSON，从第二行开始（跳过表头）
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          range: 1, // 从第二行开始读取
          header: ['name', 'avatar'], // 直接指定列名
        }) as { name?: string; avatar?: string }[]

        // 处理数据，确保每个用户对象都包含必要的字段
        const result: User[] = jsonData.map((row: { name?: string; avatar?: string }) => ({
          name: row.name || '',
          avatar: row.avatar || '/default-avatar.png',
          won: false,
          prize: '',
        }))

        resolve(result)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file)
  })
}

const addPrize = () => {
  prizes.value.push({
    name: `奖项${prizes.value.length + 1}`,
    count: 1,
    completed: false,
    description: '',
    drawOneByOne: true,
  })
}

const removePrize = async (index: number) => {
  try {
    await ElMessageBox.confirm('确定删除该奖项吗？已中奖记录不会被删除', '提示', {
      type: 'warning',
    })
    prizes.value.splice(index, 1)
  } catch {
    // 用户取消
  }
}

const getPrizeTagType = (prize: string) => {
  if (prize.includes('特等')) return 'danger'
  if (prize.includes('一等')) return 'warning'
  if (prize.includes('二等')) return 'primary'
  if (prize.includes('三等')) return 'success'
  return 'info'
}

const openDrawDialog = () => {
  showDrawDialog.value = true
}

const startDraw = () => {
  if (!canStartDraw.value) return

  if (selectedPrize.value === null) return
  const prize = prizes.value[selectedPrize.value]
  const availableUsers = users.value.filter((user) => !user.won)

  if (availableUsers.length === 0) {
    ElMessage.warning('没有可抽取的参与者！')
    return
  }

  const remainingSlots = prize.count - getPrizeWinners(prize.name).length
  if (remainingSlots <= 0) {
    ElMessage.warning(`${prize.name}已抽取完毕！`)
    prize.completed = true
    selectedPrize.value = null
    showDrawDialog.value = false
    return
  }

  drawing.value = true
  currentDrawName.value = ''
  currentDrawAvatar.value = ''

  // 如果是一次性抽取，也显示动画效果
  if (!prize.drawOneByOne) {
    const winners: User[] = []
    const availableUsersCopy = [...availableUsers]
    const drawCount = Math.min(remainingSlots, availableUsersCopy.length)

    let animationCount = 0
    const maxAnimations = 30
    const animationInterval = 50

    const animate = () => {
      if (animationCount >= maxAnimations) {
        // 动画结束后，抽取实际的中奖者
        for (let i = 0; i < drawCount; i++) {
          const randomIndex = Math.floor(Math.random() * availableUsersCopy.length)
          const winner = availableUsersCopy.splice(randomIndex, 1)[0]
          winners.push(winner)
        }

        // 更新中奖者状态
        winners.forEach((winner) => {
          winner.won = true
          winner.prize = prize.name
        })

        // 更新奖项状态
        const currentWinnersCount = winners.filter((w) => w.prize === prize.name).length
        if (currentWinnersCount >= prize.count) {
          prize.completed = true
        }

        // 显示结果
        drawing.value = false
        showWinnerResult.value = true
        currentWinnersList.value = winners
        ElMessage.success(`恭喜 ${winners.length} 位参与者获得${prize.name}！`)
        return
      }

      const randomIndex = Math.floor(Math.random() * availableUsersCopy.length)
      const randomUser = availableUsersCopy[randomIndex]
      currentDrawName.value = randomUser.name
      currentDrawAvatar.value = randomUser.avatar
      animationCount++

      const nextInterval = animationInterval + animationCount * 10
      setTimeout(animate, nextInterval)
    }

    animate()
    return
  }

  // 逐个抽取的动画逻辑
  let animationCount = 0
  const maxAnimations = 30 // 增加动画次数
  const animationInterval = 50 // 减少动画间隔，使动画更快

  const animate = () => {
    if (animationCount >= maxAnimations) {
      drawNextWinner()
      return
    }

    const randomIndex = Math.floor(Math.random() * availableUsers.length)
    const randomUser = availableUsers[randomIndex]
    currentDrawName.value = randomUser.name
    currentDrawAvatar.value = randomUser.avatar
    animationCount++

    // 逐渐减慢动画速度，但保持较快的速度
    const nextInterval = animationInterval + animationCount * 10
    setTimeout(animate, nextInterval)
  }

  animate()
}

const drawNextWinner = () => {
  if (selectedPrize.value === null) return
  const prize = prizes.value[selectedPrize.value]
  const availableUsers = users.value.filter((user) => !user.won)

  if (availableUsers.length === 0) {
    ElMessage.warning('没有可抽取的参与者！')
    drawing.value = false
    return
  }

  const randomIndex = Math.floor(Math.random() * availableUsers.length)
  const winner = availableUsers[randomIndex]

  // 更新中奖者状态
  winner.won = true
  winner.prize = prize.name

  // 更新当前奖项的中奖人数
  const currentWinnersCount = winners.value.filter((w) => w.prize === prize.name).length

  // 检查是否抽满
  if (currentWinnersCount >= prize.count) {
    prize.completed = true
  }

  // 显示结果
  drawing.value = false
  showWinnerResult.value = true
  currentWinnersList.value = [winner]
  ElMessage.success(`恭喜 ${winner.name} 获得${prize.name}！`)
}

const continueDraw = () => {
  if (!hasRemainingSlots.value) {
    ElMessage.warning('该奖项已抽取完毕！')
    return
  }
  showWinnerResult.value = false
  startDraw()
}

const closeDrawDialog = () => {
  showDrawDialog.value = false
  if (selectedPrize.value === null) return
  const prize = prizes.value[selectedPrize.value]

  // 检查是否已经抽完所有名额
  const currentWinners = winners.value.filter((w) => w.prize === prize.name).length
  if (currentWinners >= prize.count) {
    prize.completed = true
    selectedPrize.value = null
  }
}

const exportWinners = () => {
  if (winners.value.length === 0) {
    ElMessage.warning('没有可导出的中奖数据')
    return
  }

  try {
    // 生成导出数据（含时间戳和奖项分组）
    const exportData = {
      meta: {
        title: `${new Date().toLocaleDateString()} 抽奖结果`,
        exportedAt: new Date().toISOString(),
        totalWinners: winners.value.length,
      },
      prizes: prizes.value.map((prize) => ({
        name: prize.name,
        count: prize.count,
        winners: winners.value
          .filter((w) => w.prize === prize.name)
          .map((w, i) => ({ no: i + 1, name: w.name })),
      })),
    }

    // 提供格式选择
    ElMessageBox.confirm('请选择导出格式', '导出选项', {
      distinguishCancelAndClose: true,
      confirmButtonText: 'Excel格式',
      cancelButtonText: 'CSV格式',
    })
      .then(() => {
        // Excel导出逻辑
        const workbook = XLSX.utils.book_new()
        exportData.prizes.forEach((prize) => {
          const worksheet = XLSX.utils.json_to_sheet(
            prize.winners.map((w) => ({
              奖项名称: prize.name,
              序号: w.no,
              获奖人: w.name,
            })),
          )
          XLSX.utils.book_append_sheet(workbook, worksheet, prize.name)
        })

        // 添加汇总表
        const summarySheet = XLSX.utils.json_to_sheet([
          { 总奖项数: exportData.prizes.length },
          { 总获奖人数: exportData.meta.totalWinners },
          { 导出时间: new Date(exportData.meta.exportedAt).toLocaleString() },
        ])
        XLSX.utils.book_append_sheet(workbook, summarySheet, '汇总信息')

        XLSX.writeFile(workbook, `${exportData.meta.title}.xlsx`)
        ElMessage.success('Excel导出成功')
      })
      .catch((action) => {
        if (action === 'cancel') {
          // CSV导出逻辑
          let csvContent = '奖项名称,序号,获奖人\n'
          exportData.prizes.forEach((prize) => {
            prize.winners.forEach((w) => {
              csvContent += `${prize.name},${w.no},${w.name}\n`
            })
          })

          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = `${exportData.meta.title}.csv`
          link.click()
          ElMessage.success('CSV导出成功')
        }
      })
  } catch (error: unknown) {
    console.error('导出失败:', error)
    ElMessage.error(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

const getPrizeWinners = (prizeName: string) => {
  return users.value.filter((user) => user.prize === prizeName)
}

const selectPrize = (index: number) => {
  const prize = prizes.value[index]
  if (prize.completed) {
    ElMessage.warning(`${prize.name}已抽取完毕！`)
    return
  }
  selectedPrize.value = index
  currentWinnerIndex.value = getPrizeWinners(prize.name).length
  currentPrizeCount.value = prize.count
  drawing.value = false
  showWinnerResult.value = false
  progress.value = 0
  currentDrawName.value = ''
}

const closeWinnerDialog = () => {
  showWinnerResult.value = false
  if (selectedPrize.value === null) return
  const prize = prizes.value[selectedPrize.value]

  // 检查是否已经抽完所有名额
  const currentWinners = winners.value.filter((w) => w.prize === prize.name).length
  if (currentWinners >= prize.count) {
    prize.completed = true
    selectedPrize.value = null
    showDrawDialog.value = false
  }
}
</script>

<style>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 奖项列表样式 */
.prize-item {
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 8px;
  box-sizing: border-box;
  border: 2px solid transparent;
}

.prize-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.prize-item-active {
  background: rgba(255, 255, 255, 0.2);
  border-color: #fbbf24;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.2);
}

.prize-item.completed {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 中奖名字闪烁动画 */
@keyframes winner-blink {
  0% {
    transform: scale(1);
    text-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
  }

  50% {
    transform: scale(1.05);
    text-shadow:
      0 0 30px rgba(251, 191, 36, 0.6),
      0 0 40px rgba(251, 191, 36, 0.4),
      0 0 50px rgba(251, 191, 36, 0.2);
  }

  100% {
    transform: scale(1);
    text-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
  }
}

.winner-dialog {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95)) !important;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
}

.winner-dialog .el-dialog__header {
  display: none;
}

.winner-dialog .el-dialog__body {
  padding: 0;
}

.winner-dialog .el-dialog__headerbtn {
  display: none;
}

.prize-title {
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to right, #fbbf24, #f59e0b);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  letter-spacing: 2px;
}

.winner-name {
  animation: winner-blink 2s ease-in-out infinite;
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
  letter-spacing: 4px;
  font-weight: 800;
}

.continue-btn {
  background: linear-gradient(135deg, #fbbf24, #f59e0b) !important;
  border: none !important;
  padding: 12px 36px !important;
  font-size: 1.2rem !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
  color: #1e293b !important;
  font-weight: 600 !important;
}

.continue-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
}

.continue-btn:active {
  transform: translateY(1px) !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
}

/* 标签样式 */
:deep(.el-tag) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}

:deep(.el-tag--success) {
  background: rgba(34, 197, 94, 0.2) !important;
  border-color: rgba(34, 197, 94, 0.3) !important;
  color: #4ade80 !important;
}

:deep(.el-tag--warning) {
  background: rgba(251, 191, 36, 0.2) !important;
  border-color: rgba(251, 191, 36, 0.3) !important;
  color: #fbbf24 !important;
}

/* 抽奖动画样式 */
.drawing-container {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.coin-flip {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  animation: coinFlip 0.4s linear infinite;
}

.coin-front,
.coin-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  backface-visibility: hidden;
  overflow: hidden;
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
  transition: transform 0.1s ease-out;
}

.coin-back {
  transform: rotateY(180deg);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: opacity 0.1s ease-out;
}

.drawing-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0) 70%);
  animation: glowPulse 1s ease-in-out infinite alternate;
  pointer-events: none;
}

.winners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.winner-item {
  text-align: center;
  animation: winnerAppear 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.winner-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fbbf24;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
}

.winner-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
}

@keyframes coinFlip {
  0% {
    transform: rotateY(0deg);
  }

  100% {
    transform: rotateY(360deg);
  }
}

@keyframes winnerAppear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glowPulse {
  0% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(0.8);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}
</style>
