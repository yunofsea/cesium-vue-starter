<script setup lang="ts">
import AppIcon from '@/components/base/AppIcon.vue'
import type { IconName } from '@/data/icons'
import { useUiStore, type PanelId } from '@/stores/ui'

const uiStore = useUiStore()

const items: { id: PanelId; label: string; icon: IconName }[] = [
  { id: 'layers', label: '图层', icon: 'layers' },
  { id: 'basemap', label: '底图', icon: 'basemap' },
  { id: 'visual', label: '可视化', icon: 'visualize' },
  { id: 'scene', label: '场景', icon: 'scene' },
]
</script>

<template>
  <nav
    class="pointer-events-auto absolute inset-y-0 left-0 z-10 flex w-12 flex-col items-center gap-1 border-r border-ui-border bg-ui-rail py-2"
    aria-label="工具面板"
  >
    <el-tooltip
      v-for="item in items"
      :key="item.id"
      :content="item.label"
      placement="right"
      :show-after="300"
    >
      <button
        type="button"
        class="rail-button"
        :class="{ 'is-active': uiStore.panelOpen && uiStore.activePanel === item.id }"
        :aria-label="item.label"
        :aria-expanded="uiStore.panelOpen && uiStore.activePanel === item.id"
        @click="uiStore.togglePanel(item.id)"
      >
        <AppIcon
          :name="item.icon"
          :size="20"
        />
      </button>
    </el-tooltip>
  </nav>
</template>

<style scoped>
.rail-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 8px;
  color: var(--ui-text-2);
  background: transparent;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}

.rail-button:hover {
  color: var(--ui-text-1);
  background: var(--ui-hover);
}

.rail-button.is-active {
  color: var(--ui-accent);
  background: var(--ui-accent-soft);
}

.rail-button.is-active::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  border-radius: 2px;
  background: var(--ui-accent);
}
</style>
