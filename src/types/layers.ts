export type LayerKind = 'imagery' | 'terrain' | 'tileset' | 'geojson' | 'model' | 'wind'

export interface LayerExtent {
  west: number
  south: number
  east: number
  north: number
}

export interface LayerStyle {
  ramp: string
  min: number
  max: number
  unit: string
}

export interface LayerItem {
  id: string
  name: string
  kind: LayerKind
  visible: boolean
  /** 0..1 */
  opacity: number
  extent?: LayerExtent
  source?: string
  style: LayerStyle
  /** 创建时的快照，用于「重置外观」 */
  initialStyle: LayerStyle
  initialOpacity: number
}

export interface LayerDraft {
  name: string
  kind: LayerKind
  source?: string
  extent?: LayerExtent
  style?: Partial<LayerStyle>
}
