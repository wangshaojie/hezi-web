/**
 * 路由到应用列表转换工具
 * 自动从路由配置中提取应用信息，生成HomeView所需的应用列表
 */

import type { RouteRecordNormalized } from 'vue-router'

// 应用数据类型
export interface AppItem {
  id: number
  name: string
  description: string
  url: string
  category: 'all' | 'tools' | 'design' | 'development' | 'productivity' | 'mine'
  icon: string
}

// 路由元数据配置
interface RouteMeta {
  title?: string
  description?: string
  category?: 'tools' | 'design' | 'development' | 'productivity' | 'mine'
  icon?: string
  hidden?: boolean // 是否在应用列表中隐藏
}

// 智能图标映射 - 基于路径关键词自动匹配图标
const getIconByPath = (path: string, name: string): string => {
  const pathLower = path.toLowerCase()
  const nameLower = name.toLowerCase()

  // 基于路径关键词的图标映射
  const iconMappings = [
    { keywords: ['image', 'photo', 'picture', 'img', 'xiaohongshu'], icon: 'fa-image' },
    { keywords: ['watermark', 'stamp'], icon: 'fa-stamp' },
    { keywords: ['pdf'], icon: 'fa-file-pdf' },
    { keywords: ['raffle', 'lottery', 'draw'], icon: 'fa-gift' },
    { keywords: ['reminder', 'alarm', 'timer', 'bell'], icon: 'fa-bell' },
    { keywords: ['salary', 'money', 'calculator', 'calc'], icon: 'fa-calculator' },
    { keywords: ['love', 'heart', 'romance'], icon: 'fa-heart' },
    { keywords: ['device', 'computer', 'laptop', 'system'], icon: 'fa-laptop' },
    { keywords: ['chart', 'statistics', 'data', 'analytics'], icon: 'fa-chart-line' },
    { keywords: ['ocr', 'text', 'font', 'recognize'], icon: 'fa-font' },
    { keywords: ['about', 'info', 'help'], icon: 'fa-info-circle' },
    { keywords: ['edit', 'editor'], icon: 'fa-edit' },
    { keywords: ['upload', 'download'], icon: 'fa-cloud-upload-alt' },
    { keywords: ['search', 'find'], icon: 'fa-search' },
    { keywords: ['settings', 'config'], icon: 'fa-cog' },
    { keywords: ['user', 'profile', 'account'], icon: 'fa-user' },
    { keywords: ['home', 'dashboard'], icon: 'fa-home' },
    { keywords: ['list', 'table'], icon: 'fa-list' },
    { keywords: ['form', 'input'], icon: 'fa-wpforms' },
    { keywords: ['calendar', 'date', 'time'], icon: 'fa-calendar' },
    { keywords: ['mail', 'email'], icon: 'fa-envelope' },
    { keywords: ['phone', 'mobile'], icon: 'fa-phone' },
    { keywords: ['location', 'map'], icon: 'fa-map-marker-alt' },
    { keywords: ['video', 'play'], icon: 'fa-play' },
    { keywords: ['audio', 'sound', 'music'], icon: 'fa-music' },
    { keywords: ['file', 'document'], icon: 'fa-file' },
    { keywords: ['folder', 'directory'], icon: 'fa-folder' },
    { keywords: ['database', 'storage'], icon: 'fa-database' },
    { keywords: ['network', 'connection'], icon: 'fa-network-wired' },
    { keywords: ['security', 'lock', 'shield'], icon: 'fa-shield-alt' },
    { keywords: ['tool', 'utility'], icon: 'fa-tools' },
    { keywords: ['game', 'play'], icon: 'fa-gamepad' },
    { keywords: ['book', 'read', 'library'], icon: 'fa-book' },
    { keywords: ['shopping', 'cart', 'buy'], icon: 'fa-shopping-cart' },
    { keywords: ['social', 'share'], icon: 'fa-share-alt' },
    { keywords: ['news', 'article'], icon: 'fa-newspaper' },
    { keywords: ['weather', 'cloud'], icon: 'fa-cloud-sun' },
    { keywords: ['travel', 'plane'], icon: 'fa-plane' },
    { keywords: ['food', 'restaurant'], icon: 'fa-utensils' },
    { keywords: ['health', 'medical'], icon: 'fa-heartbeat' },
    { keywords: ['education', 'school', 'learn'], icon: 'fa-graduation-cap' },
    { keywords: ['work', 'business'], icon: 'fa-briefcase' },
    { keywords: ['entertainment', 'fun'], icon: 'fa-smile' },
  ]

  // 查找匹配的图标
  for (const mapping of iconMappings) {
    if (
      mapping.keywords.some((keyword) => pathLower.includes(keyword) || nameLower.includes(keyword))
    ) {
      return mapping.icon
    }
  }

  // 默认图标
  return 'fa-cube'
}

// 智能描述生成 - 基于路径和名称生成描述
const getDescriptionByPath = (path: string, name: string, title: string): string => {
  const pathLower = path.toLowerCase()
  const nameLower = name.toLowerCase()
  const titleLower = title.toLowerCase()

  // 基于关键词的描述映射
  const descriptionMappings = [
    { keywords: ['xiaohongshu'], desc: '一键生成小红书封面，小红书模板，一键生成' },
    { keywords: ['watermark'], desc: '给图片添加水印，文字，图片，自定义水印，自定义位置' },
    { keywords: ['pdf'], desc: 'PDF文件处理工具，支持转换、编辑等功能' },
    { keywords: ['raffle', 'lottery'], desc: '抽奖工具，支持抽奖，抽奖结果导出' },
    { keywords: ['reminder', 'alarm'], desc: '多任务提醒，支持定时提醒' },
    { keywords: ['salary', 'money'], desc: '工资核算，支持工资核算' },
    { keywords: ['love', 'heart'], desc: '爱情计算器，支持爱情计算' },
    { keywords: ['device', 'system'], desc: '查看设备信息，包括硬件、软件、网络等详细信息' },
    { keywords: ['chart', 'statistics', 'data'], desc: '数据可视化工具，支持图表展示和分析' },
    { keywords: ['ocr', 'text'], desc: 'OCR识别图片文字，支持批量识别' },
    { keywords: ['about', 'info'], desc: '关于我们，了解更多信息' },
    { keywords: ['edit', 'editor'], desc: '在线编辑工具，支持多种格式编辑' },
    { keywords: ['upload', 'download'], desc: '文件上传下载工具，支持多种格式' },
    { keywords: ['search', 'find'], desc: '搜索工具，快速查找所需内容' },
    { keywords: ['settings', 'config'], desc: '设置配置工具，管理系统参数' },
    { keywords: ['user', 'profile'], desc: '用户管理工具，个人信息设置' },
    { keywords: ['calendar', 'date'], desc: '日历时间工具，日程管理' },
    { keywords: ['form', 'input'], desc: '表单工具，数据收集和处理' },
    { keywords: ['file', 'document'], desc: '文件处理工具，支持多种格式' },
    { keywords: ['tool', 'utility'], desc: '实用工具，提高工作效率' },
  ]

  // 查找匹配的描述
  for (const mapping of descriptionMappings) {
    if (
      mapping.keywords.some(
        (keyword) =>
          pathLower.includes(keyword) ||
          nameLower.includes(keyword) ||
          titleLower.includes(keyword),
      )
    ) {
      return mapping.desc
    }
  }

  // 默认描述
  return `${title}工具，提供相关功能服务`
}

/**
 * 从路由配置中提取应用信息
 * @param routes 路由配置数组
 * @returns 应用列表
 */
export function extractAppsFromRoutes(routes: RouteRecordNormalized[]): AppItem[] {
  const apps: AppItem[] = []
  let idCounter = 100 // 从100开始，避免与现有ID冲突

  // 递归处理路由
  function processRoutes(routeList: RouteRecordNormalized[], parentPath = '') {
    for (const route of routeList) {
      // 跳过根路径和404页面
      if (route.path === '/' || route.path === '' || route.name === 'not-found') {
        continue
      }

      // 检查是否应该隐藏
      const meta = route.meta as RouteMeta
      if (meta?.hidden) {
        continue
      }

      // 构建完整路径
      const fullPath = parentPath + route.path

      // 只处理有meta.title的路由（表示这是一个应用）
      if (meta?.title) {
        const app: AppItem = {
          id: idCounter++,
          name: meta.title,
          description:
            meta.description || getDescriptionByPath(fullPath, route.name as string, meta.title),
          url: fullPath,
          category: meta.category || 'mine', // 默认为我的应用
          icon: meta.icon || getIconByPath(fullPath, route.name as string),
        }
        apps.push(app)
      }

      // 递归处理子路由
      if (route.children && route.children.length > 0) {
        processRoutes(route.children as RouteRecordNormalized[], fullPath)
      }
    }
  }

  processRoutes(routes)
  return apps
}

/**
 * 合并外部应用和路由应用
 * @param externalApps 外部应用列表
 * @param routeApps 从路由提取的应用列表
 * @returns 合并后的应用列表
 */
export function mergeApps(externalApps: AppItem[], routeApps: AppItem[]): AppItem[] {
  // 创建路由应用的URL集合，用于去重
  const routeUrls = new Set(routeApps.map((app) => app.url))

  // 过滤掉外部应用中与路由应用重复的URL
  const filteredExternalApps = externalApps.filter((app) => !routeUrls.has(app.url))

  // 合并并排序
  return [...filteredExternalApps, ...routeApps].sort((a, b) => a.id - b.id)
}

/**
 * 生成应用列表的完整配置
 * @param externalApps 外部应用列表
 * @param routes 路由配置
 * @returns 完整的应用列表配置
 */
export function generateAppList(
  externalApps: AppItem[],
  routes: RouteRecordNormalized[],
): AppItem[] {
  const routeApps = extractAppsFromRoutes(routes)
  return mergeApps(externalApps, routeApps)
}
