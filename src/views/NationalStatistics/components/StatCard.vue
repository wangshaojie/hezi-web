<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-gray-600 dark:text-gray-400 font-medium">{{ title }}</h3>
      <div :class="iconBgClass" class="p-2 rounded-full">
        <i :class="iconClass"></i>
      </div>
    </div>
    <div class="flex items-end justify-between">
      <div>
        <p class="text-3xl font-bold mb-1">{{ value?.toLocaleString() }} <span
            class="text-sm font-normal text-gray-500 dark:text-gray-400">{{ unit }}</span></p>
        <div class="flex items-center" v-if="trend === 'yearlyChange'">
          <span :class="changeClass">
            <i :class="changeIcon"></i> {{ changePercent }}%
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">较上年</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { convertPopulationData, type PopulationData } from '../../../utils/populationDataConverter'

interface Props {
  title: string
  value: number
  unit?: string
  trend?: string
  color?: string
}

const props = defineProps<Props>()

// 从JSON文件获取人口数据 - 用于计算同比变化
const populationData: PopulationData[] = convertPopulationData()

// 计算同比变化
const changePercent = computed(() => {
  const currentYearData = populationData[0] // 最新一年
  const previousYearData = populationData[1] // 上一年

  if (!currentYearData || !previousYearData) return 0

  let currentValue, previousValue

  switch (props.title) {
    case '总人口':
      currentValue = currentYearData.totalPopulation
      previousValue = previousYearData.totalPopulation
      break
    case '少儿人口(0-14岁)':
      currentValue = currentYearData.childPopulation
      previousValue = previousYearData.childPopulation
      break
    case '劳动年龄人口(15-64岁)':
      currentValue = currentYearData.workingPopulation
      previousValue = previousYearData.workingPopulation
      break
    case '老年人口(65岁及以上)':
      currentValue = currentYearData.elderlyPopulation
      previousValue = previousYearData.elderlyPopulation
      break
    default:
      return 0
  }

  const change = ((currentValue - previousValue) / previousValue) * 100
  return change.toFixed(2)
})

// 变化趋势样式
const changeClass = computed(() => {
  const percent = parseFloat(changePercent.value.toString())
  return percent > 0
    ? 'text-green-600 dark:text-green-400 text-sm font-medium'
    : 'text-red-600 dark:text-red-400 text-sm font-medium'
})

// 变化趋势图标
const changeIcon = computed(() => {
  const percent = parseFloat(changePercent.value.toString())
  return percent > 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'
})

// 图标背景样式
const iconBgClass = computed(() => {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  }

  return colors[props.color as keyof typeof colors] || colors.blue
})

// 图标样式
const iconClass = computed(() => {
  const icons = {
    blue: 'fa fa-users',
    green: 'fa fa-child',
    orange: 'fa fa-briefcase',
    purple: 'fa fa-heartbeat'
  }

  return icons[props.color as keyof typeof icons] || 'fa fa-bar-chart'
})
</script>
