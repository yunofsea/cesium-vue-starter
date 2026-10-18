import { addIcon } from '@iconify/vue'

import mdiAlertCircle from '@iconify-icons/mdi/alert-circle-outline'
import mdiCamera from '@iconify-icons/mdi/camera-outline'
import mdiCheck from '@iconify-icons/mdi/check'
import mdiChevronDown from '@iconify-icons/mdi/chevron-down'
import mdiChevronLeft from '@iconify-icons/mdi/chevron-left'
import mdiChevronRight from '@iconify-icons/mdi/chevron-right'
import mdiClose from '@iconify-icons/mdi/close'
import mdiCompass from '@iconify-icons/mdi/compass-outline'
import mdiCog from '@iconify-icons/mdi/cog-outline'
import mdiCrosshairs from '@iconify-icons/mdi/crosshairs-gps'
import mdiCube from '@iconify-icons/mdi/cube-outline'
import mdiDelete from '@iconify-icons/mdi/delete-outline'
import mdiDrag from '@iconify-icons/mdi/drag-vertical'
import mdiEarth from '@iconify-icons/mdi/earth'
import mdiEye from '@iconify-icons/mdi/eye-outline'
import mdiEyeOff from '@iconify-icons/mdi/eye-off-outline'
import mdiFullscreen from '@iconify-icons/mdi/fullscreen'
import mdiFullscreenExit from '@iconify-icons/mdi/fullscreen-exit'
import mdiHome from '@iconify-icons/mdi/home'
import mdiImage from '@iconify-icons/mdi/image-outline'
import mdiImageFilterHdr from '@iconify-icons/mdi/image-filter-hdr'
import mdiInfo from '@iconify-icons/mdi/information-outline'
import mdiLayers from '@iconify-icons/mdi/layers-outline'
import mdiMagnify from '@iconify-icons/mdi/magnify'
import mdiMap from '@iconify-icons/mdi/map-outline'
import mdiMenu from '@iconify-icons/mdi/menu'
import mdiPalette from '@iconify-icons/mdi/palette-outline'
import mdiPlus from '@iconify-icons/mdi/plus'
import mdiRefresh from '@iconify-icons/mdi/refresh'
import mdiRuler from '@iconify-icons/mdi/ruler'
import mdiRulerSquare from '@iconify-icons/mdi/ruler-square'
import mdiShare from '@iconify-icons/mdi/share-variant-outline'
import mdiShape from '@iconify-icons/mdi/shape-outline'
import mdiTune from '@iconify-icons/mdi/tune-variant'
import mdiUndo from '@iconify-icons/mdi/undo-variant'
import mdiVectorPolygon from '@iconify-icons/mdi/vector-polygon'

import lucideMonitor from '@iconify-icons/lucide/monitor'
import lucideMoon from '@iconify-icons/lucide/moon'
import lucideSun from '@iconify-icons/lucide/sun'
import lucideWind from '@iconify-icons/lucide/wind'

/**
 * 语义名称 → Iconify 图标标识。
 * 更换图标集时只需修改这张表，业务组件始终使用左侧的语义名称。
 */
export const iconNames = {
  logo: 'mdi:earth',
  close: 'mdi:close',
  chevronDown: 'mdi:chevron-down',
  chevronLeft: 'mdi:chevron-left',
  chevronRight: 'mdi:chevron-right',
  menu: 'mdi:menu',
  check: 'mdi:check',
  info: 'mdi:information-outline',
  warn: 'mdi:alert-circle-outline',

  home: 'mdi:home',
  fullscreen: 'mdi:fullscreen',
  fullscreenExit: 'mdi:fullscreen-exit',
  compass: 'mdi:compass-outline',

  basemap: 'mdi:map-outline',
  scene3d: 'mdi:earth',
  scene2d: 'mdi:map-outline',
  columbus: 'mdi:cube-outline',

  measure: 'mdi:ruler',
  section: 'mdi:ruler-square',

  add: 'mdi:plus',
  screenshot: 'mdi:camera-outline',
  share: 'mdi:share-variant-outline',
  settings: 'mdi:cog-outline',

  themeLight: 'lucide:sun',
  themeDark: 'lucide:moon',
  themeSystem: 'lucide:monitor',

  layers: 'mdi:layers-outline',
  visualize: 'mdi:palette-outline',
  scene: 'mdi:tune-variant',
  search: 'mdi:magnify',
  eye: 'mdi:eye-outline',
  eyeOff: 'mdi:eye-off-outline',
  trash: 'mdi:delete-outline',
  locate: 'mdi:crosshairs-gps',
  undo: 'mdi:undo-variant',
  drag: 'mdi:drag-vertical',
  reset: 'mdi:refresh',

  kindImagery: 'mdi:image-outline',
  kindTerrain: 'mdi:image-filter-hdr',
  kindTileset: 'mdi:cube-outline',
  kindGeojson: 'mdi:vector-polygon',
  kindModel: 'mdi:shape-outline',
  kindWind: 'lucide:wind',
} as const

export type IconName = keyof typeof iconNames

type IconData = Parameters<typeof addIcon>[1]

const iconData: Record<IconName, IconData> = {
  logo: mdiEarth,
  close: mdiClose,
  chevronDown: mdiChevronDown,
  chevronLeft: mdiChevronLeft,
  chevronRight: mdiChevronRight,
  menu: mdiMenu,
  check: mdiCheck,
  info: mdiInfo,
  warn: mdiAlertCircle,

  home: mdiHome,
  fullscreen: mdiFullscreen,
  fullscreenExit: mdiFullscreenExit,
  compass: mdiCompass,

  basemap: mdiMap,
  scene3d: mdiEarth,
  scene2d: mdiMap,
  columbus: mdiCube,

  measure: mdiRuler,
  section: mdiRulerSquare,

  add: mdiPlus,
  screenshot: mdiCamera,
  share: mdiShare,
  settings: mdiCog,

  themeLight: lucideSun,
  themeDark: lucideMoon,
  themeSystem: lucideMonitor,

  layers: mdiLayers,
  visualize: mdiPalette,
  scene: mdiTune,
  search: mdiMagnify,
  eye: mdiEye,
  eyeOff: mdiEyeOff,
  trash: mdiDelete,
  locate: mdiCrosshairs,
  undo: mdiUndo,
  drag: mdiDrag,
  reset: mdiRefresh,

  kindImagery: mdiImage,
  kindTerrain: mdiImageFilterHdr,
  kindTileset: mdiCube,
  kindGeojson: mdiVectorPolygon,
  kindModel: mdiShape,
  kindWind: lucideWind,
}

let registered = false

/** 启动时本地注册图标，避免运行时请求 Iconify 公共 API */
export function registerIcons() {
  if (registered) return

  for (const name of Object.keys(iconData) as IconName[]) {
    addIcon(iconNames[name], iconData[name])
  }

  registered = true
}
