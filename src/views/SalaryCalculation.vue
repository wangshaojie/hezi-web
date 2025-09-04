<template>
  <LocalToolsDetailComp title="薪酬核算系统" subtitle="工资个税计算逻辑" :showSecurityBanner="false">
    <template #content>
      <el-card shadow="hover" class="mt-6 mb-6">
        <template #header>
          <div class="flex items-center">
            <h2 class="text-xl font-bold text-blue-600">工资个税计算逻辑</h2>
            <el-tag type="success" class="ml-2">核心公式</el-tag>
          </div>
        </template>

        <!-- 计算公式区 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="formula-card">
            <h3 class="formula-title">每月应纳税所得额</h3>
            <div class="formula-content">
              = 当月收入(基本工资+奖金) - 5000(起征点) - 社保公积金 - 专项附加扣除
            </div>
          </div>

          <div class="formula-card">
            <h3 class="formula-title">累计应纳税所得额</h3>
            <div class="formula-content">= 累计收入 - 累计扣除</div>
          </div>

          <div class="formula-card">
            <h3 class="formula-title">当月个税</h3>
            <div class="formula-content">= 累计个税 - 上月累计个税</div>
          </div>

          <div class="formula-card">
            <h3 class="formula-title">实际到手工资</h3>
            <div class="formula-content">= 基本工资 + 奖金 - 社保公积金 - 当月个税</div>
          </div>
        </div>
      </el-card>

      <div class="flex justify-end mb-4 space-x-2">
        <el-button type="warning" @click="handleReset">重置为默认值</el-button>
        <el-button type="danger" @click="handleClearCache">清除缓存</el-button>
      </div>

      <el-card shadow="hover" class="mb-6 mt-6">
        <template #header>
          <div class="font-bold">基本信息</div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item label="税前月薪(元)" required>
            <el-input-number v-model="salaryData.baseSalary" :min="2320" :max="50000" :step="100" :precision="2"
              controls-position="right" />
          </el-form-item>

          <el-form-item label="社保缴纳基数(元)">
            <el-input-number v-model="salaryData.socialInsuranceBase" :max="33891" :step="100" :precision="2"
              controls-position="right" />
          </el-form-item>

          <el-form-item label="公积金缴纳基数(元)">
            <el-input-number v-model="salaryData.housingFundBase" :min="2320" :max="33891" :step="100" :precision="2"
              controls-position="right" />
          </el-form-item>
        </div>
      </el-card>

      <el-card shadow="hover" class="mb-6">
        <template #header>
          <div class="font-bold">缴纳比例配置</div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item label="养老保险比例(%)">
            <el-input-number v-model="insuranceRates.pension" :min="0" :max="20" :step="0.1" :precision="1"
              controls-position="right" />
          </el-form-item>

          <el-form-item label="医疗保险比例(%)">
            <div class="flex items-center gap-2">
              <el-input-number v-model="insuranceRates.medical" :min="0" :max="20" :step="0.1" :precision="1"
                controls-position="right" />
              <span class="text-gray-500">+</span>
              <el-input-number v-model="insuranceRates.medicalFixed" :min="0" :max="100" :step="1" :precision="0"
                controls-position="right" />
              <span class="text-gray-500">元</span>
            </div>
          </el-form-item>

          <el-form-item label="失业保险比例(%)">
            <el-input-number v-model="insuranceRates.unemployment" :min="0" :max="20" :step="0.1" :precision="1"
              controls-position="right" />
          </el-form-item>

          <el-form-item label="工伤保险比例(%)">
            <el-input-number v-model="insuranceRates.workInjury" :min="0" :max="20" :step="0.1" :precision="1"
              controls-position="right" />
          </el-form-item>

          <el-form-item label="生育保险比例(%)">
            <el-input-number v-model="insuranceRates.maternity" :min="0" :max="20" :step="0.1" :precision="1"
              controls-position="right" />
          </el-form-item>

          <el-form-item label="住房公积金比例(%)">
            <el-input-number v-model="insuranceRates.housingFund" :min="0" :max="20" :step="0.1" :precision="1"
              controls-position="right" />
          </el-form-item>
        </div>
      </el-card>

      <el-card shadow="hover" class="mb-6">
        <template #header>
          <div class="font-bold">专项附加扣除项目</div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item label="子女教育(元/月)">
            <div class="flex items-center gap-2">
              <el-switch v-model="salaryData.childrenEducationEnabled" />
              <el-input-number v-model="salaryData.childrenEducation" :min="0" :max="2000" :step="100" :precision="0"
                controls-position="right" :disabled="!salaryData.childrenEducationEnabled" />
            </div>
          </el-form-item>

          <el-form-item label="继续教育(元/月)">
            <div class="flex items-center gap-2">
              <el-switch v-model="salaryData.continuingEducationEnabled" />
              <el-input-number v-model="salaryData.continuingEducation" :min="0" :max="400" :step="100" :precision="0"
                controls-position="right" :disabled="!salaryData.continuingEducationEnabled" />
            </div>
          </el-form-item>

          <el-form-item label="住房贷款利息(元/月)">
            <div class="flex items-center gap-2">
              <el-switch v-model="salaryData.housingLoanEnabled" />
              <el-input-number v-model="salaryData.housingLoan" :min="0" :max="1000" :step="100" :precision="0"
                controls-position="right" :disabled="!salaryData.housingLoanEnabled" />
            </div>
          </el-form-item>

          <el-form-item label="住房租金(元/月)">
            <div class="flex items-center gap-2">
              <el-switch v-model="salaryData.housingRentEnabled" />
              <el-input-number v-model="salaryData.housingRent" :min="0" :max="1500" :step="100" :precision="0"
                controls-position="right" :disabled="!salaryData.housingRentEnabled" />
            </div>
          </el-form-item>

          <el-form-item label="赡养老人(元/月)">
            <div class="flex items-center gap-2">
              <el-switch v-model="salaryData.elderlyCareEnabled" />
              <el-input-number v-model="salaryData.elderlyCare" :min="0" :max="2000" :step="100" :precision="0"
                controls-position="right" :disabled="!salaryData.elderlyCareEnabled" />
            </div>
          </el-form-item>
        </div>
      </el-card>

      <el-card shadow="hover" class="mb-6">
        <template #header>
          <div class="font-bold">过节费/嘉奖/加班费等设置</div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="month in 12" :key="month" class="flex items-center gap-2">
            <span class="w-15">{{ month }}月：</span>
            <el-input-number style="width: 250px" v-model="monthlyBonus[month]" :min="0" :step="100" :precision="2"
              controls-position="right" placeholder="请输入奖金金额" />
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="mb-6">
        <template #header>
          <div class="font-bold">计算结果</div>
        </template>
        <div class="mb-4">
          <el-button type="primary" @click="calculateMonthlySalaries">计算全年工资明细</el-button>
        </div>
        <el-table :data="monthlyResults" border stripe style="width: 100%">
          <el-table-column prop="month" label="月份" width="60" />
          <el-table-column prop="baseSalary" label="税前工资" width="100" />
          <el-table-column prop="bonus" label="奖金" width="80">
            <template #default="{ row }">
              {{ row.bonus.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="netSalary" label="应收工资" width="100">
            <template #default="{ row }">
              {{ row.netSalary.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="accumulatedSalary" label="累计应收工资" width="120">
            <template #default="{ row }">
              {{ row.accumulatedSalary.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="pension" label="养老保险" width="90">
            <template #default="{ row }">
              {{ row.pension.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="medicalInsurance" label="医疗保险" width="100">
            <template #default="{ row }">
              {{ row.medicalInsurance.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="unemploymentInsurance" label="失业保险" width="100">
            <template #default="{ row }">
              {{ row.unemploymentInsurance.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="housingFund" label="住房公积金" width="100" />
          <el-table-column prop="totalInsurance" label="社保公积金合计" width="130">
            <template #default="{ row }">
              {{ row.totalInsurance.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="totalDeductions" label="专项附加扣除总额" width="140" />
          <el-table-column prop="taxableIncome" label="累计应纳税所得额">
            <template #default="{ row }">
              {{ row.taxableIncome.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="taxRate" label="适用税率" width="100">
            <template #default="{ row }"> {{ (row.taxRate * 100).toFixed(1) }}% </template>
          </el-table-column>
          <el-table-column prop="incomeTax" label="个人所得税" width="100">
            <template #default="{ row }">
              {{ row.incomeTax.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="accumulatedTax" label="累计纳税" width="100">
            <template #default="{ row }">
              {{ row.accumulatedTax.toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card shadow="hover" class="mb-6">
        <template #header>
          <div class="flex items-center">
            <h2 class="text-xl font-bold text-blue-600">2025年个人所得税计算说明</h2>
            <el-tag type="danger" class="ml-2">最新政策</el-tag>
          </div>
        </template>

        <!-- 基本计算公式 -->
        <div class="section">
          <h3 class="section-title">一、基本计算公式</h3>
          <div class="formula-box">
            <p>应纳税额 = 应纳税所得额 × 适用税率 - 速算扣除数</p>
            <p class="mt-2">
              <span class="font-bold">其中：</span>
              应纳税所得额 = 年度综合所得收入额 - 6万元 - 专项扣除 - 专项附加扣除 - 依法确定的其他扣除
            </p>
          </div>
        </div>

        <!-- 综合所得范围 -->
        <div class="section">
          <h3 class="section-title">二、综合所得范围</h3>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card shadow="never" class="h-full">
                <div class="flex items-center">
                  <el-icon class="mr-2">
                    <Money />
                  </el-icon>
                  <span>工资、薪金所得</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="never" class="h-full">
                <div class="flex items-center">
                  <el-icon class="mr-2">
                    <Briefcase />
                  </el-icon>
                  <span>劳务报酬所得</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="never" class="h-full">
                <div class="flex items-center">
                  <el-icon class="mr-2">
                    <EditPen />
                  </el-icon>
                  <span>稿酬所得</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="never" class="h-full">
                <div class="flex items-center">
                  <el-icon class="mr-2">
                    <Key />
                  </el-icon>
                  <span>特许权使用费所得</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 税率表 -->
        <div class="section">
          <h3 class="section-title">三、税率表（年度）</h3>
          <el-table :data="taxRates" stripe border class="w-full">
            <el-table-column prop="level" label="级数" width="80" align="center" />
            <el-table-column prop="range" label="全年应纳税所得额" />
            <el-table-column prop="rate" label="税率(%)" width="100" align="center" />
            <el-table-column prop="deduction" label="速算扣除数(元)" width="120" align="right" />
          </el-table>
        </div>

        <!-- 专项附加扣除 -->
        <div class="section">
          <h3 class="section-title">四、专项附加扣除项目</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="子女教育" width="150px">
              每个子女每月1,000元
            </el-descriptions-item>
            <el-descriptions-item label="继续教育" width="150px">
              每月400元或当年3,600元
            </el-descriptions-item>
            <el-descriptions-item label="大病医疗" width="150px">
              每年限额80,000元
            </el-descriptions-item>
            <el-descriptions-item label="住房贷款利息" width="150px">
              每月1,000元
            </el-descriptions-item>
            <el-descriptions-item label="住房租金" width="150px">
              根据城市不同分为1,500元/月、1,100元/月、800元/月三档
            </el-descriptions-item>
            <el-descriptions-item label="赡养老人" width="150px">
              独生子女每月2,000元，非独生子女分摊每月2,000元
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 示例计算 -->
        <div class="section">
          <h3 class="section-title">五、示例计算</h3>
          <el-steps direction="vertical" :active="5" space="40px">
            <el-step title="月应纳税所得额">
              <template #description>
                <p>
                  15,000 - 5,000（基本减除费用） - 2,000（社保公积金） - 1,000（子女教育） -
                  2,000（赡养老人） = 5,000元
                </p>
              </template>
            </el-step>
            <el-step title="年应纳税所得额">
              <template #description>
                <p>5,000 × 12 = 60,000元</p>
              </template>
            </el-step>
            <el-step title="查找适用税率">
              <template #description>
                <p>60,000元对应第2级税率（10%）和速算扣除数2,520元</p>
              </template>
            </el-step>
            <el-step title="年应纳税额">
              <template #description>
                <p>60,000 × 10% - 2,520 = 3,480元</p>
              </template>
            </el-step>
            <el-step title="月平均税额">
              <template #description>
                <p>3,480 ÷ 12 = 290元</p>
              </template>
            </el-step>
          </el-steps>
        </div>

        <!-- 注意事项 -->
        <div class="section">
          <h3 class="section-title">六、注意事项</h3>
          <ul class="note-list">
            <li>
              劳务报酬所得、稿酬所得、特许权使用费所得以每次收入减除费用后的余额为收入额，其中稿酬所得的收入额减按70%计算
            </li>
            <li>非居民个人的工资、薪金所得，以每月收入额减除费用5,000元后的余额为应纳税所得额</li>
            <li>个人所得税通常由单位代扣代缴，按年汇算清缴</li>
          </ul>
          <div class="note-footer">
            以上计算方式适用于中国大陆地区，具体实施可能因政策调整而略有不同
          </div>
        </div>
      </el-card>
    </template>
  </LocalToolsDetailComp>


</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Money, Briefcase, EditPen, Key } from '@element-plus/icons-vue'
import { insuranceRates, salaryData, resetToDefaults, clearCache } from '@/utils/salaryCache'
import LocalToolsDetailComp from '@/components/LocalToolsDetailComp.vue'

interface TaxBracket {
  min: number
  max: number
  rate: number
  deduction: number
}

interface MonthlyResult {
  month: number
  baseSalary: number
  bonus: number
  pension: number
  medicalInsurance: number
  unemploymentInsurance: number
  housingFund: number
  totalInsurance: number
  totalDeductions: number
  taxableIncome: number
  taxRate: number
  incomeTax: number
  netSalary: number
  accumulatedTax: number
  accumulatedSalary: number
}

const taxRates = [
  { level: 1, range: '不超过36,000元', rate: 3, deduction: '0' },
  { level: 2, range: '超过36,000元至144,000元', rate: 10, deduction: '2,520' },
  { level: 3, range: '超过144,000元至300,000元', rate: 20, deduction: '16,920' },
  { level: 4, range: '超过300,000元至420,000元', rate: 25, deduction: '31,920' },
  { level: 5, range: '超过420,000元至660,000元', rate: 30, deduction: '52,920' },
  { level: 6, range: '超过660,000元至960,000元', rate: 35, deduction: '85,920' },
  { level: 7, range: '超过960,000元', rate: 45, deduction: '181,920' },
]

// 2025年北京市社保公积金参数
const MIN_SOCIAL_BASE = 6326 // 社保最低基数
const MAX_SOCIAL_BASE = 33891 // 社保最高基数
const MIN_HOUSING_BASE = 2320 // 公积金最低基数
const MAX_HOUSING_BASE = 33891 // 公积金最高基数

// 税率表常量
const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 36000, rate: 0.03, deduction: 0 },
  { min: 36000, max: 144000, rate: 0.1, deduction: 2520 },
  { min: 144000, max: 300000, rate: 0.2, deduction: 16920 },
  { min: 300000, max: 420000, rate: 0.25, deduction: 31920 },
  { min: 420000, max: 660000, rate: 0.3, deduction: 52920 },
  { min: 660000, max: 960000, rate: 0.35, deduction: 85920 },
  { min: 960000, max: Infinity, rate: 0.45, deduction: 181920 },
]

const monthlyResults = ref<MonthlyResult[]>([])

// 在 salaryData 中添加月度奖金
const monthlyBonus = ref<Record<number, number>>({})

function calculateMonthlySalary(month: number): MonthlyResult {
  const {
    baseSalary,
    socialInsuranceBase,
    housingFundBase,
    childrenEducation,
    childrenEducationEnabled,
    continuingEducation,
    continuingEducationEnabled,
    housingLoan,
    housingLoanEnabled,
    housingRent,
    housingRentEnabled,
    elderlyCare,
    elderlyCareEnabled,
  } = salaryData.value

  // 获取当月奖金
  const bonus = monthlyBonus.value[month] || 0

  // 计算五险一金
  const pension =
    Math.min(Math.max(socialInsuranceBase, MIN_SOCIAL_BASE), MAX_SOCIAL_BASE) *
    (insuranceRates.value.pension / 100)
  const medicalInsurance =
    Math.min(Math.max(socialInsuranceBase, MIN_SOCIAL_BASE), MAX_SOCIAL_BASE) *
    (insuranceRates.value.medical / 100) +
    insuranceRates.value.medicalFixed
  const unemploymentInsurance =
    Math.min(Math.max(socialInsuranceBase, MIN_SOCIAL_BASE), MAX_SOCIAL_BASE) *
    (insuranceRates.value.unemployment / 100)
  const housingFund =
    Math.min(Math.max(housingFundBase, MIN_HOUSING_BASE), MAX_HOUSING_BASE) *
    (insuranceRates.value.housingFund / 100)

  const totalInsurance = pension + medicalInsurance + unemploymentInsurance + housingFund

  // 计算专项附加扣除总额
  const totalDeductions = Number(
    (
      (childrenEducationEnabled ? childrenEducation : 0) +
      (continuingEducationEnabled ? continuingEducation : 0) +
      (housingLoanEnabled ? housingLoan : 0) +
      (housingRentEnabled ? housingRent : 0) +
      (elderlyCareEnabled ? elderlyCare : 0)
    ).toFixed(2),
  )

  // 计算累计应纳税所得额（包含奖金）
  const monthlyDeduction = 5000 + totalInsurance + totalDeductions
  const accumulatedTaxableIncome = Math.max(
    0,
    (baseSalary + bonus) * month - monthlyDeduction * month,
  )
  const previousMonthTaxableIncome = Math.max(
    0,
    (baseSalary + (monthlyBonus.value[month - 1] || 0)) * (month - 1) -
    monthlyDeduction * (month - 1),
  )

  // 计算个人所得税
  const accumulatedTax = calculateIncomeTax(accumulatedTaxableIncome)
  const previousMonthTax = calculateIncomeTax(previousMonthTaxableIncome)
  const currentMonthTax = accumulatedTax - previousMonthTax

  // 获取当前月份适用税率（基于年度累计收入）
  const currentTaxRate = getTaxRate(accumulatedTaxableIncome)

  // 计算税后工资（包含奖金）
  const netSalary = baseSalary + bonus - totalInsurance - currentMonthTax

  // 计算累计到手工资
  const accumulatedSalary = netSalary * month

  return {
    month,
    baseSalary,
    bonus,
    pension,
    medicalInsurance,
    unemploymentInsurance,
    housingFund,
    totalInsurance,
    totalDeductions,
    taxableIncome: accumulatedTaxableIncome,
    taxRate: currentTaxRate,
    incomeTax: currentMonthTax,
    netSalary,
    accumulatedTax,
    accumulatedSalary,
  }
}

function calculateMonthlySalaries() {
  monthlyResults.value = Array.from({ length: 12 }, (_, i) => calculateMonthlySalary(i + 1))
}

function getTaxRate(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0
  // 将年度累计收入转换为月度收入来判断税率
  const monthlyIncome = taxableIncome / 12
  const bracket = TAX_BRACKETS.find(
    (b) => monthlyIncome > b.min / 12 && monthlyIncome <= b.max / 12,
  )
  return bracket ? bracket.rate : 0
}

function calculateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0
  const bracket = TAX_BRACKETS.find((b) => taxableIncome > b.min && taxableIncome <= b.max)
  if (!bracket) return 0
  return Number((taxableIncome * bracket.rate - bracket.deduction).toFixed(2))
}

// 自动调整社保公积金基数为合理值
watch(
  () => salaryData.value.baseSalary,
  (newVal) => {
    salaryData.value.socialInsuranceBase = Math.min(
      Math.max(newVal, MIN_SOCIAL_BASE),
      MAX_SOCIAL_BASE,
    )
    salaryData.value.housingFundBase = Math.min(
      Math.max(newVal, MIN_HOUSING_BASE),
      MAX_HOUSING_BASE,
    )
  },
)

// 添加重置和清除缓存的功能
const handleReset = () => {
  resetToDefaults()
}

const handleClearCache = () => {
  clearCache()
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}

.tax-calculator {
  max-width: 56rem;
  margin: 0 auto;
}

.section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.formula-box {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
}

.note-list {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.note-list li {
  margin-bottom: 0.5rem;
  color: #374151;
}

.note-footer {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.formula-card {
  background-color: rgb(249 250 251);
  padding: 1rem;
  border-radius: 0.5rem;
  border-left-width: 4px;
  border-left-color: rgb(59 130 246);
}

.formula-title {
  font-weight: 700;
  color: rgb(55 65 81);
  margin-bottom: 0.5rem;
}

.formula-content {
  color: rgb(75 85 99);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
</style>
