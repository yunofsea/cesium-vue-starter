<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  Cartographic,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  type Viewer,
} from 'cesium'

import { creditContainerKey } from './credit'
import { useFps } from '@/composables/useFps'
import { useSceneStore } from '@/stores/scene'
import { useViewerStore } from '@/stores/viewer'

const viewerStore = useViewerStore()
const sceneStore = useSceneStore()
const { fps } = useFps()

const creditElement = inject(creditContainerKey, null)
const creditSlot = ref<HTMLElement | null>(null)

const longitude = ref<number | null>(null)
const latitude = ref<number | null>(null)
const cameraHeight = ref<number | null>(null)

let pointerHandler: ScreenSpaceEventHandler | null = null
let removeCameraListener: (() => void) | null = null

function detach() {
  pointerHandler?.destroy()
  pointerHandler = null

  removeCameraListener?.()
  removeCameraListener = null

  longitude.value = null
  latitude.value = null
  cameraHeight.value = null
}

function attach(viewer: Viewer) {
  detach()

  const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((event: ScreenSpaceEventHandler.MotionEvent) => {
    const cartesian = viewer.camera.pickEllipsoid(event.endPosition, viewer.scene.globe.ellipsoid)

    if (!defined(cartesian)) {
      longitude.value = null
      latitude.value = null
      return
    }

    const cartographic = Cartographic.fromCartesian(cartesian)
    longitude.value = CesiumMath.toDegrees(cartographic.longitude)
    latitude.value = CesiumMath.toDegrees(cartographic.latitude)
  }, ScreenSpaceEventType.MOUSE_MOVE)
  pointerHandler = handler

  const updateHeight = () => {
    cameraHeight.value = viewer.camera.positionCartographic.height
  }

  removeCameraListener = viewer.camera.changed.addEventListener(updateHeight)
  updateHeight()
}

watch(
  () => viewerStore.viewer,
  (viewer) => {
    detach()
    if (viewer) attach(viewer)
  },
  { immediate: true },
)

onMounted(() => {
  if (creditElement && creditSlot.value && creditElement.parentElement !== creditSlot.value) {
    creditSlot.value.appendChild(creditElement)
  }
})

onBeforeUnmount(detach)

const longitudeText = computed(() => {
  if (longitude.value === null) return '--'
  const suffix = longitude.value >= 0 ? 'E' : 'W'
  return `${Math.abs(longitude.value).toFixed(5)}° ${suffix}`
})

const latitudeText = computed(() => {
  if (latitude.value === null) return '--'
  const suffix = latitude.value >= 0 ? 'N' : 'S'
  return `${Math.abs(latitude.value).toFixed(5)}° ${suffix}`
})

const heightText = computed(() => {
  if (cameraHeight.value === null) return '--'
  if (cameraHeight.value >= 1000) return `${(cameraHeight.value / 1000).toFixed(1)} km`
  return `${cameraHeight.value.toFixed(0)} m`
})

const sceneModeText = computed(() =>
  sceneStore.sceneMode === 'COLUMBUS' ? 'Columbus' : sceneStore.sceneMode,
)
</script>

<template>
  <footer
    class="flex h-6 items-center gap-3 border-t border-ui-border bg-ui-status px-3 text-[11px] text-ui-muted"
  >
    <span class="tabular-nums">经度 {{ longitudeText }}</span>
    <span class="tabular-nums">纬度 {{ latitudeText }}</span>
    <span class="h-3 w-px shrink-0 bg-ui-border" />
    <span class="tabular-nums">高度 {{ heightText }}</span>
    <span class="h-3 w-px shrink-0 bg-ui-border" />
    <span>{{ sceneModeText }}</span>
    <span class="h-3 w-px shrink-0 bg-ui-border" />
    <span class="tabular-nums">{{ fps }} fps</span>

    <div class="ml-auto flex min-w-0 items-center justify-end overflow-hidden pl-3">
      <div
        ref="creditSlot"
        class="min-w-0 overflow-hidden"
      />
    </div>
  </footer>
</template>
