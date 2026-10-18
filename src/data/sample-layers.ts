import type { LayerItem } from '@/types/layers'

/**
 * 示例图层：仅用于展示面板交互，不参与渲染。
 * 接入真实数据后可直接删除本文件及其引用。
 */
export function createSampleLayers(): LayerItem[] {
  return [
    {
      id: 'sample-imagery',
      name: '影像底图（示例）',
      kind: 'imagery',
      visible: true,
      opacity: 1,
      style: { ramp: 'viridis', min: 0, max: 255, unit: '' },
      initialStyle: { ramp: 'viridis', min: 0, max: 255, unit: '' },
      initialOpacity: 1,
    },
    {
      id: 'sample-terrain',
      name: '地形（示例）',
      kind: 'terrain',
      visible: true,
      opacity: 1,
      style: { ramp: 'grayscale', min: 0, max: 8000, unit: 'm' },
      initialStyle: { ramp: 'grayscale', min: 0, max: 8000, unit: 'm' },
      initialOpacity: 1,
    },
    {
      id: 'sample-vector',
      name: '测点矢量（示例）',
      kind: 'geojson',
      visible: true,
      opacity: 0.9,
      style: { ramp: 'plasma', min: 0, max: 1, unit: 'pcs' },
      initialStyle: { ramp: 'plasma', min: 0, max: 1, unit: 'pcs' },
      initialOpacity: 0.9,
    },
    {
      id: 'sample-wind',
      name: '风场 2026-10-17（示例）',
      kind: 'wind',
      visible: true,
      opacity: 0.85,
      extent: { west: 100, south: 20, east: 130, north: 45 },
      style: { ramp: 'turbo', min: 0, max: 25, unit: 'm/s' },
      initialStyle: { ramp: 'turbo', min: 0, max: 25, unit: 'm/s' },
      initialOpacity: 0.85,
    },
  ]
}
