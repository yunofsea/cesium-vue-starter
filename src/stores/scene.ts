import { defineStore } from 'pinia'
import {
  Ion,
  IonImageryProvider,
  JulianDate,
  OpenStreetMapImageryProvider,
  SceneMode,
  TileMapServiceImageryProvider,
  buildModuleUrl,
  type ImageryProvider,
  type Viewer,
} from 'cesium'

import type { IconName } from '@/data/icons'
import { useViewerStore } from './viewer'

export type BasemapId = 'natural-earth' | 'osm' | 'ion'
export type SceneModeId = '3D' | '2D' | 'COLUMBUS'

export interface BasemapOption {
  id: BasemapId
  name: string
  description: string
  requiresToken: boolean
  preview: string
}

export interface SceneModeOption {
  id: SceneModeId
  name: string
  icon: IconName
}

export const basemapOptions: BasemapOption[] = [
  {
    id: 'natural-earth',
    name: '自然地球（离线）',
    description: '随应用分发，无需网络与令牌',
    requiresToken: false,
    preview: 'linear-gradient(135deg, #1b4f72 0%, #2e86c1 45%, #a9cce3 100%)',
  },
  {
    id: 'osm',
    name: 'OpenStreetMap',
    description: '在线瓦片，依赖外部网络',
    requiresToken: false,
    preview: 'linear-gradient(135deg, #d9e7cf 0%, #a9c48e 50%, #7fa05f 100%)',
  },
  {
    id: 'ion',
    name: 'Cesium Ion 影像',
    description: '需要配置 VITE_CESIUM_ION_TOKEN',
    requiresToken: true,
    preview: 'linear-gradient(135deg, #1b2631 0%, #34495e 50%, #839192 100%)',
  },
]

export const sceneModeOptions: SceneModeOption[] = [
  { id: '3D', name: '三维', icon: 'scene3d' },
  { id: '2D', name: '二维', icon: 'scene2d' },
  { id: 'COLUMBUS', name: '哥伦布视图', icon: 'columbus' },
]

function hasIonToken(): boolean {
  return Boolean(import.meta.env.VITE_CESIUM_ION_TOKEN)
}

async function createImageryProvider(id: BasemapId): Promise<ImageryProvider> {
  switch (id) {
    case 'osm':
      return new OpenStreetMapImageryProvider({ url: 'https://tile.openstreetmap.org/' })

    case 'ion': {
      const token = import.meta.env.VITE_CESIUM_ION_TOKEN
      if (!token) throw new Error('未配置 Cesium Ion 访问令牌')

      Ion.defaultAccessToken = token
      return IonImageryProvider.fromAssetId(2)
    }

    case 'natural-earth':
    default:
      return TileMapServiceImageryProvider.fromUrl(
        buildModuleUrl('Assets/Textures/NaturalEarthII'),
      )
  }
}

function toSceneModeId(mode: SceneMode): SceneModeId {
  if (mode === SceneMode.SCENE2D) return '2D'
  if (mode === SceneMode.COLUMBUS_VIEW) return 'COLUMBUS'
  return '3D'
}

let morphListener: (() => void) | null = null

export const useSceneStore = defineStore('scene', {
  state: () => ({
    basemap: 'natural-earth' as BasemapId,
    basemapLoading: false,
    sceneMode: '3D' as SceneModeId,
    shadows: false,
    lightHour: 12,
    atmosphere: true,
    fog: true,
    terrainExaggeration: 1,
  }),

  getters: {
    ionAvailable: () => hasIonToken(),
    activeBasemap(state): BasemapOption {
      return basemapOptions.find((option) => option.id === state.basemap) ?? basemapOptions[0]
    },
  },

  actions: {
    bindViewer(viewer: Viewer) {
      this.applyShadows(viewer)
      this.applyLightHour(viewer)
      this.applyAtmosphere(viewer)
      this.applyFog(viewer)
      this.sceneMode = toSceneModeId(viewer.scene.mode)

      morphListener?.()
      const remove = viewer.scene.morphComplete.addEventListener(() => {
        this.sceneMode = toSceneModeId(viewer.scene.mode)
      })
      morphListener = remove
    },

    unbindViewer() {
      morphListener?.()
      morphListener = null
    },

    async applyBasemap(id: BasemapId) {
      if (id === 'ion' && !hasIonToken()) {
        throw new Error('未配置 Cesium Ion 访问令牌')
      }

      const viewer = useViewerStore().viewer
      if (!viewer) {
        this.basemap = id
        return
      }

      this.basemapLoading = true
      try {
        const provider = await createImageryProvider(id)
        if (viewer.isDestroyed()) return

        viewer.imageryLayers.removeAll()
        viewer.imageryLayers.addImageryProvider(provider)
        this.basemap = id
      } finally {
        this.basemapLoading = false
      }
    },

    setSceneMode(mode: SceneModeId) {
      this.sceneMode = mode

      const viewer = useViewerStore().viewer
      if (!viewer) return

      if (mode === '2D') viewer.scene.morphTo2D(0.8)
      else if (mode === 'COLUMBUS') viewer.scene.morphToColumbusView(0.8)
      else viewer.scene.morphTo3D(0.8)
    },

    setShadows(enabled: boolean) {
      this.shadows = enabled
      const viewer = useViewerStore().viewer
      if (viewer) this.applyShadows(viewer)
    },

    applyShadows(viewer: Viewer) {
      viewer.scene.globe.enableLighting = this.shadows
    },

    setLightHour(hour: number) {
      this.lightHour = Math.min(24, Math.max(0, hour))
      const viewer = useViewerStore().viewer
      if (viewer) this.applyLightHour(viewer)
    },

    applyLightHour(viewer: Viewer) {
      const now = new Date()
      const date = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          Math.floor(this.lightHour),
          0,
          0,
        ),
      )

      viewer.clock.shouldAnimate = false
      viewer.clock.currentTime = JulianDate.fromDate(date)
    },

    setAtmosphere(enabled: boolean) {
      this.atmosphere = enabled
      const viewer = useViewerStore().viewer
      if (viewer) this.applyAtmosphere(viewer)
    },

    applyAtmosphere(viewer: Viewer) {
      if (viewer.scene.skyAtmosphere) {
        viewer.scene.skyAtmosphere.show = this.atmosphere
      }
    },

    setFog(enabled: boolean) {
      this.fog = enabled
      const viewer = useViewerStore().viewer
      if (viewer) this.applyFog(viewer)
    },

    applyFog(viewer: Viewer) {
      viewer.scene.fog.enabled = this.fog
    },

    /** 本版本仅保存设置，不改变地形渲染结果 */
    setTerrainExaggeration(value: number) {
      this.terrainExaggeration = Math.min(5, Math.max(1, value))
    },
  },
})
