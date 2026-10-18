<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'

import AppIcon from '@/components/base/AppIcon.vue'
import ToolButton from './toolbar/ToolButton.vue'
import ToolDropdown from './toolbar/ToolDropdown.vue'
import ToolGroup from './toolbar/ToolGroup.vue'

import { useCameraTools } from '@/composables/useCameraTools'
import { basemapOptions, sceneModeOptions, useSceneStore, type BasemapId, type SceneModeId } from '@/stores/scene'
import { useThemeStore } from '@/stores/theme'
import { useUiStore } from '@/stores/ui'
import type { IconName } from '@/data/icons'
import type { ToolDropdownItem } from '@/types/toolbar'

const { isFullscreen, resetView, toggleFullscreen, northUp, takeScreenshot, shareView } = useCameraTools()

const sceneStore = useSceneStore()
const themeStore = useThemeStore()
const uiStore = useUiStore()

const basemapItems = computed<ToolDropdownItem[]>(() =>
  basemapOptions.map((option) => {
    const unavailable = option.requiresToken && !sceneStore.ionAvailable
    return {
      id: option.id,
      label: option.name,
      active: sceneStore.basemap === option.id,
      disabled: unavailable,
      hint: unavailable ? '需令牌' : undefined,
    }
  }),
)

const sceneModeItems = computed<ToolDropdownItem[]>(() =>
  sceneModeOptions.map((option) => ({
    id: option.id,
    label: option.name,
    icon: option.icon,
    active: sceneStore.sceneMode === option.id,
  })),
)

const analysisItems: ToolDropdownItem[] = [
  { id: 'measure', label: '测距', icon: 'measure' },
  { id: 'section', label: '剖面', icon: 'section' },
]

const activeSceneMode = computed(
  () => sceneModeOptions.find((option) => option.id === sceneStore.sceneMode) ?? sceneModeOptions[0],
)

const themeIcon = computed<IconName>(() => {
  if (themeStore.mode === 'light') return 'themeLight'
  if (themeStore.mode === 'dark') return 'themeDark'
  return 'themeSystem'
})

const themeLabel = computed(() => {
  if (themeStore.mode === 'light') return '浅色主题'
  if (themeStore.mode === 'dark') return '深色主题'
  return '跟随系统'
})

const fullscreenIcon = computed<IconName>(() =>
  isFullscreen.value ? 'fullscreenExit' : 'fullscreen',
)

const fullscreenLabel = computed(() => (isFullscreen.value ? '退出全屏' : '全屏'))

async function selectBasemap(id: string) {
  try {
    await sceneStore.applyBasemap(id as BasemapId)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '底图切换失败')
  }
}

function selectSceneMode(id: string) {
  sceneStore.setSceneMode(id as SceneModeId)
}

function selectAnalysis(id: string) {
  const item = analysisItems.find((entry) => entry.id === id)
  ElMessage.info(`「${item?.label ?? '分析'}」规划中`)
}

function openLayers() {
  uiStore.openPanel('layers')
}
</script>

<template>
  <header class="flex h-12 items-center gap-1 border-b border-ui-border bg-ui-toolbar px-2">
    <div class="flex shrink-0 items-center gap-2 pr-2">
      <AppIcon
        name="logo"
        :size="20"
        class="text-ui-accent"
      />
      <span class="hidden text-[13px] font-semibold tracking-wide text-ui-text md:inline">Cesium4CFD</span>
    </div>

    <ToolGroup>
      <ToolButton
        icon="home"
        label="复位视图"
        @click="resetView"
      />
      <ToolButton
        :icon="fullscreenIcon"
        :label="fullscreenLabel"
        @click="toggleFullscreen"
      />
      <ToolButton
        icon="compass"
        label="指北"
        @click="northUp"
      />
    </ToolGroup>

    <ToolGroup>
      <ToolDropdown
        icon="basemap"
        label="底图"
        :items="basemapItems"
        @select="selectBasemap"
      />
      <ToolDropdown
        :icon="activeSceneMode.icon"
        :label="activeSceneMode.name"
        :items="sceneModeItems"
        @select="selectSceneMode"
      />
    </ToolGroup>

    <ToolGroup>
      <ToolDropdown
        icon="measure"
        label="分析"
        :items="analysisItems"
        @select="selectAnalysis"
      />
    </ToolGroup>

    <ToolGroup>
      <ToolButton
        icon="add"
        label="添加图层"
        @click="openLayers"
      />
      <ToolButton
        icon="screenshot"
        label="截图"
        @click="takeScreenshot"
      />
      <ToolButton
        icon="share"
        label="分享视角"
        @click="shareView"
      />
    </ToolGroup>

    <div class="ml-auto flex shrink-0 items-center gap-1">
      <ToolButton
        :icon="themeIcon"
        :label="themeLabel"
        @click="themeStore.cycle"
      />
      <ToolButton
        icon="settings"
        label="设置"
        @click="uiStore.openSettings"
      />
    </div>
  </header>
</template>
