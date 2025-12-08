<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100"
  >
    <!-- 顶部导航栏 -->
    <header
      class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm"
    >
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg
            class="w-6 h-6 text-indigo-600 dark:text-indigo-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.44 15.21c-.24.14-.54.14-.78 0l-2.74-1.69c-.36.29-.79.49-1.26.54v1.27c0 .39-.31.72-.72.72h-.87c-.39 0-.72-.31-.72-.72V15c-1.1 0-2-.9-2-2V7c0-.39.31-.72.72-.72h1.27c.06-.46.26-.89.54-1.25L8.7 3.69c.14-.24.14-.54 0-.78s-.54-.14-.78 0l-3.14 1.93c-.31.19-.5.51-.5.86v10.74c0 .36.19.68.5.86l3.14 1.93c.24.14.54.14.78 0l3.14-1.93c.31-.19.5-.5.5-.86V7.37c0-.36-.19-.68-.5-.86l-3.14-1.93c-.14-.24-.44-.36-.7-.36-.26 0-.56.12-.7.36L8.7 4.87l2.74 1.69c.36-.29.79-.49 1.26-.54V3.72c0-.39.31-.72.72-.72h.87c.39 0 .72.31.72.72V7c1.1 0 2 .9 2 2v6c0 .39-.31.72-.72.72h-1.27c-.06.46-.26.89-.54 1.25l2.74 1.69c.14.24.14.54 0 .78-.24.14-.54.14-.78 0l-2.74-1.69z"
            />
          </svg>
          <h1 class="text-xl font-bold">图片合并工具</h1>
        </div>
        <button
          @click="exportImage"
          :disabled="!hasImages"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          导出图片
        </button>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <!-- 排版选择区 -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-3">选择排版方式</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <template v-for="(layout, index) in layouts" :key="index">
            <button
              @click="selectLayout(index)"
              class="relative overflow-hidden rounded-lg border-2 transition-all duration-200 hover:shadow-md"
              :class="
                selectedLayout === index
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              "
            >
              <div
                class="aspect-video p-2"
                :style="{
                  display: 'grid',
                  gridTemplateColumns: layout.columns,
                  gridTemplateRows: layout.rows,
                  gap: '4px',
                }"
              >
                <div
                  v-for="i in layout.count"
                  :key="i"
                  class="bg-slate-200 dark:bg-slate-700 rounded"
                ></div>
              </div>
              <span
                class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 text-center"
              >
                {{ layout.name }}
              </span>
            </button>
          </template>
        </div>
      </section>

      <!-- 图片上传/粘贴区 -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-3">
          添加图片 ({{ currentImages.length }}/{{ maxImages }})
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 上传区域 -->
          <div class="md:col-span-2">
            <el-upload
              class="upload-demo"
              drag
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              :file-list="fileList"
              :limit="maxImages - currentImages.length"
              :on-exceed="handleExceed"
              accept="image/*"
            >
              <i class="el-icon-upload text-2xl text-slate-400"></i>
              <div class="el-upload__text">
                <em>点击或拖拽图片到此处上传</em>
              </div>
              <div class="el-upload__tip text-xs text-slate-500 dark:text-slate-400 mt-1">
                支持 JPG、PNG、WEBP 等格式，最多可上传 {{ maxImages }} 张图片
              </div>
            </el-upload>

            <!-- 粘贴提示 -->
            <div
              class="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm flex items-center gap-2"
            >
              <svg
                class="w-4 h-4 text-slate-500 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>也可以直接复制图片（Ctrl+C）后粘贴到页面（Ctrl+V）</span>
            </div>
          </div>

          <!-- 已选图片预览 -->
          <div class="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
            <h3 class="text-sm font-medium mb-3">已选图片</h3>
            <div class="space-y-3 max-h-60 overflow-y-auto">
              <div
                v-if="currentImages.length === 0"
                class="text-center py-6 text-slate-500 dark:text-slate-400 text-sm"
              >
                暂无图片
              </div>
              <div v-for="(img, index) in currentImages" :key="index" class="relative group">
                <img :src="img.url" alt="预览图" class="w-full h-24 object-cover rounded-md" />
                <button
                  @click="removeImage(index)"
                  class="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i class="el-icon-close text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 预览和设置区 -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 实时预览 -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
          <h2 class="text-lg font-semibold mb-3">实时预览</h2>
          <div
            class="relative w-full aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden"
          >
            <div
              v-if="currentImages.length > 0"
              ref="previewContainer"
              class="w-full h-full"
              :style="{
                display: 'grid',
                gridTemplateColumns: currentLayout.columns,
                gridTemplateRows: currentLayout.rows,
                gap: `${gapSize}px`,
                padding: `${paddingSize}px`,
              }"
            >
              <div
                v-for="(img, index) in currentImages"
                :key="index"
                class="overflow-hidden rounded-md"
              >
                <img :src="img.url" alt="合并图" class="w-full h-full object-cover" />
              </div>
              <!-- 占位图 -->
              <div
                v-for="i in currentLayout.count - currentImages.length"
                :key="`placeholder-${i}`"
                class="bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center text-slate-400"
              >
                <i class="el-icon-plus text-2xl"></i>
              </div>
            </div>
            <div v-else class="text-center text-slate-500 dark:text-slate-400">
              <i class="el-icon-picture-outline text-4xl mb-2"></i>
              <p>添加图片后即可预览合并效果</p>
            </div>
          </div>
        </div>

        <!-- 合并设置 -->
        <div class="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
          <h2 class="text-lg font-semibold mb-3">合并设置</h2>
          <div class="space-y-4">
            <!-- 间距设置 -->
            <div>
              <label class="block text-sm font-medium mb-1">图片间距</label>
              <el-slider v-model="gapSize" :min="0" :max="50" :step="1" class="w-full" />
              <p class="text-xs text-slate-500 dark:text-slate-400 text-right">{{ gapSize }}px</p>
            </div>

            <!-- 内边距设置 -->
            <div>
              <label class="block text-sm font-medium mb-1">整体内边距</label>
              <el-slider v-model="paddingSize" :min="0" :max="100" :step="1" class="w-full" />
              <p class="text-xs text-slate-500 dark:text-slate-400 text-right">
                {{ paddingSize }}px
              </p>
            </div>

            <!-- 背景色设置 -->
            <div>
              <label class="block text-sm font-medium mb-1">背景颜色</label>
              <div class="flex items-center gap-2">
                <el-color-picker
                  v-model="bgColor"
                  :predefine="['#ffffff', '#f5f5f5', '#fafafa', '#000000', '#191919', '#333333']"
                  class="w-full"
                />
                <div
                  :style="{
                    backgroundColor: bgColor,
                    width: '30px',
                    height: '30px',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                  }"
                ></div>
              </div>
            </div>

            <!-- 导出尺寸设置 -->
            <div>
              <label class="block text-sm font-medium mb-1">导出尺寸</label>
              <div class="grid grid-cols-2 gap-2">
                <el-input
                  v-model.number="exportWidth"
                  placeholder="宽度(px)"
                  type="number"
                  min="100"
                  max="4000"
                  class="w-full"
                />
                <el-input
                  v-model.number="exportHeight"
                  placeholder="高度(px)"
                  type="number"
                  min="100"
                  max="4000"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部信息 -->
    <footer
      class="mt-12 py-4 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400"
    >
      <p>图片合并工具 &copy; {{ new Date().getFullYear() }} | 支持上传和粘贴图片</p>
    </footer>

    <!-- 加载中弹窗 -->
    <el-dialog
      title="正在导出图片"
      v-model:visible="isExporting"
      :show-close="false"
      :close-on-click-modal="false"
      width="300px"
    >
      <div class="flex flex-col items-center">
        <el-loading-spinner
          class="text-indigo-600 dark:text-indigo-400"
          size="40"
        ></el-loading-spinner>
        <p class="mt-4 text-slate-700 dark:text-slate-300">请稍候，正在处理图片...</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import {
  ElUpload,
  ElSlider,
  ElColorPicker,
  ElInput,
  ElDialog,
  ElLoadingSpinner,
  ElIcon,
} from 'element-plus'
import { PictureOutline, Plus, Close, Upload } from '@element-plus/icons-vue'

// 排版定义
interface Layout {
  name: string
  columns: string
  rows: string
  count: number
}

// 图片类型定义
interface ImageItem {
  url: string
  file?: File
}

// 预设排版
const layouts = ref<Layout[]>([
  { name: '1行2列', columns: '1fr 1fr', rows: '1fr', count: 2 },
  { name: '2行1列', columns: '1fr', rows: '1fr 1fr', count: 2 },
  { name: '2行2列', columns: '1fr 1fr', rows: '1fr 1fr', count: 4 },
  { name: '3行1列', columns: '1fr', rows: '1fr 1fr 1fr', count: 3 },
  { name: '1行3列', columns: '1fr 1fr 1fr', rows: '1fr', count: 3 },
  { name: '3行2列', columns: '1fr 1fr', rows: '1fr 1fr 1fr', count: 6 },
  { name: '2行3列', columns: '1fr 1fr 1fr', rows: '1fr 1fr', count: 6 },
  { name: '3行3列', columns: '1fr 1fr 1fr', rows: '1fr 1fr 1fr', count: 9 },
])

// 状态管理
const selectedLayout = ref(0)
const currentLayout = ref<Layout>(layouts.value[0])
const currentImages = ref<ImageItem[]>([])
const fileList = ref<any[]>([])
const gapSize = ref(10)
const paddingSize = ref(20)
const bgColor = ref('#ffffff')
const exportWidth = ref(1200)
const exportHeight = ref(800)
const isExporting = ref(false)
const previewContainer = ref<HTMLDivElement | null>(null)

// 计算属性
const maxImages = ref(0)
const hasImages = ref(false)

// 监听选中的排版变化
watch(selectedLayout, (val) => {
  currentLayout.value = layouts.value[val]
  maxImages.value = currentLayout.value.count
})

// 监听图片数量变化
watch(currentImages, (val) => {
  hasImages.value = val.length > 0
  fileList.value = val.map((img) => ({ url: img.url, raw: img.file }))
})

// 初始化
onMounted(() => {
  maxImages.value = currentLayout.value.count
  // 监听粘贴事件
  document.addEventListener('paste', handlePaste)
})

// 处理文件上传
const handleFileChange = (uploadFile: any) => {
  const file = uploadFile.raw
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      currentImages.value.push({
        url: e.target?.result as string,
        file,
      })
    }
    reader.readAsDataURL(file)
  }
}

// 处理粘贴图片
const handlePaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) {
      const file = items[i].getAsFile()
      if (file && currentImages.value.length < maxImages.value) {
        const reader = new FileReader()
        reader.onload = (event) => {
          currentImages.value.push({
            url: event.target?.result as string,
            file,
          })
        }
        reader.readAsDataURL(file)
        break
      } else if (currentImages.value.length >= maxImages.value) {
        ElMessage.warning(`最多只能添加 ${maxImages.value} 张图片`)
      }
    }
  }
}

// 移除图片
const removeImage = (index: number) => {
  currentImages.value.splice(index, 1)
}

// 处理文件超出限制
const handleExceed = () => {
  ElMessage.warning(`最多只能添加 ${maxImages.value} 张图片`)
}

// 选择排版
const selectLayout = (index: number) => {
  selectedLayout.value = index
}

// 导出图片（使用html2canvas）
const exportImage = async () => {
  if (!previewContainer.value || currentImages.value.length === 0) return

  isExporting.value = true

  try {
    // 动态导入html2canvas
    const html2canvas = await import('html2canvas')

    // 创建临时容器用于导出
    const tempContainer = document.createElement('div')
    tempContainer.style.width = `${exportWidth.value}px`
    tempContainer.style.height = `${exportHeight.value}px`
    tempContainer.style.display = 'grid'
    tempContainer.style.gridTemplateColumns = currentLayout.value.columns
    tempContainer.style.gridTemplateRows = currentLayout.value.rows
    tempContainer.style.gap = `${gapSize.value}px`
    tempContainer.style.padding = `${paddingSize.value}px`
    tempContainer.style.backgroundColor = bgColor.value
    tempContainer.style.position = 'absolute'
    tempContainer.style.top = '-9999px'
    tempContainer.style.left = '-9999px'
    document.body.appendChild(tempContainer)

    // 复制预览内容到临时容器
    currentImages.value.forEach((img) => {
      const imgElement = document.createElement('img')
      imgElement.src = img.url
      imgElement.style.width = '100%'
      imgElement.style.height = '100%'
      imgElement.style.objectFit = 'cover'
      imgElement.style.borderRadius = '4px'
      tempContainer.appendChild(imgElement)
    })

    // 补充占位图
    const placeholderCount = currentLayout.value.count - currentImages.value.length
    for (let i = 0; i < placeholderCount; i++) {
      const placeholder = document.createElement('div')
      placeholder.style.backgroundColor = '#e5e7eb'
      placeholder.style.borderRadius = '4px'
      tempContainer.appendChild(placeholder)
    }

    // 等待图片加载完成
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 生成图片
    const canvas = await html2canvas.default(tempContainer, {
      scale: 2, // 提高分辨率
      useCORS: true,
      logging: false,
    })

    // 创建下载链接
    const link = document.createElement('a')
    link.download = `图片合并_${new Date().getTime()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()

    // 清理临时容器
    document.body.removeChild(tempContainer)

    ElMessage.success('图片导出成功！')
  } catch (error) {
    console.error('导出图片失败:', error)
    ElMessage.error('图片导出失败，请重试')
  } finally {
    isExporting.value = false
  }
}
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

/* 修复Element Plus上传组件样式 */
:deep(.el-upload--drag) {
  background-color: white !important;
  border: 2px dashed #e5e7eb !important;
  border-radius: 0.5rem !important;
  padding: 2rem !important;
}

:deep(.el-upload--drag:hover) {
  border-color: #6366f1 !important;
}

:deep(.el-slider__runway) {
  height: 6px !important;
}

:deep(.el-slider__bar) {
  background-color: #6366f1 !important;
  height: 6px !important;
}

:deep(.el-slider__button) {
  width: 16px !important;
  height: 16px !important;
  background-color: #6366f1 !important;
  border-color: #6366f1 !important;
}
</style>
