<script setup lang="ts">
import { computed, ref } from 'vue'

import AppIcon from '@/components/base/AppIcon.vue'
import BasemapPanel from '@/components/panels/BasemapPanel.vue'
import LayerPanel from '@/components/panels/LayerPanel.vue'
import ScenePanel from '@/components/panels/ScenePanel.vue'
import VisualPanel from '@/components/panels/VisualPanel.vue'
import { useUiStore, type PanelId } from '@/stores/ui'

const uiStore = useUiStore()

const titles: Record<PanelId, string> = {
  layers: '图层',
  basemap: '底图',
  visual: '可视化',
  scene: '场景',
}

const title = computed(() => titles[uiStore.activePanel])
const resizing = ref(false)

function startResize(event: PointerEvent) {
  if (uiStore.narrow) return

  resizing.value = true
  const startX = event.clientX
  const startWidth = uiStore.panelWidth

  function onMove(moveEvent: PointerEvent) {
    uiStore.setPanelWidth(startWidth + (moveEvent.clientX - startX))
  }

  function onUp() {
    resizing.value = false
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)
}
</script>

<template>
  <div
    v-if="uiStore.panelOpen && uiStore.narrow"
    class="absolute inset-0 z-[9] bg-[var(--ui-mask)]"
    @click="uiStore.closePanel()"
  />

  <div
    v-if="uiStore.panelOpen"
    class="pointer-events-none absolute inset-y-0 left-12 z-10 flex py-2 pr-2"
  >
    <section
      class="pointer-events-auto relative flex h-full flex-col overflow-hidden rounded-lg border border-ui-border backdrop-blur-sm"
      :class="resizing ? '' : 'transition-[width] duration-150'"
      :style="{
        width: uiStore.narrow ? 'min(320px, 78vw)' : `${uiStore.panelWidth}px`,
        background: 'var(--ui-surface-translucent)',
        boxShadow: 'var(--ui-shadow)',
      }"
      role="region"
      :aria-label="`${title}面板`"
    >
      <header class="flex h-11 shrink-0 items-center justify-between border-b border-ui-border px-3">
        <h2 class="text-[13px] font-semibold text-ui-text">
          {{ title }}
        </h2>
        <button
          type="button"
          class="panel-close"
          aria-label="关闭面板"
          @click="uiStore.closePanel()"
        >
          <AppIcon
            name="close"
            :size="16"
          />
        </button>
      </header>

      <div class="min-h-0 flex-1">
        <LayerPanel v-if="uiStore.activePanel === 'layers'" />
        <BasemapPanel v-else-if="uiStore.activePanel === 'basemap'" />
        <VisualPanel v-else-if="uiStore.activePanel === 'visual'" />
        <ScenePanel v-else-if="uiStore.activePanel === 'scene'" />
      </div>

      <div
        v-if="!uiStore.narrow"
        class="absolute inset-y-0 right-0 w-1.5 cursor-col-resize touch-none hover:bg-[var(--ui-accent-soft)]"
        role="separator"
        aria-orientation="vertical"
        aria-label="调整面板宽度"
        @pointerdown="startResize"
      />
    </section>
  </div>
</template>

<style scoped>
.panel-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 4px;
  color: var(--ui-text-2);
  background: transparent;
  cursor: pointer;
}

.panel-close:hover {
  color: var(--ui-text-1);
  background: var(--ui-hover);
}
</style>
