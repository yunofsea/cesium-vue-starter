import { onBeforeUnmount, ref, watch } from 'vue'

import { useViewerStore } from '@/stores/viewer'

/** 统计每秒渲染帧数，刷新间隔固定为 1 秒 */
export function useFps() {
  const viewerStore = useViewerStore()
  const fps = ref(0)

  let frames = 0
  let lastSample = 0
  let timer: number | undefined
  let removeListener: (() => void) | undefined

  function detach() {
    removeListener?.()
    removeListener = undefined

    if (timer !== undefined) {
      window.clearInterval(timer)
      timer = undefined
    }

    fps.value = 0
  }

  function attach() {
    const viewer = viewerStore.viewer
    if (!viewer) return

    frames = 0
    lastSample = performance.now()

    removeListener = viewer.scene.postRender.addEventListener(() => {
      frames += 1
    })

    timer = window.setInterval(() => {
      const now = performance.now()
      const elapsed = (now - lastSample) / 1000

      if (elapsed > 0) fps.value = Math.round(frames / elapsed)

      frames = 0
      lastSample = now
    }, 1000)
  }

  watch(
    () => viewerStore.viewer,
    (viewer) => {
      detach()
      if (viewer) attach()
    },
    { immediate: true },
  )

  onBeforeUnmount(detach)

  return { fps }
}
