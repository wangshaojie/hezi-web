<template>
  <LocalToolsDetailComp
    title="小红书封面生成器"
    subtitle="一键生成多种风格封面"
    :showSecurityBanner="true"
  >
    <!-- 主内容插槽content -->
    <template #content>
      <!-- 主内容区 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
        <!-- 上传与设置面板 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 上传区域 -->
          <el-upload
            class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors"
            drag
            action=""
            accept="image/*"
            :auto-upload="false"
            :on-change="handleUpload"
            :show-file-list="false"
          >
            <el-icon class="el-icon--upload text-4xl text-blue-500"><upload-filled /></el-icon>
            <div class="mt-4 text-center">
              <p class="text-lg font-medium text-gray-700">拖放图片到此处</p>
              <p class="text-sm text-gray-500 mt-1">或点击选择文件</p>
              <p class="text-xs text-gray-400 mt-2">支持JPG/PNG/WebP格式</p>
            </div>
          </el-upload>

          <!-- 水印设置 -->
          <div class="bg-gray-50 p-5 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <el-icon class="mr-2"><setting /></el-icon>水印设置
            </h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">水印内容</label>
                <el-input v-model="watermarkText" placeholder="版权信息/品牌名称" clearable />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">文字颜色</label>
                  <el-color-picker
                    v-model="watermarkColor"
                    show-alpha
                    :predefine="predefineColors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">字体大小</label>
                  <el-slider v-model="watermarkSize" :min="12" :max="72" :step="2" show-input />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">透明度</label>
                  <el-slider
                    v-model="watermarkOpacity"
                    :min="0.1"
                    :max="1"
                    :step="0.1"
                    show-input
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">旋转角度</label>
                  <el-slider v-model="watermarkAngle" :min="-45" :max="45" :step="5" show-input />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">水印密度</label>
                <el-radio-group v-model="watermarkDensity" size="small">
                  <el-radio-button label="sparse">稀疏</el-radio-button>
                  <el-radio-button label="normal">正常</el-radio-button>
                  <el-radio-button label="dense">密集</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>

        <!-- 预览区 -->
        <div class="lg:col-span-2">
          <div class="sticky top-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold flex items-center">
                <el-icon class="mr-2"><View /></el-icon>效果预览
              </h3>
              <div class="flex space-x-2">
                <el-tooltip content="原始图片" placement="top">
                  <el-button
                    :type="viewMode === 'original' ? 'primary' : ''"
                    @click="viewMode = 'original'"
                  >
                    <el-icon><PictureFilled /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="水印效果" placement="top">
                  <el-button
                    :type="viewMode === 'watermarked' ? 'primary' : ''"
                    @click="viewMode = 'watermarked'"
                  >
                    <el-icon><watermelon /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="对比视图" placement="top">
                  <el-button
                    :type="viewMode === 'compare' ? 'primary' : ''"
                    @click="viewMode = 'compare'"
                  >
                    <el-icon><copy-document /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>

            <!-- 预览画布 -->
            <div
              class="relative border rounded-lg overflow-hidden bg-gray-100 min-h-[400px] flex items-center justify-center"
            >
              <template v-if="!imageUrl">
                <div class="text-center p-8 text-gray-400">
                  <el-icon class="text-4xl"><picture-filled /></el-icon>
                  <p class="mt-2">请上传图片开始编辑</p>
                </div>
              </template>
              <template v-else>
                <img
                  v-show="viewMode === 'original'"
                  :src="imageUrl"
                  class="max-w-full max-h-[70vh] mx-auto"
                />
                <canvas
                  v-show="viewMode === 'watermarked'"
                  ref="watermarkedCanvas"
                  class="max-w-full max-h-[70vh] mx-auto border"
                />
                <div
                  v-show="viewMode === 'compare'"
                  class="compare-container w-full h-[70vh] relative overflow-hidden"
                >
                  <img
                    :src="imageUrl"
                    class="absolute left-0 top-0 h-full max-w-[50%] object-contain"
                  />
                  <canvas
                    ref="compareCanvas"
                    class="absolute right-0 top-0 h-full max-w-[50%] object-contain border-l-2 border-gray-200"
                  />
                  <div
                    class="divider-line absolute top-0 bottom-0 left-1/2 w-1 bg-blue-500 cursor-col-resize"
                    @mousedown="startDrag"
                  ></div>
                </div>
              </template>
            </div>

            <!-- 操作按钮 -->
            <div class="mt-6 flex justify-end space-x-3">
              <el-button @click="resetAll" plain>重置所有</el-button>
              <el-button type="primary" @click="applyWatermark" :loading="isProcessing">
                <template #icon>
                  <el-icon><magic-stick /></el-icon>
                </template>
                应用水印
              </el-button>
              <el-button type="success" @click="downloadImage" :disabled="!watermarkedImageUrl">
                <template #icon>
                  <el-icon><download /></el-icon>
                </template>
                下载图片
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </LocalToolsDetailComp>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import LocalToolsDetailComp from '@/components/LocalToolsDetailComp.vue'
import {
  UploadFilled,
  Setting,
  Watermelon,
  CopyDocument,
  PictureFilled,
  MagicStick,
  Download,
  View,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const imageUrl = ref<string | null>(null)
const watermarkText = ref('© 2025 My Company')
const watermarkColor = ref('rgba(255,255,255,0.7)')
const watermarkSize = ref(36)
const watermarkOpacity = ref(0.7)
const watermarkAngle = ref(30)
const watermarkDensity = ref('normal')
const viewMode = ref('watermarked')
const isProcessing = ref(false)
const watermarkedImageUrl = ref('')
const predefineColors = ref([
  'rgba(255, 255, 255, 0.7)',
  'rgba(0, 0, 0, 0.5)',
  'rgba(255, 0, 0, 0.6)',
  'rgba(0, 255, 0, 0.6)',
  'rgba(0, 0, 255, 0.6)',
])

// Refs
const watermarkedCanvas = ref(null)
const compareCanvas = ref(null)
let isDragging = false

// 处理图片上传
const handleUpload = (file: { raw: Blob }) => {
  if (!file.raw.type.match('image.*')) {
    ElMessage.error('请上传有效的图片文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const target = e.target as FileReader
    if (target.result) {
      imageUrl.value = target.result as string
    }
    nextTick(() => {
      applyWatermark()
    })
  }
  reader.readAsDataURL(file.raw)
}

// 应用水印
const applyWatermark = () => {
  if (!imageUrl.value) return

  isProcessing.value = true
  const img = new Image()
  img.onload = () => {
    // 获取 Canvas 元素并断言其存在
    const canvas = watermarkedCanvas.value as unknown as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      console.error('无法获取 Canvas 2D 上下文')
      isProcessing.value = false
      return
    }

    // 设置画布尺寸
    const maxWidth = 1200
    const ratio = Math.min(maxWidth / img.width, 1)
    canvas.width = img.width * ratio
    canvas.height = img.height * ratio

    // 绘制原始图片
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    // 设置水印样式
    ctx.font = `bold ${watermarkSize.value}px Arial`
    ctx.fillStyle = watermarkColor.value
    ctx.globalAlpha = watermarkOpacity.value
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 计算水印间距
    const textWidth = ctx.measureText(watermarkText.value).width
    const spacing = {
      sparse: textWidth * 3,
      normal: textWidth * 2,
      dense: textWidth * 1.2,
    }[watermarkDensity.value]

    // 绘制水印
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((watermarkAngle.value * Math.PI) / 180)

    for (let x = -canvas.width; x < canvas.width * 2; x += spacing || textWidth * 2) {
      for (let y = -canvas.height; y < canvas.height * 2; y += spacing || textWidth * 2) {
        ctx.fillText(watermarkText.value, x, y)
      }
    }

    ctx.restore()
    isProcessing.value = false

    // 断言 canvas.toDataURL 返回值不为空
    watermarkedImageUrl.value = canvas.toDataURL('image/png')

    // 更新对比画布
    updateCompareCanvas()
  }
  img.src = imageUrl.value
}

// 更新对比画布
const updateCompareCanvas = () => {
  if (!imageUrl.value || !watermarkedImageUrl.value) return

  const img = new Image()
  img.onload = () => {
    const canvas = compareCanvas.value as unknown as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    // 设置画布尺寸与主画布一致
    // 确保 watermarkedCanvas 不为空
    canvas.width = (watermarkedCanvas.value as unknown as HTMLCanvasElement)?.width || 0
    canvas.height = (watermarkedCanvas.value as unknown as HTMLCanvasElement)?.height || 0

    // 绘制水印图片
    ctx.drawImage(watermarkedCanvas.value as unknown as HTMLCanvasElement, 0, 0)
  }
  img.src = watermarkedImageUrl.value
}

// 下载图片
const downloadImage = () => {
  if (!watermarkedImageUrl.value) return

  const link = document.createElement('a')
  link.download = `watermarked-${new Date().getTime()}.png`
  link.href = watermarkedImageUrl.value
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 重置所有设置
const resetAll = () => {
  imageUrl.value = ''
  watermarkText.value = '© 2025 My Company'
  watermarkColor.value = 'rgba(255,255,255,0.7)'
  watermarkSize.value = 36
  watermarkOpacity.value = 0.7
  watermarkAngle.value = 30
  watermarkDensity.value = 'normal'
  viewMode.value = 'watermarked'
  watermarkedImageUrl.value = ''
}

// 对比视图拖拽功能
const startDrag = (e: { preventDefault: () => void }) => {
  isDragging = true
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  e.preventDefault()
}

const handleDrag = (e: { clientX: number }) => {
  if (!isDragging) return
  const container = document.querySelector('.compare-container') as HTMLElement
  const rect = container.getBoundingClientRect()
  let pos = ((e.clientX - rect.left) / rect.width) * 100
  pos = Math.max(25, Math.min(75, pos)) // 限制拖动范围

  const leftImg = container.querySelector('img') as HTMLImageElement
  const rightCanvas = container.querySelector('canvas') as HTMLCanvasElement
  const divider = container.querySelector('.divider-line') as HTMLDivElement

  leftImg.style.maxWidth = `${pos}%`
  rightCanvas.style.maxWidth = `${100 - pos}%`
  divider.style.left = `${pos}%`
}

const stopDrag = () => {
  isDragging = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 监听水印设置变化
watch(
  [
    watermarkText,
    watermarkColor,
    watermarkSize,
    watermarkOpacity,
    watermarkAngle,
    watermarkDensity,
  ],
  () => {
    if (imageUrl.value) {
      applyWatermark()
    }
  },
)
</script>

<style scoped>
.upload-area :deep(.el-upload) {
  width: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100%;
  padding: 2rem;
  border: none;
  background-color: rgb(249 250 251);
}

.upload-area :deep(.el-upload-dragger:hover) {
  background-color: rgb(239 246 255);
}

.compare-container {
  user-select: none;
}

.divider-line {
  transform: translateX(-50%);
  transition: background-color 0.2s;
}

.divider-line:hover {
  background-color: rgb(37, 99, 235);
}
</style>
