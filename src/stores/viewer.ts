/*
 * @Author: haiyun 11326211+denghuolanshantrue@user.noreply.gitee.com
 * @Date: 2026-10-17 09:26:50
 * @LastEditors: haiyun 11326211+denghuolanshantrue@user.noreply.gitee.com
 * @LastEditTime: 2026-10-17 09:27:05
 * @FilePath: \cesium-vue-project\src\stores\viewer.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'
import type { Viewer } from 'cesium'

export const useViewerStore = defineStore('viewer', {
  state: () => ({
    viewer: null as Viewer | null,
  }),

  actions: {
    setViewer(viewer: Viewer) {
      this.viewer = viewer
    },

    destroyViewer() {
      if (this.viewer && !this.viewer.isDestroyed()) {
        this.viewer.destroy()
      }

      this.viewer = null
    },
  },
})