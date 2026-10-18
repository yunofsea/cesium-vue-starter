<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

import { iconNames, type IconName } from '@/data/icons'

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: number | string
  }>(),
  { size: 16 },
)

const icon = computed(() => iconNames[props.name])
</script>

<template>
  <Icon
    :icon="icon"
    :width="size"
    :height="size"
    class="shrink-0"
    aria-hidden="true"
  />
</template>
