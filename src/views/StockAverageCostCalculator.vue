<template>
  <LocalToolsDetailComp
    title="股票补仓计算器"
    subtitle="股票被套时，计算目标成本价需要补仓多少股与所需资金"
    :showSecurityBanner="true"
    securityText="隐私模式已开启，所有数据将在您浏览器本地计算，无需上传至服务器，请放心使用"
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
              <el-icon class="mr-2 text-blue-500"><DataBoard /></el-icon>持仓信息
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
                  placeholder="请输入当前持仓成本价（例如：10.50）"
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
                  placeholder="请输入当前持仓数量（例如：1000，建议为100的倍数）"
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
                  placeholder="请输入当前股价（例如：9.80）"
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
                  placeholder="请输入目标成本价（例如：10.00，需低于当前成本价）"
                  class="w-full"
                />
              </div>
            </div>

            <!-- 交易所选择 -->
            <div class="mt-6">
              <h3 class="text-lg font-semibold mb-4 flex items-center">
                <el-icon class="mr-2 text-blue-500"><DataBoard /></el-icon>交易所选择
              </h3>
              <div class="flex items-center space-x-4">
                <el-radio-group v-model="exchange">
                  <el-radio label="sh" class="flex items-center">
                    <span>沪市</span>
                    <el-tooltip content="单独收取过户费0.001%" placement="top">
                      <el-icon class="ml-1 text-gray-400"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </el-radio>
                  <el-radio label="sz" class="flex items-center">
                    <span>深市</span>
                    <el-tooltip content="过户费已包含在佣金中" placement="top">
                      <el-icon class="ml-1 text-gray-400"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </el-radio>
                </el-radio-group>
              </div>
            </div>

            <!-- 手续费设置 -->
            <div class="mt-6 pt-4 border-t">
              <h3 class="text-lg font-semibold mb-4 flex items-center">
                <el-icon class="mr-2 text-green-500"><Money /></el-icon>手续费设置
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>佣金费率 (%)</span>
                    <el-tooltip content="券商收取的交易佣金，默认0.01%（万分之一）" placement="top">
                      <el-icon class="ml-1 text-gray-400"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </label>
                  <el-input-number
                    v-model="commissionRate"
                    :min="0"
                    :max="0.3"
                    :precision="2"
                    :step="0.0001"
                    placeholder="默认0.01%（万分之一）"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>最低佣金 (元)</span>
                    <el-tooltip
                      content="单笔交易的最低佣金金额，默认5元，不足5元按5元收取"
                      placement="top"
                    >
                      <el-icon class="ml-1 text-gray-400"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </label>
                  <el-input-number
                    v-model="minCommission"
                    :min="0"
                    :precision="2"
                    :step="0.1"
                    placeholder="默认5元"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>印花税税率 (%)</span>
                    <el-tooltip
                      content="只有卖出时才收取印花税，税率为0.1%（千分之一）"
                      placement="top"
                    >
                      <el-icon class="ml-1 text-gray-400"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </label>
                  <el-input-number
                    v-model="stampTaxRate"
                    :min="0"
                    :max="0.1"
                    :precision="1"
                    :step="0.001"
                    placeholder="默认0%（买入）"
                    class="w-full"
                  />
                </div>

                <div v-if="exchange === 'sh'">
                  <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>过户费费率 (%)</span>
                    <el-tooltip
                      content="仅上海证券交易所收取，固定为0.01‰（即0.001%），不可修改"
                      placement="top"
                    >
                      <el-icon class="ml-1 text-gray-400"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </label>
                  <div
                    class="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-700 font-mono text-sm"
                  >
                    0.001%（0.01‰）
                  </div>
                </div>
                <div v-else class="text-sm text-gray-500 italic">
                  深市过户费已包含在佣金中，不单独收取
                </div>
              </div>
            </div>

            <!-- 计算按钮 -->
            <div class="mt-6">
              <el-button type="primary" @click="calculate" class="w-full" :loading="isCalculating">
                <template #icon>
                  <el-icon><Operation /></el-icon>
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
                        <p class="text-xs text-gray-500">股票总价</p>
                        <p class="text-xl font-bold text-green-600">
                          {{ totalMoney.toFixed(2) }} 元
                        </p>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-gray-500">预估手续费</p>
                        <p class="text-xl font-bold text-green-600">
                          {{ estimatedFee.toFixed(2) }} 元
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">实际投入资金</p>
                        <p class="text-xl font-bold text-green-600">
                          {{ actualInvestment.toFixed(2) }} 元
                        </p>
                      </div>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">目标成本价</p>
                      <p class="text-xl font-bold text-green-600">{{ targetCost.toFixed(2) }} 元</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">实际成本价</p>
                      <p class="text-xl font-bold text-green-600">
                        {{ actualCostAfterBuy.toFixed(2) }} 元
                      </p>
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
                    建议补仓 <strong>{{ sharesToBuy.toLocaleString() }}</strong> 股，股票总价约
                    <strong>{{ totalMoney.toFixed(2) }}</strong> 元，预估手续费
                    <strong>{{ estimatedFee.toFixed(2) }}</strong> 元，实际投入资金约
                    <strong>{{ actualInvestment.toFixed(2) }}</strong> 元，可将持仓成本降至约
                    <strong>{{ actualCostAfterBuy.toFixed(2) }}</strong> 元（目标成本价：
                    <strong>{{ targetCost.toFixed(2) }}</strong> 元）。
                    补仓后，当股价回升至实际成本价时即可解套。
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
import { ref, computed, watch } from 'vue'
import LocalToolsDetailComp from '@/components/LocalToolsDetailComp.vue'
import {
  DataBoard,
  Calendar,
  SuccessFilled,
  Warning,
  Money,
  Operation,
  QuestionFilled,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const currentCost = ref(0)
const currentShares = ref(0)
const currentPrice = ref(0)
const targetCost = ref(0)
const isCalculating = ref(false)
const showResult = ref(false)

// 手续费设置
const commissionRate = ref(0.01) // 默认佣金费率0.01% (万分之一，即0.01/100=0.0001，以百分比形式存储)
const minCommission = ref(5) // 默认最低佣金5元
const stampTaxRate = ref(0) // 默认印花税税率0% (买入时无印花税，以百分比形式存储)
const transferFeeRate = ref(0.001) // 固定过户费费率0.001% (即0.01‰，以百分比形式存储)

// 交易所选择（沪市/深市）
const exchange = ref('sh') // sh: 沪市, sz: 深市

// 监听交易所变化，清除之前的结果
watch(exchange, () => {
  if (showResult.value) {
    showResult.value = false
    ElMessage.info('交易所已切换，请重新计算')
  }
})

// 计算结果
const sharesToBuy = ref(0)
const totalMoney = ref(0)
const estimatedFee = ref(0) // 预估手续费
const actualInvestment = ref(0) // 实际投入资金（含手续费）

// 实际达到的成本价（考虑手续费后的实际成本）
const actualCostAfterBuy = computed(() => {
  if (!showResult.value || sharesToBuy.value === 0) return 0
  return (
    (currentCost.value * currentShares.value + actualInvestment.value) /
    (currentShares.value + sharesToBuy.value)
  )
})

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

// 计算手续费
const calculateFee = (shares: number, price: number) => {
  const transactionAmount = shares * price

  // 佣金（费率以百分比形式存储，需要除以100）
  let commission = transactionAmount * (commissionRate.value / 100)
  commission = Math.max(commission, minCommission.value)

  // 印花税（买入时不收取，费率以百分比形式存储）
  const stampTax = transactionAmount * (stampTaxRate.value / 100)

  // 过户费
  // 沪市：单独收取成交金额的0.001%（费率以百分比形式存储，需要除以100）
  // 深市：已包含在佣金中，不单独收取
  // 0.001% = 0.001/100 = 0.00001（即十万分之一，或0.01‰）
  const transferFee =
    exchange.value === 'sh' ? transactionAmount * (transferFeeRate.value / 100) : 0

  return commission + stampTax + transferFee
}

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

  // 使用迭代方法计算需要补仓的数量（考虑手续费）
  // 因为手续费会影响实际成本，需要迭代计算
  // 公式：目标成本价 = (当前成本价 * 当前持仓数量 + 补仓投入资金) / (当前持仓数量 + 补仓数量)
  // 其中：补仓投入资金 = 当前股价 * 补仓数量 + 手续费

  let sharesToBuyTemp = 0
  let lastShares = -1
  let iterations = 0
  const maxIterations = 100
  const tolerance = 0.01 // 允许的误差（股）

  // 初始估算（不考虑手续费）
  sharesToBuyTemp =
    (currentCost.value * currentShares.value - targetCost.value * currentShares.value) /
    (targetCost.value - currentPrice.value)

  // 迭代计算，直到收敛
  while (Math.abs(sharesToBuyTemp - lastShares) > tolerance && iterations < maxIterations) {
    lastShares = sharesToBuyTemp

    // 如果补仓数量为负或过小，设为0
    if (sharesToBuyTemp < 0) {
      sharesToBuyTemp = 0
      break
    }

    const totalMoneyTemp = sharesToBuyTemp * currentPrice.value
    const feeTemp = calculateFee(sharesToBuyTemp, currentPrice.value)
    const actualInvestmentTemp = totalMoneyTemp + feeTemp

    // 计算实际成本价（考虑手续费）
    const actualCostAfterBuy =
      (currentCost.value * currentShares.value + actualInvestmentTemp) /
      (currentShares.value + sharesToBuyTemp)

    // 计算成本价差异
    const costDiff = actualCostAfterBuy - targetCost.value

    // 如果差异很小，认为已收敛
    if (Math.abs(costDiff) < 0.0001) {
      break
    }

    // 根据成本价差异调整补仓数量
    // 如果实际成本高于目标，需要补更多；如果低于目标，可以减少
    // 使用线性近似来调整
    const adjustment =
      (costDiff * (currentShares.value + sharesToBuyTemp)) / (targetCost.value - currentPrice.value)
    sharesToBuyTemp += adjustment

    // 确保补仓数量不为负
    sharesToBuyTemp = Math.max(0, sharesToBuyTemp)

    iterations++
  }

  // 取整为100股的倍数（A股交易单位）
  sharesToBuy.value = Math.ceil(sharesToBuyTemp / 100) * 100
  totalMoney.value = sharesToBuy.value * currentPrice.value

  // 计算手续费
  estimatedFee.value = calculateFee(sharesToBuy.value, currentPrice.value)
  actualInvestment.value = totalMoney.value + estimatedFee.value

  showResult.value = true
  isCalculating.value = false

  ElMessage.success('计算完成')
}
</script>

<style scoped>
/* 自定义样式 */
</style>
