# 智能匹配功能示例

## 概述

现在系统支持基于路径和名称关键词的智能图标和描述匹配，无需手动维护映射表。

## 测试示例

以下是一些测试示例，展示智能匹配的效果：

### 1. 图片相关功能

```typescript
// 路由配置
{
  path: 'image-editor',
  name: 'ImageEditor',
  component: () => import('@/views/ImageEditor.vue'),
  meta: {
    title: '图片编辑器'
    // 无需配置icon和description
  }
}

// 自动匹配结果
// icon: 'fa-image' (匹配关键词: image)
// description: '在线编辑工具，支持多种格式编辑' (匹配关键词: edit)
```

### 2. 用户管理功能

```typescript
// 路由配置
{
  path: 'user-profile',
  name: 'UserProfile',
  component: () => import('@/views/UserProfile.vue'),
  meta: {
    title: '用户资料'
  }
}

// 自动匹配结果
// icon: 'fa-user' (匹配关键词: user)
// description: '用户管理工具，个人信息设置' (匹配关键词: user, profile)
```

### 3. 数据分析功能

```typescript
// 路由配置
{
  path: 'data-analytics',
  name: 'DataAnalytics',
  component: () => import('@/views/DataAnalytics.vue'),
  meta: {
    title: '数据分析'
  }
}

// 自动匹配结果
// icon: 'fa-chart-line' (匹配关键词: data, analytics)
// description: '数据可视化工具，支持图表展示和分析' (匹配关键词: data, analytics)
```

### 4. 文件处理功能

```typescript
// 路由配置
{
  path: 'file-converter',
  name: 'FileConverter',
  component: () => import('@/views/FileConverter.vue'),
  meta: {
    title: '文件转换器'
  }
}

// 自动匹配结果
// icon: 'fa-file' (匹配关键词: file)
// description: '文件处理工具，支持多种格式' (匹配关键词: file)
```

### 5. 安全相关功能

```typescript
// 路由配置
{
  path: 'security-checker',
  name: 'SecurityChecker',
  component: () => import('@/views/SecurityChecker.vue'),
  meta: {
    title: '安全检查'
  }
}

// 自动匹配结果
// icon: 'fa-shield-alt' (匹配关键词: security)
// description: '安全工具，提供安全相关功能' (匹配关键词: security)
```

## 关键词匹配规则

### 图标匹配优先级

1. **精确匹配**：路径或名称中包含关键词
2. **部分匹配**：关键词包含在路径或名称中
3. **默认图标**：`fa-cube`（当无法匹配时）

### 描述匹配优先级

1. **精确匹配**：路径、名称或标题中包含关键词
2. **通用描述**：`${title}工具，提供相关功能服务`

## 支持的关键词分类

### 功能类关键词

- `image`, `photo`, `picture`, `img` → `fa-image`
- `pdf` → `fa-file-pdf`
- `video`, `play` → `fa-play`
- `audio`, `sound`, `music` → `fa-music`
- `file`, `document` → `fa-file`

### 操作类关键词

- `edit`, `editor` → `fa-edit`
- `upload`, `download` → `fa-cloud-upload-alt`
- `search`, `find` → `fa-search`
- `create`, `add` → `fa-plus`
- `delete`, `remove` → `fa-trash`

### 界面类关键词

- `form`, `input` → `fa-wpforms`
- `list`, `table` → `fa-list`
- `chart`, `graph` → `fa-chart-line`
- `calendar`, `date` → `fa-calendar`
- `dashboard` → `fa-tachometer-alt`

### 系统类关键词

- `settings`, `config` → `fa-cog`
- `user`, `profile` → `fa-user`
- `device`, `system` → `fa-laptop`
- `security`, `lock` → `fa-shield-alt`
- `network` → `fa-network-wired`

### 业务类关键词

- `shopping`, `cart` → `fa-shopping-cart`
- `social`, `share` → `fa-share-alt`
- `news`, `article` → `fa-newspaper`
- `weather` → `fa-cloud-sun`
- `travel` → `fa-plane`

## 最佳实践

1. **使用描述性路径**：`user-profile` 比 `profile` 更容易匹配
2. **包含功能关键词**：`image-editor` 比 `editor` 更精确
3. **避免过于通用**：`tool` 会匹配到通用图标
4. **组合关键词**：`data-chart` 会匹配到图表相关图标

## 自定义覆盖

如果需要自定义图标或描述，仍然可以在meta中指定：

```typescript
{
  path: 'custom-tool',
  name: 'CustomTool',
  component: () => import('@/views/CustomTool.vue'),
  meta: {
    title: '自定义工具',
    icon: 'fa-custom-icon',        // 覆盖智能匹配
    description: '自定义描述'       // 覆盖智能匹配
  }
}
```

这样既享受了智能匹配的便利，又保留了自定义的灵活性！
