<template>
  <LocalToolsDetailComp
    title="股票补仓计算器"
    subtitle="股票被套时，计算目标成本价需要补仓多少股与所需资金"
    :showSecurityBanner="true"
  >
    <!-- 主内容插槽content -->
    <template #content>
      <!-- 主内容区 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        <!-- 输入表单面板 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 输入区域 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <el-icon class="mr-2 text-blue-500"><data-board /></el-icon>持仓信息
            </h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >当前持仓成本价 (元)</label
                >
                <el-input-number
                  v-model="currentCost"
                  :min="0.01"
                  :precision="2"
                  :step="0.01"
                  placeholder="请输入当前持仓成本价"
                  class="w-full"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >当前持仓数量 (股)</label
                >
                <el-input-number
                  v-model="currentShares"
                  :min="1"
                  :precision="0"
                  :step="100"
                  placeholder="请输入当前持仓数量"
                  class="w-full"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">当前股价 (元)</label>
                <el-input-number
                  v-model="currentPrice"
                  :min="0.01"
                  :precision="2"
                  :step="0.01"
                  placeholder="请输入当前股价"
                  class="w-full"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">目标成本价 (元)</label>
                <el-input-number
                  v-model="targetCost"
                  :min="0.01"
                  :precision="2"
                  :step="0.01"
                  placeholder="请输入目标成本价"
                  class="w-full"
                />
              </div>
            </div>

            <!-- 计算按钮 -->
            <div class="mt-6">
              <el-button type="primary" @click="calculate" class="w-full" :loading="isCalculating">
                <template #icon>
                  <el-icon><Calculator /></el-icon>
                </template>
                计算补仓方案
              </el-button>
            </div>
          </div>

          <!-- 注意事项 -->
          <div class="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
            <h3 class="text-lg font-semibold mb-3 flex items-center text-yellow-800">
              <el-icon class="mr-2"><warning /></el-icon>注意事项
            </h3>
            <ul class="text-sm text-yellow-700 space-y-2">
              <li class="flex items-start">
                <span class="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2"></span>
                <span>目标成本价必须低于当前持仓成本价</span>
              </li>
              <li class="flex items-start">
                <span class="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2"></span>
                <span>当前股价越低于目标成本价，需要补仓的数量越少</span>
              </li>
              <li class="flex items-start">
                <span class="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2"></span>
                <span>计算结果仅供参考，实际交易需考虑手续费等因素</span>
              </li>
              <li class="flex items-start">
                <span class="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2"></span>
                <span>补仓存在风险，请根据自身情况谨慎决策</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 结果显示区 -->
        <div class="lg:col-span-1">
          <div class="sticky top-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold mb-4 flex items-center">
                <el-icon class="mr-2 text-green-500"><success-filled /></el-icon>计算结果
              </h3>

              <!-- 计算结果展示 -->
              <div v-if="showResult" class="space-y-4">
                <!-- 当前持仓信息 -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">当前持仓信息</h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-500">持仓成本</p>
                      <p class="text-lg font-semibold">{{ currentCost.toFixed(2) }} 元</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">持仓数量</p>
                      <p class="text-lg font-semibold">{{ currentShares.toLocaleString() }} 股</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">当前股价</p>
                      <p class="text-lg font-semibold">{{ currentPrice.toFixed(2) }} 元</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">当前市值</p>
                      <p class="text-lg font-semibold">
                        {{ (currentPrice * currentShares).toFixed(2) }} 元
                      </p>
                    </div>
                    <div class="col-span-2">
                      <p class="text-xs text-gray-500">浮动盈亏</p>
                      <p
                        :class="[
                          'text-lg font-semibold',
                          currentPrice - currentCost >= 0 ? 'text-green-600' : 'text-red-600',
                        ]"
                      >
                        {{ ((currentPrice - currentCost) * currentShares).toFixed(2) }} 元 ({{
                          (((currentPrice - currentCost) / currentCost) * 100).toFixed(2)
                        }}%)
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 补仓方案 -->
                <div class="bg-green-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-green-800 mb-2">补仓方案</h4>
                  <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-gray-500">需要补仓数量</p>
                        <p class="text-xl font-bold text-green-600">
                          {{ sharesToBuy.toLocaleString() }} 股
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">补仓所需资金</p>
                        <p class="text-xl font-bold text-green-600">
                          {{ totalMoney.toFixed(2) }} 元
                        </p>
                      </div>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">目标成本价</p>
                      <p class="text-xl font-bold text-green-600">{{ targetCost.toFixed(2) }} 元</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">补仓后总持仓</p>
                      <p class="text-xl font-bold text-green-600">
                        {{ (currentShares + sharesToBuy).toLocaleString() }} 股
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 成本变化图表 -->
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-blue-800 mb-3">成本变化对比</h4>
                  <div class="h-40 flex items-end justify-around">
                    <div class="flex flex-col items-center">
                      <div
                        class="w-20 bg-red-500 rounded-t-lg"
                        :style="{ height: currentCostHeight + 'px' }"
                      ></div>
                      <p class="text-xs mt-2">当前成本</p>
                      <p class="text-sm font-medium">{{ currentCost.toFixed(2) }}元</p>
                    </div>
                    <div class="flex flex-col items-center">
                      <div
                        class="w-20 bg-blue-500 rounded-t-lg"
                        :style="{ height: targetCostHeight + 'px' }"
                      ></div>
                      <p class="text-xs mt-2">目标成本</p>
                      <p class="text-sm font-medium">{{ targetCost.toFixed(2) }}元</p>
                    </div>
                    <div class="flex flex-col items-center">
                      <div
                        class="w-20 bg-green-500 rounded-t-lg"
                        :style="{ height: currentPriceHeight + 'px' }"
                      ></div>
                      <p class="text-xs mt-2">当前股价</p>
                      <p class="text-sm font-medium">{{ currentPrice.toFixed(2) }}元</p>
                    </div>
                  </div>
                </div>

                <!-- 操作建议 -->
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 class="text-sm font-medium text-purple-800 mb-2">操作建议</h4>
                  <p class="text-sm text-purple-700">
                    建议补仓 <strong>{{ sharesToBuy.toLocaleString() }}</strong> 股，投入资金约
                    <strong>{{ totalMoney.toFixed(2) }}</strong> 元， 可将持仓成本降至
                    <strong>{{ targetCost.toFixed(2) }}</strong> 元。
                    补仓后，当股价回升至目标成本价时即可解套。
                  </p>
                </div>
              </div>

              <!-- 未计算状态 -->
              <div v-else class="text-center p-8 text-gray-400">
                <el-icon class="text-4xl mb-2"><Calendar /></el-icon>
                <p>请输入持仓信息并点击计算按钮</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </LocalToolsDetailComp>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LocalToolsDetailComp from '@/components/LocalToolsDetailComp.vue'
import { DataBoard, Calendar, SuccessFilled, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const currentCost = ref(0)
const currentShares = ref(0)
const currentPrice = ref(0)
const targetCost = ref(0)
const isCalculating = ref(false)
const showResult = ref(false)

// 计算结果
const sharesToBuy = ref(0)
const totalMoney = ref(0)

// 图表高度计算
const maxPrice = computed(() => {
  return Math.max(currentCost.value, targetCost.value, currentPrice.value, 1)
})

const currentCostHeight = computed(() => {
  return (currentCost.value / maxPrice.value) * 120
})

const targetCostHeight = computed(() => {
  return (targetCost.value / maxPrice.value) * 120
})

const currentPriceHeight = computed(() => {
  return (currentPrice.value / maxPrice.value) * 120
})

// 计算补仓方案
const calculate = () => {
  // 验证输入
  if (!currentCost.value || !currentShares.value || !currentPrice.value || !targetCost.value) {
    ElMessage.warning('请填写所有持仓信息')
    return
  }

  if (targetCost.value >= currentCost.value) {
    ElMessage.warning('目标成本价必须低于当前持仓成本价')
    return
  }

  if (currentPrice.value > targetCost.value) {
    ElMessage.warning('当前股价必须低于目标成本价')
    return
  }

  isCalculating.value = true

  // 计算需要补仓的数量
  // 公式：(当前成本价 * 当前持仓数量 - 目标成本价 * 当前持仓数量) / (目标成本价 - 当前股价)
  const result =
    (currentCost.value * currentShares.value - targetCost.value * currentShares.value) /
    (targetCost.value - currentPrice.value)

  // 取整为100股的倍数（A股交易单位）
  sharesToBuy.value = Math.ceil(result / 100) * 100
  totalMoney.value = sharesToBuy.value * currentPrice.value

  showResult.value = true
  isCalculating.value = false

  ElMessage.success('计算完成')
}
</script>

<style scoped>
/* 自定义样式 */
</style>
