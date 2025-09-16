<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
    <!-- 页面头部 -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-blue-600 dark:text-blue-400">中国人口数据分析 (2015-2024)</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">各年龄段人口数量统计与趋势分析</p>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 数据概览卡片 -->
      <div class="mb-4">
        <h2 class="text-xl font-semibold mb-2">{{ latestYearData.year }}年人口数据概览</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">基于最新统计数据</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="总人口" :value="totalPopulation" unit="万人" trend="yearlyChange" color="blue" />
        <StatCard title="少儿人口(0-14岁)" :value="childPopulation" unit="万人" trend="yearlyChange" color="green" />
        <StatCard title="劳动年龄人口(15-64岁)" :value="workingPopulation" unit="万人" trend="yearlyChange" color="orange" />
        <StatCard title="老年人口(65岁及以上)" :value="elderlyPopulation" unit="万人" trend="yearlyChange" color="purple" />
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <!-- 总人口趋势图 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 class="text-xl font-semibold mb-4">总人口变化趋势</h2>
          <div class="h-80">
            <canvas ref="totalPopulationChart"></canvas>
          </div>
        </div>

        <!-- 各年龄段人口比例图 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 class="text-xl font-semibold mb-2">各年龄段人口比例</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">基于{{ latestYearData.year }}年数据</p>
          <div class="h-80">
            <canvas ref="ageGroupChart"></canvas>
          </div>
        </div>

        <!-- 各年龄段人口趋势图 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 class="text-xl font-semibold mb-4">各年龄段人口趋势</h2>
          <div class="h-80">
            <canvas ref="ageTrendChart"></canvas>
          </div>
        </div>

        <!-- 老年人口占比趋势图 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 class="text-xl font-semibold mb-4">老龄化趋势 (65岁及以上占比)</h2>
          <div class="h-80">
            <canvas ref="agingChart"></canvas>
          </div>
        </div>

        <!-- 性别结构图 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 class="text-xl font-semibold mb-2">性别结构</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">基于{{ latestYearData.year }}年数据</p>
          <div class="h-80">
            <canvas ref="genderChart"></canvas>
          </div>
        </div>

        <!-- 城乡分布图 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 class="text-xl font-semibold mb-2">城乡分布</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">基于{{ latestYearData.year }}年数据</p>
          <div class="h-80">
            <canvas ref="urbanRuralChart"></canvas>
          </div>
        </div>

        <!-- 人口出生率与死亡率趋势图 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 class="text-xl font-semibold mb-4">人口出生率与死亡率趋势 (2015-2024)</h2>
          <div class="h-80">
            <canvas ref="birthDeathRateChart"></canvas>
          </div>
        </div>

        <!-- 平均预期寿命对比图 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 class="text-xl font-semibold mb-4">平均预期寿命对比 (2015年 vs 2020年)</h2>
          <div class="h-80">
            <canvas ref="lifeExpectancyChart"></canvas>
          </div>
        </div>
      </div>

      <!-- 人口出生率、死亡率与自然增长率趋势图 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10 overflow-x-auto">
        <h2 class="text-xl font-semibold mb-4">人口出生率、死亡率与自然增长率趋势 (2015-2024)</h2>
        <div class="h-80">
          <canvas ref="recentTrendsChart"></canvas>
        </div>
      </div>

      <!-- 年龄结构数据表格 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10 overflow-x-auto">
        <h2 class="text-xl font-semibold mb-4">年龄结构数据详情 (2015-2024)</h2>
        <table class="w-full min-w-[800px]">
          <thead>
            <tr class="border-b-2 border-gray-200 dark:border-gray-700">
              <th class="py-3 px-4 text-left font-semibold">年份</th>
              <th class="py-3 px-4 text-right font-semibold">总人口(万人)</th>
              <th class="py-3 px-4 text-right font-semibold">0-14岁人口(万人)</th>
              <th class="py-3 px-4 text-right font-semibold">15-64岁人口(万人)</th>
              <th class="py-3 px-4 text-right font-semibold">65岁及以上人口(万人)</th>
              <th class="py-3 px-4 text-right font-semibold">总抚养比(%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in populationData" :key="data.year"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td class="py-3 px-4 font-medium">{{ data.year }}</td>
              <td class="py-3 px-4 text-right">{{ data.totalPopulation.toLocaleString() }}</td>
              <td class="py-3 px-4 text-right">{{ data.childPopulation.toLocaleString() }}</td>
              <td class="py-3 px-4 text-right">{{ data.workingPopulation.toLocaleString() }}</td>
              <td class="py-3 px-4 text-right">{{ data.elderlyPopulation.toLocaleString() }}</td>
              <td class="py-3 px-4 text-right">{{ data.dependencyRatio.toFixed(1) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 性别与城乡分布数据表格 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10 overflow-x-auto">
        <h2 class="text-xl font-semibold mb-4">性别与城乡分布数据详情 (2015-2024)</h2>
        <table class="w-full min-w-[1000px]">
          <thead>
            <tr class="border-b-2 border-gray-200 dark:border-gray-700">
              <th class="py-3 px-4 text-left font-semibold">年份</th>
              <th class="py-3 px-4 text-right font-semibold">总人口(万人)</th>
              <th class="py-3 px-4 text-right font-semibold">男性人口(万人)</th>
              <th class="py-3 px-4 text-right font-semibold">女性人口(万人)</th>
              <th class="py-3 px-4 text-right font-semibold">城镇人口(万人)</th>
              <th class="py-3 px-4 text-right font-semibold">乡村人口(万人)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in populationData" :key="data.year"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td class="py-3 px-4 font-medium">{{ data.year }}</td>
              <td class="py-3 px-4 text-right">{{ data.totalPopulation.toLocaleString() }}</td>
              <td class="py-3 px-4 text-right">{{ data.malePopulation.toLocaleString() }}</td>
              <td class="py-3 px-4 text-right">{{ data.femalePopulation.toLocaleString() }}</td>
              <td class="py-3 px-4 text-right">{{ data.urbanPopulation.toLocaleString() }}</td>
              <td class="py-3 px-4 text-right">{{ data.ruralPopulation.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 人口出生率、死亡率与自然增长率数据表格 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10 overflow-x-auto">
        <h2 class="text-xl font-semibold mb-4">人口出生率、死亡率与自然增长率数据详情 (2015-2024)</h2>
        <table class="w-full min-w-[800px]">
          <thead>
            <tr class="border-b-2 border-gray-200 dark:border-gray-700">
              <th class="py-3 px-4 text-left font-semibold">年份</th>
              <th class="py-3 px-4 text-right font-semibold">人口出生率(‰)</th>
              <th class="py-3 px-4 text-right font-semibold">人口死亡率(‰)</th>
              <th class="py-3 px-4 text-right font-semibold">人口自然增长率(‰)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in populationData" :key="data.year"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td class="py-3 px-4 font-medium">{{ data.year }}</td>
              <td class="py-3 px-4 text-right">{{ data.birthRate.toFixed(2) }}</td>
              <td class="py-3 px-4 text-right">{{ data.deathRate.toFixed(2) }}</td>
              <td class="py-3 px-4 text-right"
                :class="data.naturalGrowthRate < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                {{ data.naturalGrowthRate.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-white dark:bg-gray-900 shadow-inner py-6">
      <div class="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
        <p>人口数据分析仪表盘 &copy; 2024</p>
        <p class="text-sm mt-1">数据来源: 统计年鉴 (2015-2024)</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Chart, registerables, type TooltipItem } from 'chart.js'
import StatCard from './components/StatCard.vue'
import { convertPopulationData, getLatestYearData, validateData, type PopulationData } from '../../utils/populationDataConverter'

// 注册Chart.js组件
Chart.register(...registerables)

// 从JSON文件获取人口数据
const populationData: PopulationData[] = convertPopulationData()

// 验证数据完整性
const validation = validateData()
if (!validation.isValid) {
  console.warn('数据验证失败:', validation.errors)
}

// 图表引用
const totalPopulationChart = ref<HTMLCanvasElement | null>(null)
const ageGroupChart = ref<HTMLCanvasElement | null>(null)
const ageTrendChart = ref<HTMLCanvasElement | null>(null)
const agingChart = ref<HTMLCanvasElement | null>(null)
const genderChart = ref<HTMLCanvasElement | null>(null)
const urbanRuralChart = ref<HTMLCanvasElement | null>(null)
const birthDeathRateChart = ref<HTMLCanvasElement | null>(null)
const lifeExpectancyChart = ref<HTMLCanvasElement | null>(null)
const recentTrendsChart = ref<HTMLCanvasElement | null>(null)

// 计算属性 - 最新一年的数据
const latestYearData = computed(() => {
  return getLatestYearData()
})

// 统计卡片数据
const totalPopulation = computed(() => latestYearData.value.totalPopulation)
const childPopulation = computed(() => latestYearData.value.childPopulation)
const workingPopulation = computed(() => latestYearData.value.workingPopulation)
const elderlyPopulation = computed(() => latestYearData.value.elderlyPopulation)

// 初始化图表
onMounted(() => {
  // 总人口趋势图
  if (totalPopulationChart.value) {
    new Chart(totalPopulationChart.value, {
      type: 'line',
      data: {
        labels: populationData.map(d => d.year.toString()),
        datasets: [{
          label: '总人口 (万人)',
          data: populationData.map(d => d.totalPopulation),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#3B82F6',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: function (context: TooltipItem<'line'>) {
                return `${(context.raw as number).toLocaleString()} 万人`
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(209, 213, 219, 0.5)'
            },
            ticks: {
              callback: function (value) {
                return value.toLocaleString()
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    })
  }

  // 各年龄段人口比例图 (使用最新一年数据)
  if (ageGroupChart.value) {
    const latestData = latestYearData.value

    new Chart(ageGroupChart.value, {
      type: 'pie',
      data: {
        labels: ['0-14岁', '15-64岁', '65岁及以上'],
        datasets: [{
          data: [
            latestData.childPopulation,
            latestData.workingPopulation,
            latestData.elderlyPopulation
          ],
          backgroundColor: [
            '#10B981', // 绿色 - 少儿
            '#F59E0B', // 橙色 - 劳动年龄
            '#8B5CF6'  // 紫色 - 老年
          ],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context) {
                const value = context.raw as number
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${context.label}: ${value.toLocaleString()} 万人 (${percentage}%)`
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    })
  }

  // 各年龄段人口趋势图
  if (ageTrendChart.value) {
    new Chart(ageTrendChart.value, {
      type: 'line',
      data: {
        labels: populationData.map(d => d.year.toString()),
        datasets: [
          {
            label: '0-14岁',
            data: populationData.map(d => d.childPopulation),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          },
          {
            label: '15-64岁',
            data: populationData.map(d => d.workingPopulation),
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          },
          {
            label: '65岁及以上',
            data: populationData.map(d => d.elderlyPopulation),
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.05)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            callbacks: {
              label: function (context: TooltipItem<'line'>) {
                return `${context.dataset.label}: ${(context.raw as number).toLocaleString()} 万人`
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(209, 213, 219, 0.5)'
            },
            ticks: {
              callback: function (value) {
                return value.toLocaleString()
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    })
  }

  // 老龄化趋势图
  if (agingChart.value) {
    new Chart(agingChart.value, {
      type: 'bar',
      data: {
        labels: populationData.map(d => d.year.toString()),
        datasets: [{
          label: '65岁及以上人口占比 (%)',
          data: populationData.map(d => (d.elderlyPopulation / d.totalPopulation) * 100),
          backgroundColor: 'rgba(139, 92, 246, 0.7)',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            callbacks: {
              label: function (context: TooltipItem<'bar'>) {
                return `占比: ${(context.raw as number).toFixed(1)}%`
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(209, 213, 219, 0.5)'
            },
            ticks: {
              callback: function (value) {
                return value + '%'
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    })
  }

  // 性别结构图 (使用最新一年数据)
  if (genderChart.value) {
    const latestData = latestYearData.value

    new Chart(genderChart.value, {
      type: 'doughnut',
      data: {
        labels: ['男性', '女性'],
        datasets: [{
          data: [latestData.malePopulation, latestData.femalePopulation],
          backgroundColor: [
            '#3B82F6', // 蓝色 - 男性
            '#EC4899'  // 粉色 - 女性
          ],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context) {
                const value = context.raw as number
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${context.label}: ${value.toLocaleString()} 万人 (${percentage}%)`
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    })
  }

  // 城乡分布图 (使用最新一年数据)
  if (urbanRuralChart.value) {
    const latestData = latestYearData.value

    new Chart(urbanRuralChart.value, {
      type: 'doughnut',
      data: {
        labels: ['城镇人口', '乡村人口'],
        datasets: [{
          data: [latestData.urbanPopulation, latestData.ruralPopulation],
          backgroundColor: [
            '#10B981', // 绿色 - 城镇
            '#F59E0B'  // 橙色 - 乡村
          ],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context) {
                const value = context.raw as number
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${context.label}: ${value.toLocaleString()} 万人 (${percentage}%)`
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    })
  }

  // 人口出生率与死亡率趋势图
  if (birthDeathRateChart.value) {
    new Chart(birthDeathRateChart.value, {
      type: 'line',
      data: {
        labels: populationData.map(d => d.year.toString()),
        datasets: [
          {
            label: '人口出生率(‰)',
            data: populationData.map(d => d.birthRate),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#10B981',
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y'
          },
          {
            label: '人口死亡率(‰)',
            data: populationData.map(d => d.deathRate),
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#EF4444',
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y'
          },
          {
            label: '人口自然增长率(‰)',
            data: populationData.map(d => d.naturalGrowthRate),
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#8B5CF6',
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context: TooltipItem<'line'>) {
                return `${context.dataset.label}: ${(context.raw as number).toFixed(2)}‰`
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: false,
            grid: {
              color: 'rgba(209, 213, 219, 0.5)'
            },
            ticks: {
              callback: function (value) {
                return value + '‰'
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: function (value) {
                return value + '‰'
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    })
  }

  // 平均预期寿命对比图
  if (lifeExpectancyChart.value) {
    // 筛选出有预期寿命数据的年份
    const lifeExpectancyData = populationData.filter(d => d.lifeExpectancy !== null)

    new Chart(lifeExpectancyChart.value, {
      type: 'bar',
      data: {
        labels: lifeExpectancyData.map(d => d.year.toString()),
        datasets: [
          {
            label: '平均预期寿命(岁)',
            data: lifeExpectancyData.map(d => d.lifeExpectancy),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: '#3B82F6',
            borderWidth: 2,
            borderRadius: 4
          },
          {
            label: '男性平均预期寿命(岁)',
            data: lifeExpectancyData.map(d => d.maleLifeExpectancy),
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: '#10B981',
            borderWidth: 2,
            borderRadius: 4
          },
          {
            label: '女性平均预期寿命(岁)',
            data: lifeExpectancyData.map(d => d.femaleLifeExpectancy),
            backgroundColor: 'rgba(236, 72, 153, 0.7)',
            borderColor: '#EC4899',
            borderWidth: 2,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context: TooltipItem<'bar'>) {
                return `${context.dataset.label}: ${(context.raw as number).toFixed(2)}岁`
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 70,
            max: 85,
            grid: {
              color: 'rgba(209, 213, 219, 0.5)'
            },
            ticks: {
              callback: function (value) {
                return value + '岁'
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    })
  }

  // 人口出生率、死亡率与自然增长率趋势图 (2015-2024)
  if (recentTrendsChart.value) {
    // 使用完整的数据
    const recentData = populationData

    new Chart(recentTrendsChart.value, {
      type: 'line',
      data: {
        labels: recentData.map(d => d.year.toString()),
        datasets: [
          {
            label: '人口出生率(‰)',
            data: recentData.map(d => d.birthRate),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: false,
            pointBackgroundColor: '#10B981',
            pointRadius: 5,
            pointHoverRadius: 7,
            yAxisID: 'y'
          },
          {
            label: '人口死亡率(‰)',
            data: recentData.map(d => d.deathRate),
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: false,
            pointBackgroundColor: '#EF4444',
            pointRadius: 5,
            pointHoverRadius: 7,
            yAxisID: 'y'
          },
          {
            label: '人口自然增长率(‰)',
            data: recentData.map(d => d.naturalGrowthRate),
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: false,
            pointBackgroundColor: '#8B5CF6',
            pointRadius: 5,
            pointHoverRadius: 7,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context: TooltipItem<'line'>) {
                return `${context.dataset.label}: ${(context.raw as number).toFixed(2)}‰`
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: false,
            min: 5,
            max: 15,
            grid: {
              color: 'rgba(209, 213, 219, 0.5)'
            },
            ticks: {
              callback: function (value) {
                return value + '‰'
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            min: -2,
            max: 8,
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: function (value) {
                return value + '‰'
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    })
  }
})
</script>

<style scoped>
/* 基础样式已通过外部CSS框架提供，这里仅补充特定样式 */
.table-container {
  overflow-x: auto;
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 延迟动画 */
.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}

.delay-400 {
  animation-delay: 0.4s;
}
</style>
