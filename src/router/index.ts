/*
 * @Author: haiyun 11326211+denghuolanshantrue@user.noreply.gitee.com
 * @Date: 2026-10-17 09:28:31
 * @LastEditors: haiyun 11326211+denghuolanshantrue@user.noreply.gitee.com
 * @LastEditTime: 2026-10-17 09:28:38
 * @FilePath: \cesium-vue-project\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
  ],
})

export default router