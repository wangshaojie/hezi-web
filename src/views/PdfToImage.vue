<style>
/* 自定义表单标签颜色 */
.el-form-item__label {
  color: rgb(75 85 99);
}

/* 表格悬停效果 */
.el-table__body tr:hover > td {
  background-color: rgb(239 246 255);
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElUpload, ElProgress } from 'element-plus'
import LocalToolsDetailComp from '@/components/LocalToolsDetailComp.vue'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker?worker'

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker()

const props = defineProps({
  dpi: { type: Number, default: 300 },
  scale: { type: Number, default: 2.5 },
})

const pdfUrl = ref('')
const pdfImages = ref<string[]>([])
const currentPage = ref(0)
const progress = ref(0)
const isConverting = ref(false)

const handleUpload = async (file: Blob | MediaSource) => {
  resetState()
  pdfUrl.value = URL.createObjectURL(file)
  await renderPDF(file)
}

const renderPDF = async (file: Blob | MediaSource) => {
  try {
    isConverting.value = true
    const arrayBuffer = await (file as Blob).arrayBuffer()
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise

    for (let i = 1; i <= pdf.numPages; i++) {
      progress.value = Math.round((i / pdf.numPages) * 100)
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({
        scale: props.scale,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
      })

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', {
        willReadFrequently: true,
      })

      canvas.width = viewport.width * window.devicePixelRatio
      canvas.height = viewport.height * window.devicePixelRatio
      canvas.style.width = `${viewport.width}px`
      canvas.style.height = `${viewport.height}px`

      await page.render({
        canvasContext: context as CanvasRenderingContext2D,
        viewport: viewport,
        transform: [window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0],
      }).promise

      pdfImages.value.push(canvas.toDataURL('image/png', 1.0))
    }
  } finally {
    isConverting.value = false
  }
}

const resetState = () => {
  pdfUrl.value = ''
  pdfImages.value = []
  currentPage.value = 0
  progress.value = 0
}
</script>
<template>
  <LocalToolsDetailComp
    title="小红书封面生成器"
    subtitle="一键生成多种风格封面"
    :showSecurityBanner="true"
  >
    <!-- 主内容插槽content -->
    <template #content>
      <div class="min-h-screen bg-gray-50 p-6">
        <div class="mx-auto space-y-6">
          <!-- 上传区域 -->
          <div class="bg-white rounded-xl shadow p-6">
            <ElUpload
              :show-file-list="false"
              :before-upload="handleUpload"
              accept=".pdf"
              class="w-full"
            >
              <ElButton type="primary" class="w-full">
                <span class="i-carbon-document-pdf mr-2"></span>
                上传PDF文件
              </ElButton>
            </ElUpload>

            <ElProgress v-if="isConverting" :percentage="progress" class="mt-4" />
          </div>

          <!-- 双栏预览 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- PDF预览 -->
            <div class="bg-white rounded-xl shadow p-6">
              <h3 class="text-lg font-semibold mb-4">PDF预览</h3>
              <div class="h-[800px] overflow-auto border border-gray-200 rounded-lg">
                <iframe v-if="pdfUrl" :src="pdfUrl" class="w-full h-full" frameborder="0"></iframe>
                <div v-else class="flex items-center justify-center h-full text-gray-400">
                  请上传PDF文件
                </div>
              </div>
            </div>

            <!-- 图片预览 -->
            <div class="bg-white rounded-xl shadow p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">图片预览</h3>
                <div class="flex space-x-2">
                  <ElButton :disabled="currentPage <= 0" @click="currentPage--" size="small">
                    上一页
                  </ElButton>
                  <ElButton
                    :disabled="currentPage >= pdfImages.length - 1"
                    @click="currentPage++"
                    size="small"
                  >
                    下一页
                  </ElButton>
                </div>
              </div>

              <div
                class="h-[800px] overflow-auto border border-gray-200 rounded-lg flex items-center justify-center"
              >
                <img
                  v-if="pdfImages.length"
                  :src="pdfImages[currentPage]"
                  class="max-w-full max-h-full object-contain"
                />
                <span v-else class="text-gray-400"> 转换后将显示图片 </span>
              </div>

              <div class="mt-2 text-sm text-gray-500 text-center">
                第 {{ currentPage + 1 }} / {{ pdfImages.length }} 页
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </LocalToolsDetailComp>
</template>
