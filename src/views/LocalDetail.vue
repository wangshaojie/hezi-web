<script setup lang="ts">
import { ref } from 'vue'
import domtoimage from 'dom-to-image'

const mainTitle = ref('请输入主标题')
const subTitle = ref('分享我的美好生活')
const showCovers = ref(false)
const selectedFont = ref('PingFang SC')
const fontSize = ref('24px')
const fontColor = ref('#ffffff')
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
    },
  })

  const link = document.createElement('a')
  link.download = `封面_${index + 1}.png`
  link.href = dataUrl
  link.click()
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- 标题区 -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
      <h1 class="text-2xl font-bold text-white">专业图片水印工具</h1>
      <p class="text-blue-100 mt-1">保护您的原创内容不被盗用</p>
    </div>
    <div
      class="security-banner bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center"
    >
      <el-icon class="text-green-500 mr-2"><lock /></el-icon>
      <span class="text-sm text-green-700">
        隐私保护模式已启用 · 所有处理均在浏览器内完成 · 永不连接网络.
        所有图片和操作均在您的设备上完成，绝不上传至服务器，专业守护隐私与数据安全。无论是保护个人照片版权，还是为企业文档添加机密标识，这款工具都能快速、高效地满足需求。
      </span>
    </div>

    <!-- 主内容区 -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- 标题区 -->
        <div class="text-center mb-10">
          <h1
            class="text-4xl font-extrabold text-gray-900 mb-3 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text"
          >
            小红书封面生成器
          </h1>
          <p class="text-lg text-gray-500">PC宽屏版 - 一键生成多种风格封面</p>
        </div>

        <!-- 输入区 -->

        <div
          class="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-100 w-full max-w-6xl mx-auto"
        >
          <div class="space-y-8">
            <div class="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h3 class="text-xl font-semibold text-gray-700 mb-6">内容设置</h3>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <el-input
                  type="textarea"
                  v-model="mainTitle"
                  placeholder="主标题"
                  size="large"
                  class="w-full"
                  rows="3"
                  :style="{ '--el-input-border-radius': '12px' }"
                />
                <el-input
                  type="textarea"
                  v-model="subTitle"
                  placeholder="副标题"
                  size="large"
                  class="w-full"
                  rows="3"
                  :style="{ '--el-input-border-radius': '12px' }"
                />
              </div>
            </div>

            <div class="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h3 class="text-xl font-semibold text-gray-700 mb-6">样式设置</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <el-select
                  v-model="selectedFont"
                  placeholder="字体选择"
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

                <el-select
                  v-model="fontSize"
                  placeholder="字号选择"
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
                    ]"
                    :key="size"
                    :label="size"
                    :value="size"
                  />
                </el-select>

                <div>
                  <el-color-picker
                    v-model="fontColor"
                    size="large"
                    class="w-full"
                    :style="{ '--el-input-border-radius': '12px' }"
                  />
                </div>
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
                :style="{ fontFamily: selectedFont, fontSize: fontSize, color: fontColor }"
              >
                {{ mainTitle }}
              </h2>
              <p
                class="opacity-90 relative z-10"
                :style="{
                  fontFamily: selectedFont,
                  fontSize: 'calc(' + fontSize + ' - 4px)',
                  color: fontColor,
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
    </div>
  </div>
</template>
