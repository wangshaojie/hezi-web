<template>
  <div class="mx-auto px-2 py-2 bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- 标题区 -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
      <h1 class="text-2xl font-bold text-white">{{ title }}</h1>
      <p class="text-blue-100 mt-1">{{ subtitle }}</p>
    </div>

    <div
      class="security-banner bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center"
      v-if="showSecurityBanner"
    >
      <el-icon class="text-green-500 mr-2">
        <lock />
      </el-icon>
      <span class="text-sm text-green-700">
        {{ securityText }}
      </span>
    </div>

    <!-- 主内容区 -->
    <slot name="content" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { Lock } from '@element-plus/icons-vue'
defineProps({
  // 标题区文本
  title: {
    type: String,
    default: '专业图片水印工具',
  },
  subtitle: {
    type: String,
    default: '保护您的原创内容不被盗用',
  },

  // 安全提示区文本
  securityText: {
    type: String,
    default:
      '隐私保护模式已启用 · 所有处理均在浏览器内完成 · 永不连接网络. ' +
      '所有图片和操作均在您的设备上完成，绝不上传至服务器，专业守护隐私与数据安全。' +
      '无论是保护个人照片版权，还是为企业文档添加机密标识，这款工具都能快速、高效地满足需求。',
  },

  // 安全提示区显示控制
  showSecurityBanner: {
    type: Boolean,
    default: true,
  },
})
</script>
