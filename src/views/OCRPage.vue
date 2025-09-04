<script setup lang="ts">
import LocalToolsDetailComp from '@/components/LocalToolsDetailComp.vue'

import { ref } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage, type UploadFile, type UploadFiles } from 'element-plus'

const imageSrc = ref('')
const resultText = ref('')
const isProcessing = ref(false)
const fileList = ref(<UploadFiles>[])

interface Page {
  input_path: string
  rec_texts: string[]
  visualization_base64_list: string[]
}

const pages = ref<Page[]>([])

const handleFileChange = (file: { status: string; raw: File }) => {
  if (file.status === 'ready') {
    // 构造新的 UploadFile，只保留最新一张
    const rawWithUid = Object.assign(file.raw, { uid: Date.now() })
    const newFile: UploadFile = {
      name: file.raw.name,
      status: file.status,
      uid: Date.now(),
      raw: rawWithUid,
      url: '', // 可选
    }
    fileList.value = [newFile]

    const reader = new FileReader()
    reader.onload = (e) => {
      imageSrc.value = e.target?.result as string
      resultText.value = ''
      pages.value = [] // 清空识别结果
    }
    reader.readAsDataURL(file.raw)
  }
}

const handleExceed = (files: File[]) => {
  // 只保留最新一张
  const raw = files[0]
  const rawWithUid = Object.assign(raw, { uid: Date.now() })
  const newFile: UploadFile = {
    name: raw.name,
    status: 'ready',
    uid: Date.now(),
    raw: rawWithUid,
    url: '', // 可选
  }
  fileList.value = [newFile]

  // 预览新图片
  const reader = new FileReader()
  reader.onload = (e) => {
    imageSrc.value = e.target?.result as string
    resultText.value = ''
    pages.value = [] // 清空识别结果
  }
  reader.readAsDataURL(raw)

  ElMessage.warning('只能上传一张图片，已自动替换为最新图片')
}

const processOCR = async () => {
  if (!fileList.value.length) {
    ElMessage.warning('请先上传图片')
    return
  }

  isProcessing.value = true
  resultText.value = ''

  try {
    const formData = new FormData()
    fileList.value.forEach((file: UploadFile) => {
      if (file.raw) {
        formData.append('file', file.raw)
      }
    })

    const response = await fetch('http://192.168.60.130:8088/ocr/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('上传成功:', data)

    pages.value = data.result.pages
    console.log(pages.value)

    isProcessing.value = false

    // 模拟OCR处理过程 - 在实际项目中删除此部分
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error(`OCR处理失败: ${error instanceof Error ? error.message : '未知错误'}`)
    isProcessing.value = false
  }
}

const copyResult = async () => {
  if (!resultText.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }

  try {
    await navigator.clipboard.writeText(resultText.value)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败，请手动复制')
  }
}
</script>

<template>
  <LocalToolsDetailComp
    title="智能OCR识别"
    subtitle="上传图片，轻松提取文字内容"
    :showSecurityBanner="false"
  >
    <!-- 主内容插槽content -->
    <template #content>
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div class="mx-auto">
          <!-- 主卡片 -->
          <div class="bg-white rounded-xl shadow-xl overflow-hidden">
            <!-- 上传区域 -->
            <div class="p-8 border-b border-gray-200">
              <el-upload
                class="upload-area"
                drag
                v-model:file-list="fileList"
                :auto-upload="false"
                :on-change="handleFileChange"
                :limit="1"
                :on-exceed="handleExceed"
                accept="image/*"
              >
                <div class="flex flex-col items-center justify-center p-6">
                  <el-icon class="text-4xl text-indigo-500 mb-4"><Upload /></el-icon>
                  <div class="text-lg font-medium text-gray-700 mb-1">点击或拖拽上传图片</div>
                  <div class="text-sm text-gray-500">支持JPG、PNG等常见图片格式</div>
                </div>
              </el-upload>
            </div>

            <!-- 处理区域 -->
            <div class="p-8">
              <div v-if="!imageSrc" class="text-center text-gray-500">请先上传需要识别的图片</div>

              <div v-else class="flex flex-col md:flex-row gap-8">
                <!-- 图片预览 -->
                <div class="flex-1">
                  <div class="mb-4 font-medium text-gray-700">图片预览</div>
                  <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      :src="imageSrc"
                      class="w-full h-auto object-contain max-h-80"
                      alt="预览图片"
                    />
                  </div>
                  <el-button
                    class="mt-4 w-full"
                    type="primary"
                    :loading="isProcessing"
                    @click="processOCR"
                  >
                    {{ isProcessing ? '识别中...' : '开始识别' }}
                  </el-button>
                </div>

                <!-- 识别结果 -->
                <div class="flex-1">
                  <div class="mb-4 font-medium text-gray-700">识别结果</div>
                  <div
                    class="border border-gray-200 rounded-lg p-4 min-h-40 bg-gray-50"
                    :class="{ 'flex items-center justify-center': !resultText }"
                  >
                    <div v-if="pages.length" class="whitespace-pre-wrap">
                      <template v-for="item in pages" :key="item.input_path">
                        {{ item.rec_texts.join('') }}
                        <p v-for="img in item.visualization_base64_list" :key="img">
                          <img :src="'data:image/png;base64,' + img" />
                        </p>
                      </template>
                    </div>
                    <div v-else class="text-gray-400 text-center">
                      {{ isProcessing ? '正在识别文字...' : '识别结果将显示在这里' }}
                    </div>
                  </div>
                  <el-button
                    v-if="resultText"
                    class="mt-4 w-full"
                    type="success"
                    @click="copyResult"
                  >
                    复制结果
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </LocalToolsDetailComp>
</template>
<style scoped>
.upload-area :deep(.el-upload) {
  width: 100%;
}
.upload-area :deep(.el-upload-dragger) {
  width: 100%;
  padding: 0;
  background-color: transparent;
  border: 2px dashed #c7d2fe;
  border-radius: 12px;
  transition: all 0.3s;
}
.upload-area :deep(.el-upload-dragger:hover) {
  border-color: #6366f1;
  background-color: #eef2ff;
}
</style>
