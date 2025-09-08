<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1
          class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          系统信息查看器
        </h1>
        <button @click="toggleDarkMode"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="切换深色模式">
          <i class="fa" :class="isDarkMode ? 'fa-sun-o' : 'fa-moon-o'"></i>
        </button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 状态信息 -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-4 text-lg">正在收集系统信息...</p>
      </div>

      <div v-if="error"
        class="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-6"
        role="alert">
        <strong class="font-bold">获取信息失败: </strong>
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <!-- 手动刷新按钮 -->
      <button @click="collectSystemInfo"
        class="mb-6 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/30 rounded text-sm transition-colors">
        <i class="fa fa-refresh mr-1"></i> 刷新系统信息
      </button>

      <!-- 信息卡片容器 -->
      <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 浏览器信息卡片 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
          <div class="bg-blue-500 dark:bg-blue-600 p-4">
            <h2 class="text-white text-xl font-bold flex items-center">
              <i class="fa fa-browser mr-2"></i> 浏览器信息
            </h2>
          </div>
          <div class="p-5 space-y-3">
            <InfoItem label="浏览器名称" :value="browser.name" />
            <InfoItem label="浏览器版本" :value="browser.version" />
            <InfoItem label="浏览器引擎" :value="browser.engine" />
            <InfoItem label="用户代理" :value="browser.userAgent" isLong />
            <InfoItem label="语言" :value="browser.language" />
            <InfoItem label="是否支持触摸" :value="browser.touchSupport ? '是' : '否'" />
            <InfoItem label="是否在iframe中" :value="browser.inIframe ? '是' : '否'" />
            <InfoItem label="Cookie 启用" :value="browser.cookieEnabled ? '是' : '否'" />
            <InfoItem label="在线状态" :value="browser.onLine ? '在线' : '离线'" />
            <InfoItem label="硬件并发数" :value="browser.hardwareConcurrency?.toString()" />
          </div>
        </section>

        <!-- 操作系统信息卡片 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
          <div class="bg-green-500 dark:bg-green-600 p-4">
            <h2 class="text-white text-xl font-bold flex items-center">
              <i class="fa fa-server mr-2"></i> 操作系统信息
            </h2>
          </div>
          <div class="p-5 space-y-3">
            <InfoItem label="操作系统" :value="os.name" />
            <InfoItem label="平台" :value="os.platform" />
            <InfoItem label="CPU 架构" :value="os.architecture" />
            <InfoItem label="设备内存" :value="os.deviceMemory ? `${os.deviceMemory} GB` : '未知'" />
            <InfoItem label="总内存估计" :value="os.totalRAM ? formatBytes(os.totalRAM) : '未知'" />
            <InfoItem label="时区" :value="os.timezone" />
            <InfoItem label="系统语言" :value="os.systemLanguage" />
            <InfoItem label="当前时间" :value="currentTime" />
          </div>
        </section>

        <!-- 电池信息卡片 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
          <div class="bg-amber-500 dark:bg-amber-600 p-4">
            <h2 class="text-white text-xl font-bold flex items-center">
              <i class="fa fa-battery-three-quarters mr-2"></i> 电池信息
            </h2>
          </div>
          <div class="p-5 space-y-3">
            <InfoItem label="电池状态" :value="battery.status" />
            <InfoItem label="电池电量" :value="battery.level !== null ? `${battery.level}%` : '未知'" />
            <div v-if="battery.level !== null" class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div class="bg-amber-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                :style="{ width: battery.level + '%' }"></div>
            </div>
            <InfoItem label="充电状态" :value="battery.charging ? '正在充电' : '未充电'" />
            <InfoItem label="完全充电时间" :value="battery.chargingTime !== null ? formatTime(battery.chargingTime) : '未知'" />
            <InfoItem label="完全放电时间"
              :value="battery.dischargingTime !== null ? formatTime(battery.dischargingTime) : '未知'" />
            <InfoItem label="电池健康度" :value="battery.health ? `${battery.health}%` : '不支持'" />
          </div>
        </section>

        <!-- 显示器信息卡片 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
          <div class="bg-purple-500 dark:bg-purple-600 p-4">
            <h2 class="text-white text-xl font-bold flex items-center">
              <i class="fa fa-desktop mr-2"></i> 显示器信息
            </h2>
          </div>
          <div class="p-5 space-y-3">
            <InfoItem label="屏幕宽度" :value="`${displayInfo.width}px`" />
            <InfoItem label="屏幕高度" :value="`${displayInfo.height}px`" />
            <InfoItem label="可用宽度" :value="`${displayInfo.availWidth}px`" />
            <InfoItem label="可用高度" :value="`${displayInfo.availHeight}px`" />
            <InfoItem label="颜色深度" :value="`${displayInfo.colorDepth} 位`" />
            <InfoItem label="像素深度" :value="`${displayInfo.pixelDepth} 位`" />
            <InfoItem label="设备像素比" :value="devicePixelRatio.toString()" />
            <InfoItem label="刷新率" :value="screenRefreshRate ? `${screenRefreshRate} Hz` : '未知'" />
            <InfoItem label="方向" :value="screenOrientation" />
          </div>
        </section>

        <!-- 网络信息卡片 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
          <div class="bg-emerald-500 dark:bg-emerald-600 p-4">
            <h2 class="text-white text-xl font-bold flex items-center">
              <i class="fa fa-wifi mr-2"></i> 网络信息
            </h2>
          </div>
          <div class="p-5 space-y-3">
            <InfoItem label="连接类型" :value="network.type" />
            <InfoItem label="有效类型" :value="network.effectiveType" />
            <InfoItem label="下行速度" :value="network.downlink ? `${network.downlink} Mbps` : '未知'" />
            <InfoItem label="RTT" :value="network.rtt ? `${network.rtt} ms` : '未知'" />
            <InfoItem label="是否节省数据" :value="network.saveData ? '是' : '否'" />
            <InfoItem label="IP 地址" :value="network.ipAddress || '获取中...'" />
            <InfoItem label="网络状态" :value="browser.onLine ? '在线' : '离线'" />
          </div>
        </section>

        <!-- 地理位置信息卡片 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
          <div class="bg-red-500 dark:bg-red-600 p-4">
            <h2 class="text-white text-xl font-bold flex items-center">
              <i class="fa fa-map-marker mr-2"></i> 地理位置信息
            </h2>
          </div>
          <div class="p-5 space-y-3">
            <div v-if="geoLoading" class="text-center py-2">
              <div class="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-500"></div>
              <span class="ml-2">正在获取位置信息...</span>
            </div>
            <div v-if="geoError" class="text-red-500 dark:text-red-400 text-sm">
              {{ geoError }}
            </div>
            <InfoItem v-if="!geoLoading && !geoError" label="纬度" :value="geolocation.latitude" />
            <InfoItem v-if="!geoLoading && !geoError" label="经度" :value="geolocation.longitude" />
            <InfoItem v-if="!geoLoading && !geoError" label="精度"
              :value="geolocation.accuracy ? `${geolocation.accuracy} 米` : '未知'" />
            <InfoItem v-if="!geoLoading && !geoError" label="海拔"
              :value="geolocation.altitude ? `${geolocation.altitude} 米` : '未知'" />
            <InfoItem v-if="!geoLoading && !geoError" label="海拔精度"
              :value="geolocation.altitudeAccuracy ? `${geolocation.altitudeAccuracy} 米` : '未知'" />
            <button v-if="!geoLoading" @click="getGeolocation"
              class="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/30 rounded text-sm transition-colors">
              {{ (geolocation.latitude && !geoError) ? '重新获取位置' : '获取位置信息' }}
            </button>
          </div>
        </section>

        <!-- 设备传感器信息卡片 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
          <div class="bg-teal-500 dark:bg-teal-600 p-4">
            <h2 class="text-white text-xl font-bold flex items-center">
              <i class="fa fa-microchip mr-2"></i> 设备传感器
            </h2>
          </div>
          <div class="p-5 space-y-3">
            <InfoItem label="加速度计" :value="sensors.accelerometer ? '支持' : '不支持'" />
            <InfoItem label="陀螺仪" :value="sensors.gyroscope ? '支持' : '不支持'" />
            <InfoItem label="磁力计" :value="sensors.magnetometer ? '支持' : '不支持'" />
            <InfoItem label="方向传感器" :value="sensors.orientation ? '支持' : '不支持'" />
            <InfoItem label="光传感器" :value="sensors.lightSensor ? '支持' : '不支持'" />
            <InfoItem label="接近传感器" :value="sensors.proximitySensor ? '支持' : '不支持'" />
            <button @click="toggleSensorMonitoring"
              class="mt-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-800/30 rounded text-sm transition-colors">
              {{ isMonitoringSensors ? '停止监测' : '开始监测' }}
            </button>
            <div v-if="isMonitoringSensors && sensors.readings"
              class="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded text-sm text-gray-600 dark:text-gray-300">
              <p v-if="sensors.readings.accelerometer">加速度: {{ sensors.readings.accelerometer.x.toFixed(2) }}, {{
                sensors.readings.accelerometer.y.toFixed(2) }}, {{ sensors.readings.accelerometer.z.toFixed(2) }}</p>
              <p v-if="sensors.readings.gyroscope">角速度: {{ sensors.readings.gyroscope.x.toFixed(2) }}, {{
                sensors.readings.gyroscope.y.toFixed(2) }}, {{ sensors.readings.gyroscope.z.toFixed(2) }}</p>
            </div>
          </div>
        </section>

        <!-- 存储信息卡片 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
          <div class="bg-pink-500 dark:bg-pink-600 p-4">
            <h2 class="text-white text-xl font-bold flex items-center">
              <i class="fa fa-hdd-o mr-2"></i> 存储信息
            </h2>
          </div>
          <div class="p-5 space-y-3">
            <InfoItem label="本地存储使用"
              :value="storageInfo.localStorageUsed ? `${formatBytes(storageInfo.localStorageUsed)} / ${formatBytes(storageInfo.localStorageQuota)}` : '未知'" />
            <InfoItem label="会话存储使用"
              :value="storageInfo.sessionStorageUsed ? `${formatBytes(storageInfo.sessionStorageUsed)} / ${formatBytes(storageInfo.sessionStorageQuota)}` : '未知'" />
            <InfoItem label="IndexedDB 支持" :value="storageInfo.indexedDbSupported ? '是' : '否'" />
            <InfoItem label="Cookie 数量" :value="storageInfo.cookieCount?.toString() || '未知'" />
            <InfoItem label="Cookie 总大小" :value="storageInfo.cookieSize ? formatBytes(storageInfo.cookieSize) : '未知'" />
          </div>
        </section>

        <!-- 性能信息卡片 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
          <div class="bg-indigo-500 dark:bg-indigo-600 p-4">
            <h2 class="text-white text-xl font-bold flex items-center">
              <i class="fa fa-tachometer mr-2"></i> 性能信息
            </h2>
          </div>
          <div class="p-5 space-y-3">
            <InfoItem label="页面加载时间" :value="performanceInfo.loadTime ? `${performanceInfo.loadTime} ms` : '未知'" />
            <InfoItem label="DOM 就绪时间"
              :value="performanceInfo.domReadyTime ? `${performanceInfo.domReadyTime} ms` : '未知'" />
            <InfoItem label="首屏渲染时间" :value="performanceInfo.firstPaint ? `${performanceInfo.firstPaint} ms` : '未知'" />
            <InfoItem label="内存使用"
              :value="performanceInfo.memoryUsed ? formatBytes(performanceInfo.memoryUsed) : '未知'" />
            <InfoItem label="CPU 核心数" :value="browser.hardwareConcurrency?.toString() || '未知'" />
          </div>
        </section>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-12">
      <div class="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>系统信息查看器 &copy; {{ new Date().getFullYear() }}</p>
        <p class="mt-1">数据来源于浏览器API，仅在本地处理，不会上传至服务器</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// 扩展Navigator接口以包含非标准属性
interface ExtendedNavigator extends Navigator {
  userAgentData?: {
    platform?: string
  }
  deviceMemory?: number
  systemLanguage?: string
  userLanguage?: string
  getBattery?: () => Promise<BatteryManager>
}

// 扩展Window接口以包含传感器API
interface ExtendedWindow extends Window {
  Accelerometer?: new (options?: { frequency?: number }) => Accelerometer
  Gyroscope?: new (options?: { frequency?: number }) => Gyroscope
  Magnetometer?: new (options?: { frequency?: number }) => { x: number; y: number; z: number }
  AmbientLightSensor?: new (options?: { frequency?: number }) => { illuminance: number }
  ProximitySensor?: new (options?: { frequency?: number }) => { distance: number }
}

// 扩展Performance接口以包含memory属性
interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
}

// 扩展Screen接口以包含refreshRate和事件监听器
interface ExtendedScreen extends Screen {
  refreshRate?: number
  addEventListener?: (type: string, listener: EventListener) => void
  removeEventListener?: (type: string, listener: EventListener) => void
}

// 网络信息接口
interface NetworkInformation {
  type: string
  effectiveType: string
  downlink?: number
  rtt?: number
  saveData: boolean
  addEventListener?: (type: string, listener: () => void) => void
}

// 传感器接口
interface Accelerometer {
  x: number
  y: number
  z: number
  addEventListener: (type: string, listener: () => void) => void
  start: () => void
  stop: () => void
}

interface Gyroscope {
  x: number
  y: number
  z: number
  addEventListener: (type: string, listener: () => void) => void
  start: () => void
  stop: () => void
}

// 电池管理器接口
interface BatteryManager {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
  addEventListener: (type: string, listener: () => void) => void
}

// 定义类型
interface BrowserInfo {
  name: string
  version: string
  engine: string
  userAgent: string
  language: string
  touchSupport: boolean
  inIframe: boolean
  cookieEnabled: boolean
  onLine: boolean
  hardwareConcurrency?: number
}

interface OSInfo {
  name: string
  platform: string
  architecture: string
  deviceMemory?: number
  totalRAM?: number
  timezone: string
  systemLanguage: string
}

interface BatteryInfo {
  status: string
  level: number | null
  charging: boolean
  chargingTime: number | null
  dischargingTime: number | null
  health?: number
}

interface DisplayInfo {
  width: number
  height: number
  availWidth: number
  availHeight: number
  colorDepth: number
  pixelDepth: number
}

interface NetworkInfo {
  type: string
  effectiveType: string
  downlink?: number
  rtt?: number
  saveData: boolean
  ipAddress: string | null
}

interface GeolocationInfo {
  latitude: string | null
  longitude: string | null
  accuracy?: number
  altitude?: number
  altitudeAccuracy?: number
}

interface SensorReadings {
  accelerometer?: { x: number; y: number; z: number }
  gyroscope?: { x: number; y: number; z: number }
}

interface SensorsInfo {
  accelerometer: boolean
  gyroscope: boolean
  magnetometer: boolean
  orientation: boolean
  lightSensor: boolean
  proximitySensor: boolean
  readings: SensorReadings | null
}

interface StorageInfo {
  localStorageUsed: number | null
  localStorageQuota: number | null
  sessionStorageUsed: number | null
  sessionStorageQuota: number | null
  indexedDbSupported: boolean
  cookieCount: number | null
  cookieSize: number | null
}

interface PerformanceInfo {
  loadTime: number | null
  domReadyTime: number | null
  firstPaint: number | null
  memoryUsed: number | null
}

// 信息项组件
const InfoItem = {
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    isLong: {
      type: Boolean,
      default: false
    }
  },
  template: `
    <div class="flex flex-col">
      <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ label }}</span>
      <span :class="isLong ? 'text-sm break-all' : ''" class="font-mono">{{ value || '未知' }}</span>
    </div>
  `
}

// 状态变量
const loading = ref(true)
const error = ref<string | null>(null)
const isDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

const browser = ref<BrowserInfo>({
  name: '',
  version: '',
  engine: '',
  userAgent: '',
  language: '',
  touchSupport: false,
  inIframe: false,
  cookieEnabled: false,
  onLine: false
})

const os = ref<OSInfo>({
  name: '',
  platform: '',
  architecture: '',
  timezone: '',
  systemLanguage: ''
})

const battery = ref<BatteryInfo>({
  status: '未知',
  level: null,
  charging: false,
  chargingTime: null,
  dischargingTime: null
})

const displayInfo = ref<DisplayInfo>({
  width: 0,
  height: 0,
  availWidth: 0,
  availHeight: 0,
  colorDepth: 0,
  pixelDepth: 0
})

const devicePixelRatio = ref(1)
const screenRefreshRate = ref<number | null>(null)
const screenOrientation = ref('')

const network = ref<NetworkInfo>({
  type: '',
  effectiveType: '',
  saveData: false,
  ipAddress: null
})

const geolocation = ref<GeolocationInfo>({
  latitude: null,
  longitude: null
})
const geoLoading = ref(false)
const geoError = ref<string | null>(null)

const sensors = ref<SensorsInfo>({
  accelerometer: false,
  gyroscope: false,
  magnetometer: false,
  orientation: false,
  lightSensor: false,
  proximitySensor: false,
  readings: null
})

const storageInfo = ref<StorageInfo>({
  localStorageUsed: null,
  localStorageQuota: null,
  sessionStorageUsed: null,
  sessionStorageQuota: null,
  indexedDbSupported: false,
  cookieCount: null,
  cookieSize: null
})

const performanceInfo = ref<PerformanceInfo>({
  loadTime: null,
  domReadyTime: null,
  firstPaint: null,
  memoryUsed: null
})

const isMonitoringSensors = ref(false)
const sensorReaders = ref<{
  accelerometer?: Accelerometer
  gyroscope?: Gyroscope
}>({})

// 计算属性 - 当前时间
const currentTime = computed(() => {
  return new Date().toLocaleString()
})

// 方法
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  applyDarkMode()
}

const applyDarkMode = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const collectSystemInfo = async () => {
  try {
    loading.value = true
    error.value = null

    // 逐个收集信息
    await collectBrowserInfo()
    await collectOsInfo()
    await collectDisplayInfo()
    await collectNetworkInfo()
    await checkBatteryStatus()
    await detectSensors()
    await estimateTotalRAM()
    await getIpAddress()
    await collectStorageInfo()
    await collectPerformanceInfo()

    console.log('所有系统信息收集完成')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取系统信息时发生错误'
    console.error('收集系统信息错误:', err)
  } finally {
    loading.value = false
  }
}

const collectBrowserInfo = (): void => {
  try {
    const userAgent = navigator.userAgent

    browser.value = {
      userAgent,
      language: navigator.language || (navigator as ExtendedNavigator).userLanguage || '未知',
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      inIframe: window.self !== window.top,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency,
      name: detectBrowserName(userAgent),
      version: detectBrowserVersion(userAgent),
      engine: detectBrowserEngine(userAgent)
    }
    console.log('浏览器信息收集完成', browser.value)
  } catch (err) {
    console.error('收集浏览器信息错误:', err)
    throw new Error(`收集浏览器信息失败: ${err instanceof Error ? err.message : '未知错误'}`)
  }
}

const detectBrowserName = (userAgent: string): string => {
  if (userAgent.includes('Edg')) return 'Edge'
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera'
  if (userAgent.includes('Trident') || userAgent.includes('MSIE')) return 'Internet Explorer'
  return '未知浏览器'
}

const detectBrowserVersion = (userAgent: string): string => {
  const versionRegex: Record<string, RegExp> = {
    Chrome: /Chrome\/(\d+\.\d+)/,
    Firefox: /Firefox\/(\d+\.\d+)/,
    Safari: /Version\/(\d+\.\d+)/,
    Edge: /Edg\/(\d+\.\d+)/,
    Opera: /(Opera|OPR)\/(\d+\.\d+)/,
    'Internet Explorer': /(Trident\/.*rv:|MSIE) (\d+\.\d+)/
  }

  for (const [, regex] of Object.entries(versionRegex)) {
    const match = userAgent.match(regex)
    if (match) return match[2] || match[1]
  }

  return '未知版本'
}

const detectBrowserEngine = (userAgent: string): string => {
  if (userAgent.includes('Gecko') && !userAgent.includes('like Gecko')) return 'Gecko'
  if (userAgent.includes('WebKit') && !userAgent.includes('Chrome')) return 'WebKit'
  if (userAgent.includes('Blink')) return 'Blink'
  if (userAgent.includes('Trident')) return 'Trident'
  return '未知引擎'
}

const collectOsInfo = (): void => {
  try {
    const userAgent = navigator.userAgent
    let osName = '未知操作系统'

    if (userAgent.includes('Windows')) osName = 'Windows'
    else if (userAgent.includes('Mac OS X')) osName = 'macOS'
    else if (userAgent.includes('Linux')) osName = 'Linux'
    else if (userAgent.includes('Android')) osName = 'Android'
    else if (userAgent.includes('iOS')) osName = 'iOS'
    else if (userAgent.includes('FreeBSD')) osName = 'FreeBSD'
    else if (userAgent.includes('OpenBSD')) osName = 'OpenBSD'
    else if (userAgent.includes('NetBSD')) osName = 'NetBSD'

    os.value = {
      ...os.value,
      name: osName,
      platform: navigator.platform || '未知',
      architecture: (navigator as ExtendedNavigator).userAgentData?.platform || navigator.platform || '未知',
      deviceMemory: (navigator as ExtendedNavigator).deviceMemory,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '未知',
      systemLanguage: (navigator as ExtendedNavigator).systemLanguage || navigator.language || '未知'
    }
    console.log('操作系统信息收集完成', os.value)
  } catch (err) {
    console.error('收集操作系统信息错误:', err)
    throw new Error(`收集操作系统信息失败: ${err instanceof Error ? err.message : '未知错误'}`)
  }
}

const estimateTotalRAM = (): void => {
  try {
    if ((navigator as ExtendedNavigator).deviceMemory) {
      os.value.totalRAM = (navigator as ExtendedNavigator).deviceMemory! * 1024 * 1024 * 1024
    } else if (window.performance && (window.performance as ExtendedPerformance).memory) {
      const totalMemory = (window.performance as ExtendedPerformance).memory!.totalJSHeapSize
      os.value.totalRAM = totalMemory * 7 // 粗略估计
    }
    console.log('内存信息收集完成', os.value.totalRAM)
  } catch (err) {
    console.error('收集内存信息错误:', err)
    // 这里不抛出错误，因为这是可选信息
  }
}

const checkBatteryStatus = async (): Promise<void> => {
  try {

    if (!(navigator as ExtendedNavigator).getBattery) {
      battery.value = {
        status: '不支持电池API',
        level: null,
        charging: false,
        chargingTime: null,
        dischargingTime: null
      }
      return
    }

    const batteryManager = await (navigator as ExtendedNavigator).getBattery!()

    const updateBatteryInfo = () => {
      battery.value = {
        status: batteryManager.charging ? '充电中' : '未充电',
        level: Math.round(batteryManager.level * 100),
        charging: batteryManager.charging,
        chargingTime: batteryManager.chargingTime || null,
        dischargingTime: batteryManager.dischargingTime || null,
        // 电池健康度 - 仅部分浏览器支持
        health: (batteryManager as BatteryManager & { health?: number }).health ? Math.round((batteryManager as BatteryManager & { health?: number }).health! * 100) : undefined
      }
    }

    updateBatteryInfo()

    // 添加事件监听器以实时更新电池状态
    batteryManager.addEventListener('chargingchange', updateBatteryInfo)
    batteryManager.addEventListener('levelchange', updateBatteryInfo)
    batteryManager.addEventListener('chargingtimechange', updateBatteryInfo)
    batteryManager.addEventListener('dischargingtimechange', updateBatteryInfo)

    console.log('电池信息收集完成', battery.value)
  } catch (err) {
    console.error('收集电池信息错误:', err)
    battery.value = {
      status: '获取电池信息失败',
      level: null,
      charging: false,
      chargingTime: null,
      dischargingTime: null
    }
  }
}

const collectDisplayInfo = (): void => {
  try {
    displayInfo.value = {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth
    }

    devicePixelRatio.value = window.devicePixelRatio

    if ((window.screen as ExtendedScreen)?.refreshRate) {
      screenRefreshRate.value = Math.round((window.screen as ExtendedScreen).refreshRate!)
    }

    updateScreenOrientation()
    console.log('显示器信息收集完成', displayInfo.value)
  } catch (err) {
    console.error('收集显示器信息错误:', err)
    throw new Error(`收集显示器信息失败: ${err instanceof Error ? err.message : '未知错误'}`)
  }
}

const updateScreenOrientation = (): void => {
  try {
    const orientation = window.screen.orientation ||
      (window.screen as ExtendedScreen & { mozOrientation?: { type: string } }).mozOrientation ||
      (window.screen as ExtendedScreen & { msOrientation?: { type: string } }).msOrientation

    if (orientation) {
      screenOrientation.value = orientation.type
    } else {
      screenOrientation.value = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    }
  } catch (err) {
    console.error('更新屏幕方向错误:', err)
    screenOrientation.value = '未知'
  }
}

const collectNetworkInfo = (): void => {
  try {
    interface ConnectionNavigator extends ExtendedNavigator {
      connection?: NetworkInformation
      mozConnection?: NetworkInformation
      webkitConnection?: NetworkInformation
    }

    const connectionNavigator = navigator as ConnectionNavigator

    if (!connectionNavigator.connection && !connectionNavigator.mozConnection && !connectionNavigator.webkitConnection) {
      network.value.type = '不支持网络信息API'
      return
    }

    const connection = connectionNavigator.connection || connectionNavigator.mozConnection || connectionNavigator.webkitConnection

    if (connection) {
      network.value = {
        ...network.value,
        type: connection.type || '未知',
        effectiveType: connection.effectiveType || '未知',
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData || false
      }

      if (connection.addEventListener) {
        connection.addEventListener('change', collectNetworkInfo)
      }
    }
    console.log('网络信息收集完成', network.value)
  } catch (err) {
    console.error('收集网络信息错误:', err)
    throw new Error(`收集网络信息失败: ${err instanceof Error ? err.message : '未知错误'}`)
  }
}

const getIpAddress = async (): Promise<void> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`)

    const data = await response.json()
    network.value.ipAddress = data.ip
    console.log('IP地址获取完成', network.value.ipAddress)
  } catch (err) {
    console.error('获取IP地址错误:', err)
    network.value.ipAddress = '无法获取IP'
  }
}

const getGeolocation = (): void => {
  if (!navigator.geolocation) {
    geoError.value = '浏览器不支持地理位置API'
    return
  }

  geoLoading.value = true
  geoError.value = null

  navigator.geolocation.getCurrentPosition(
    (position) => {
      geolocation.value = {
        latitude: position.coords.latitude.toFixed(6),
        longitude: position.coords.longitude.toFixed(6),
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude || undefined,
        altitudeAccuracy: position.coords.altitudeAccuracy || undefined
      }
      geoLoading.value = false
    },
    (error) => {
      const errorMessages: Record<number, string> = {
        1: '用户拒绝了位置请求',
        2: '无法获取位置信息',
        3: '位置请求超时'
      }

      geoError.value = errorMessages[error.code] || `获取位置失败: ${error.message}`
      geoLoading.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

const detectSensors = (): void => {
  try {
    sensors.value.orientation = 'ondeviceorientation' in window

    if (typeof (window as ExtendedWindow).Accelerometer !== 'undefined') {
      sensors.value.accelerometer = true
    } else if ('ondevicemotion' in window) {
      sensors.value.accelerometer = true
    }

    if (typeof (window as ExtendedWindow).Gyroscope !== 'undefined') {
      sensors.value.gyroscope = true
    } else if ('ondevicemotion' in window) {
      sensors.value.gyroscope = true
    }

    if (typeof (window as ExtendedWindow).Magnetometer !== 'undefined') {
      sensors.value.magnetometer = true
    } else if ('ondeviceorientation' in window) {
      sensors.value.magnetometer = true
    }

    if (typeof (window as ExtendedWindow).AmbientLightSensor !== 'undefined') {
      sensors.value.lightSensor = true
    }

    if (typeof (window as ExtendedWindow).ProximitySensor !== 'undefined') {
      sensors.value.proximitySensor = true
    }

    console.log('传感器信息收集完成', sensors.value)
  } catch (err) {
    console.error('检测传感器错误:', err)
    throw new Error(`检测传感器失败: ${err instanceof Error ? err.message : '未知错误'}`)
  }
}

const toggleSensorMonitoring = (): void => {
  if (isMonitoringSensors.value) {
    stopSensorMonitoring()
  } else {
    startSensorMonitoring()
  }
}

const handleDeviceMotion = (event: DeviceMotionEvent): void => {
  if (event.acceleration) {
    sensors.value.readings = {
      ...sensors.value.readings,
      accelerometer: {
        x: event.acceleration.x || 0,
        y: event.acceleration.y || 0,
        z: event.acceleration.z || 0
      }
    }
  }

  if (event.rotationRate) {
    sensors.value.readings = {
      ...sensors.value.readings,
      gyroscope: {
        x: event.rotationRate.alpha || 0,
        y: event.rotationRate.beta || 0,
        z: event.rotationRate.gamma || 0
      }
    }
  }
}

const startSensorMonitoring = (): void => {
  isMonitoringSensors.value = true
  sensors.value.readings = {}

  if (typeof (window as ExtendedWindow).Accelerometer !== 'undefined') {
    try {
      sensorReaders.value.accelerometer = new (window as ExtendedWindow).Accelerometer!({ frequency: 5 })
      sensorReaders.value.accelerometer?.addEventListener('reading', () => {
        if (sensorReaders.value.accelerometer) {
          sensors.value.readings = {
            ...sensors.value.readings,
            accelerometer: {
              x: sensorReaders.value.accelerometer.x,
              y: sensorReaders.value.accelerometer.y,
              z: sensorReaders.value.accelerometer.z
            }
          }
        }
      })
      sensorReaders.value.accelerometer?.start()
    } catch (err) {
      console.error('初始化加速度计错误:', err)
    }
  } else if ('ondevicemotion' in window) {
    window.addEventListener('devicemotion', handleDeviceMotion)
  }

  if (typeof (window as ExtendedWindow).Gyroscope !== 'undefined') {
    try {
      sensorReaders.value.gyroscope = new (window as ExtendedWindow).Gyroscope!({ frequency: 5 })
      sensorReaders.value.gyroscope?.addEventListener('reading', () => {
        if (sensorReaders.value.gyroscope) {
          sensors.value.readings = {
            ...sensors.value.readings,
            gyroscope: {
              x: sensorReaders.value.gyroscope.x,
              y: sensorReaders.value.gyroscope.y,
              z: sensorReaders.value.gyroscope.z
            }
          }
        }
      })
      sensorReaders.value.gyroscope?.start()
    } catch (err) {
      console.error('初始化陀螺仪错误:', err)
    }
  }
}

const stopSensorMonitoring = (): void => {
  isMonitoringSensors.value = false

  Object.values(sensorReaders.value).forEach(sensor => {
    if (sensor && 'stop' in sensor && typeof sensor.stop === 'function') {
      sensor.stop()
    }
  })

  window.removeEventListener('devicemotion', handleDeviceMotion)

  sensorReaders.value = {}
  sensors.value.readings = null
}

// 新增：收集存储信息
const collectStorageInfo = (): void => {
  try {
    // 本地存储信息
    if (typeof localStorage !== 'undefined') {
      try {
        // 估算本地存储使用量
        let localStorageSize = 0
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key) {
            const value = localStorage.getItem(key) || ''
            localStorageSize += key.length + value.length
          }
        }
        storageInfo.value.localStorageUsed = localStorageSize

        // 估算本地存储配额（不同浏览器有不同限制）
        storageInfo.value.localStorageQuota = 5 * 1024 * 1024 // 通常为5MB
      } catch (e) {
        console.warn('无法访问localStorage:', e)
      }
    }

    // 会话存储信息
    if (typeof sessionStorage !== 'undefined') {
      try {
        // 估算会话存储使用量
        let sessionStorageSize = 0
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i)
          if (key) {
            const value = sessionStorage.getItem(key) || ''
            sessionStorageSize += key.length + value.length
          }
        }
        storageInfo.value.sessionStorageUsed = sessionStorageSize

        // 估算会话存储配额
        storageInfo.value.sessionStorageQuota = 5 * 1024 * 1024 // 通常为5MB
      } catch (e) {
        console.warn('无法访问sessionStorage:', e)
      }
    }

    // 检查IndexedDB支持
    storageInfo.value.indexedDbSupported = typeof window.indexedDB !== 'undefined'

    // Cookie信息
    if (document.cookie) {
      const cookies = document.cookie.split(';')
      storageInfo.value.cookieCount = cookies.length

      // 估算Cookie总大小
      let cookieSize = 0
      cookies.forEach(cookie => {
        cookieSize += cookie.length
      })
      storageInfo.value.cookieSize = cookieSize
    }

    console.log('存储信息收集完成', storageInfo.value)
  } catch (err) {
    console.error('收集存储信息错误:', err)
  }
}

// 新增：收集性能信息
const collectPerformanceInfo = (): void => {
  try {
    if (!window.performance) {
      console.warn('浏览器不支持Performance API')
      return
    }

    const performanceData = window.performance
    const timing = performanceData.timing

    // 页面加载时间
    if (timing.loadEventEnd && timing.navigationStart) {
      performanceInfo.value.loadTime = timing.loadEventEnd - timing.navigationStart
    }

    // DOM就绪时间
    if (timing.domContentLoadedEventEnd && timing.navigationStart) {
      performanceInfo.value.domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart
    }

    // 首屏渲染时间
    if (performanceData.getEntriesByType) {
      const paintEntries = performanceData.getEntriesByType('paint')
      if (paintEntries.length > 0) {
        performanceInfo.value.firstPaint = (paintEntries[0] as PerformanceEntry & { startTime: number }).startTime
      }
    }

    // 内存使用情况
    if ((performanceData as ExtendedPerformance).memory) {
      performanceInfo.value.memoryUsed = (performanceData as ExtendedPerformance).memory!.usedJSHeapSize
    }

    console.log('性能信息收集完成', performanceInfo.value)
  } catch (err) {
    console.error('收集性能信息错误:', err)
  }
}

// 工具函数：格式化字节数
const formatBytes = (bytes: number | null, decimals = 2): string => {
  if (bytes === null || bytes === undefined) return '未知'
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

// 工具函数：格式化时间（秒转换为时分秒）
const formatTime = (seconds: number): string => {
  if (seconds === Infinity) return '未知'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const parts = []
  if (hours > 0) parts.push(`${hours}小时`)
  if (minutes > 0) parts.push(`${minutes}分钟`)
  parts.push(`${secs}秒`)

  return parts.join(' ')
}

// 事件监听器
const handleOnlineStatusChange = () => {
  browser.value.onLine = navigator.onLine
}

const addEventListeners = (): void => {
  window.addEventListener('online', handleOnlineStatusChange)
  window.addEventListener('offline', handleOnlineStatusChange)
  const extendedScreen = window.screen as ExtendedScreen
  if (extendedScreen.addEventListener) {
    extendedScreen.addEventListener('orientationchange', updateScreenOrientation)
  }
  window.addEventListener('resize', collectDisplayInfo)

  // 每秒更新一次当前时间
  setInterval(() => { }, 1000)
}

const removeEventListeners = (): void => {
  window.removeEventListener('online', handleOnlineStatusChange)
  window.removeEventListener('offline', handleOnlineStatusChange)
  const extendedScreen = window.screen as ExtendedScreen
  if (extendedScreen.removeEventListener) {
    extendedScreen.removeEventListener('orientationchange', updateScreenOrientation)
  }
  window.removeEventListener('resize', collectDisplayInfo)
}

// 生命周期钩子
onMounted(() => {
  console.log('组件挂载，开始收集系统信息')
  applyDarkMode()
  // 延迟一点执行，确保DOM已准备好
  setTimeout(collectSystemInfo, 100)
  addEventListeners()
})

onBeforeUnmount(() => {
  removeEventListeners()
  stopSensorMonitoring()
})
</script>

<style scoped>
.dark {
  color-scheme: dark;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
