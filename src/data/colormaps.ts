export interface ColorRamp {
  id: string
  name: string
  stops: string[]
}

export const colorRamps: ColorRamp[] = [
  {
    id: 'viridis',
    name: 'Viridis',
    stops: ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'],
  },
  {
    id: 'plasma',
    name: 'Plasma',
    stops: ['#0d0887', '#6a00a8', '#b12a90', '#e16462', '#fca636', '#f0f921'],
  },
  {
    id: 'turbo',
    name: 'Turbo',
    stops: ['#30123b', '#4145ab', '#1ae4b6', '#a2fc3c', '#f9ba38', '#e34a33', '#7a0403'],
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    stops: ['#1a1a1a', '#4d4d4d', '#808080', '#b3b3b3', '#e6e6e6', '#ffffff'],
  },
]

export const defaultRampId = colorRamps[0].id

export function findColorRamp(id: string): ColorRamp {
  return colorRamps.find((ramp) => ramp.id === id) ?? colorRamps[0]
}

export function rampGradient(id: string): string {
  return `linear-gradient(90deg, ${findColorRamp(id).stops.join(', ')})`
}
