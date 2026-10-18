<script setup lang="ts">
import { computed } from 'vue'

import AppIcon from '@/components/base/AppIcon.vue'
import { sceneModeOptions, useSceneStore } from '@/stores/scene'

const sceneStore = useSceneStore()

const lightTimeText = computed(() => {
  const hour = Math.round(sceneStore.lightHour)
  return `${String(hour).padStart(2, '0')}:00`
})
</script>

<template>
  <div class="ui-scroll h-full space-y-5 overflow-y-auto p-3">
    <section>
      <h3 class="section-title">
        场景模式
      </h3>
      <div class="grid grid-cols-3 gap-1.5">
        <button
          v-for="mode in sceneModeOptions"
          :key="mode.id"
          type="button"
          class="mode-option"
          :class="{ 'is-active': sceneStore.sceneMode === mode.id }"
          :aria-pressed="sceneStore.sceneMode === mode.id"
          @click="sceneStore.setSceneMode(mode.id)"
        >
          <AppIcon
            :name="mode.icon"
            :size="18"
          />
          <span class="text-[11px]">{{ mode.name }}</span>
        </button>
      </div>
    </section>

    <section class="space-y-2">
      <h3 class="section-title">
        光照
      </h3>
      <label class="switch-row">
        <span>开启阴影</span>
        <el-switch
          :model-value="sceneStore.shadows"
          @update:model-value="sceneStore.setShadows($event as boolean)"
        />
      </label>

      <div :class="{ 'opacity-50': !sceneStore.shadows }">
        <div class="mb-1 flex items-center justify-between text-[11px] text-ui-muted">
          <span>光照时间</span>
          <span class="tabular-nums text-ui-text">{{ lightTimeText }}</span>
        </div>
        <el-slider
          :model-value="sceneStore.lightHour"
          :min="0"
          :max="24"
          :step="1"
          :show-tooltip="false"
          :disabled="!sceneStore.shadows"
          @update:model-value="sceneStore.setLightHour(Number($event))"
        />
      </div>
    </section>

    <section class="space-y-2">
      <h3 class="section-title">
        大气与雾
      </h3>
      <label class="switch-row">
        <span>大气</span>
        <el-switch
          :model-value="sceneStore.atmosphere"
          @update:model-value="sceneStore.setAtmosphere($event as boolean)"
        />
      </label>
      <label class="switch-row">
        <span>雾</span>
        <el-switch
          :model-value="sceneStore.fog"
          @update:model-value="sceneStore.setFog($event as boolean)"
        />
      </label>
    </section>

    <section>
      <h3 class="section-title">
        地形
      </h3>
      <div class="mb-1 flex items-center justify-between text-[11px] text-ui-muted">
        <span>地形夸张</span>
        <span class="tabular-nums text-ui-text">{{ sceneStore.terrainExaggeration }}×</span>
      </div>
      <el-slider
        :model-value="sceneStore.terrainExaggeration"
        :min="1"
        :max="5"
        :step="0.5"
        :show-tooltip="false"
        @update:model-value="sceneStore.setTerrainExaggeration(Number($event))"
      />
      <p class="mt-1 text-[11px] leading-relaxed text-ui-muted">
        本版本仅保存该设置，不改变地形渲染结果。
      </p>
    </section>
  </div>
</template>

<style scoped>
.section-title {
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--ui-text-2);
}

.mode-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 2px;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  color: var(--ui-text-2);
  background: transparent;
  cursor: pointer;
}

.mode-option:hover {
  border-color: var(--ui-control-border);
  background: var(--ui-hover);
}

.mode-option.is-active {
  border-color: var(--ui-accent);
  color: var(--ui-accent);
  background: var(--ui-accent-soft);
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ui-text-1);
}
</style>
