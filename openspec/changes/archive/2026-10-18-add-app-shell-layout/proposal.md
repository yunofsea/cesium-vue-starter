# Proposal

## Why

当前模板只有一个全屏 Cesium 地球和左上角一张浮动卡片，没有任何可承载后续业务的应用外壳。使用者每次基于此模板开发，都要重新搭建顶栏、侧栏与状态栏；而仓库定位（`cesium4cfd`）与现有「加载风场」入口都指向图层化、可调参数的可视化应用，缺少统一的图层抽象会让后续功能直接硬编码进面板。

因此本次先交付一个**结构完整、可扩展的应用外壳**：布局、面板机制、图层状态模型与主题体系一次到位，图层渲染通过单一接缝延后接入。

## What Changes

- 新增应用外壳布局：48px 顶栏、48px 图标栏 + 默认 288px 面板、24px 状态栏。
- 面板以浮层形式覆盖在画布之上，开合与拖宽**不改变画布尺寸**，不触发 Cesium 重算。
- 顶栏提供分组命令：复位视图、全屏、指北、底图切换、2D/3D 场景模式、分析入口、添加图层、截图、分享、fps 指示、主题切换。
- 左侧图标栏提供四个面板：图层、底图、可视化、场景。
- 新增统一图层模型 `LayerItem` 与 `layers` store：添加、删除（可撤销）、拖拽排序、显隐、选中、搜索、定位。
- 新增可视化参数面板：透明度、色带、数值范围、图例、重置；所有修改只写入状态。
- 引入单一渲染接缝 `applyLayer()`，本次不实现具体图层渲染。
- 新增双主题体系：`light` / `dark` / `system`，语义化 CSS 令牌，持久化并避免首屏闪烁。
- 默认底图改为 Cesium 自带的离线 `NaturalEarthII`，摆脱对 Ion token 的强依赖。
- 新增图标层：以 Iconify 图标数据为来源、通过语义映射在组件中引用，不绑定单一图标供应商。
- 清理脚手架残留：`src/style.css`、`src/components/HelloWorld.vue`、`public/icons.svg` 及 `App.vue` 中未使用的导入。
- 同步更新 README 的结构说明、主题配置与扩展方式。

**非破坏性**：不修改 `CESIUM_BASE_URL`、`viteStaticCopy` 配置，`viewer` store 仅做增量扩展。无 **BREAKING** 变更。

## 技术选型

| 方面 | 选择 | 说明 |
| --- | --- | --- |
| 图标 | Iconify 图标数据 + `@iconify/vue` 组件，本地注册 | 图标以 `集合:名称` 引用，可在 mdi、lucide 等集合间自由替换；组件层只使用语义名称，不直接写图标标识 |
| UI 组件 | Element Plus（沿用） | 已接入，表单、弹层、反馈组件齐全，避免重复造轮子 |
| 样式 | Tailwind CSS 4 + 语义 CSS 令牌 | 布局用工具类，颜色与层级用令牌，一套组件支撑双主题 |
| 状态管理 | Pinia，按 `viewer` / `ui` / `layers` / `theme` 拆分 | 四者生命周期与持久化需求不同，拆开后互不牵连 |
| 构建与类型 | Vite 8 + TypeScript + `vue-tsc`（沿用） | 不新增构建工具，保持模板现有开发体验 |
| 校验 | `vue-tsc` 类型检查 + 手工走查 | 项目当前没有测试框架，本变更不为此引入新工具 |

图标选择的核心约束是**不锁定单一供应商**：`@element-plus/icons-vue` 虽然与现有 UI 库同源，但图标集合有限且缺少图层、风场、剖面等 GIS 语义；Iconify 提供统一的数据格式与多个可互换的图标集，换库只需改一处语义映射。为避免运行时依赖公共接口，所用图标在应用启动时本地注册，默认不请求 Iconify API。

详细取舍与备选方案见 [design.md](./design.md) 的 Decisions 章节。

## Capabilities

### New Capabilities

- `app-shell`: 应用外壳的区域划分、顶栏命令、侧栏开合机制与状态栏信息展示。
- `layer-management`: 图层数据模型、图层列表操作，以及选中图层的外观参数（透明度、色带、范围、图例）。
- `map-scene`: 底图选择、场景模式切换与场景设置（地形夸张、光照、大气/雾）。
- `ui-theme`: 三种主题模式、语义化色彩令牌、持久化与首屏防闪、Cesium 内置控件适配。

### Modified Capabilities

无。项目当前没有任何已有 spec。

## Impact

- **代码**：新增 `src/components/layout/`、`src/components/panels/`、`src/composables/`、`src/stores/{ui,theme,layers,scene}.ts`、`src/types/`、`src/data/`；修改 `App.vue`、`main.ts`、`styles/index.css`、`index.html`、`views/Home.vue`、`components/cesium/CesiumViewer.vue`。
- **依赖**：新增 `@iconify/vue` 与所需的 Iconify 图标数据包；不引入图表库或图标字体。
- **配置**：`vite.config.ts` 不变。
- **文档**：`README.md` 更新。
- **行为**：顶栏与状态栏命令产生真实的 Viewer 行为；图层面板的操作只改变应用状态，不影响地球渲染。
