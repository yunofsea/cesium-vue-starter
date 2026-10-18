import { defineStore } from 'pinia'

import { createSampleLayers } from '@/data/sample-layers'
import { defaultRampId } from '@/data/colormaps'
import type { LayerDraft, LayerItem, LayerStyle } from '@/types/layers'

let undoTimer: ReturnType<typeof setTimeout> | undefined

let idSeed = 0

function createId(): string {
  idSeed += 1
  return `layer-${Date.now().toString(36)}-${idSeed}`
}

/**
 * 渲染接缝：图层状态变化后统一从这里进入 Cesium。
 * 本版本为空实现；后续按 kind 分发到 ImageryLayer / Cesium3DTileset / DataSource 等。
 */
function applyLayer(_layer: LayerItem) {
  // TODO(layer-render): 在此处接入真实渲染，调用方无需改动
}

function createStyle(style?: Partial<LayerStyle>): LayerStyle {
  return {
    ramp: style?.ramp ?? defaultRampId,
    min: style?.min ?? 0,
    max: style?.max ?? 100,
    unit: style?.unit ?? '',
  }
}

export const useLayersStore = defineStore('layers', {
  state: () => ({
    items: createSampleLayers(),
    selectedId: 'sample-wind' as string | null,
    query: '',
    pendingDeletion: null as { layer: LayerItem; index: number } | null,
  }),

  getters: {
    filteredItems(state): LayerItem[] {
      const query = state.query.trim().toLowerCase()
      if (!query) return state.items
      return state.items.filter((item) => item.name.toLowerCase().includes(query))
    },

    selected(state): LayerItem | null {
      return state.items.find((item) => item.id === state.selectedId) ?? null
    },
  },

  actions: {
    addLayer(draft: LayerDraft) {
      const style = createStyle(draft.style)
      const layer: LayerItem = {
        id: createId(),
        name: draft.name.trim(),
        kind: draft.kind,
        visible: true,
        opacity: 1,
        extent: draft.extent,
        source: draft.source,
        style,
        initialStyle: { ...style },
        initialOpacity: 1,
      }

      this.items.unshift(layer)
      this.selectedId = layer.id
      applyLayer(layer)
      return layer
    },

    removeLayer(id: string) {
      const index = this.items.findIndex((item) => item.id === id)
      if (index < 0) return

      const [layer] = this.items.splice(index, 1)
      if (this.selectedId === id) {
        this.selectedId = this.items[0]?.id ?? null
      }

      this.pendingDeletion = { layer, index }
      clearTimeout(undoTimer)
      undoTimer = setTimeout(() => {
        this.pendingDeletion = null
      }, 5000)

      return layer
    },

    undoRemove() {
      if (!this.pendingDeletion) return

      const { layer, index } = this.pendingDeletion
      this.items.splice(Math.min(index, this.items.length), 0, layer)
      this.selectedId = layer.id
      this.pendingDeletion = null
      clearTimeout(undoTimer)
      applyLayer(layer)
    },

    moveLayer(fromId: string, toIndex: number) {
      const from = this.items.findIndex((item) => item.id === fromId)
      if (from < 0) return

      const [layer] = this.items.splice(from, 1)
      const target = Math.max(0, Math.min(toIndex, this.items.length))
      this.items.splice(target, 0, layer)
    },

    toggleVisible(id: string) {
      const layer = this.items.find((item) => item.id === id)
      if (!layer) return

      layer.visible = !layer.visible
      applyLayer(layer)
    },

    select(id: string | null) {
      this.selectedId = id
    },

    setQuery(query: string) {
      this.query = query
    },

    setOpacity(id: string, percent: number) {
      const layer = this.items.find((item) => item.id === id)
      if (!layer) return

      layer.opacity = Math.min(1, Math.max(0, percent / 100))
      applyLayer(layer)
    },

    setRamp(id: string, ramp: string) {
      const layer = this.items.find((item) => item.id === id)
      if (!layer) return

      layer.style.ramp = ramp
      applyLayer(layer)
    },

    setRange(id: string, min: number, max: number) {
      if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) return false

      const layer = this.items.find((item) => item.id === id)
      if (!layer) return false

      layer.style.min = min
      layer.style.max = max
      applyLayer(layer)
      return true
    },

    resetStyle(id: string) {
      const layer = this.items.find((item) => item.id === id)
      if (!layer) return

      layer.style = { ...layer.initialStyle }
      layer.opacity = layer.initialOpacity
      applyLayer(layer)
    },
  },
})
