<!--
 * @Author: haiyun 11326211+denghuolanshantrue@user.noreply.gitee.com
 * @Date: 2026-10-17 09:27:38
 * @LastEditors: haiyun 11326211+denghuolanshantrue@user.noreply.gitee.com
 * @LastEditTime: 2026-10-17 10:03:31
 * @FilePath: \cesium-vue-project\src\components\cesium\CesiumViewer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { Viewer } from 'cesium'

import 'cesium/Build/Cesium/Widgets/widgets.css'

import { creditContainerKey } from '@/components/layout/credit'
import { applySharedView } from '@/composables/useCameraTools'
import { useSceneStore } from '@/stores/scene'
import { useViewerStore } from '@/stores/viewer'

const container = ref<HTMLElement | null>(null)
const creditContainer = inject(creditContainerKey, null)

const viewerStore = useViewerStore()
const sceneStore = useSceneStore()

let viewer: Viewer | undefined

onMounted(async () => {
  if (!container.value) return

  // 如果使用 Cesium ion token，可在此设置；底图面板会按需读取环境变量
  // Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN

  viewer = new Viewer(container.value, {
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
    // 由底图面板接管底图，避免加载默认的 Ion 影像
    baseLayer: false,
    ...(creditContainer ? { creditContainer } : {}),
  })

  viewerStore.setViewer(viewer)
  sceneStore.bindViewer(viewer)

  if (!applySharedView(viewer)) viewer.camera.flyHome(0)

  try {
    await sceneStore.applyBasemap(sceneStore.basemap)
  } catch (error) {
    console.warn('[CesiumViewer] 初始底图加载失败：', error)
  }
})

onBeforeUnmount(() => {
  sceneStore.unbindViewer()
  viewerStore.destroyViewer()
  viewer = undefined
})
</script>

<template>
  <div
    ref="container"
    class="h-full w-full"
  />
</template>