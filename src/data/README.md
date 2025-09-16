# 人口数据管理说明

## 文件结构

```
src/data/
├── populationData.json          # 主要数据文件
└── README.md                   # 本说明文件

src/utils/
└── populationDataConverter.ts   # 数据转换工具
```

## 数据更新指南

### 1. 更新数据文件

编辑 `src/data/populationData.json` 文件：

#### 添加新年份数据

```json
{
  "year": 2025,
  "description": "2025年人口数据",
  "totalPopulation": 140000,
  "totalPopulationUnit": "万人",
  "ageStructure": {
    "childPopulation": 22000,
    "childPopulationUnit": "万人",
    "childPopulationDescription": "0-14岁人口",
    "workingPopulation": 96000,
    "workingPopulationUnit": "万人",
    "workingPopulationDescription": "15-64岁劳动年龄人口",
    "elderlyPopulation": 22000,
    "elderlyPopulationUnit": "万人",
    "elderlyPopulationDescription": "65岁及以上老年人口",
    "dependencyRatio": 45.8,
    "dependencyRatioUnit": "%",
    "dependencyRatioDescription": "总抚养比"
  },
  "genderStructure": {
    "malePopulation": 71000,
    "malePopulationUnit": "万人",
    "femalePopulation": 69000,
    "femalePopulationUnit": "万人"
  },
  "urbanRuralStructure": {
    "urbanPopulation": 94000,
    "urbanPopulationUnit": "万人",
    "ruralPopulation": 46000,
    "ruralPopulationUnit": "万人"
  },
  "vitalRates": {
    "birthRate": 6.5,
    "birthRateUnit": "‰",
    "birthRateDescription": "人口出生率",
    "deathRate": 7.8,
    "deathRateUnit": "‰",
    "deathRateDescription": "人口死亡率",
    "naturalGrowthRate": -1.3,
    "naturalGrowthRateUnit": "‰",
    "naturalGrowthRateDescription": "人口自然增长率"
  },
  "lifeExpectancy": {
    "average": 78.5,
    "averageUnit": "岁",
    "male": 76.0,
    "maleUnit": "岁",
    "female": 81.0,
    "femaleUnit": "岁",
    "note": "2025年预期寿命数据"
  }
}
```

#### 更新元数据

```json
{
  "description": "中国人口统计数据 (2015-2025年)",
  "dataSource": "国家统计局",
  "lastUpdated": "2025-01-01",
  "data": [
    // ... 数据数组
  ]
}
```

### 2. 数据验证

系统会自动验证数据完整性：

- 总人口 = 0-14岁人口 + 15-64岁人口 + 65岁及以上人口
- 自然增长率 = 出生率 - 死亡率
- 抚养比 = (0-14岁人口 + 65岁及以上人口) / 15-64岁人口 × 100

### 3. 数据字段说明

#### 必需字段

- `year`: 年份
- `totalPopulation`: 总人口（万人）
- `ageStructure.childPopulation`: 0-14岁人口（万人）
- `ageStructure.workingPopulation`: 15-64岁人口（万人）
- `ageStructure.elderlyPopulation`: 65岁及以上人口（万人）
- `ageStructure.dependencyRatio`: 总抚养比（%）
- `genderStructure.malePopulation`: 男性人口（万人）
- `genderStructure.femalePopulation`: 女性人口（万人）
- `urbanRuralStructure.urbanPopulation`: 城镇人口（万人）
- `urbanRuralStructure.ruralPopulation`: 乡村人口（万人）
- `vitalRates.birthRate`: 出生率（‰）
- `vitalRates.deathRate`: 死亡率（‰）
- `vitalRates.naturalGrowthRate`: 自然增长率（‰）

#### 可选字段

- `lifeExpectancy.average`: 平均预期寿命（岁）
- `lifeExpectancy.male`: 男性预期寿命（岁）
- `lifeExpectancy.female`: 女性预期寿命（岁）

### 4. 数据单位

- 人口数据：万人
- 比率数据：‰（千分比）
- 百分比数据：%（百分比）
- 年龄数据：岁

### 5. 更新步骤

1. 备份当前数据文件
2. 编辑 `populationData.json`
3. 将新年份数据插入到 `data` 数组的开头
4. 更新 `lastUpdated` 字段
5. 运行项目验证数据正确性
6. 检查控制台是否有数据验证警告

### 6. 注意事项

- 数据按年份降序排列（最新数据在前）
- 如果某个数据暂未公布，设置为 `null`
- 保持数据结构一致性
- 定期备份数据文件
- 更新后测试所有图表和表格显示

### 7. 数据来源

- 国家统计局
- 各省市统计年鉴
- 人口普查数据
- 抽样调查数据

### 8. 联系方式

如有数据更新问题，请联系开发团队。
