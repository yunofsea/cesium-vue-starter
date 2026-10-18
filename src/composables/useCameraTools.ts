import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Cartesian3, Math as CesiumMath, type Viewer } from 'cesium'

import { useViewerStore } from '@/stores/viewer'

interface SharedCameraState {
  lon: number
  lat: number
  height: number
  heading: number
  pitch: number
  roll: number
}

const SHARE_PARAM = 'view'

function encodeBase64(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeBase64(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
  return atob(normalized + padding)
}

function readCameraState(viewer: Viewer): SharedCameraState | null {
  const position = viewer.camera.positionCartographic
  if (!position) return null

  return {
    lon: Number(CesiumMath.toDegrees(position.longitude).toFixed(6)),
    lat: Number(CesiumMath.toDegrees(position.latitude).toFixed(6)),
    height: Number(position.height.toFixed(1)),
    heading: Number(CesiumMath.toDegrees(viewer.camera.heading).toFixed(3)),
    pitch: Number(CesiumMath.toDegrees(viewer.camera.pitch).toFixed(3)),
    roll: Number(CesiumMath.toDegrees(viewer.camera.roll).toFixed(3)),
  }
}

function parseCameraState(raw: string): SharedCameraState | null {
  try {
    const parsed = JSON.parse(decodeBase64(raw)) as Partial<SharedCameraState>
    const values = [parsed.lon, parsed.lat, parsed.height, parsed.heading, parsed.pitch, parsed.roll]

    if (values.some((value) => typeof value !== 'number' || !Number.isFinite(value))) return null

    return parsed as SharedCameraState
  } catch {
    return null
  }
}

/** 页面加载时还原 URL hash 中的相机视角，返回是否成功应用 */
export function applySharedView(viewer: Viewer): boolean {
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return false

  const raw = new URLSearchParams(hash).get(SHARE_PARAM)
  if (!raw) return false

  const state = parseCameraState(raw)
  if (!state) return false

  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(state.lon, state.lat, Math.max(1, state.height)),
    orientation: {
      heading: CesiumMath.toRadians(state.heading),
      pitch: CesiumMath.toRadians(state.pitch),
      roll: CesiumMath.toRadians(state.roll),
    },
  })

  return true
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const copied = document.execCommand('copy')
      textarea.remove()
      return copied
    } catch {
      return false
    }
  }
}

export function useCameraTools() {
  const viewerStore = useViewerStore()
  const isFullscreen = ref(Boolean(document.fullscreenElement))

  function syncFullscreen() {
    isFullscreen.value = Boolean(document.fullscreenElement)
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', syncFullscreen)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', syncFullscreen)
  })

  function resetView() {
    viewerStore.viewer?.camera.flyHome(0.8)
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      ElMessage.error('当前环境不支持全屏')
    }
  }

  function northUp() {
    const camera = viewerStore.viewer?.camera
    if (!camera) return

    camera.setView({
      destination: camera.positionWC,
      orientation: { heading: 0, pitch: camera.pitch, roll: 0 },
    })
  }

  function takeScreenshot() {
    const viewer = viewerStore.viewer
    if (!viewer) return

    // 必须在同一帧内完成渲染与读取，否则 WebGL 缓冲区可能已被清空
    viewer.render()
    const dataUrl = viewer.scene.canvas.toDataURL('image/png')

    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `cesium-${stamp}.png`
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  async function shareView() {
    const viewer = viewerStore.viewer
    if (!viewer) return

    const state = readCameraState(viewer)
    if (!state) {
      ElMessage.error('无法读取当前视角')
      return
    }

    const url = new URL(window.location.href)
    url.hash = `${SHARE_PARAM}=${encodeBase64(JSON.stringify(state))}`

    const copied = await copyText(url.toString())
    if (copied) ElMessage.success('视角链接已复制到剪贴板')
    else ElMessage.warning('复制失败，请手动复制地址栏中的链接')
  }

  return {
    isFullscreen,
    resetView,
    toggleFullscreen,
    northUp,
    takeScreenshot,
    shareView,
  }
}
