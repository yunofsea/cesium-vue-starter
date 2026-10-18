# map-scene Specification

## Purpose

管理三维场景的底图、观察模式与渲染设置，使用户能够在不同数据源与环境条件下获得合适的画面。

## Requirements

### Requirement: 底图选择

系统 SHALL 提供至少三种底图选项：离线自然地球影像、OpenStreetMap 与 Cesium Ion 影像；当前底图 MUST 有明确选中态。

#### Scenario: 查看底图选项

- **WHEN** 用户打开底图面板
- **THEN** 至少显示三种底图选项
- **AND** 当前使用的底图带有选中标记

### Requirement: 默认离线底图

未配置 Cesium Ion 访问令牌时，系统 MUST 默认使用随应用分发的离线自然地球影像，且加载该底图不依赖外部网络。

#### Scenario: 无外网环境启动

- **WHEN** 应用在没有外部网络的环境下加载
- **THEN** 地球仍然显示自然地球影像

### Requirement: 不可用底图的禁用说明

未配置访问令牌时，Cesium Ion 影像选项 MUST 处于禁用状态，并向用户说明原因。

#### Scenario: 点击被禁用的底图

- **WHEN** 用户在没有可用令牌时查看 Cesium Ion 选项
- **THEN** 该选项不可选择
- **AND** 界面说明需要配置访问令牌

### Requirement: 底图切换不丢失视角

切换底图后，相机位置与朝向 MUST 保持不变，新底图 SHALL 在 2 秒内完成替换。

#### Scenario: 从离线底图切换到在线底图

- **WHEN** 用户选择另一种底图
- **THEN** 相机位置与朝向与切换前一致
- **AND** 2 秒内显示新底图影像

### Requirement: 场景模式切换

系统 SHALL 支持三维、二维与哥伦布视图三种场景模式，并在切换后保持当前地理范围。

#### Scenario: 切换到二维

- **WHEN** 用户选择二维模式
- **THEN** 场景以平面视图呈现
- **AND** 状态栏显示「2D」

#### Scenario: 切回三维

- **WHEN** 用户在二维模式下选择三维模式
- **THEN** 场景恢复为三维地球
- **AND** 状态栏显示「3D」

### Requirement: 阴影开关

系统 SHALL 提供阴影开关；开启后地球表面 MUST 呈现随时间变化的光照，关闭后 MUST 恢复均匀照明。

#### Scenario: 开启阴影

- **WHEN** 用户开启阴影
- **THEN** 地球表面出现昼夜明暗变化

#### Scenario: 关闭阴影

- **WHEN** 用户关闭阴影
- **THEN** 地球表面恢复均匀照明

### Requirement: 光照时间调节

场景设置 SHALL 提供 0–24 时的光照时间滑杆；阴影开启时，调整 MUST 立即改变光照方向。

#### Scenario: 拖动光照时间

- **WHEN** 阴影开启时用户将光照时间从 12 时调到 18 时
- **THEN** 地球表面的明暗分布立即变化

### Requirement: 大气与雾开关

系统 SHALL 分别提供大气与雾的开关，切换 MUST 立即影响画面。

#### Scenario: 关闭大气

- **WHEN** 用户关闭大气
- **THEN** 地球边缘的大气光晕消失

#### Scenario: 关闭雾

- **WHEN** 用户关闭雾
- **THEN** 远处地表不再呈现雾化渐变

### Requirement: 地形夸张设置

场景设置 SHALL 提供 1–5 倍的地形夸张滑杆；本版本 MUST 保存该设置并在会话内保持，不改变地形渲染结果。

#### Scenario: 调整地形夸张

- **WHEN** 用户将地形夸张调整为 3 倍
- **THEN** 设置值显示为 3 倍并在会话内保持
- **AND** 地球画面不因该操作发生变化
