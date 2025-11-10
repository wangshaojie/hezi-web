<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
      <h1 class="text-2xl font-bold text-center mb-6 text-gray-800">🌍 Google Earth 坐标转换器</h1>

      <div class="mb-4">
        <label class="block mb-2 font-medium text-gray-700">输入坐标：</label>
        <input
          v-model="input"
          type="text"
          placeholder="支持格式：45°49'03.76&quot;N, 82°25'49.55&quot;E 或 33.747252, -112.633853 或 37.242176°N, -115.813238°W"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        @click="convert"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-all"
      >
        转换为 Google Earth 链接
      </button>

      <div v-if="link" class="mt-6">
        <p class="font-medium text-gray-700 mb-2">生成结果：</p>
        <div class="bg-gray-100 p-3 rounded-lg break-all text-blue-700">
          {{ link }}
        </div>

        <div class="flex gap-3 mt-4">
          <button
            @click="openLink"
            class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
          >
            打开链接
          </button>
          <button
            @click="copyLink"
            class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold"
          >
            复制链接
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const input = ref('')
const link = ref('')

/**
 * 将 DMS 格式或十进制度+方向字母 转为十进制度
 */
function parseCoordinate(coord: string): number {
  coord = coord.trim()

  // 1️⃣ 匹配 DMS 格式 (45°49'03.76"N)
  const dmsMatch = coord.match(/(\d+)°(\d+)'([\d.]+)"?([NSEW])/i)
  if (dmsMatch) {
    const [, deg, min, sec, dir] = dmsMatch
    let val = parseFloat(deg) + parseFloat(min) / 60 + parseFloat(sec) / 3600
    if (dir.toUpperCase() === 'S' || dir.toUpperCase() === 'W') val *= -1
    return val
  }

  // 2️⃣ 匹配十进制度 + 方向字母 (37.242176°N)
  const degMatch = coord.match(/(-?\d+(\.\d+)?)°?\s*([NSEW])/i)
  if (degMatch) {
    const [, val, , dir] = degMatch
    let decimal = parseFloat(val)
    if (dir.toUpperCase() === 'S' || dir.toUpperCase() === 'W') decimal *= -1
    return decimal
  }

  // 3️⃣ 纯十进制度格式 (33.747252)
  if (/^-?\d+(\.\d+)?$/.test(coord)) {
    return parseFloat(coord)
  }

  return NaN
}

/**
 * 转换输入为 Google Earth URL
 */
function convert() {
  let lat = NaN
  let lon = NaN

  const value = input.value.trim()
  const parts = value.split(',')

  if (parts.length >= 2) {
    lat = parseCoordinate(parts[0])
    lon = parseCoordinate(parts[1])
  }

  if (isNaN(lat) || isNaN(lon)) {
    alert('坐标格式错误，请检查输入。支持 DMS / 十进制度 / 十进制度+方向字母。')
    return
  }

  link.value = `https://earth.google.com/web/@${lat.toFixed(
    6,
  )},${lon.toFixed(6)},1000a,35y,0h,0t,0r`
}

/**
 * 打开链接
 */
function openLink() {
  if (link.value) window.open(link.value, '_blank')
}

/**
 * 复制链接
 */
function copyLink() {
  if (!link.value) return
  navigator.clipboard.writeText(link.value)
  ElMessage.success('✅ 已复制到剪贴板！')
}
</script>
