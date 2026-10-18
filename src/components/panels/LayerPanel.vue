<script setup lang="ts">
import { computed, ref } from 'vue'
import { Rectangle } from 'cesium'

import AppIcon from '@/components/base/AppIcon.vue'
import type { IconName } from '@/data/icons'
import { useLayersStore } from '@/stores/layers'
import { useViewerStore } from '@/stores/viewer'
import type { LayerExtent, LayerItem, LayerKind } from '@/types/layers'

const layersStore = useLayersStore()
const viewerStore = useViewerStore()

const kindIcons: Record<LayerKind, IconName> = {
  imagery: 'kindImagery',
  terrain: 'kindTerrain',
  tileset: 'kindTileset',
  geojson: 'kindGeojson',
  model: 'kindModel',
  wind: 'kindWind',
}

const fileInput = ref<HTMLInputElement | null>(null)
const addMode = ref<'none' | 'url'>('none')
const urlValue = ref('')
const urlError = ref('')
const draggingId = ref<string | null>(null)
const dropIndex = ref<number | null>(null)

const isFiltering = computed(() => layersStore.query.trim().length > 0)
const showEmpty = computed(() => layersStore.items.length === 0)
const showNoResults = computed(
  () => !showEmpty.value && layersStore.filteredItems.length === 0,
)

function kindFromName(name: string): LayerKind {
  const extension = name.split('.').pop()?.toLowerCase() ?? ''
  if (extension === 'geojson' || extension === 'json') return 'geojson'
  if (extension === 'glb' || extension === 'gltf') return 'model'
  if (['png', 'jpg', 'jpeg', 'webp'].includes(extension)) return 'imagery'
  return 'tileset'
}

function openFilePicker() {
  fileInput.value?.click()
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  layersStore.addLayer({
    name: file.name,
    kind: kindFromName(file.name),
    source: `file:${file.name}`,
  })
}

function toggleUrlForm() {
  addMode.value = addMode.value === 'url' ? 'none' : 'url'
  urlError.value = ''
}

function submitUrl() {
  const value = urlValue.value.trim()

  if (!value) {
    urlError.value = '请输入地址'
    return
  }

  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    urlError.value = '地址格式不正确'
    return
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    urlError.value = '仅支持 http 或 https 地址'
    return
  }

  const lastSegment = parsed.pathname.split('/').filter(Boolean).pop()
  const name = lastSegment ? decodeURIComponent(lastSegment) : parsed.hostname

  layersStore.addLayer({ name, kind: 'tileset', source: value })
  urlValue.value = ''
  urlError.value = ''
  addMode.value = 'none'
}

let sampleCount = 0

function addSampleLayer() {
  sampleCount += 1
  layersStore.addLayer({
    name: `风场示例 ${sampleCount}`,
    kind: 'wind',
    extent: { west: 100, south: 20, east: 130, north: 45 },
    style: { ramp: 'turbo', min: 0, max: 25, unit: 'm/s' },
  })
}

function onDragStart(id: string, event: DragEvent) {
  if (isFiltering.value) return

  draggingId.value = id
  event.dataTransfer?.setData('text/plain', id)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function onDragOver(index: number, event: DragEvent) {
  if (isFiltering.value) return

  event.preventDefault()
  dropIndex.value = index
}

function onDrop(index: number, event: DragEvent) {
  event.preventDefault()

  const id = draggingId.value ?? event.dataTransfer?.getData('text/plain')
  if (id) layersStore.moveLayer(id, index)

  onDragEnd()
}

function onDragEnd() {
  draggingId.value = null
  dropIndex.value = null
}

function locate(extent: LayerExtent) {
  const viewer = viewerStore.viewer
  if (!viewer) return

  viewer.camera.flyTo({
    destination: Rectangle.fromDegrees(extent.west, extent.south, extent.east, extent.north),
    duration: 1.8,
  })
}

function handleCommand(command: string | number | object, layer: LayerItem) {
  const value = String(command)

  if (value === 'delete') layersStore.removeLayer(layer.id)
  if (value === 'locate' && layer.extent) locate(layer.extent)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="shrink-0 border-b border-ui-border p-2">
      <label class="search-box">
        <AppIcon
          name="search"
          :size="15"
        />
        <input
          type="search"
          :value="layersStore.query"
          placeholder="搜索图层"
          aria-label="搜索图层"
          @input="layersStore.setQuery(($event.target as HTMLInputElement).value)"
        >
      </label>
    </div>

    <ul
      v-if="layersStore.filteredItems.length"
      class="ui-scroll min-h-0 flex-1 space-y-1 overflow-y-auto p-2"
      aria-label="图层列表"
    >
      <li
        v-for="(layer, index) in layersStore.filteredItems"
        :key="layer.id"
        class="layer-row"
        :class="{
          'is-selected': layer.id === layersStore.selectedId,
          'is-hidden': !layer.visible,
          'is-drop-target': dropIndex === index,
        }"
        :draggable="!isFiltering"
        @click="layersStore.select(layer.id)"
        @dragstart="onDragStart(layer.id, $event)"
        @dragover="onDragOver(index, $event)"
        @drop="onDrop(index, $event)"
        @dragend="onDragEnd"
      >
        <span
          class="drag-handle"
          :class="{ 'is-disabled': isFiltering }"
          title="拖动排序"
        >
          <AppIcon
            name="drag"
            :size="14"
          />
        </span>

        <AppIcon
          :name="kindIcons[layer.kind]"
          :size="16"
          class="layer-kind"
        />

        <span
          class="layer-name"
          :title="layer.name"
        >{{ layer.name }}</span>

        <button
          type="button"
          class="row-action"
          :aria-label="layer.visible ? `隐藏 ${layer.name}` : `显示 ${layer.name}`"
          @click.stop="layersStore.toggleVisible(layer.id)"
        >
          <AppIcon
            :name="layer.visible ? 'eye' : 'eyeOff'"
            :size="15"
          />
        </button>

        <el-dropdown
          trigger="click"
          @command="handleCommand($event, layer)"
        >
          <button
            type="button"
            class="row-action"
            aria-label="更多操作"
            @click.stop
          >
            <AppIcon
              name="menu"
              :size="15"
            />
          </button>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-if="layer.extent"
                command="locate"
              >
                <span class="menu-item"><AppIcon
                  name="locate"
                  :size="14"
                />定位</span>
              </el-dropdown-item>
              <el-dropdown-item command="delete">
                <span class="menu-item"><AppIcon
                  name="trash"
                  :size="14"
                />删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
    </ul>

    <div
      v-else
      class="flex min-h-0 flex-1 flex-col items-center justify-center gap-1 p-4 text-center text-[12px] text-ui-muted"
    >
      <AppIcon
        :name="showEmpty ? 'layers' : 'search'"
        :size="28"
      />
      <p v-if="showEmpty">还没有图层，从下方添加第一个图层。</p>
      <p v-else>没有匹配的图层。</p>
      <p
        v-if="showNoResults"
        class="text-[11px]"
      >
        搜索内容保持不变。
      </p>
    </div>

    <div class="shrink-0 border-t border-ui-border p-2">
      <div
        v-if="layersStore.pendingDeletion"
        class="undo-bar"
      >
        <span class="min-w-0 truncate">已删除「{{ layersStore.pendingDeletion.layer.name }}」</span>
        <button
          type="button"
          class="undo-action"
          @click="layersStore.undoRemove()"
        >
          撤销
        </button>
      </div>

      <div
        v-if="addMode === 'url'"
        class="mb-2"
      >
        <input
          v-model="urlValue"
          class="url-input"
          type="url"
          placeholder="https://example.com/tileset.json"
          aria-label="图层地址"
          @keyup.enter="submitUrl"
        >
        <p
          v-if="urlError"
          class="mt-1 text-[11px] text-[var(--ui-danger)]"
          role="alert"
        >
          {{ urlError }}
        </p>
        <div class="mt-1.5 flex gap-1.5">
          <el-button
            size="small"
            type="primary"
            @click="submitUrl"
          >
            确定
          </el-button>
          <el-button
            size="small"
            @click="addMode = 'none'"
          >
            取消
          </el-button>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-1.5">
        <button
          type="button"
          class="add-button"
          @click="openFilePicker"
        >
          <AppIcon
            name="kindModel"
            :size="15"
          />文件
        </button>
        <button
          type="button"
          class="add-button"
          :class="{ 'is-active': addMode === 'url' }"
          @click="toggleUrlForm"
        >
          <AppIcon
            name="share"
            :size="15"
          />URL
        </button>
        <button
          type="button"
          class="add-button"
          @click="addSampleLayer"
        >
          <AppIcon
            name="kindWind"
            :size="15"
          />示例
        </button>
      </div>

      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept=".json,.geojson,.glb,.gltf,.png,.jpg,.jpeg,.webp"
        @change="onFileChange"
      >
    </div>
  </div>
</template>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--ui-control-border);
  border-radius: 5px;
  color: var(--ui-text-2);
  background: var(--ui-surface);
}

.search-box input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  color: var(--ui-text-1);
  background: transparent;
  font-size: 12px;
}

.layer-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 6px;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
}

.layer-row:hover {
  background: var(--ui-hover);
}

.layer-row.is-selected {
  border-color: var(--ui-accent);
  background: var(--ui-accent-soft);
}

.layer-row.is-hidden .layer-name,
.layer-row.is-hidden .layer-kind {
  opacity: 0.45;
}

.layer-row.is-drop-target {
  box-shadow: inset 0 2px 0 var(--ui-accent);
}

.drag-handle {
  display: inline-flex;
  color: var(--ui-text-2);
  opacity: 0.5;
  cursor: grab;
}

.drag-handle.is-disabled {
  cursor: not-allowed;
  opacity: 0.25;
}

.layer-kind {
  color: var(--ui-text-2);
}

.layer-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--ui-text-1);
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.row-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 4px;
  color: var(--ui-text-2);
  background: transparent;
  cursor: pointer;
}

.row-action:hover {
  color: var(--ui-text-1);
  background: var(--ui-hover);
}

.menu-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.undo-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  padding: 6px 8px;
  border-radius: 5px;
  background: var(--ui-accent-soft);
  color: var(--ui-text-1);
  font-size: 11px;
}

.undo-action {
  border: 0;
  color: var(--ui-accent);
  background: transparent;
  font-size: 11px;
  cursor: pointer;
}

.add-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 30px;
  border: 1px solid var(--ui-border);
  border-radius: 5px;
  color: var(--ui-text-1);
  background: transparent;
  font-size: 11px;
  cursor: pointer;
}

.add-button:hover {
  border-color: var(--ui-control-border);
  background: var(--ui-hover);
}

.add-button.is-active {
  border-color: var(--ui-accent);
  color: var(--ui-accent);
  background: var(--ui-accent-soft);
}

.url-input {
  width: 100%;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--ui-control-border);
  border-radius: 5px;
  color: var(--ui-text-1);
  background: var(--ui-surface);
  font-size: 12px;
  outline: none;
}

.url-input:focus {
  border-color: var(--ui-accent);
  box-shadow: 0 0 0 2px var(--ui-accent-soft);
}
</style>
