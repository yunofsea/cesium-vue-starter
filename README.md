# Cesium Vue Starter

基于 **Vue 3 + TypeScript + Vite + CesiumJS** 的 3D 地理可视化项目模板，集成 Element Plus、Tailwind CSS 与 Pinia。自带一套可直接使用的应用外壳：顶部工具条、左侧图层与可视化面板、状态栏，以及浅色 / 深色主题。

[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![CesiumJS](https://img.shields.io/badge/CesiumJS-1.146-48b?logo=cesium&logoColor=white)](https://cesium.com/platform/cesiumjs/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## 功能特性

- 🧭 **应用外壳**：48px 单行顶栏、48px 图标栏 + 浮层工具面板、24px 状态栏；面板开合不会改变画布尺寸。
- 🗂️ **图层管理**：统一的 `LayerItem` 模型，支持添加、删除（5 秒撤销）、拖拽排序、显隐、搜索与定位。
- 🎨 **可视化参数**：透明度、色带、数值范围与图例，全部由同一份图层状态驱动。
- 🗺️ **底图与场景**：离线自然地球影像（默认）、OpenStreetMap、Cesium Ion；三维 / 二维 / 哥伦布视图、光照、大气与雾。
- 🌗 **双主题**：浅色、深色、跟随系统，令牌化 CSS 变量，持久化并避免首屏闪烁。
- 🖼️ **顶栏命令**：复位视图、全屏、指北、底图切换、场景模式、截图导出、视角分享。
- 🧩 **Iconify 图标层**：语义化映射 + 本地注册，不绑定单一图标供应商，也不依赖运行时公共 API。
- 🌍 **Cesium 生命周期托管**：Pinia 保存 `Viewer` 实例，卸载时自动销毁，避免 WebGL 资源泄漏。
- 📦 **Cesium 静态资源处理**：`vite-plugin-static-copy` 自动复制 `Workers`、`ThirdParty`、`Assets`、`Widgets`，并设置 `CESIUM_BASE_URL`。
- 🛠 **TypeScript**：`vue-tsc` 类型检查，`@` → `src` 路径别名。

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 框架 | Vue 3（`<script setup>` + Composition API） |
| 语言 | TypeScript |
| 构建工具 | Vite |
| 三维引擎 | CesiumJS |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| UI | Element Plus、Tailwind CSS |
| 图标 | Iconify（`@iconify/vue` + 本地图标注册） |
| 类型检查 | vue-tsc |

## 环境要求

- [Node.js](https://nodejs.org/) 20.19+ 或 22.12+（推荐使用最新 LTS）
- npm 10+（或 pnpm / yarn，命令按对应包管理器调整）

## 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/yunofsea/cesium-vue-starter.git
cd cesium-vue-starter

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

打开终端输出的地址（默认 <http://localhost:5173>）即可看到三维地球与完整外壳。

### 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器（HMR） |
| `npm run build` | 执行 `vue-tsc` 类型检查并构建到 `dist/` |
| `npm run preview` | 本地预览生产构建产物 |

## 配置 Cesium Ion Token

模板默认使用**随包分发的离线自然地球影像**，不配置令牌也能正常看到地球。只有需要 Cesium Ion 的在线影像时才需要令牌：

1. 在项目根目录创建 `.env`（该文件已被 `.gitignore` 忽略）：

   ```dotenv
   VITE_CESIUM_ION_TOKEN=你的_Cesium_ion_Token
   ```

2. 重启开发服务器。底图面板中的「Cesium Ion 影像」会自动解除禁用。

> 只有以 `VITE_` 开头的变量才会暴露给客户端代码。未配置令牌时，Ion 选项会禁用并说明原因，不会静默失败。

## 项目结构

```text
cesium-vue-starter/
├─ public/                          # 静态资源（favicon 等）
├─ src/
│  ├─ assets/                       # 图片等资源
│  ├─ components/
│  │  ├─ base/
│  │  │  └─ AppIcon.vue             # 语义化图标组件（内部使用 Iconify）
│  │  ├─ cesium/
│  │  │  └─ CesiumViewer.vue        # Viewer 初始化、底图接入、视角还原
│  │  ├─ layout/
│  │  │  ├─ AppShell.vue            # 三分区布局、快捷键、设置弹层
│  │  │  ├─ TopToolbar.vue          # 分组命令与下拉入口
│  │  │  ├─ SideRail.vue            # 48px 图标栏
│  │  │  ├─ SidePanel.vue           # 浮层面板、拖拽调宽、窄屏抽屉
│  │  │  ├─ StatusBar.vue           # 坐标、高度、场景模式、帧率、版权
│  │  │  ├─ credit.ts               # 版权容器注入键
│  │  │  └─ toolbar/                # ToolGroup / ToolButton / ToolDropdown
│  │  └─ panels/
│  │     ├─ LayerPanel.vue          # 图层列表、添加、排序、撤销
│  │     ├─ VisualPanel.vue         # 透明度、色带、范围、图例
│  │     ├─ BasemapPanel.vue        # 底图选择
│  │     ├─ ScenePanel.vue          # 场景模式与渲染设置
│  │     └─ controls/               # 可复用的参数控件
│  ├─ composables/
│  │  ├─ useCameraTools.ts          # 复位、全屏、指北、截图、分享
│  │  └─ useFps.ts                  # 帧率统计
│  ├─ data/
│  │  ├─ icons.ts                   # 语义图标映射与本地注册
│  │  ├─ colormaps.ts               # 预设色带
│  │  └─ sample-layers.ts           # 示例图层（可直接删除）
│  ├─ router/index.ts               # 路由配置
│  ├─ stores/
│  │  ├─ viewer.ts                  # Viewer 实例生命周期
│  │  ├─ ui.ts                      # 面板、宽度、设置弹层
│  │  ├─ theme.ts                   # 主题模式与持久化
│  │  ├─ layers.ts                  # 图层状态与渲染接缝
│  │  └─ scene.ts                   # 底图与场景设置
│  ├─ types/
│  │  ├─ layers.ts                  # LayerItem / LayerStyle
│  │  └─ toolbar.ts                 # 下拉项类型
│  ├─ views/Home.vue                # 首页，挂载 AppShell
│  ├─ App.vue                       # 根组件
│  ├─ main.ts                       # 注册 Pinia / Router / Element Plus / 图标
│  └─ styles/index.css              # Tailwind 入口、主题令牌、全局样式
├─ openspec/                        # OpenSpec 规格与变更目录
├─ index.html                       # 含首屏主题脚本
├─ vite.config.ts                   # Cesium 资源复制、别名与全局常量
├─ tsconfig.app.json
└─ package.json
```

## 实现说明

### 应用外壳

[`AppShell.vue`](./src/components/layout/AppShell.vue) 使用 CSS Grid 划分三个区域：

```text
48px  顶部工具条
1fr   内容区（Cesium 铺满）
24px  状态栏
```

图标栏与面板都是**浮层**，绝对定位在画布之上，因此开合、切换、拖宽都不会改变 `canvas` 尺寸，也就不会触发 Cesium 的缓冲区重建。面板外层使用 `pointer-events: none`、本体使用 `pointer-events: auto`，保证空白区域的拖拽仍然交给地球。

面板默认宽度 288px，可在 240–420px 之间拖拽，宽度写入 `localStorage`。视口小于 1024px 时默认收起，打开后为带遮罩的抽屉。

### 主题

主题模式定义在 [`stores/theme.ts`](./src/stores/theme.ts)，三种取值：`light`、`dark`、`system`，默认 `system`，保存在 `localStorage` 的 `cesium4cfd-theme` 键中。

所有颜色都是语义令牌，定义在 [`styles/index.css`](./src/styles/index.css)：

| 令牌 | 用途 |
| --- | --- |
| `--ui-surface` / `--ui-surface-raised` | 面板与卡片底色 |
| `--ui-surface-translucent` | 浮层半透明底色 |
| `--ui-border` / `--ui-control-border` | 分隔线与可交互控件边框 |
| `--ui-text-1` / `--ui-text-2` | 主要与次要文字 |
| `--ui-accent` / `--ui-accent-soft` | 强调色与浅强调底色 |
| `--ui-shadow` / `--ui-mask` | 浮层阴影与抽屉遮罩 |

令牌通过 `@theme inline` 暴露为 Tailwind 工具类（`bg-ui-surface`、`text-ui-muted`、`border-ui-border` 等）。组件中不要写死颜色，否则深色主题会失效。

`index.html` 中的内联脚本会在应用挂载前读取存储与系统偏好并写入 `html.dark`，避免深色用户看到白色闪屏。`@custom-variant dark` 让 Tailwind 的 `dark:` 前缀跟随 `class` 而不是单纯跟随系统。

### 图标

[`data/icons.ts`](./src/data/icons.ts) 维护两张表：

- `iconNames`：语义名称 → Iconify 标识（如 `wind: 'lucide:wind'`）
- `iconData`：语义名称 → 图标数据

组件统一通过 [`AppIcon.vue`](./src/components/base/AppIcon.vue) 引用语义名称：

```vue
<AppIcon name="layers" :size="18" />
```

新增一个图标：

1. `npm install @iconify-icons/<集合>`（例如 `@iconify-icons/mdi`）
2. 在 `data/icons.ts` 中导入图标数据，并在 `iconNames`、`iconData` 中登记同一语义名称
3. 直接使用 `<AppIcon name="你的语义名称" />`

更换图标集只需修改 `iconNames` 中的映射，业务组件不需要改动。所有图标在 `registerIcons()` 中本地注册（`main.ts` 启动时调用），因此运行时不会请求 `api.iconify.design`。

### 图层

图层模型定义在 [`types/layers.ts`](./src/types/layers.ts)，状态集中在 [`stores/layers.ts`](./src/stores/layers.ts)。面板只读写 store，不直接操作 Cesium。

本版本中图层只维护状态与外观参数，**不参与地球渲染**。渲染入口是唯一接缝：

```ts
function applyLayer(_layer: LayerItem) {
  // TODO(layer-render): 按 kind 分发到 ImageryLayer / Cesium3DTileset / DataSource 等
}
```

新增一种图层通常需要三步：

1. 在 `LayerKind` 中加入新的类型值；
2. 在 `LayerPanel.vue` 的 `kindIcons` 中补充图标，按需扩展添加入口；
3. 在 `applyLayer()` 中为该 `kind` 编写渲染分支。

示例图层集中在 [`data/sample-layers.ts`](./src/data/sample-layers.ts)，不接入真实数据时可直接删除该文件及 `stores/layers.ts` 中的引用。

### 底图

[`stores/scene.ts`](./src/stores/scene.ts) 负责底图切换：

- `natural-earth`：`TileMapServiceImageryProvider` 读取 `Assets/Textures/NaturalEarthII`，离线可用；
- `osm`：`OpenStreetMapImageryProvider`，依赖外部网络；
- `ion`：`IonImageryProvider`，需要 `VITE_CESIUM_ION_TOKEN`。

`Viewer` 以 `baseLayer: false` 创建，底图完全由面板控制，切换时不会重建 Viewer，相机视角保持不变。

### 场景设置

| 设置 | 行为 |
| --- | --- |
| 三维 / 二维 / 哥伦布视图 | 立即执行场景变形 |
| 阴影 | 立即切换 `globe.enableLighting` |
| 光照时间 | 立即调整时钟，阴影开启时改变光照方向 |
| 大气 / 雾 | 立即切换对应开关 |
| 地形夸张 | 仅保存设置，本版本不改变地形渲染 |

### Viewer 生命周期

[`CesiumViewer.vue`](./src/components/cesium/CesiumViewer.vue) 在 `onMounted` 中创建 `Viewer` 并写入 Pinia，在 `onBeforeUnmount` 中调用 `destroyViewer()`。其他组件通过 store 复用同一个 Viewer：

```ts
import { useViewerStore } from '@/stores/viewer'

const viewerStore = useViewerStore()

viewerStore.viewer?.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(116.39, 39.91, 2_000_000),
})
```

Cesium 的版权信息通过 `creditContainer` 选项挂载到状态栏，始终可见，不会被工具面板遮挡。

### Cesium 静态资源

Cesium 运行时需要独立的 `Workers`、`Assets`、`Widgets` 等文件。[`vite.config.ts`](./vite.config.ts) 使用 `vite-plugin-static-copy` 将它们复制到构建产物的 `cesium/` 目录，并通过以下配置告知 Cesium 资源位置：

```ts
define: {
  CESIUM_BASE_URL: JSON.stringify('/cesium'),
}
```

如果部署在子路径下，请同时调整该值、Vite 的 `base` 以及路由的 History 基路径。

### 路径别名

`@` 指向 `src/`，在 TypeScript 与 Vite 中均已配置：

```ts
import AppIcon from '@/components/base/AppIcon.vue'
```

## 快捷键

| 快捷键 | 作用 |
| --- | --- |
| `Ctrl / ⌘ + B` | 显示 / 隐藏工具面板 |
| `Ctrl / ⌘ + Shift + T` | 循环切换主题（浅色 → 深色 → 跟随系统） |
| `Esc` | 关闭工具面板或设置弹层 |

## 常见问题

**地球是黑的 / 控制台提示 Ion Token 无效**

模板默认使用离线底图，正常不会出现该问题。若手动切换到了 Cesium Ion 影像，请配置 `VITE_CESIUM_ION_TOKEN` 并重启开发服务器；也可以直接切回「自然地球（离线）」。

**控制台出现 `Workers/...` 或 `Assets/...` 404**

确认 `vite.config.ts` 中的 `viteStaticCopy` 配置未被移除，并检查 `CESIUM_BASE_URL` 与实际静态资源目录一致。

**面板打开后地球被挡住**

面板只覆盖左侧区域，点击图标栏中当前激活的图标、右上角关闭按钮，或按 `Esc` 都可以完全隐藏面板。窄屏下点击遮罩即可关闭。

**深色主题下看到浅色控件**

确认 `main.ts` 引入了 `element-plus/theme-chalk/dark/css-vars.css`，并且新增组件使用的是语义令牌而不是写死的颜色值。

**部署后刷新页面返回 404**

路由使用 History 模式，需要在 Web 服务器上配置 SPA 回退：所有未匹配的路径都返回 `index.html`。

## 构建与部署

```bash
npm run build
```

构建产物位于 `dist/`，其中 `dist/cesium/` 为 Cesium 运行时静态资源，需与 `index.html` 一同部署。

Nginx 配置示例：

```nginx
server {
  listen 80;
  root /var/www/cesium-vue-starter/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## 许可证

本项目基于 [MIT License](./LICENSE) 开源，Copyright © 2026 yunofsea。
