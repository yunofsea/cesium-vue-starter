/*
 * @Author: haiyun 11326211+denghuolanshantrue@user.noreply.gitee.com
 * @Date: 2026-10-17 00:08:32
 * @LastEditors: haiyun 11326211+denghuolanshantrue@user.noreply.gitee.com
 * @LastEditTime: 2026-10-17 09:25:51
 * @FilePath: \cesium-vue-project\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import App from './App.vue'
import router from './router'
import { registerIcons } from './data/icons'
import './styles/index.css'

registerIcons()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')