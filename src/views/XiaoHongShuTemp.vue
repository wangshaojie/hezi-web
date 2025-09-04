<script setup lang="ts">
import LocalToolsDetailComp from '@/components/LocalToolsDetailComp.vue'
import { ref } from 'vue'
import domtoimage from 'dom-to-image'

const mainTitle = ref('请输入主标题')
const subTitle = ref('分享我的美好生活')
const showCovers = ref(false)
const selectedFont = ref('PingFang SC')
const fontSize = ref('24px')
const fontColor = ref('#541919')
const lineHeight = ref('1.2')
const lineHeights = ref([
  { name: '紧凑', value: '1.0' },
  { name: '常规', value: '1.2' },
  { name: '宽松', value: '1.5' },
  { name: '加宽', value: '2.0' },
])
const fonts = ref([
  { name: '微软雅黑', value: 'Microsoft YaHei' },
  { name: '宋体', value: 'SimSun' },
  { name: '楷体', value: 'KaiTi' },
  { name: '黑体', value: 'SimHei' },
  { name: '隶书', value: 'LiSu' },
  { name: '幼圆', value: 'YouYuan' },
  { name: '仿宋', value: 'fangsong' },
  { name: '思源黑体', value: 'Source Han Sans CN' },
])
const covers = ref([
  {
    name: '简约笔记本',
    style: {
      background: '#f8f4e8',
      border: '1px solid #e0d8c0',
    },
  },
  {
    name: '商务灰纸',
    style: {
      background: '#f0f0f0',
      border: '1px solid #d0d0d0',
    },
  },
  {
    name: '米色纸张',
    style: {
      background: '#f5f5dc',
      border: '1px solid #e0d8b0',
    },
  },
  {
    name: '浅灰网格',
    style: {
      background:
        'repeating-linear-gradient(0deg, #f0f0f0, #f0f0f0 1px, #ffffff 1px, #ffffff 20px)',
    },
  },
  {
    name: '淡蓝笔记',
    style: {
      background: '#f0f8ff',
      border: '1px solid #c0d8e8',
    },
  },
  {
    name: '美食风格',
    style: {
      background: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)',
    },
  },
  {
    name: '旅行风格',
    style: {
      background: 'linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)',
    },
  },
  {
    name: '美妆风格',
    style: {
      background: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)',
    },
  },
  {
    name: '健身风格',
    style: {
      background: 'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)',
    },
  },
  {
    name: '时尚风格',
    style: {
      background: 'linear-gradient(135deg, #FF9D6C 0%, #BB4E75 100%)',
    },
  },
  {
    name: '家居风格',
    style: {
      background: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)',
    },
  },
  {
    name: '宠物风格',
    style: {
      background: 'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)',
    },
  },
  {
    name: '科技风格',
    style: {
      background: 'linear-gradient(135deg, #A3BDFF 0%, #7B66FF 100%)',
    },
  },
  {
    name: '读书风格',
    style: {
      background: 'linear-gradient(135deg, #D4A5A5 0%, #5D5F7F 100%)',
    },
  },
  {
    name: '极简风格',
    style: {
      background: 'linear-gradient(135deg, #F5F7FA 0%, #B8C6DB 100%)',
    },
  },
  {
    name: '美食诱惑',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '极简白',
    style: {
      background: '#ffffff',
      border: '1px solid #eee',
    },
  },
  {
    name: '旅行风景',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '清新绿植',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '深色高级',
    style: {
      background: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    },
  },
  {
    name: '夏日海滩',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '星空梦幻',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '咖啡时光',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1445112098124-3e76dd67983c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '城市夜景',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '美妆特写',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '健身器材',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1571019613454-1cb2f5b2f836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '时尚街拍',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1483181957632-8bda974cbc91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '家居设计',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '宠物萌照',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '科技产品',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '读书角落',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '城市风光',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '美食诱惑',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '自然风景',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '极简抽象',
    style: {
      background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    },
  },
  {
    name: '粉色少女',
    style: {
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    },
  },
  {
    name: '复古胶片',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '生活方式',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1522205408450-add114ad53fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '科技数码',
    style: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
  },
  {
    name: '宠物日常',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1519056530488-b332a4baf0d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
  {
    name: '时尚穿搭',
    style: {
      background:
        "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
    },
  },
])

const generateAllCovers = () => {
  showCovers.value = true
}

const downloadCover = async (index: number) => {
  const node = document.querySelectorAll('.cover-item')[index] as HTMLElement
  if (!node) return

  const scale = 1242 / node.offsetWidth

  const dataUrl = await domtoimage.toPng(node, {
    width: 1242,
    height: 1660,
    style: {
      color: fontColor.value,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      width: `${node.offsetWidth}px`,
      height: `${node.offsetHeight}px`,
      fontFamily: selectedFont.value,
      fontSize: `${fontSize.value}px`,
      lineHeight: lineHeight.value,
    },
  })

  const link = document.createElement('a')
  link.download = `封面_${index + 1}.png`
  link.href = dataUrl
  link.click()
}
</script>

<template>
  <LocalToolsDetailComp
    title="小红书封面生成器"
    subtitle="一键生成多种小红书风格封面"
    :showSecurityBanner="false"
  >
    <!-- 主内容插槽content -->
    <template #content>
      <div class="mx-auto px-6 py-8">
        <!-- 输入区 -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-100 w-full mx-auto">
          <div class="space-y-8">
            <div class="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h3 class="text-xl font-semibold text-gray-700 mb-6">内容设置</h3>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <el-form-item label="主标题">
                  <el-input
                    type="textarea"
                    v-model="mainTitle"
                    placeholder="请输入主标题"
                    size="large"
                    class="w-full"
                    :rows="5"
                    :style="{ '--el-input-border-radius': '12px' }"
                  />
                </el-form-item>
                <el-form-item label="副标题">
                  <el-input
                    type="textarea"
                    v-model="subTitle"
                    placeholder="请输入副标题"
                    size="large"
                    class="w-full"
                    :rows="5"
                    :style="{ '--el-input-border-radius': '12px' }"
                  />
                </el-form-item>
              </div>
            </div>

            <div class="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h3 class="text-xl font-semibold text-gray-700 mb-6">样式设置</h3>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <el-form-item label="字体选择">
                  <el-select
                    v-model="selectedFont"
                    size="large"
                    class="w-full"
                    :style="{ '--el-input-border-radius': '12px' }"
                  >
                    <el-option
                      v-for="font in fonts"
                      :key="font.value"
                      :label="font.name"
                      :value="font.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="字号选择">
                  <el-select
                    v-model="fontSize"
                    size="large"
                    class="w-full"
                    :style="{ '--el-input-border-radius': '12px' }"
                  >
                    <el-option
                      v-for="size in [
                        '16px',
                        '18px',
                        '20px',
                        '22px',
                        '24px',
                        '26px',
                        '28px',
                        '30px',
                        '32px',
                        '36px',
                        '40px',
                        '48px',
                        '56px',
                        '60px',
                      ]"
                      :key="size"
                      :label="size"
                      :value="size"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="字体颜色">
                  <el-color-picker
                    v-model="fontColor"
                    size="large"
                    class="w-full"
                    :style="{ '--el-input-border-radius': '12px' }"
                  />
                </el-form-item>

                <el-form-item label="行高选择">
                  <el-select
                    v-model="lineHeight"
                    size="large"
                    class="w-full"
                    :style="{ '--el-input-border-radius': '12px' }"
                  >
                    <el-option
                      v-for="lh in lineHeights"
                      :key="lh.value"
                      :label="lh.name"
                      :value="lh.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>

            <el-button
              type="primary"
              size="large"
              @click="generateAllCovers"
              class="w-full h-16 text-xl font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              立即生成封面
            </el-button>
          </div>
        </div>

        <!-- 封面展示区 -->
        <div
          v-if="showCovers"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-4"
        >
          <div
            v-for="(cover, index) in covers"
            :key="index"
            class="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group"
          >
            <div
              class="cover-item w-full aspect-[3/4] flex flex-col justify-center items-center p-6 relative overflow-hidden"
              :style="cover.style"
            >
              <div
                class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              ></div>
              <h2
                class="text-2xl font-bold mb-2 relative z-10 text-center"
                :style="{
                  fontFamily: selectedFont,
                  fontSize: fontSize,
                  color: fontColor,
                  lineHeight: lineHeight,
                }"
              >
                {{ mainTitle }}
              </h2>
              <p
                class="opacity-90 relative z-10"
                :style="{
                  fontFamily: selectedFont,
                  fontSize: 'calc(' + fontSize + ' - 4px)',
                  color: fontColor,
                  lineHeight: lineHeight,
                }"
              >
                {{ subTitle }}
              </p>
            </div>
            <div class="p-5 flex justify-between items-center border-t border-gray-100">
              <span class="text-gray-700 font-medium">{{ cover.name }}</span>
              <el-button
                type="primary"
                size="small"
                @click="downloadCover(index)"
                class="rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
              >
                下载
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </LocalToolsDetailComp>
</template>
