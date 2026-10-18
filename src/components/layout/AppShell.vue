<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide } from 'vue'

import CesiumViewer from '@/components/cesium/CesiumViewer.vue'
import SidePanel from './SidePanel.vue'
import SideRail from './SideRail.vue'
import StatusBar from './StatusBar.vue'
import TopToolbar from './TopToolbar.vue'
import { creditContainerKey } from './credit'
import { useThemeStore } from '@/stores/theme'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
const themeStore = useThemeStore()

// 先创建容器，CesiumViewer 与 StatusBar 共享同一个元素
const creditContainer = document.createElement('div')
creditContainer.className = 'cesium-credit-host'
provide(creditContainerKey, creditContainer)

let narrowQuery: MediaQueryList | null = null

function handleNarrowChange(event: MediaQueryListEvent) {
  uiStore.setNarrow(event.matches)
}

function handleKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  const isEditing =
    target !== null &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)

  if (isEditing) return

  const modifier = event.ctrlKey || event.metaKey

  if (uiStore.settingsOpen) {
    if (event.key === 'Escape') uiStore.closeSettings()
    return
  }

  if (modifier && !event.shiftKey && event.key.toLowerCase() === 'b') {
    event.preventDefault()
    uiStore.togglePanelOpen()
    return
  }

  if (modifier && event.shiftKey && event.key.toLowerCase() === 't') {
    event.preventDefault()
    themeStore.cycle()
    return
  }

  if (event.key === 'Escape' && uiStore.panelOpen) {
    uiStore.closePanel()
  }
}

onMounted(() => {
  themeStore.startSystemWatcher()

  narrowQuery = window.matchMedia('(max-width: 1023px)')
  narrowQuery.addEventListener('change', handleNarrowChange)
  uiStore.setNarrow(narrowQuery.matches)

  window.addEventListener('keydown', handleKeydown, true)
})

onBeforeUnmount(() => {
  themeStore.stopSystemWatcher()
  narrowQuery?.removeEventListener('change', handleNarrowChange)
  window.removeEventListener('keydown', handleKeydown, true)
})
</script>

<template>
  <div class="grid h-full w-full grid-rows-[48px_1fr_24px] overflow-hidden bg-ui-bg">
    <TopToolbar />

    <main class="relative overflow-hidden">
      <CesiumViewer />
      <SideRail />
      <SidePanel />
    </main>

    <StatusBar />

    <el-dialog
      v-model="uiStore.settingsOpen"
      title="设置"
      width="440px"
      append-to-body
    >
      <div class="space-y-5 text-[13px] text-ui-text">
        <section>
          <h3 class="mb-2 font-semibold">
            快捷键
          </h3>
          <dl class="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 text-ui-muted">
            <dt><kbd class="shortcut">Ctrl/⌘ + B</kbd></dt>
            <dd>显示 / 隐藏工具面板</dd>
            <dt><kbd class="shortcut">Ctrl/⌘ + Shift + T</kbd></dt>
            <dd>切换主题</dd>
            <dt><kbd class="shortcut">Esc</kbd></dt>
            <dd>关闭工具面板或弹层</dd>
          </dl>
        </section>

        <section>
          <h3 class="mb-2 font-semibold">
            关于
          </h3>
          <p class="text-ui-muted">
            Cesium4CFD 应用外壳模板，基于 CesiumJS、Vue 3、Element Plus 与 Tailwind CSS。
          </p>
        </section>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.shortcut {
  display: inline-block;
  padding: 1px 6px;
  border: 1px solid var(--ui-control-border);
  border-radius: 4px;
  color: var(--ui-text-1);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 11px;
}
</style>
