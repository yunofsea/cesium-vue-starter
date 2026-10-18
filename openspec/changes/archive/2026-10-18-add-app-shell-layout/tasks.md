# Tasks

## 1. 依赖与清理

- [x] 1.1 在 `package.json` 增加 `@iconify/vue` 与所需图标数据包并执行 `npm install`，验证 `node_modules` 生成且安装无错误
- [x] 1.2 删除 `src/style.css`、`src/components/HelloWorld.vue`、`public/icons.svg`，移除 `App.vue` 中未使用的 `HelloWorld` 导入；用 `grep` 确认无残留引用，并运行 `npm run build` 通过

## 2. 主题与样式基础

- [x] 2.1 在 `src/styles/index.css` 定义语义令牌（`--ui-surface`、`--ui-surface-raised`、`--ui-border`、`--ui-text-1`、`--ui-text-2`、`--ui-accent`、`--ui-shadow`）并为 `.dark` 提供第二套值；用 `@theme inline` 映射为工具类，加入 `@custom-variant dark (&:where(.dark, .dark *))`；验证 `bg-ui-surface` 等工具类可编译
- [x] 2.2 在 `main.ts` 引入 `element-plus/theme-chalk/dark/css-vars.css`；新建 `stores/theme.ts` 实现 `light | dark | system`、`localStorage` 持久化与 `matchMedia` 监听；验证三种模式切换后顶栏与 Element Plus 控件同步变化
- [x] 2.3 在 `index.html` 加入挂载前的内联脚本，根据 `localStorage` 与系统偏好写入 `html.dark`；验证深色用户刷新页面时首帧即为深色、无白色闪屏
- [x] 2.4 在 README「实现说明」补充主题模式与令牌约定；验证文档中的令牌名与代码一致

## 3. 应用外壳骨架

- [x] 3.1 新建 `components/layout/AppShell.vue`，实现 48px 顶栏 / `1fr` 内容区 / 24px 状态栏的网格，`CesiumViewer` 在内容区铺满；在 `Home.vue` 接入并验证三分区尺寸与画布填满
- [x] 3.2 新建 `stores/ui.ts` 与 `components/layout/SideRail.vue`、`SidePanel.vue`，实现四个标签（图层 / 底图 / 可视化 / 场景）、激活切换、再次点击收起、关闭按钮、面板内容 `v-if` 挂载；验证每种开合路径的面板状态
- [x] 3.3 为浮层设置 `pointer-events: none` 外层与 `pointer-events: auto` 本体，并按 canvas 0 / 浮层 10 / 顶栏 20 / 弹层 30 分层；验证在面板右侧空白处拖拽仍能旋转地球
- [x] 3.4 实现面板拖拽调宽（240–420px）与宽度记录；验证拖拽时画布 `clientWidth`、`clientHeight` 在控制台中保持不变
- [x] 3.5 实现视口小于 1024px 时默认收起、打开为抽屉 + 遮罩、点击遮罩关闭、Esc 关闭；验证 800px 宽度下的全部行为
- [x] 3.6 新建 `components/layout/StatusBar.vue`，展示指针经纬度（椭球拾取、无拾取显示 `--`）、场景模式、每秒帧率，并保留 Cesium 版权信息可见；验证鼠标在地球与太空中两种状态及帧率每秒刷新
- [x] 3.7 在 README「项目结构」补充 `layout/`、`panels/`、`stores/`、`types/` 的职责；验证目录树与实际文件一致

## 4. 顶部工具条

- [x] 4.1 新建 `components/base/AppIcon.vue` 与 `data/icons.ts`：定义语义图标映射（如 `layer`、`wind`、`measure`），并在应用启动时本地注册实际使用的图标；验证断网状态下全部图标正常显示、浏览器网络面板无 `api.iconify.design` 请求
- [x] 4.2 新建 `TopToolbar.vue`、`toolbar/ToolGroup.vue`、`ToolButton.vue`、`ToolDropdown.vue`，以配置数组渲染命令分组并通过 `AppIcon` 引用图标；验证每个按钮有悬停提示、`aria-label` 与可见焦点环
- [x] 4.3 新建 `composables/useCameraTools.ts`，实现复位（1 秒内动画返回默认视角）、全屏（含 Esc 同步）、指北（朝向归零且位置与俯仰角不变）；逐项手动验证
- [x] 4.4 实现截图导出：同一帧内渲染后读取画布为 PNG 并下载，文件名含时间戳；验证导出图片非空白
- [x] 4.5 实现视角分享：相机参数编码进 URL hash、复制链接、加载时还原；验证新页面打开链接后视角一致，无参数时使用默认视角
- [x] 4.6 实现底图下拉与场景模式下拉的入口，并将选中状态委托给 `map-scene` 能力；分析类命令触发「规划中」提示且不改变任何状态；逐项验证
- [x] 4.7 加入主题切换按钮（浅色 → 深色 → 跟随系统循环）与设置弹层入口；验证切换顺序与状态持久化
- [x] 4.8 在 README 补充顶栏命令清单、快捷键（`Ctrl/Cmd + B` 切换面板、`Ctrl/Cmd + Shift + T` 切换主题），以及图标的添加与替换方式（语义映射 + 本地注册）；验证文档描述的快捷键可用、按文档新增一个图标可正常显示

## 5. 图层管理与可视化

- [x] 5.1 新建 `types/layers.ts` 定义 `LayerKind` 与 `LayerItem`，新建 `stores/layers.ts` 与 `data/sample-layers.ts`；验证类型检查通过且示例图层集中可删除
- [x] 5.2 新建 `LayerPanel.vue`，实现列表呈现（名称、类型图标、可见性开关）、空状态、按名称搜索；验证空列表与无搜索结果两种状态
- [x] 5.3 实现添加图层（文件 / URL / 示例数据）与非法输入行内报错；验证合法添加出现在顶部并选中、非法输入不改变列表
- [x] 5.4 实现删除与 5 秒撤销（恢复原索引）、可见性切换、点击选中高亮；逐项验证
- [x] 5.5 实现拖拽排序并写回数组；验证将第三项拖到首位后顺序正确
- [x] 5.6 实现有空间范围图层的定位命令（2 秒内飞向范围），无范围时不显示该命令；用带 `extent` 与不带 `extent` 的示例图层分别验证
- [x] 5.7 新建 `VisualPanel.vue` 与 `controls/`（透明度、色带、范围、图例、重置），新建 `data/colormaps.ts` 提供至少四种色带；验证未选中时只显示引导、选中后参数与图例随调整实时更新、最小/最大值非法时阻止保存
- [x] 5.8 在 `stores/layers.ts` 增加 `applyLayer()` 空实现与 TODO 注释，作为唯一渲染接缝；验证修改外观后地球画面不变化而面板数值更新
- [x] 5.9 在 README「扩展工具栏」章节改写为图层扩展说明：新增一种图层需要改动的模型、面板与 `applyLayer()` 分支；验证文档步骤与代码结构对应

## 6. 底图与场景

- [x] 6.1 新建 `BasemapPanel.vue`，提供离线自然地球影像（默认）、OpenStreetMap、Cesium Ion 影像三项；验证无 token 时默认显示离线影像且 Ion 项禁用并说明原因
- [x] 6.2 实现底图切换：替换影像图层而不重建 Viewer，切换后相机位置与朝向不变、2 秒内完成；验证切换前后的相机参数与 `viewer` 实例不变
- [x] 6.3 新建 `ScenePanel.vue`，实现三维 / 二维 / 哥伦布视图切换并同步状态栏文本；验证三种模式与状态栏显示
- [x] 6.4 接入阴影、光照时间、大气、雾四项真实设置；验证阴影开关与光照时间改变画面，大气与雾开关分别生效
- [x] 6.5 实现地形夸张滑杆（1–5 倍）仅保存设置；验证数值在会话内保持且画面不变
- [x] 6.6 更新 README 中 Cesium Ion token 章节，说明离线默认底图与新底图选项；验证文档描述与实际界面对应

## 7. 集成验证

- [x] 7.1 运行 `npm run build`（含 `vue-tsc`），确认无类型错误且构建产物包含 `dist/cesium/Assets`
- [x] 7.2 按验收清单逐项手动走查：外壳尺寸、面板不改变画布、三种主题、窄屏抽屉、版权信息可见、快捷键可用、无遗留死文件；记录结果
- [x] 7.3 在两套主题下检查正文对比度不低于 4.5:1、控件边界不低于 3:1，并确认深色下 Cesium 版权信息清晰可读

## Workflow follow-up

- 项目评审通过后归档本变更。
- 归档后验证 `openspec/specs/` 下四个能力文件与本次 delta 内容一致。
