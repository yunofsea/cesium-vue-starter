<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import AppIcon from '@/components/base/AppIcon.vue'
import ColorRampSelect from './controls/ColorRampSelect.vue'
import LegendPreview from './controls/LegendPreview.vue'
import OpacitySlider from './controls/OpacitySlider.vue'
import RangeInput from './controls/RangeInput.vue'
import { useLayersStore } from '@/stores/layers'
import type { LayerKind } from '@/types/layers'

const layersStore = useLayersStore()

const kindNames: Record<LayerKind, string> = {
  imagery: '影像',
  terrain: '地形',
  tileset: '3D Tiles',
  geojson: '矢量',
  model: '模型',
  wind: '风场',
}

const layer = computed(() => layersStore.selected)

const minValue = ref(0)
const maxValue = ref(100)
const rangeError = ref('')

watch(
  () => layer.value?.id,
  () => {
    const current = layer.value
    if (!current) return

    minValue.value = current.style.min
    maxValue.value = current.style.max
    rangeError.value = ''
  },
  { immediate: true },
)

const opacity = computed({
  get: () => Math.round((layer.value?.opacity ?? 1) * 100),
  set: (value: number) => {
    if (layer.value) layersStore.setOpacity(layer.value.id, value)
  },
})

const ramp = computed(() => layer.value?.style.ramp ?? 'viridis')

function setRamp(value: string) {
  if (layer.value) layersStore.setRamp(layer.value.id, value)
}

function commitRange() {
  const current = layer.value
  if (!current) return

  if (!Number.isFinite(minValue.value) || !Number.isFinite(maxValue.value)) {
    rangeError.value = '请输入有效数字'
    return
  }

  if (minValue.value >= maxValue.value) {
    rangeError.value = '最小值必须小于最大值'
    return
  }

  rangeError.value = ''
  layersStore.setRange(current.id, minValue.value, maxValue.value)
}

function resetStyle() {
  const current = layer.value
  if (!current) return

  layersStore.resetStyle(current.id)
  minValue.value = current.style.min
  maxValue.value = current.style.max
  rangeError.value = ''
}
</script>

<template>
  <div class="ui-scroll h-full overflow-y-auto p-3">
    <div
      v-if="!layer"
      class="flex h-full flex-col items-center justify-center gap-2 text-center text-[12px] text-ui-muted"
    >
      <AppIcon
        name="visualize"
        :size="28"
      />
      <p>先在「图层」中选择一个图层</p>
      <p class="text-[11px]">
        选中后可以调节透明度、色带与数值范围
      </p>
    </div>

    <div
      v-else
      class="space-y-4"
    >
      <div class="rounded-md border border-ui-border bg-ui-raised p-2">
        <p class="text-[12px] font-medium text-ui-text">
          {{ layer.name }}
        </p>
        <p class="text-[11px] text-ui-muted">
          类型：{{ kindNames[layer.kind] }}<span v-if="layer.source"> · {{ layer.source }}</span>
        </p>
      </div>

      <OpacitySlider v-model="opacity" />

      <section>
        <h3 class="section-title">
          色带
        </h3>
        <ColorRampSelect
          :model-value="ramp"
          @update:model-value="setRamp"
        />
      </section>

      <section>
        <h3 class="section-title">
          数值范围
        </h3>
        <RangeInput
          v-model:min="minValue"
          v-model:max="maxValue"
          :unit="layer.style.unit"
          :error="rangeError"
          @commit="commitRange"
        />
      </section>

      <LegendPreview
        :ramp="ramp"
        :min="layer.style.min"
        :max="layer.style.max"
        :unit="layer.style.unit"
      />

      <el-button
        size="small"
        class="w-full"
        @click="resetStyle"
      >
        <AppIcon
          name="reset"
          :size="14"
          class="mr-1"
        />重置外观
      </el-button>

      <p class="text-[11px] leading-relaxed text-ui-muted">
        本版本的外观参数仅作用于面板与图例，暂不改变地球渲染。
      </p>
    </div>
  </div>
</template>

<style scoped>
.section-title {
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--ui-text-2);
}
</style>
