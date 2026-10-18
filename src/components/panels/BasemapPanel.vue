<script setup lang="ts">
import { ElMessage } from 'element-plus'

import AppIcon from '@/components/base/AppIcon.vue'
import { basemapOptions, useSceneStore, type BasemapId } from '@/stores/scene'

const sceneStore = useSceneStore()

async function select(id: BasemapId) {
  const option = basemapOptions.find((entry) => entry.id === id)
  if (!option) return

  if (option.requiresToken && !sceneStore.ionAvailable) {
    ElMessage.warning('请先在 .env 中配置 VITE_CESIUM_ION_TOKEN')
    return
  }

  try {
    await sceneStore.applyBasemap(id)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '底图切换失败')
  }
}
</script>

<template>
  <div class="ui-scroll h-full overflow-y-auto p-3">
    <div class="grid gap-2">
      <button
        v-for="option in basemapOptions"
        :key="option.id"
        type="button"
        class="basemap-option"
        :class="{
          'is-active': option.id === sceneStore.basemap,
          'is-disabled': option.requiresToken && !sceneStore.ionAvailable,
        }"
        :disabled="option.requiresToken && !sceneStore.ionAvailable"
        :aria-pressed="option.id === sceneStore.basemap"
        @click="select(option.id)"
      >
        <span
          class="basemap-swatch"
          :style="{ background: option.preview }"
        />
        <span class="min-w-0 flex-1 text-left">
          <span class="block text-[12px] text-ui-text">{{ option.name }}</span>
          <span class="block text-[11px] text-ui-muted">
            {{ option.requiresToken && !sceneStore.ionAvailable ? '需要配置 VITE_CESIUM_ION_TOKEN' : option.description }}
          </span>
        </span>
        <AppIcon
          v-if="option.id === sceneStore.basemap"
          name="check"
          :size="16"
          class="text-ui-accent"
        />
      </button>
    </div>

    <p
      v-if="sceneStore.basemapLoading"
      class="mt-3 text-[11px] text-ui-muted"
      role="status"
    >
      正在加载底图…
    </p>

    <p class="mt-3 text-[11px] leading-relaxed text-ui-muted">
      离线底图随应用分发，不需要网络与访问令牌；在线底图依赖外部服务可用性。
    </p>
  </div>
</template>

<style scoped>
.basemap-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
}

.basemap-option:hover:not(:disabled) {
  border-color: var(--ui-control-border);
  background: var(--ui-hover);
}

.basemap-option.is-active {
  border-color: var(--ui-accent);
  background: var(--ui-accent-soft);
}

.basemap-option.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.basemap-swatch {
  width: 44px;
  height: 32px;
  border: 1px solid var(--ui-border);
  border-radius: 4px;
  flex-shrink: 0;
}
</style>
