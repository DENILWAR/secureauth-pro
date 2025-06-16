import { useState, useEffect, useCallback } from 'react'

/**
 * Hook personalizado para manejar localStorage de forma reactiva
 * @param {string} key - Clave para localStorage
 * @param {any} initialValue - Valor inicial si no existe en localStorage
 * @param {Object} options - Opciones adicionales
 */
export const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncAcrossTabs = true,
    errorHandling = 'log', // 'log', 'throw', 'silent'
  } = options

  // Función para leer del localStorage
  const readValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return initialValue
      }
      return deserialize(item)
    } catch (error) {
      if (errorHandling === 'throw') {
        throw error
      } else if (errorHandling === 'log') {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
      return initialValue
    }
  }, [key, initialValue, deserialize, errorHandling])

  // Estado
  const [storedValue, setStoredValue] = useState(readValue)

  // Función para establecer valor
  const setValue = useCallback((value) => {
    try {
      // Permitir que value sea una función para el patrón funcional de setState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      setStoredValue(valueToStore)
      
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, serialize(valueToStore))
      }
    } catch (error) {
      if (errorHandling === 'throw') {
        throw error
      } else if (errorHandling === 'log') {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    }
  }, [key, serialize, storedValue, errorHandling])

  // Función para eliminar valor
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      if (errorHandling === 'throw') {
        throw error
      } else if (errorHandling === 'log') {
        console.error(`Error removing localStorage key "${key}":`, error)
      }
    }
  }, [key, initialValue, errorHandling])

  // Sincronizar entre pestañas
  useEffect(() => {
    if (!syncAcrossTabs) return

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== serialize(storedValue)) {
        try {
          setStoredValue(e.newValue ? deserialize(e.newValue) : initialValue)
        } catch (error) {
          if (errorHandling === 'log') {
            console.error(`Error syncing localStorage key "${key}":`, error)
          }
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, storedValue, initialValue, serialize, deserialize, syncAcrossTabs, errorHandling])

  // Verificar si la clave existe
  const hasValue = useCallback(() => {
    try {
      return window.localStorage.getItem(key) !== null
    } catch {
      return false
    }
  }, [key])

  return [storedValue, setValue, removeValue, hasValue]
}

/**
 * Hook específico para manejar preferencias de usuario
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences, removePreferences] = useLocalStorage(
    'secureauth_user_preferences',
    {
      theme: 'system',
      language: 'es',
      notifications: true,
      twoFactorEnabled: false,
      rememberDevice: false,
    }
  )

  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }))
  }, [setPreferences])

  const resetPreferences = useCallback(() => {
    removePreferences()
  }, [removePreferences])

  return {
    preferences,
    updatePreference,
    resetPreferences,
    setPreferences,
  }
}

/**
 * Hook para manejar configuraciones de la aplicación
 */
export const useAppSettings = () => {
  const [settings, setSettings, removeSettings] = useLocalStorage(
    'secureauth_app_settings',
    {
      autoLock: true,
      autoLockTimeout: 300000, // 5 minutos
      showWelcomeMessage: true,
      enableBiometric: false,
      debugMode: false,
    }
  )

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }))
  }, [setSettings])

  const resetSettings = useCallback(() => {
    removeSettings()
  }, [removeSettings])

  return {
    settings,
    updateSetting,
    resetSettings,
    setSettings,
  }
}

/**
 * Hook para manejar historial de sesiones
 */
export const useSessionHistory = () => {
  const [sessions, setSessions, removeSessions] = useLocalStorage(
    'secureauth_session_history',
    [],
    {
      serialize: JSON.stringify,
      deserialize: (value) => {
        const parsed = JSON.parse(value)
        // Mantener solo las últimas 10 sesiones
        return Array.isArray(parsed) ? parsed.slice(-10) : []
      },
    }
  )

  const addSession = useCallback((sessionData) => {
    const newSession = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...sessionData,
    }

    setSessions(prev => [...prev, newSession])
  }, [setSessions])

  const clearHistory = useCallback(() => {
    removeSessions()
  }, [removeSessions])

  const getLastSession = useCallback(() => {
    return sessions.length > 0 ? sessions[sessions.length - 1] : null
  }, [sessions])

  return {
    sessions,
    addSession,
    clearHistory,
    getLastSession,
  }
}

/**
 * Hook para manejar cache de datos temporales
 */
export const useTempCache = (key, ttl = 300000) => { // TTL por defecto: 5 minutos
  const [cache, setCache, removeCache] = useLocalStorage(
    `secureauth_cache_${key}`,
    null,
    {
      serialize: (value) => JSON.stringify({
        data: value,
        timestamp: Date.now(),
        ttl,
      }),
      deserialize: (value) => {
        try {
          const parsed = JSON.parse(value)
          const now = Date.now()
          
          // Verificar si el cache ha expirado
          if (parsed.timestamp + parsed.ttl < now) {
            return null
          }
          
          return parsed.data
        } catch {
          return null
        }
      },
    }
  )

  const isExpired = useCallback(() => {
    try {
      const stored = window.localStorage.getItem(`secureauth_cache_${key}`)
      if (!stored) return true
      
      const parsed = JSON.parse(stored)
      return Date.now() > parsed.timestamp + parsed.ttl
    } catch {
      return true
    }
  }, [key])

  const refreshCache = useCallback((newData) => {
    setCache(newData)
  }, [setCache])

  return {
    data: cache,
    setData: setCache,
    removeData: removeCache,
    isExpired,
    refreshCache,
  }
}

export default useLocalStorage