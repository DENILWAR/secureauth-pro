import React, { createContext, useContext, useReducer, useCallback } from 'react'

// Tipos de notificaciones
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error', 
  WARNING: 'warning',
  INFO: 'info',
  SECURITY: 'security',
}

// Posiciones para las notificaciones
const POSITIONS = {
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right',
}

// Acciones del reducer
const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL: 'CLEAR_ALL',
  UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
  SET_POSITION: 'SET_POSITION',
}

// Estado inicial
const initialState = {
  notifications: [],
  position: POSITIONS.TOP_RIGHT,
  maxNotifications: 5,
}

// Generar ID único
const generateId = () => `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Reducer
function notificationReducer(state, action) {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION: {
      const newNotification = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      }

      const updatedNotifications = [newNotification, ...state.notifications]
      
      // Limitar número máximo de notificaciones
      if (updatedNotifications.length > state.maxNotifications) {
        updatedNotifications.splice(state.maxNotifications)
      }

      return {
        ...state,
        notifications: updatedNotifications,
      }
    }

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      }

    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        notifications: [],
      }

    case NOTIFICATION_ACTIONS.UPDATE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id
            ? { ...notification, ...action.payload.updates }
            : notification
        ),
      }

    case NOTIFICATION_ACTIONS.SET_POSITION:
      return {
        ...state,
        position: action.payload,
      }

    default:
      return state
  }
}

// Crear contexto
const NotificationContext = createContext()

// Hook para usar el contexto
export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de NotificationProvider')
  }
  return context
}

// Provider del contexto
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  // Función base para crear notificaciones
  const createNotification = useCallback((notification) => {
    const {
      type = NOTIFICATION_TYPES.INFO,
      title,
      message,
      duration = 5000,
      persistent = false,
      action = null,
      icon = null,
      ...rest
    } = notification

    const notificationData = {
      type,
      title,
      message,
      duration,
      persistent,
      action,
      icon,
      ...rest,
    }

    dispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: notificationData,
    })

    // Auto-remover después del duration (si no es persistente)
    if (!persistent && duration > 0) {
      setTimeout(() => {
        dispatch({
          type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
          payload: notificationData.id,
        })
      }, duration)
    }

    return notificationData.id
  }, [])

  // Funciones específicas para cada tipo
  const success = useCallback((title, message, options = {}) => {
    return createNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      title,
      message,
      duration: 4000,
      ...options,
    })
  }, [createNotification])

  const error = useCallback((title, message, options = {}) => {
    return createNotification({
      type: NOTIFICATION_TYPES.ERROR,
      title,
      message,
      duration: 6000,
      ...options,
    })
  }, [createNotification])

  const warning = useCallback((title, message, options = {}) => {
    return createNotification({
      type: NOTIFICATION_TYPES.WARNING,
      title,
      message,
      duration: 5000,
      ...options,
    })
  }, [createNotification])

  const info = useCallback((title, message, options = {}) => {
    return createNotification({
      type: NOTIFICATION_TYPES.INFO,
      title,
      message,
      duration: 4000,
      ...options,
    })
  }, [createNotification])

  const security = useCallback((title, message, options = {}) => {
    return createNotification({
      type: NOTIFICATION_TYPES.SECURITY,
      title,
      message,
      duration: 8000,
      persistent: true, // Alertas de seguridad son persistentes por defecto
      ...options,
    })
  }, [createNotification])

  // Funciones de gestión
  const remove = useCallback((id) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
      payload: id,
    })
  }, [])

  const clearAll = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL })
  }, [])

  const update = useCallback((id, updates) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.UPDATE_NOTIFICATION,
      payload: { id, updates },
    })
  }, [])

  const setPosition = useCallback((position) => {
    if (Object.values(POSITIONS).includes(position)) {
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_POSITION,
        payload: position,
      })
    }
  }, [])

  // Funciones de utilidad
  const getByType = useCallback((type) => {
    return state.notifications.filter(notification => notification.type === type)
  }, [state.notifications])

  const getById = useCallback((id) => {
    return state.notifications.find(notification => notification.id === id)
  }, [state.notifications])

  const hasType = useCallback((type) => {
    return state.notifications.some(notification => notification.type === type)
  }, [state.notifications])

  const count = state.notifications.length

  // Funciones predefinidas para casos comunes
  const authSuccess = useCallback((message = 'Autenticación exitosa') => {
    return success('¡Bienvenido!', message, {
      icon: '🔓',
      action: {
        label: 'Ver Dashboard',
        onClick: () => console.log('Navigate to dashboard'),
      },
    })
  }, [success])

  const authError = useCallback((message = 'Error de autenticación') => {
    return error('Error de Acceso', message, {
      icon: '🔒',
      action: {
        label: 'Reintentar',
        onClick: () => console.log('Retry authentication'),
      },
    })
  }, [error])

  const securityAlert = useCallback((title, message, severity = 'high') => {
    return security(title, message, {
      icon: severity === 'high' ? '🚨' : '⚠️',
      action: {
        label: 'Ver Detalles',
        onClick: () => console.log('View security details'),
      },
    })
  }, [security])

  const twoFASuccess = useCallback(() => {
    return success('Verificación 2FA', 'Código verificado correctamente', {
      icon: '✅',
      duration: 3000,
    })
  }, [success])

  const codeResent = useCallback((method) => {
    return info('Código Reenviado', `Nuevo código enviado por ${method}`, {
      icon: '📤',
      duration: 3000,
    })
  }, [info])

  const value = {
    // Estado
    notifications: state.notifications,
    position: state.position,
    count,

    // Funciones principales
    success,
    error,
    warning,
    info,
    security,
    remove,
    clearAll,
    update,
    setPosition,
    createNotification,

    // Funciones de utilidad
    getByType,
    getById,
    hasType,

    // Funciones predefinidas
    authSuccess,
    authError,
    securityAlert,
    twoFASuccess,
    codeResent,

    // Constantes
    NOTIFICATION_TYPES,
    POSITIONS,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext