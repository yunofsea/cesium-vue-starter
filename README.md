# Cesium Vue Starter

基于 **Vue 3 + TypeScript + Vite + CesiumJS** 的 3D 地理可视化项目模板，集成 Element Plus、Tailwind CSS 与 Pinia，开箱即可运行一个干净的 Cesium 三维地球。

[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![CesiumJS](https://img.shields.io/badge/CesiumJS-1.146-48b?logo=cesium&logoColor=white)](https://cesium.com/platform/cesiumjs/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## 功能特性

- 🌍 **Cesium 三维地球**：默认隐藏 Animation、Timeline、Geocoder 等内置控件，保留干净的视图区域。
- 🧩 **Viewer 生命周期托管**：基于 Pinia 统一保存 `Viewer` 实例，组件卸载时自动销毁，避免 WebGL 资源泄漏。
- 🎨 **UI 组件库**：集成 Element Plus 与 Tailwind CSS 4，左侧工具栏示例可直接扩展。
- 🚦 **路由**：Vue Router 5 使用 History 模式，页面按需加载。
- 📦 **Cesium 静态资源处理**：通过 `vite-plugin-static-copy` 自动复制 `Workers`、`ThirdParty`、`Assets`、`Widgets`，并设置 `CESIUM_BASE_URL`。
- 🛠 **TypeScript**：`vue-tsc` 类型检查，配置了 `@` → `src` 路径别名。

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

打开终端输出的地址（默认 <http://localhost:5173>）即可看到三维地球。

### 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器（HMR） |
| `npm run build` | 执行 `vue-tsc` 类型检查并构建到 `dist/` |
| `npm run preview` | 本地预览生产构建产物 |

## 配置 Cesium Ion Token

Cesium 的在线影像、地形等资源通常需要 [Cesium ion](https://ion.cesium.com/tokens) 访问令牌。项目不会提交任何令牌，请使用环境变量配置：

1. 在项目根目录创建 `.env`（该文件已被 `.gitignore` 忽略）：

   ```dotenv
   VITE_CESIUM_ION_TOKEN=你的_Cesium_ion_Token
   ```

2. 在 [`src/components/cesium/CesiumViewer.vue`](./src/components/cesium/CesiumViewer.vue) 中启用令牌设置：

   ```ts
   import { Ion, Viewer } from 'cesium'

   Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN
   ```

> 只有以 `VITE_` 开头的变量才会暴露给客户端代码。没有配置令牌时，Cesium 可能使用内置的默认令牌，存在额度限制或报错提示。

## 项目结构

```text
cesium-vue-starter/
├─ public/                          # 静态资源（favicon、icons 等）
├─ src/
│  ├─ assets/                       # 静态图片资源
│  ├─ components/
│  │  ├─ cesium/
│  │  │  └─ CesiumViewer.vue        # Viewer 初始化与销毁
│  │  └─ HelloWorld.vue             # Vite 模板示例组件（当前未使用）
│  ├─ router/
│  │  └─ index.ts                   # 路由配置
│  ├─ stores/
│  │  └─ viewer.ts                  # Pinia Viewer Store
│  ├─ styles/
│  │  └─ index.css                  # Tailwind 入口与全局样式
│  ├─ views/
│  │  └─ Home.vue                   # 首页（地球 + 左侧工具栏）
│  ├─ App.vue                       # 根组件
│  └─ main.ts                       # 应用入口，注册 Pinia / Router / Element Plus
├─ openspec/                        # OpenSpec 规格与变更目录
├─ index.html
├─ vite.config.ts                   # Cesium 资源复制、别名与全局常量配置
├─ tsconfig.app.json
└─ package.json
```

## 实现说明

### Viewer 生命周期

[`CesiumViewer.vue`](./src/components/cesium/CesiumViewer.vue) 在 `onMounted` 中创建 `Viewer` 并写入 Pinia，在 `onBeforeUnmount` 中调用 `destroyViewer()`。其他组件可以通过 Store 复用同一个 Viewer：

```ts
import * as Cesium from 'cesium'
import { useViewerStore } from '@/stores/viewer'

const viewerStore = useViewerStore()

viewerStore.viewer?.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.39, 39.91),
  point: { pixelSize: 10, color: Cesium.Color.RED },
})
```

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
import CesiumViewer from '@/components/cesium/CesiumViewer.vue'
```

### 扩展工具栏

[`Home.vue`](./src/views/Home.vue) 中的「添加模型」「加载 3D Tiles」「加载风场」按钮目前是占位示例。可以在按钮事件中通过 `useViewerStore()` 获取 Viewer，进而加载 `Entity`、`Cesium3DTileset` 或自定义图元。

## 常见问题

**地球是黑的 / 控制台提示 Ion Token 无效**

配置 `VITE_CESIUM_ION_TOKEN` 并在 `CesiumViewer.vue` 中设置 `Ion.defaultAccessToken`，然后重启开发服务器。

**控制台出现 `Workers/...` 或 `Assets/...` 404**

确认 `vite.config.ts` 中的 `viteStaticCopy` 配置未被移除，并检查 `CESIUM_BASE_URL` 与实际静态资源目录一致。

**部署后刷新页面返回 404**

路由使用 History 模式，需要在 Web 服务器上配置 SPA 回退：所有未匹配的路径都返回 `index.html`。

**如何修改默认相机视角**

在创建 `Viewer` 后使用 `viewer.camera` 的 `setView`、`flyTo` 或 `flyHome` 方法，例如：

```ts
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(116.39, 39.91, 2_000_000),
})
```

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
