<script setup lang="ts">
import AppIcon from '@/components/base/AppIcon.vue'
import type { IconName } from '@/data/icons'
import type { ToolDropdownItem } from '@/types/toolbar'

defineProps<{
  icon: IconName
  label: string
  items: ToolDropdownItem[]
  disabled?: boolean
}>()

const emit = defineEmits<{ select: [id: string] }>()

function handleCommand(command: string | number | object) {
  emit('select', String(command))
}
</script>

<template>
  <el-dropdown
    trigger="click"
    :disabled="disabled"
    @command="handleCommand"
  >
    <button
      type="button"
      class="tool-button"
      :disabled="disabled"
      :aria-label="label"
    >
      <AppIcon
        :name="icon"
        :size="18"
      />
      <span class="tool-button__label">{{ label }}</span>
      <AppIcon
        name="chevronDown"
        :size="14"
      />
    </button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in items"
          :key="item.id"
          :command="item.id"
          :disabled="item.disabled"
        >
          <span class="dropdown-item">
            <AppIcon
              v-if="item.icon"
              :name="item.icon"
              :size="16"
            />
            <span>{{ item.label }}</span>
            <span
              v-if="item.hint"
              class="dropdown-hint"
            >{{ item.hint }}</span>
            <AppIcon
              v-if="item.active"
              name="check"
              :size="14"
            />
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 190px;
}

.dropdown-hint {
  margin-left: auto;
  font-size: 11px;
  color: var(--ui-text-2);
}
</style>
