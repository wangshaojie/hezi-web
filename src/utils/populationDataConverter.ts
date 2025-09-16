/**
 * 人口数据转换工具
 * 用于将JSON数据转换为组件所需的格式
 */

import populationDataJson from '../data/populationData.json'

// 定义转换后的数据接口
export interface PopulationData {
  year: number
  totalPopulation: number
  childPopulation: number // 0-14岁
  workingPopulation: number // 15-64岁
  elderlyPopulation: number // 65岁及以上
  dependencyRatio: number // 总抚养比
  malePopulation: number // 男性人口
  femalePopulation: number // 女性人口
  urbanPopulation: number // 城镇人口
  ruralPopulation: number // 乡村人口
  birthRate: number // 人口出生率(‰)
  deathRate: number // 人口死亡率(‰)
  naturalGrowthRate: number // 人口自然增长率(‰)
  lifeExpectancy: number | null // 平均预期寿命(岁)
  maleLifeExpectancy: number | null // 男性平均预期寿命(岁)
  femaleLifeExpectancy: number | null // 女性平均预期寿命(岁)
}

/**
 * 将JSON数据转换为组件所需的格式
 * @returns 转换后的人口数据数组
 */
export function convertPopulationData(): PopulationData[] {
  return populationDataJson.data.map((item) => ({
    year: item.year,
    totalPopulation: item.totalPopulation,
    childPopulation: item.ageStructure.childPopulation,
    workingPopulation: item.ageStructure.workingPopulation,
    elderlyPopulation: item.ageStructure.elderlyPopulation,
    dependencyRatio: item.ageStructure.dependencyRatio,
    malePopulation: item.genderStructure.malePopulation,
    femalePopulation: item.genderStructure.femalePopulation,
    urbanPopulation: item.urbanRuralStructure.urbanPopulation,
    ruralPopulation: item.urbanRuralStructure.ruralPopulation,
    birthRate: item.vitalRates.birthRate,
    deathRate: item.vitalRates.deathRate,
    naturalGrowthRate: item.vitalRates.naturalGrowthRate,
    lifeExpectancy: item.lifeExpectancy.average,
    maleLifeExpectancy: item.lifeExpectancy.male,
    femaleLifeExpectancy: item.lifeExpectancy.female,
  }))
}

/**
 * 获取最新年份的数据
 * @returns 最新年份的人口数据
 */
export function getLatestYearData(): PopulationData {
  const data = convertPopulationData()
  return data[0] // 数据已按年份降序排列
}

/**
 * 获取指定年份的数据
 * @param year 年份
 * @returns 指定年份的人口数据，如果不存在则返回null
 */
export function getYearData(year: number): PopulationData | null {
  const data = convertPopulationData()
  return data.find((item) => item.year === year) || null
}

/**
 * 获取数据源信息
 * @returns 数据源描述信息
 */
export function getDataSourceInfo() {
  return {
    description: populationDataJson.description,
    dataSource: populationDataJson.dataSource,
    lastUpdated: populationDataJson.lastUpdated,
    totalYears: populationDataJson.data.length,
    yearRange: {
      start: Math.min(...populationDataJson.data.map((item) => item.year)),
      end: Math.max(...populationDataJson.data.map((item) => item.year)),
    },
  }
}

/**
 * 验证数据完整性
 * @returns 验证结果
 */
export function validateData(): { isValid: boolean; errors: string[] } {
  const data = convertPopulationData()
  const errors: string[] = []

  data.forEach((item, index) => {
    // 验证总人口是否等于各年龄段人口之和
    const calculatedTotal = item.childPopulation + item.workingPopulation + item.elderlyPopulation
    if (Math.abs(item.totalPopulation - calculatedTotal) > 1) {
      // 允许1万人的误差
      errors.push(`${item.year}年：总人口与各年龄段人口之和不匹配`)
    }

    // 验证自然增长率是否等于出生率减去死亡率
    const calculatedNaturalGrowth = item.birthRate - item.deathRate
    if (Math.abs(item.naturalGrowthRate - calculatedNaturalGrowth) > 0.01) {
      // 允许0.01‰的误差
      errors.push(`${item.year}年：自然增长率与出生率减去死亡率不匹配`)
    }

    // 验证抚养比计算
    const calculatedDependencyRatio =
      ((item.childPopulation + item.elderlyPopulation) / item.workingPopulation) * 100
    if (Math.abs(item.dependencyRatio - calculatedDependencyRatio) > 0.1) {
      // 允许0.1%的误差
      errors.push(`${item.year}年：抚养比计算不匹配`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}
