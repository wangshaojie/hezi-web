import { ref, watch } from 'vue'

interface InsuranceRates {
  pension: number
  medical: number
  medicalFixed: number
  unemployment: number
  workInjury: number
  maternity: number
  housingFund: number
}

interface SalaryData {
  baseSalary: number
  socialInsuranceBase: number
  housingFundBase: number
  childrenEducation: number
  childrenEducationEnabled: boolean
  continuingEducation: number
  continuingEducationEnabled: boolean
  housingLoan: number
  housingLoanEnabled: boolean
  housingRent: number
  housingRentEnabled: boolean
  elderlyCare: number
  elderlyCareEnabled: boolean
}

const CACHE_KEYS = {
  INSURANCE_RATES: 'salary_insurance_rates',
  SALARY_DATA: 'salary_data',
}

// 默认保险比例配置
const defaultInsuranceRates: InsuranceRates = {
  pension: 8,
  medical: 2,
  medicalFixed: 3,
  unemployment: 0.5,
  workInjury: 0,
  maternity: 0,
  housingFund: 12,
}

// 默认工资数据
const defaultSalaryData: SalaryData = {
  baseSalary: 15000,
  socialInsuranceBase: 15000,
  housingFundBase: 15000,
  childrenEducation: 1000,
  childrenEducationEnabled: true,
  continuingEducation: 400,
  continuingEducationEnabled: true,
  housingLoan: 1000,
  housingLoanEnabled: true,
  housingRent: 0,
  housingRentEnabled: false,
  elderlyCare: 2000,
  elderlyCareEnabled: true,
}

// 创建响应式数据
export const insuranceRates = ref<InsuranceRates>(
  JSON.parse(
    localStorage.getItem(CACHE_KEYS.INSURANCE_RATES) || JSON.stringify(defaultInsuranceRates),
  ),
)

export const salaryData = ref<SalaryData>(
  JSON.parse(localStorage.getItem(CACHE_KEYS.SALARY_DATA) || JSON.stringify(defaultSalaryData)),
)

// 监听数据变化并保存到localStorage
watch(
  insuranceRates,
  (newValue) => {
    localStorage.setItem(CACHE_KEYS.INSURANCE_RATES, JSON.stringify(newValue))
  },
  { deep: true },
)

watch(
  salaryData,
  (newValue) => {
    localStorage.setItem(CACHE_KEYS.SALARY_DATA, JSON.stringify(newValue))
  },
  { deep: true },
)

// 重置数据到默认值
export function resetToDefaults() {
  insuranceRates.value = { ...defaultInsuranceRates }
  salaryData.value = { ...defaultSalaryData }
}

// 清除缓存数据
export function clearCache() {
  localStorage.removeItem(CACHE_KEYS.INSURANCE_RATES)
  localStorage.removeItem(CACHE_KEYS.SALARY_DATA)
  resetToDefaults()
}
