import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
  colors: {
    bgBase: string
    bgSurface: string
    bgElevated: string
    border: string
    textPrimary: string
    textSecondary: string
    textMuted: string
    accent: string
  }
}

const dark = {
  bgBase: '#0B1220', bgSurface: '#121C2E', bgElevated: '#0F1828',
  border: '#1E2A3D', textPrimary: '#E8EEF7', textSecondary: '#93A1B5',
  textMuted: '#5E6E85', accent: '#3B82F6',
}

const light = {
  bgBase: '#F0F4FF', bgSurface: '#FFFFFF', bgElevated: '#F1F5F9',
  border: '#E2E8F0', textPrimary: '#0F172A', textSecondary: '#475569',
  textMuted: '#64748B', accent: '#2563EB',
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark', toggleTheme: () => {}, isDark: true, colors: dark,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return (localStorage.getItem('theme') as Theme) || 'dark' } catch { return 'dark' }
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{
      theme, toggleTheme, isDark: theme === 'dark',
      colors: theme === 'dark' ? dark : light,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
