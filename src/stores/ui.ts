import { defineStore } from 'pinia'

export type PanelId = 'layers' | 'basemap' | 'visual' | 'scene'

export const PANEL_WIDTH_KEY = 'cesium4cfd-panel-width'

const MIN_PANEL_WIDTH = 240
const MAX_PANEL_WIDTH = 420
const DEFAULT_PANEL_WIDTH = 288

function clampWidth(value: number): number {
  return Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, Math.round(value)))
}

function readStoredWidth(): number {
  try {
    const value = Number(localStorage.getItem(PANEL_WIDTH_KEY))
    if (Number.isFinite(value) && value >= MIN_PANEL_WIDTH) return clampWidth(value)
  } catch {
    // 忽略存储不可用
  }
  return DEFAULT_PANEL_WIDTH
}

function isNarrowViewport(): boolean {
  return window.matchMedia('(max-width: 1023px)').matches
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    activePanel: 'layers' as PanelId,
    panelOpen: !isNarrowViewport(),
    panelWidth: readStoredWidth(),
    narrow: isNarrowViewport(),
    settingsOpen: false,
  }),

  actions: {
    /** 点击当前激活的图标收起面板，点击其他图标切换面板 */
    togglePanel(panel: PanelId) {
      if (this.panelOpen && this.activePanel === panel) {
        this.panelOpen = false
        return
      }
      this.activePanel = panel
      this.panelOpen = true
    },

    openPanel(panel: PanelId) {
      this.activePanel = panel
      this.panelOpen = true
    },

    closePanel() {
      this.panelOpen = false
    },

    togglePanelOpen() {
      if (this.panelOpen) this.closePanel()
      else this.panelOpen = true
    },

    setPanelWidth(width: number) {
      this.panelWidth = clampWidth(width)
      try {
        localStorage.setItem(PANEL_WIDTH_KEY, String(this.panelWidth))
      } catch {
        // 忽略持久化失败
      }
    },

    setNarrow(narrow: boolean) {
      this.narrow = narrow
      if (narrow) this.panelOpen = false
    },

    openSettings() {
      this.settingsOpen = true
    },

    closeSettings() {
      this.settingsOpen = false
    },
  },
})
