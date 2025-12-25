<template>
  <LocalToolsDetailComp
    :title="'世界各国护照排名指数'"
    subtitle="护照免签国家/地区数量完整排名 | 数据实时更新，数据来源：亨利护照指数（Henley & Partners）"
    :showSecurityBanner="false"
  >
    <div class="bg-white text-gray-800 p-2">
      <div class="grid grid-cols-12 gap-8 h-[calc(100vh-160px)]">
        <!-- 左侧排名列表 (4列) -->
        <div
          class="col-span-4 bg-gray-50 rounded-xl p-6 overflow-hidden flex flex-col border border-gray-200"
        >
          <!-- 列表头部 -->
          <div
            class="grid grid-cols-12 py-2 px-3 bg-gray-100 rounded-lg mb-2 text-base font-medium"
          >
            <div class="col-span-4">国家/地区</div>
            <div class="col-span-4 text-center">排名</div>
            <div class="col-span-3 text-center">免签数量</div>
          </div>

          <!-- 排名列表 -->
          <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div v-if="sortedRankingData.length">
              <div
                v-for="(item, index) in sortedRankingData"
                :key="item.code"
                @click="handleCountryClick(item.code)"
                class="grid grid-cols-12 py-2 px-3 mb-1 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group"
                :class="{ 'bg-cyan-50 border-l-4 border-cyan-500': selectedCode === item.code }"
              >
                <!-- 国家名称 + 国旗 -->
                <div class="col-span-4 flex items-center">
                  <div class="w-8 h-5 mr-2 bg-gray-200 rounded flex items-center justify-center">
                    <span
                      :class="`fi fi-${item.code.toLowerCase()}`"
                      style="font-size: 1.3rem"
                    ></span>
                  </div>
                  <span class="text-gray-800 group-hover:text-cyan-600 transition-colors text-sm">{{
                    countryCodeToChineseName[item.code] || item.name
                  }}</span>
                </div>

                <!-- 排名 -->
                <div class="col-span-4 text-center">
                  <span
                    class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-600 text-white text-sm"
                  >
                    {{ index + 1 }}
                  </span>
                </div>

                <!-- 免签数量 + 加载状态指示器 -->
                <div class="col-span-3 text-center text-lg font-bold text-black relative">
                  {{ item.visa_free_count }}
                  <i
                    v-if="loading && selectedCode === item.code"
                    class="fa-solid fa-spinner fa-spin text-cyan-500 absolute right-0 top-1/2 transform -translate-y-1/2 ml-2"
                  ></i>
                </div>
              </div>
            </div>
            <div v-else class="flex-1 flex items-center justify-center">
              <div
                class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"
              ></div>
            </div>
          </div>
        </div>

        <!-- 右侧免签详情 (8列) -->
        <div
          class="col-span-8 bg-gray-50 rounded-xl p-6 overflow-hidden flex flex-col border border-gray-200"
        >
          <h2 class="text-2xl font-semibold text-black mb-4 flex items-center">
            <div
              v-if="selectedCode"
              class="w-8 h-6 mr-2 bg-gray-200 rounded flex items-center justify-center"
            >
              <span :class="`fi fi-${selectedCode.toLowerCase()}`" style="font-size: 1.4rem"></span>
            </div>
            <i v-else class="fa-solid fa-globe mr-2"></i>
            【{{ selectedCountry || '全球护照免签' }}】免签+落地签+电子旅行授权详情
          </h2>

          <!-- 筛选条件 -->
          <div class="bg-white p-4 rounded-lg mb-4 border border-gray-200">
            <h3 class="text-lg font-semibold mb-3">筛选条件</h3>
            <div class="grid grid-cols-2 gap-3">
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="selectedFilters.visaFree"
                  class="mr-2 h-4 w-4 text-green-500"
                />
                <i class="fa-solid fa-passport text-green-500 mr-2"></i>
                <span>免签</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="selectedFilters.electronicTravelAuthorization"
                  class="mr-2 h-4 w-4 text-blue-500"
                />
                <i class="fa-solid fa-shield-halved text-blue-500 mr-2"></i>
                <span>电子旅行授权</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="selectedFilters.visaOnArrival"
                  class="mr-2 h-4 w-4 text-yellow-500"
                />
                <i class="fa-solid fa-plane-circle-check text-yellow-500 mr-2"></i>
                <span>落地签</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="selectedFilters.requiresVisa"
                  class="mr-2 h-4 w-4 text-red-500"
                />
                <i class="fa-solid fa-times-circle text-red-500 mr-2"></i>
                <span>需签证</span>
              </label>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="flex-1 flex items-center justify-center">
            <div
              class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"
            ></div>
          </div>

          <!-- 所有国家列表 -->
          <div v-else class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div class="grid grid-cols-4 gap-2">
              <div
                v-for="item in filteredCountryData"
                :key="item.code"
                class="bg-white rounded-lg p-2 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div class="flex justify-between items-center mb-1">
                  <span class="font-semibold text-gray-800 text-sm">
                    <i :class="`fi fi-${item.code.toLowerCase()}`"></i>
                    {{ countryCodeToChineseName[item.code] || item.name }}</span
                  >
                  <span class="text-xs bg-gray-200 text-gray-800 px-1 py-0.5 rounded">{{
                    item.code
                  }}</span>
                </div>
                <div class="flex items-center">
                  <span v-if="item.isVisaFree" class="text-green-500 mr-2">
                    <i class="fa-solid fa-passport"></i>
                  </span>
                  <span v-else-if="item.isElectronicTravelAuthorization" class="text-blue-500 mr-2">
                    <i class="fa-solid fa-shield-halved"></i>
                  </span>
                  <span v-else-if="item.isVisaOnArrival" class="text-yellow-500 mr-2">
                    <i class="fa-solid fa-plane-circle-check"></i>
                  </span>
                  <span v-else class="text-red-500 mr-2">
                    <i class="fa-solid fa-times-circle"></i>
                  </span>
                  <span class="text-gray-600 text-sm">{{
                    item.isVisaFree
                      ? '免签入境'
                      : item.isElectronicTravelAuthorization
                        ? '电子旅行授权'
                        : item.isVisaOnArrival
                          ? '落地签'
                          : '需签证'
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LocalToolsDetailComp>
</template>

<script setup lang="ts">
import { countryCodeToChineseName } from '@/data/PassportRankingData2025'
import { ref, computed } from 'vue'
import axios from 'axios'
import 'flag-icons/css/flag-icons.min.css'

interface VisaItem {
  code: string
  name: string
  has_data?: boolean
  visa_free_count?: number
  isVisaFree?: boolean
  isElectronicTravelAuthorization?: boolean
  isVisaOnArrival?: boolean
}

// 为 countryCodeToChineseName 添加类型断言
const typedCountryCodeToChineseName = countryCodeToChineseName as Record<string, string>

// 响应式数据
const selectedCode = ref('')
const selectedCountry = ref('')
const loading = ref(false)
const visaFreeAccess = ref<VisaItem[]>([])
const electronicTravelAuthorization = ref<VisaItem[]>([])
const visaOnArrival = ref<VisaItem[]>([])
const allCountryData = ref<VisaItem[]>([])

// 筛选条件变量
const selectedFilters = ref({
  visaFree: true,
  electronicTravelAuthorization: true,
  visaOnArrival: true,
  requiresVisa: true,
})

// 获取所有国家列表
const getAllCountryData = async () => {
  try {
    const response = await axios.get('https://api.henleypassportindex.com/api/v3/countries')
    allCountryData.value = response.data.countries

    // 数据加载完成后，默认加载第一个国家的数据
    if (allCountryData.value.length > 0) {
      // 先对国家数据进行排序，获取排名第一的国家代码
      const sortedCountries = [...allCountryData.value].sort(
        (a, b) => (b.visa_free_count || 0) - (a.visa_free_count || 0),
      )
      const firstCode = sortedCountries[0]?.code

      if (firstCode) {
        // 立即设置selectedCode和loading状态，确保左侧loading能正确显示
        selectedCode.value = firstCode
        selectedCountry.value = typedCountryCodeToChineseName[firstCode] || ''
        loading.value = true

        // 调用免签接口获取数据
        try {
          const visaResponse = await axios.get(
            `https://api.henleypassportindex.com/api/v3/visa-single/${firstCode}`,
          )

          const apiData = visaResponse.data
          if (apiData.visa_free_access && Array.isArray(apiData.visa_free_access)) {
            // 分别存储三种签证类型
            visaFreeAccess.value = apiData.visa_free_access || []
            electronicTravelAuthorization.value = apiData.electronic_travel_authorisation || []
            visaOnArrival.value = apiData.visa_on_arrival || []

            // 更新所有国家的签证状态
            allCountryData.value = allCountryData.value.map((country) => {
              const countryCode = country.code.toLowerCase()
              const isVisaFree = visaFreeAccess.value.some(
                (visa) => visa.code.toLowerCase() === countryCode,
              )
              const isElectronicTravelAuthorization = electronicTravelAuthorization.value.some(
                (visa) => visa.code.toLowerCase() === countryCode,
              )
              const isVisaOnArrival = visaOnArrival.value.some(
                (visa) => visa.code.toLowerCase() === countryCode,
              )
              return {
                ...country,
                isVisaFree,
                isElectronicTravelAuthorization,
                isVisaOnArrival,
              }
            })
          }
        } catch (error) {
          console.error('获取免签数据失败:', error)
          alert('获取免签数据失败，请稍后重试')
        } finally {
          loading.value = false
        }
      }
    }
  } catch (error) {
    console.error('获取所有国家数据错误:', error)
  }
}
getAllCountryData()

// 排序后的排名数据 (按免签数量降序)
const sortedRankingData = computed(() => {
  return [...allCountryData.value]
    .filter((item) => item.has_data !== false) // 只有明确标记为false的才过滤
    .sort((a, b) => (b.visa_free_count || 0) - (a.visa_free_count || 0))
})

// 筛选后的国家数据
const filteredCountryData = computed(() => {
  return allCountryData.value.filter((country) => {
    // 检查国家是否符合任何选中的筛选条件
    const matchesVisaFree = selectedFilters.value.visaFree && country.isVisaFree
    const matchesElectronic =
      selectedFilters.value.electronicTravelAuthorization && country.isElectronicTravelAuthorization
    const matchesVisaOnArrival = selectedFilters.value.visaOnArrival && country.isVisaOnArrival
    const matchesRequiresVisa =
      selectedFilters.value.requiresVisa &&
      !country.isVisaFree &&
      !country.isElectronicTravelAuthorization &&
      !country.isVisaOnArrival

    return matchesVisaFree || matchesElectronic || matchesVisaOnArrival || matchesRequiresVisa
  })
})

// 处理国家点击事件
const handleCountryClick = async (code: string) => {
  selectedCode.value = code
  // 获取选中国家的中文名
  selectedCountry.value = typedCountryCodeToChineseName[code] || ''

  loading.value = true
  visaFreeAccess.value = []
  electronicTravelAuthorization.value = []
  visaOnArrival.value = []

  try {
    // 调用免签接口
    const response = await axios.get(
      `https://api.henleypassportindex.com/api/v3/visa-single/${code}`,
    )

    const apiData = response.data
    if (apiData.visa_free_access && Array.isArray(apiData.visa_free_access)) {
      // 分别存储三种签证类型
      visaFreeAccess.value = apiData.visa_free_access || []
      electronicTravelAuthorization.value = apiData.electronic_travel_authorisation || []
      visaOnArrival.value = apiData.visa_on_arrival || []

      // 更新所有国家的签证状态 - 忽略大小写比较国家代码
      allCountryData.value = allCountryData.value.map((country) => {
        const countryCode = country.code.toLowerCase()
        const isVisaFree = visaFreeAccess.value.some(
          (visa) => visa.code.toLowerCase() === countryCode,
        )
        const isElectronicTravelAuthorization = electronicTravelAuthorization.value.some(
          (visa) => visa.code.toLowerCase() === countryCode,
        )
        const isVisaOnArrival = visaOnArrival.value.some(
          (visa) => visa.code.toLowerCase() === countryCode,
        )
        return {
          ...country,
          isVisaFree,
          isElectronicTravelAuthorization,
          isVisaOnArrival,
        }
      })
    }
  } catch (error) {
    console.error('获取免签数据失败:', error)
    alert('获取免签数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #e5e7eb;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
