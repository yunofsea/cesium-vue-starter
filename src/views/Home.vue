<!--
 * @Author: haiyun 11326211+denghuolanshantrue@user.noreply.gitee.com
 * @Date: 2026-10-17 09:28:49
 * @LastEditors: haiyun 11326211+denghuolanshantrue@user.noreply.gitee.com
 * @LastEditTime: 2026-10-17 09:28:57
 * @FilePath: \cesium-vue-project\src\components\Home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import CesiumViewer from '@/components/cesium/CesiumViewer.vue'
</script>

<template>
  <div class="relative h-full w-full overflow-hidden">
    <CesiumViewer />

    <!-- 左侧工具栏 -->
    <div
      class="absolute left-4 top-4 z-10 w-64"
    >
      <el-card shadow="always">
        <template #header>
          <div class="font-semibold">
            Cesium 工具
          </div>
        </template>

        <div class="flex flex-col gap-2">
          <el-button type="primary">
            添加模型
          </el-button>

          <el-button>
            加载 3D Tiles
          </el-button>

          <el-button>
            加载风场
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>