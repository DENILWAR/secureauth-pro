import { useContext, useCallback } from 'react'
import NotificationContext from '@/contexts/NotificationContext'

/**
 * Hook personalizado para manejar notificaciones
 * Proporciona funciones optimizadas para diferentes tipos de notificaciones
 */
export const useNotification = () => {
  const context = useContext(NotificationContext)
  
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de NotificationProvider')
  }

  // Funciones específicas para la aplicación
  const showLoginSuccess = useCallback((userName = 'Usuario') => {
    return context.success(
      '¡Bienvenido!',
      `Hola ${userName}, has ingresado correctamente`,
      {
        icon: '🎉',
        duration: 4000,
        action: {
          label: 'Ir al Dashboard',
          onClick: () => {
            // Esta función se puede personalizar desde el componente
            console.log('Navigate to dashboard')
          },
        },
      }
    )
  }, [context])

  const showLoginError = useCallback((error = 'Credenciales incorrectas') => {
    return context.error(
      'Error de Acceso',
      error,
      {
        icon: '🔒',
        duration: 6000,
        action: {
          label: 'Reintentar',
          onClick: () => {
            console.log('Retry login')
          },
        },
      }
    )
  }, [context])

  const show2FACodeSent = useCallback((method = 'email', contact = '') => {
    const methodText = method === 'sms' ? 'SMS' : 'email'
    const contactText = contact ? ` a ${contact}` : ''
    
    return context.info(
      'Código Enviado',
      `Te hemos enviado un código de verificación por ${methodText}${contactText}`,
      {
        icon: method === 'sms' ? '📱' : '📧',
        duration: 5000,
        action: {
          label: 'Reenviar',
          onClick: () => {
            console.log('Resend code')
          },
        },
      }
    )
  }, [context])

  const show2FASuccess = useCallback(() => {
    return context.success(
      'Verificación Exitosa',
      'Tu identidad ha sido verificada correctamente',
      {
        icon: '✅',
        duration: 3000,
      }
    )
  }, [context])

  const show2FAError = useCallback((error = 'Código incorrecto') => {
    return context.error(
      'Verificación Fallida',
      error,
      {
        icon: '❌',
        duration: 5000,
        action: {
          label: 'Intentar de nuevo',
          onClick: () => {
            console.log('Retry 2FA')
          },
        },
      }
    )
  }, [context])

  const showBiometricSuccess = useCallback(() => {
    return context.success(
      'Autenticación Biométrica',
      'Identidad verificada con éxito',
      {
        icon: '👤',
        duration: 3000,
      }
    )
  }, [context])

  const showBiometricError = useCallback((error = 'No se pudo verificar la identidad biométrica') => {
    return context.error(
      'Error Biométrico',
      error,
      {
        icon: '🚫',
        duration: 6000,
        action: {
          label: 'Usar contraseña',
          onClick: () => {
            console.log('Switch to password')
          },
        },
      }
    )
  }, [context])

  const showSecurityAlert = useCallback((title, message, severity = 'high') => {
    return context.security(
      title,
      message,
      {
        icon: severity === 'high' ? '🚨' : severity === 'medium' ? '⚠️' : 'ℹ️',
        persistent: severity === 'high',
        action: {
          label: 'Ver Detalles',
          onClick: () => {
            console.log('View security details')
          },
        },
      }
    )
  }, [context])

  const showPasswordChanged = useCallback(() => {
    return context.success(
      'Contraseña Actualizada',
      'Tu contraseña ha sido cambiada exitosamente',
      {
        icon: '🔐',
        duration: 4000,
      }
    )
  }, [context])

  const showProfileUpdated = useCallback(() => {
    return context.success(
      'Perfil Actualizado',
      'Tus datos han sido guardados correctamente',
      {
        icon: '👤',
        duration: 3000,
      }
    )
  }, [context])

  const showLogoutSuccess = useCallback(() => {
    return context.info(
      'Sesión Cerrada',
      'Has cerrado sesión de forma segura',
      {
        icon: '👋',
        duration: 3000,
      }
    )
  }, [context])

  const showNetworkError = useCallback(() => {
    return context.error(
      'Error de Conexión',
      'Verifica tu conexión a internet e intenta nuevamente',
      {
        icon: '🌐',
        duration: 6000,
        action: {
          label: 'Reintentar',
          onClick: () => {
            window.location.reload()
          },
        },
      }
    )
  }, [context])

  const showMaintenanceMode = useCallback(() => {
    return context.warning(
      'Mantenimiento Programado',
      'El sistema estará en mantenimiento en 10 minutos',
      {
        icon: '🔧',
        persistent: true,
        action: {
          label: 'Más info',
          onClick: () => {
            console.log('Show maintenance info')
          },
        },
      }
    )
  }, [context])

  const showSessionExpiring = useCallback((minutesLeft = 5) => {
    return context.warning(
      'Sesión por Expirar',
      `Tu sesión expirará en ${minutesLeft} minutos`,
      {
        icon: '⏰',
        duration: 10000,
        action: {
          label: 'Extender Sesión',
          onClick: () => {
            console.log('Extend session')
          },
        },
      }
    )
  }, [context])

  const showDataSaved = useCallback(callback => {
    return context.success(
      'Datos Guardados',
      'Los cambios han sido guardados automáticamente',
      {
        icon: '💾',
        duration: 2000,
      }
    )
  }, [context])

  const showUpgradeRequired = useCallback(() => {
    return context.info(
      'Actualización Disponible',
      'Hay una nueva versión disponible para mejorar la seguridad',
      {
        icon: '🔄',
        persistent: true,
        action: {
          label: 'Actualizar',
          onClick: () => {
            window.location.reload()
          },
        },
      }
    )
  }, [context])

  const showFeatureComingSoon = useCallback((featureName = 'función') => {
    return context.info(
      'Próximamente',
      `La ${featureName} estará disponible pronto`,
      {
        icon: '🚀',
        duration: 4000,
      }
    )
  }, [context])

  // Función genérica para mostrar progreso
  const showProgress = useCallback((title, message, progress = 0) => {
    return context.info(
      title,
      `${message} (${progress}%)`,
      {
        icon: '⏳',
        persistent: true,
        // Se puede actualizar el progreso usando context.update
      }
    )
  }, [context])

  // Función para mostrar confirmación de acción destructiva
  const showDestructiveAction = useCallback((title, message, onConfirm) => {
    return context.warning(
      title,
      message,
      {
        icon: '⚠️',
        persistent: true,
        action: {
          label: 'Confirmar',
          onClick: onConfirm,
          destructive: true,
        },
      }
    )
  }, [context])

  return {
    // Funciones del contexto base
    ...context,
    
    // Funciones específicas de la aplicación
    showLoginSuccess,
    showLoginError,
    show2FACodeSent,
    show2FASuccess,
    show2FAError,
    showBiometricSuccess,
    showBiometricError,
    showSecurityAlert,
    showPasswordChanged,
    showProfileUpdated,
    showLogoutSuccess,
    showNetworkError,
    showMaintenanceMode,
    showSessionExpiring,
    showDataSaved,
    showUpgradeRequired,
    showFeatureComingSoon,
    showProgress,
    showDestructiveAction,
  }
}

export default useNotification