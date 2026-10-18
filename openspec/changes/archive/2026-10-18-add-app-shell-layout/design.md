# Design

## Context

- 现有界面：`CesiumViewer` 铺满全屏，`Home.vue` 只叠了一张 Element Plus 卡片；`viewer` store 仅保存实例。
- 技术栈：Vue 3 `<script setup>`、TypeScript（`noUnusedLocals`）、Vite 8、Tailwind CSS 4、Element Plus 全量注册、Pinia。
- Cesium 1.146，`viteStaticCopy` 已将 `Assets` 复制到 `/cesium/Assets`，`CESIUM_BASE_URL = '/cesium'`。
- Cesium 只在 `window` 的 `resize` 事件上重算画布尺寸，不监听容器尺寸变化。
- `node_modules` 当前未安装，验证前需先 `npm install`。
- 动机与范围见 [proposal.md](./proposal.md)，行为契约见 `specs/`。

## Goals / Non-Goals

**Goals:**

- 外壳结构一次定型，后续新增工具面板、图层类型不改动布局组件。
- 全局状态与渲染实现解耦：新增一种图层只需实现一个分支，不改面板。
- 两套主题共用同一套组件，不写两遍样式。

**Non-Goals:**

- 不实现图层的实际渲染、风场粒子、着色器、空间分析。
- 不引入状态持久化后端或项目文件格式。
- 不改动 Cesium 静态资源与构建配置。

## Decisions

### 1. 布局采用「停靠栏 + 浮层面板」

顶栏与状态栏占据布局空间，工具面板绝对定位浮在画布之上。

- **为什么**：Cesium 不感知容器尺寸变化，停靠面板需要额外的 `ResizeObserver` 与 `viewer.resize()` 调用，并在拖拽时反复重建缓冲；浮层方案画布尺寸只随窗口变化，完全交给 Cesium 自己处理。
- **代价**：面板会遮挡画布左侧；通过「可完全关闭 + 窄屏抽屉 + Esc 关闭」缓解，并在后续版本提供相机偏移补偿（`flyToWithOffset`）。
- **备选**：停靠挤压更接近 ArcGIS Pro，但引入上述 resize 复杂度，本版本不采用。

### 2. 顶栏为单行 48px，配置驱动

顶栏由 `{ id, group, icon, label, action, disabled }` 数组渲染，分组之间用分隔线，扩展项放进下拉。

- **为什么**：三维画布垂直空间稀缺；Ribbon 需要约 100px 且缺少成熟的 Web 组件，容易做成空分组。
- **备选**：精简 Ribbon（更接近 Pro，但代价是持续占用垂直空间）。

### 3. 侧栏为 48px 图标栏 + 288px 面板

`ui` store 管理 `activePanel`、`panelOpen`、`panelWidth`；面板内容用 `v-if` 挂载。

- **为什么**：面板数量会随功能增长（图层、底图、可视化、场景，未来还有分析、时间轴），图标栏使新增面板不改外壳。
- **为什么用 `v-if`**：隐藏面板不保留计算与监听，避免不可见面板持续订阅 store。
- **备选**：单列手风琴（组件最少，但图层与全局设置混在一列，难以扩展）。

### 4. 图层以应用状态为唯一事实来源

`types/layers.ts` 定义判别联合 `LayerItem`，`layers` store 持有数组；所有面板只读写 store。

```
LayerPanel ──┐
VisualPanel ─┼─> layers store ──> applyLayer(layer) ──> Cesium 对象
BasemapPanel ┘        ^
                      └── 选中项 id
```

- **为什么**：以 Cesium 对象作为事实来源会失去可序列化性与 Vue 响应性，排序、撤销、未来保存场景都难以实现。
- **本版本的边界**：`applyLayer()` 是唯一渲染接缝，当前为空实现并标注 TODO；面板行为与状态完全可用。
- **备选**：每种图层一个 composable 直接操作 Viewer（初期简单，后期状态分散）。

### 5. Store 按职责拆分

保留 `viewer`（唯一持有 Viewer 实例），新增 `ui`（面板与布局状态）、`theme`（主题模式）、`layers`（图层数据）、`scene`（底图与场景设置）。

- **为什么**：面板交互与图层数据生命周期不同；主题需要独立持久化；底图与场景设置需要跨面板挂载/卸载保持。
- **约束**：`viewer` 现有 `setViewer` / `destroyViewer` 保持不变，仅增量扩展。

### 6. 主题通过语义令牌实现

- 语义变量定义在 `:root` 与 `.dark`，Tailwind 通过 `@theme inline` 映射为工具类；组件只使用令牌，不写死颜色。
- Tailwind 4 默认 `dark:` 跟随系统，需用 `@custom-variant dark (&:where(.dark, .dark *));` 改为跟随 `class`。
- Element Plus 引入 `theme-chalk/dark/css-vars.css`，通过 `html.dark` 生效。
- `index.html` 内联脚本在应用挂载前读取 `localStorage` 与 `matchMedia` 并写入 `html.dark`，消除首屏闪烁。

**为什么不用纯 CSS `prefers-color-scheme`**：无法支持用户手动覆盖系统设置。
**备选**：两套独立样式表（维护成本翻倍）。

### 7. 图标采用 Iconify 数据格式 + 运行时组件，并本地注册

图标以 `集合:名称` 字符串引用（如 `mdi:layers`、`lucide:wind`），由 `@iconify/vue` 的 `Icon` 组件渲染。项目实际用到的图标在 `src/data/icons.ts` 中于启动时本地注册，默认不发起 Iconify 公共 API 请求。

组件层不直接写图标标识，而是经由 `components/base/AppIcon.vue` 的语义映射（`layer`、`basemap`、`wind`、`measure` 等）引用。更换图标集只需修改映射表，业务组件不受影响。

- **为什么**：不绑定单一图标供应商。`@element-plus/icons-vue` 只提供 Element Plus 自有图标，缺少图层、风场、剖面等语义；Iconify 用统一数据格式覆盖 mdi、lucide、tabler 等集合，可按视觉风格或授权条件替换。
- **为什么本地注册**：`@iconify/vue` 在图标未注册时会请求公共 API，带来联网依赖、隐私与可用性风险，也与本项目「默认离线底图」的取向不一致。
- **代价**：需要维护一份实际使用的图标清单；遗漏注册会在运行期回退为联网请求，因此把「断网下图标正常显示、网络面板无 `api.iconify.design` 请求」列为验收项。
- **备选**：`unplugin-icons`（编译期生成组件，无运行时依赖、按需打包，但需要额外的 Vite 插件与类型声明）；`@element-plus/icons-vue`（与 UI 库同源，但集合有限且供应商锁定）；图标字体（可访问性与加载成本较高）。

### 8. 默认底图使用随包分发的自然地球影像

`TileMapServiceImageryProvider` 指向 `assets/Textures/NaturalEarthII`（经 `CESIUM_BASE_URL` 解析到 `/cesium/...`）。

- **为什么**：无需 token、无需外网，模板开箱即用；Ion 影像作为可选升级项，未配置 token 时禁用并说明。
- **备选**：默认 Ion 影像（受 token 与配额限制），或直接使用 OSM（依赖网络与使用政策）。

### 9. 视角分享使用 URL hash

相机位置与朝向编码进 `location.hash`，页面加载时解析还原；复制链接写入剪贴板。

- **为什么**：hash 不参与路由匹配，也不发送到服务器，避免与 History 路由冲突；只编码相机参数，长度可控。
- **备选**：query 参数（需与路由约定协调）。

### 10. 截图使用同帧渲染

触发时先执行一次渲染，再立即从画布读取 PNG，不开启 `preserveDrawingBuffer`。

- **为什么**：`preserveDrawingBuffer: true` 会给所有帧带来额外开销，而截图是低频操作。
- **风险**：必须在同一帧内读取，否则得到空白图；实现时集中在单一工具函数并添加注释。

## Risks / Trade-offs

- [面板遮挡画布左侧] → 支持完全关闭、Esc 关闭、窄屏抽屉；后续增加相机偏移补偿。
- [浅色主题浮层对比度不足] → 浅色用实心底色 + 边框 + 阴影，深色用半透明 + 边框；两套分别验收。
- [首屏主题闪烁] → `index.html` 内联脚本先于任何样式渲染执行。
- [截图返回空白] → 同帧渲染后立即读取，封装为单一函数并注释约束。
- [状态与渲染脱节造成"空壳感"] → 顶栏命令与场景设置中的阴影、大气、雾、光照全部接真实接口；仅在图层外观与地形夸张处明确标注未生效。
- [Element Plus 全量注册增大体积] → 本版本不改动引入方式，记录为后续优化项。
- [Cesium 内置控件样式不受令牌控制] → 针对版权与提示控件增加作用域覆盖，并纳入验收。
- [分享链接过长] → 仅编码相机位置与朝向，不编码图层数据。
- [图标遗漏本地注册而回退联网] → 断网与网络面板检查纳入验收；新增图标必须同时登记到 `data/icons.ts` 与语义映射。

## Migration Plan

纯增量变更，无数据迁移。若需回滚，还原本次提交即可；`viewer` store 与 Cesium 配置保持兼容，回滚后模板仍可运行。

## Open Questions

- 深色主题是否默认推荐深色底图：可在实现完成后根据实际观感决定，不影响本设计。
- 顶栏「设置」弹层的具体条目（快捷键列表、关于信息）可留到实现时补充。
