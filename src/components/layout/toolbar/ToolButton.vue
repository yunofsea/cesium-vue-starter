<script setup lang="ts">
import AppIcon from '@/components/base/AppIcon.vue'
import type { IconName } from '@/data/icons'

withDefaults(
  defineProps<{
    icon: IconName
    label: string
    active?: boolean
    disabled?: boolean
    shortcut?: string
  }>(),
  { shortcut: '' },
)

// el-tooltip 是组件根节点，外部 @click 不会自动落到内部 button 上
const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <el-tooltip
    :content="shortcut ? `${label}（${shortcut}）` : label"
    placement="bottom"
    :show-after="300"
    :disabled="disabled"
  >
    <button
      type="button"
      class="tool-button"
      :class="{ 'is-active': active }"
      :disabled="disabled"
      :aria-label="label"
      :aria-pressed="active"
      @click="emit('click')"
    >
      <AppIcon
        :name="icon"
        :size="18"
      />
      <span class="tool-button__label">{{ label }}</span>
    </button>
  </el-tooltip>
</template>
