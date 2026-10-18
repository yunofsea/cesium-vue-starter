<script setup lang="ts">
import { colorRamps, rampGradient } from '@/data/colormaps'

defineProps<{ modelValue: string }>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="grid grid-cols-2 gap-1.5">
    <button
      v-for="ramp in colorRamps"
      :key="ramp.id"
      type="button"
      class="ramp-option"
      :class="{ 'is-active': ramp.id === modelValue }"
      :aria-pressed="ramp.id === modelValue"
      :aria-label="`色带 ${ramp.name}`"
      @click="emit('update:modelValue', ramp.id)"
    >
      <span
        class="ramp-swatch"
        :style="{ background: rampGradient(ramp.id) }"
      />
      <span class="text-[11px] text-ui-text">{{ ramp.name }}</span>
    </button>
  </div>
</template>

<style scoped>
.ramp-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 5px;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
}

.ramp-option:hover {
  border-color: var(--ui-control-border);
}

.ramp-option.is-active {
  border-color: var(--ui-accent);
  box-shadow: 0 0 0 1px var(--ui-accent);
}

.ramp-swatch {
  display: block;
  height: 10px;
  border-radius: 3px;
}
</style>
