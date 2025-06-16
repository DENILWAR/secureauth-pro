import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Temas disponibles
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
}

// Acciones del reducer
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_SYSTEM_THEME: 'SET_SYSTEM_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_ACCENT_COLOR: 'SET_ACCENT_COLOR',
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  RESET_PREFERENCES: 'RESET_PREFERENCES',
}

// Estado inicial
const initialState = {
  theme: THEMES.SYSTEM,
  systemTheme: 'light', // Lo que detecta el sistema
  resolvedTheme: 'light', // El tema que realmente se aplica
  accentColor: 'blue', // blue, purple, green, red
  fontSize: 'medium', // small, medium, large
  reducedMotion: false,
  highContrast: false,
}

// Reducer
function themeReducer(state, action) {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      const newTheme = action.payload
      const resolved = newTheme === THEMES.SYSTEM ? state.systemTheme : newTheme
      
      return {
        ...state,
        theme: newTheme,
        resolvedTheme: resolved,
      }

    case THEME_ACTIONS.SET_SYSTEM_THEME:
      const systemTheme = action.payload
      const resolvedTheme = state.theme === THEMES.SYSTEM ? systemTheme : state.resolvedTheme
      
      return {
        ...state,
        systemTheme,
        resolvedTheme,
      }

    case THEME_ACTIONS.TOGGLE_THEME:
      const currentResolved = state.resolvedTheme
      const toggledTheme = currentResolved === 'light' ? 'dark' : 'light'
      
      return {
        ...state,
        theme: toggledTheme,
        resolvedTheme: toggledTheme,
      }

    case THEME_ACTIONS.SET_ACCENT_COLOR:
      return {
        ...state,
        accentColor: action.payload,
      }

    case THEME_ACTIONS.SET_FONT_SIZE:
      return {
        ...state,
        fontSize: action.payload,
      }

    case THEME_ACTIONS.RESET_PREFERENCES:
      return {
        ...initialState,
        systemTheme: state.systemTheme,
        resolvedTheme: state.systemTheme,
      }

    default:
      return state
  }
}

// Crear contexto
const ThemeContext = createContext()

// Hook para usar el contexto
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider')
  }
  return context
}

// Provider del contexto
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState)

  // Cargar preferencias desde localStorage
  useEffect(() => {
    const loadThemePreferences = () => {
      try {
        const saved = localStorage.getItem('secureauth_theme_preferences')
        if (saved) {
          const preferences = JSON.parse(saved)
          
          // Aplicar preferencias guardadas
          if (preferences.theme) {
            dispatch({ type: THEME_ACTIONS.SET_THEME, payload: preferences.theme })
          }
          if (preferences.accentColor) {
            dispatch({ type: THEME_ACTIONS.SET_ACCENT_COLOR, payload: preferences.accentColor })
          }
          if (preferences.fontSize) {
            dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: preferences.fontSize })
          }
        }
      } catch (error) {
        console.error('Error loading theme preferences:', error)
      }
    }

    loadThemePreferences()
  }, [])

  // Detectar tema del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleSystemThemeChange = (e) => {
      dispatch({
        type: THEME_ACTIONS.SET_SYSTEM_THEME,
        payload: e.matches ? 'dark' : 'light',
      })
    }

    // Configurar tema inicial del sistema
    dispatch({
      type: THEME_ACTIONS.SET_SYSTEM_THEME,
      payload: mediaQuery.matches ? 'dark' : 'light',
    })

    // Escuchar cambios
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  // Detectar preferencias de accesibilidad
  useEffect(() => {
    const detectAccessibilityPreferences = () => {
      // Detectar si prefiere movimiento reducido
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      
      if (prefersReducedMotion.matches) {
        dispatch({
          type: THEME_ACTIONS.SET_REDUCED_MOTION,
          payload: true,
        })
      }

      // Detectar si prefiere alto contraste
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
      
      if (prefersHighContrast.matches) {
        dispatch({
          type: THEME_ACTIONS.SET_HIGH_CONTRAST,
          payload: true,
        })
      }
    }

    detectAccessibilityPreferences()
  }, [])

  // Aplicar tema al HTML
  useEffect(() => {
    const root = document.documentElement
    
    // Aplicar tema
    if (state.resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Aplicar color de acento como custom property
    const accentColors = {
      blue: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        900: '#1e3a8a',
      },
      purple: {
        50: '#f5f3ff',
        500: '#8b5cf6',
        600: '#7c3aed',
        900: '#4c1d95',
      },
      green: {
        50: '#ecfdf5',
        500: '#10b981',
        600: '#059669',
        900: '#064e3b',
      },
      red: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
        900: '#7f1d1d',
      },
    }

    const colors = accentColors[state.accentColor] || accentColors.blue
    
    Object.entries(colors).forEach(([shade, color]) => {
      root.style.setProperty(`--accent-${shade}`, color)
    })

    // Aplicar tamaño de fuente
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
    }
    
    root.style.setProperty('--base-font-size', fontSizes[state.fontSize])

  }, [state.resolvedTheme, state.accentColor, state.fontSize])

  // Guardar preferencias en localStorage
  useEffect(() => {
    const savePreferences = () => {
      try {
        const preferences = {
          theme: state.theme,
          accentColor: state.accentColor,
          fontSize: state.fontSize,
        }
        
        localStorage.setItem('secureauth_theme_preferences', JSON.stringify(preferences))
      } catch (error) {
        console.error('Error saving theme preferences:', error)
      }
    }

    // Solo guardar si no es el estado inicial
    if (state.theme !== THEMES.SYSTEM || state.accentColor !== 'blue' || state.fontSize !== 'medium') {
      savePreferences()
    }
  }, [state.theme, state.accentColor, state.fontSize])

  // Funciones del contexto
  const setTheme = (theme) => {
    if (Object.values(THEMES).includes(theme)) {
      dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme })
    }
  }

  const toggleTheme = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_THEME })
  }

  const setAccentColor = (color) => {
    const validColors = ['blue', 'purple', 'green', 'red']
    if (validColors.includes(color)) {
      dispatch({ type: THEME_ACTIONS.SET_ACCENT_COLOR, payload: color })
    }
  }

  const setFontSize = (size) => {
    const validSizes = ['small', 'medium', 'large']
    if (validSizes.includes(size)) {
      dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: size })
    }
  }

  const resetPreferences = () => {
    dispatch({ type: THEME_ACTIONS.RESET_PREFERENCES })
    localStorage.removeItem('secureauth_theme_preferences')
  }

  // Obtener clase CSS para el tema actual
  const getThemeClass = () => {
    return state.resolvedTheme === 'dark' ? 'dark' : ''
  }

  // Obtener estilos CSS variables
  const getCSSVariables = () => {
    return {
      '--theme': state.resolvedTheme,
      '--accent-color': state.accentColor,
      '--font-size': state.fontSize,
    }
  }

  // Verificar si es tema oscuro
  const isDark = state.resolvedTheme === 'dark'

  // Obtener información del tema para UI
  const getThemeInfo = () => {
    return {
      current: state.theme,
      resolved: state.resolvedTheme,
      isDark,
      isSystem: state.theme === THEMES.SYSTEM,
      systemPreference: state.systemTheme,
    }
  }

  const value = {
    // Estado
    ...state,
    isDark,
    
    // Funciones
    setTheme,
    toggleTheme,
    setAccentColor,
    setFontSize,
    resetPreferences,
    getThemeClass,
    getCSSVariables,
    getThemeInfo,
    
    // Constantes
    THEMES,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext