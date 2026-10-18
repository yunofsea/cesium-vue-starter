<script setup lang="ts">
import { computed } from 'vue'

import { findColorRamp, rampGradient } from '@/data/colormaps'

const props = defineProps<{
  ramp: string
  min: number
  max: number
  unit: string
}>()

const gradient = computed(() => rampGradient(props.ramp))
const rampName = computed(() => findColorRamp(props.ramp).name)
</script>

<template>
  <div>
    <div class="mb-1 flex items-center justify-between text-[11px] text-ui-muted">
      <span>图例 · {{ rampName }}</span>
      <span v-if="unit">{{ unit }}</span>
    </div>
    <div
      class="h-3 w-full rounded-sm border border-ui-border"
      :style="{ background: gradient }"
      role="img"
      :aria-label="`色带图例，范围 ${min} 到 ${max} ${unit}`"
    />
    <div class="mt-1 flex justify-between text-[11px] tabular-nums text-ui-muted">
      <span>{{ min }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>
