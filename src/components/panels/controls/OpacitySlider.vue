<script setup lang="ts">
defineProps<{ modelValue: number }>()

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <div>
    <div class="mb-1 flex items-center justify-between text-[11px] text-ui-muted">
      <span>透明度</span>
      <span class="tabular-nums text-ui-text">{{ modelValue }}%</span>
    </div>
    <el-slider
      :model-value="modelValue"
      :min="0"
      :max="100"
      :show-tooltip="false"
      @update:model-value="emit('update:modelValue', Number($event))"
    />
  </div>
</template>
