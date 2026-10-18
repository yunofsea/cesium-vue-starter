import type { InjectionKey } from 'vue'

/** 由 AppShell 创建，CesiumViewer 用于挂载版权信息，StatusBar 负责在页面中定位它 */
export const creditContainerKey: InjectionKey<HTMLElement> = Symbol('cesiumCreditContainer')
