import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark' | 'system'

export const THEME_STORAGE_KEY = 'cesium4cfd-theme'

const MODES: ThemeMode[] = ['light', 'dark', 'system']

let media: MediaQueryList | null = null
let mediaListener: ((event: MediaQueryListEvent) => void) | null = null

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // 隐私模式下 localStorage 可能不可用
  }
  return 'system'
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: readStoredMode(),
    systemDark: systemPrefersDark(),
  }),

  getters: {
    isDark: (state) => state.mode === 'dark' || (state.mode === 'system' && state.systemDark),
  },

  actions: {
    apply() {
      document.documentElement.classList.toggle('dark', this.isDark)
    },

    setMode(mode: ThemeMode) {
      this.mode = mode
      try {
        localStorage.setItem(THEME_STORAGE_KEY, mode)
      } catch {
        // 忽略持久化失败
      }
      this.apply()
    },

    cycle() {
      const index = MODES.indexOf(this.mode)
      this.setMode(MODES[(index + 1) % MODES.length])
    },

    startSystemWatcher() {
      if (!media) {
        media = window.matchMedia('(prefers-color-scheme: dark)')
        mediaListener = (event: MediaQueryListEvent) => {
          this.systemDark = event.matches
          if (this.mode === 'system') this.apply()
        }
        media.addEventListener('change', mediaListener)
      }

      this.systemDark = media.matches
      this.apply()
    },

    stopSystemWatcher() {
      if (media && mediaListener) {
        media.removeEventListener('change', mediaListener)
      }
      media = null
      mediaListener = null
    },
  },
})
