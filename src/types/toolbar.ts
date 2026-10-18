import type { IconName } from '@/data/icons'

export interface ToolDropdownItem {
  id: string
  label: string
  icon?: IconName
  active?: boolean
  disabled?: boolean
  hint?: string
}
