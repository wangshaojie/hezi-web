import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: BaseLayout,
      children: [
        {
          path: '',
          name: 'welcome',
          component: () => import('@/views/WelcomeView.vue'),
        },
        {
          path: 'home-view',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'passport-ranking',
          name: 'PassportRanking',
          component: () => import('@/views/PassportRankingView.vue'),
          meta: {
            title: '世界各国护照排名指数',
            description: '展示世界各国护照排名指数及详细信息',
            category: 'mine',
            icon: 'fa-passport',
          },
        },
        {
          path: 'xiaohongshu-temp',
          name: 'XiaohongshuTemp',
          component: () => import('@/views/XiaoHongShuTemp.vue'),
          meta: {
            title: '小红书封面生成器',
            description: '一键生成小红书封面，小红书模板，一键生成',
            category: 'mine',
            icon: 'fa-image',
          },
          props: true,
        },
        {
          path: 'remote-detail/:id',
          name: 'remote-detail',
          component: () => import('@/views/RemoteDetail.vue'),
          props: true,
        },
        {
          path: 'watermark',
          name: 'WatermarkImage',
          component: () => import('@/views/WatermarkImage.vue'),
          meta: {
            title: '图片加水印',
            description: '给图片添加水印，文字，图片，自定义水印，自定义位置',
            category: 'mine',
            icon: 'fa-stamp',
          },
        },
        {
          path: 'raffle',
          name: 'RaffleView',
          component: () => import('@/views/RaffleView.vue'),
          meta: {
            title: '抽奖',
            description: '抽奖工具，支持抽奖，抽奖结果导出',
            category: 'mine',
            icon: 'fa-gift',
          },
        },
        {
          path: 'ocr-page',
          name: 'OCRPage',
          component: () => import('@/views/OCRPage.vue'),
          meta: {
            title: 'OCR识别图片文字',
            description: 'OCR识别图片文字，支持批量识别',
            category: 'mine',
            icon: 'fa-font',
          },
        },
        {
          // 定时提醒
          path: 'reminder',
          name: 'Reminder',
          component: () => import('@/views/ReminderView.vue'),
          meta: {
            title: '多任务提醒',
            description: '多任务提醒，支持定时提醒',
            category: 'mine',
            icon: 'fa-bell',
          },
        },
        // 工资核算
        {
          path: 'salary-calculation',
          name: 'SalaryCalculation',
          component: () => import('@/views/SalaryCalculation.vue'),
          meta: {
            title: '工资核算',
            description: '工资核算，支持工资核算',
            category: 'mine',
            icon: 'fa-calculator',
          },
        },
        {
          path: 'love-page',
          name: 'LovePage',
          component: () => import('@/views/LovePage.vue'),
          meta: {
            title: '爱情计算器',
            description: '爱情计算器，支持爱情计算',
            category: 'mine',
            icon: 'fa-heart',
          },
        },
        {
          path: 'my-device',
          name: 'MyDevice',
          component: () => import('@/views/MyDevice.vue'),
          meta: {
            title: '我的设备',
            description: '查看设备信息，包括硬件、软件、网络等详细信息',
            category: 'mine',
            icon: 'fa-laptop',
          },
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
          meta: {
            title: '关于我们',
            description: '关于我们，了解更多信息',
            category: 'mine',
            icon: 'fa-info-circle',
            hidden: true, // 在应用列表中隐藏
          },
        },
        // 国家统计局数据可视化
        {
          path: 'national-statistics',
          name: 'NationalStatistics',
          component: () => import('@/views/NationalStatistics/AnnualDashboard.vue'),
          meta: {
            title: '国家统计局数据可视化',
            description: '国家统计局数据可视化，支持国家统计局数据可视化',
            category: 'mine',
            icon: 'fa-chart-line',
          },
        },
        // 2025年全球各行业前10排名
        {
          path: 'global-industry-rankings-2025',
          name: 'GlobalIndustryRankings2025',
          component: () => import('@/views/GlobalIndustryRankings2025.vue'),
          meta: {
            title: '2025年全球各行业前10排名',
            description: '展示2025年全球各行业的前10名企业排名',
            category: 'mine',
            icon: 'fa-chart-bar',
          },
        },
        // 夸克资源
        {
          path: 'quark-resources',
          name: 'QuarkResources',
          component: () => import('@/views/QuarkResources/index.vue'),
          meta: {
            title: '夸克资源',
            description: '夸克资源页面',
            category: 'mine',
            icon: 'fa-cube',
          },
        },
        // Google Earth Converter
        {
          path: 'google-earth-converter',
          name: 'GoogleEarthConverter',
          component: () => import('@/views/GoogleEarthConverter.vue'),
          meta: {
            title: 'Google Earth Converter',
            description: 'Google Earth 转换工具',
            category: 'mine',
            icon: 'fa-globe',
          },
        },
        // 股票补仓计算器
        {
          path: 'stock-average-cost-calculator',
          name: 'StockAverageCostCalculator',
          component: () => import('@/views/StockAverageCostCalculator.vue'),
          meta: {
            title: '股票补仓计算器',
            description: '计算目标成本价需要补仓多少股与所需资金，降低持仓成本',
            category: 'mine',
            icon: 'fa-chart-line',
          },
        },
        // 互联网档案馆
        {
          path: 'internet-archive',
          name: 'InternetArchive',
          component: () => import('@/views/InternetArchiveView.vue'),
          meta: {
            title: '互联网档案馆',
            description: '互联网历史存档与资源库',
            category: 'mine',
            icon: 'fa-database',
          },
        },
      ],
    },
  ],
})

// 添加404路由
router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next({ name: 'not-found' })
  } else {
    next()
  }
})

export default router
