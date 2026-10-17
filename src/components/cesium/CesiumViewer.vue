<!--
 * @Author: haiyun 11326211+denghuolanshantrue@user.noreply.gitee.com
 * @Date: 2026-10-17 09:27:38
 * @LastEditors: haiyun 11326211+denghuolanshantrue@user.noreply.gitee.com
 * @LastEditTime: 2026-10-17 10:03:31
 * @FilePath: \cesium-vue-project\src\components\cesium\CesiumViewer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import {
  Viewer
} from 'cesium'

import 'cesium/Build/Cesium/Widgets/widgets.css'

import { useViewerStore } from '@/stores/viewer'

const container = ref<HTMLElement | null>(null)

const viewerStore = useViewerStore()

let viewer: Viewer | undefined

onMounted(async () => {
  if (!container.value) return

  // 如果使用 Cesium ion token，可以在这里设置
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
  })

  viewerStore.setViewer(viewer)

  viewer.camera.flyHome(0)
})

onBeforeUnmount(() => {
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