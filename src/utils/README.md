# 路由到应用列表自动同步工具

## 概述

这个工具可以自动从Vue Router配置中提取应用信息，并生成HomeView所需的应用列表，实现路由和应用列表的自动同步。

## 使用方法

### 1. 添加新路由

在 `src/router/index.ts` 中添加新路由时，只需要在 `meta` 中配置应用信息：

```typescript
{
  path: 'new-feature',
  name: 'NewFeature',
  component: () => import('@/views/NewFeature.vue'),
  meta: {
    title: '新功能',                    // 应用名称
    description: '新功能的详细描述',      // 应用描述
    category: 'mine',                   // 应用分类
    icon: 'fa-star',                    // 图标
    hidden: false                       // 是否在应用列表中隐藏（可选）
  },
}
```

### 2. 分类选项

- `tools`: 工具类
- `design`: 设计类
- `development`: 开发类
- `productivity`: 生产力
- `mine`: 我的应用（默认）

### 3. 隐藏应用

如果某个路由不想在应用列表中显示，可以设置 `hidden: true`：

```typescript
{
  path: 'admin',
  name: 'Admin',
  component: () => import('@/views/Admin.vue'),
  meta: {
    title: '管理后台',
    hidden: true  // 不会出现在应用列表中
  },
}
```

## 工作原理

1. **自动提取**：从路由配置的 `meta` 字段中提取应用信息
2. **智能合并**：将外部应用和路由应用合并，避免重复
3. **自动排序**：按ID排序，确保显示顺序一致
4. **去重处理**：自动去除重复的URL

## 配置说明

### 路由元数据字段

| 字段          | 类型    | 必需 | 说明                             |
| ------------- | ------- | ---- | -------------------------------- |
| `title`       | string  | 是   | 应用名称                         |
| `description` | string  | 否   | 应用描述，如未提供会使用默认描述 |
| `category`    | string  | 否   | 应用分类，默认为 'mine'          |
| `icon`        | string  | 否   | 图标类名，如未提供会使用默认图标 |
| `hidden`      | boolean | 否   | 是否隐藏，默认为 false           |

### 智能匹配

工具提供了智能的图标和描述匹配功能，基于路径和名称关键词自动匹配：

- **智能图标匹配**：根据路径和名称中的关键词自动匹配合适的图标
- **智能描述生成**：根据路径、名称和标题自动生成描述
- **关键词覆盖**：支持40+种常见功能的关键词匹配
- **自动降级**：如果无法匹配，会使用默认图标和描述

## 优势

1. **自动化**：添加路由后无需手动维护应用列表
2. **一致性**：确保路由和应用列表信息一致
3. **可维护性**：减少重复代码，降低维护成本
4. **灵活性**：支持外部应用和路由应用混合使用
5. **可扩展性**：易于添加新的分类和配置选项

## 注意事项

1. 只有包含 `meta.title` 的路由才会被提取为应用
2. 外部应用和路由应用会合并显示，避免重复
3. 路由应用的优先级高于外部应用（相同URL时）
4. 建议为每个路由都配置完整的meta信息

## 示例

### 完整配置示例

```typescript
{
  path: 'image-editor',
  name: 'ImageEditor',
  component: () => import('@/views/ImageEditor.vue'),
  meta: {
    title: '图片编辑器',
    description: '在线图片编辑工具，支持裁剪、滤镜、文字添加等功能',
    category: 'tools',
    icon: 'fa-image',
    hidden: false
  },
}
```

### 最小配置示例

```typescript
{
  path: 'simple-tool',
  name: 'SimpleTool',
  component: () => import('@/views/SimpleTool.vue'),
  meta: {
    title: '简单工具'
    // 其他字段会使用智能匹配
  },
}
```

这样配置后，应用会自动出现在"我的应用"分类中，系统会根据路径中的"tool"关键词自动匹配`fa-tools`图标和"实用工具，提高工作效率"描述。

### 智能匹配示例

以下是一些智能匹配的示例：

| 路径关键词       | 自动匹配图标          | 自动匹配描述                       |
| ---------------- | --------------------- | ---------------------------------- |
| `image-editor`   | `fa-image`            | 在线编辑工具，支持多种格式编辑     |
| `user-profile`   | `fa-user`             | 用户管理工具，个人信息设置         |
| `calendar-app`   | `fa-calendar`         | 日历时间工具，日程管理             |
| `file-upload`    | `fa-cloud-upload-alt` | 文件上传下载工具，支持多种格式     |
| `data-chart`     | `fa-chart-line`       | 数据可视化工具，支持图表展示和分析 |
| `security-check` | `fa-shield-alt`       | 安全工具，提供安全相关功能         |
| `music-player`   | `fa-music`            | 音频工具，支持音乐播放功能         |

### 支持的关键词类型

- **功能类**：image, pdf, video, audio, file, document
- **操作类**：edit, upload, download, search, create, delete
- **界面类**：form, list, table, chart, calendar, dashboard
- **系统类**：settings, user, device, security, network
- **业务类**：shopping, social, news, weather, travel, health
- **工具类**：calculator, timer, converter, generator

现在您只需要添加路由，系统会自动智能匹配图标和描述！
