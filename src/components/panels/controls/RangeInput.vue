<script setup lang="ts">
defineProps<{
  min: number
  max: number
  unit: string
  error: string
}>()

const emit = defineEmits<{
  'update:min': [value: number]
  'update:max': [value: number]
  commit: []
}>()

function readNumber(event: Event): number {
  return Number((event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="space-y-1.5">
    <div class="flex items-end gap-2">
      <label class="flex-1">
        <span class="mb-1 block text-[11px] text-ui-muted">最小值</span>
        <input
          class="range-input"
          type="number"
          :value="min"
          @input="emit('update:min', readNumber($event))"
          @change="emit('commit')"
        >
      </label>
      <label class="flex-1">
        <span class="mb-1 block text-[11px] text-ui-muted">最大值</span>
        <input
          class="range-input"
          type="number"
          :value="max"
          @input="emit('update:max', readNumber($event))"
          @change="emit('commit')"
        >
      </label>
      <span
        v-if="unit"
        class="pb-1.5 text-[11px] text-ui-muted"
      >{{ unit }}</span>
    </div>
    <p
      v-if="error"
      class="text-[11px] text-[var(--ui-danger)]"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.range-input {
  width: 100%;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--ui-control-border);
  border-radius: 5px;
  color: var(--ui-text-1);
  background: var(--ui-surface);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  outline: none;
}

.range-input:focus {
  border-color: var(--ui-accent);
  box-shadow: 0 0 0 2px var(--ui-accent-soft);
}
</style>
