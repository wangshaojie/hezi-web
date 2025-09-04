import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BaseLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'xiaohongshu-temp',
          name: 'XiaohongshuTemp',
          component: () => import('@/views/XiaoHongShuTemp.vue'),
          meta: {
            title: '小红书模板',
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
          },
        },
        {
          path: 'pdf-to-image',
          name: 'PdfToImage',
          component: () => import('@/views/PdfToImage.vue'),
          meta: {
            title: '图片合成',
          },
        },
        {
          path: 'raffle',
          name: 'RaffleView',
          component: () => import('@/views/RaffleView.vue'),
          meta: {
            title: '本地抽奖',
          },
        },
        {
          path: 'ocr-page',
          name: 'OCRPage',
          component: () => import('@/views/OCRPage.vue'),
        },
        {
          // 定时提醒
          path: 'reminder',
          name: 'Reminder',
          component: () => import('@/views/ReminderView.vue'),
          meta: {
            title: '定时提醒',
          },
        },
        // 工资核算
        {
          path: 'salary-calculation',
          name: 'SalaryCalculation',
          component: () => import('@/views/SalaryCalculation.vue'),
          meta: {
            title: '工资核算',
          },
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
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
