import { useContext, useState, useCallback } from 'react'
import AuthContext from '@/contexts/AuthContext'
import { useNotification } from '@/contexts/NotificationContext'
import { validateEmail, validatePhone } from '@/utils/validation'
import { formatPhone } from '@/utils/formatting'

/**
 * Hook personalizado para manejar la autenticación
 * Proporciona funciones y estado relacionados con la autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  const notification = useNotification()
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    phone: '',
    code: '',
  })

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    phone: '',
    code: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  // Limpiar errores
  const clearErrors = useCallback(() => {
    setErrors({
      email: '',
      password: '',
      phone: '',
      code: '',
    })
  }, [])

  // Validar email
  const validateEmailField = useCallback((email) => {
    if (!email) {
      return 'El email es requerido'
    }
    if (!validateEmail(email)) {
      return 'Formato de email inválido'
    }
    return ''
  }, [])

  // Validar contraseña
  const validatePasswordField = useCallback((password) => {
    if (!password) {
      return 'La contraseña es requerida'
    }
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres'
    }
    return ''
  }, [])

  // Validar teléfono
  const validatePhoneField = useCallback((phone) => {
    if (!phone) {
      return 'El teléfono es requerido'
    }
    if (!validatePhone(phone)) {
      return 'Formato de teléfono inválido (ej: +34 600 123 456)'
    }
    return ''
  }, [])

  // Validar código 2FA
  const validateCodeField = useCallback((code) => {
    if (!code) {
      return 'El código es requerido'
    }
    if (code.length !== 6) {
      return 'El código debe tener 6 dígitos'
    }
    if (!/^\d{6}$/.test(code)) {
      return 'El código solo debe contener números'
    }
    return ''
  }, [])

  // Actualizar datos de login
  const updateLoginData = useCallback((field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value,
    }))

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }))
    }
  }, [errors])

  // Manejar cambio de email
  const handleEmailChange = useCallback((email) => {
    updateLoginData('email', email)
    
    if (email) {
      const error = validateEmailField(email)
      setErrors(prev => ({
        ...prev,
        email: error,
      }))
    }
  }, [updateLoginData, validateEmailField])

  // Manejar cambio de teléfono
  const handlePhoneChange = useCallback((phone) => {
    updateLoginData('phone', phone)
    
    if (phone) {
      const error = validatePhoneField(phone)
      setErrors(prev => ({
        ...prev,
        phone: error,
      }))
    }
  }, [updateLoginData, validatePhoneField])

  // Validar formulario completo
  const validateForm = useCallback((step) => {
    const newErrors = {}

    if (step === 1) {
      newErrors.email = validateEmailField(loginData.email)
      newErrors.password = validatePasswordField(loginData.password)
    } else if (step === 2 && context.verificationMethod === 'sms') {
      newErrors.phone = validatePhoneField(loginData.phone)
    } else if (step === 3) {
      newErrors.code = validateCodeField(loginData.code)
    }

    setErrors(newErrors)
    
    // Retornar true si no hay errores
    return Object.values(newErrors).every(error => !error)
  }, [
    loginData,
    context.verificationMethod,
    validateEmailField,
    validatePasswordField,
    validatePhoneField,
    validateCodeField,
  ])

  // Función de login mejorada
  const handleLogin = useCallback(async () => {
    setIsLoading(true)
    clearErrors()

    try {
      if (context.loginStep === 1) {
        // Paso 1: Validar credenciales
        if (!validateForm(1)) {
          return
        }

        const result = await context.login({
          email: loginData.email,
          password: loginData.password,
        })

        if (result.success) {
          context.setLoginStep(2)
          notification.success(
            'Credenciales Verificadas',
            'Selecciona tu método de verificación 2FA'
          )
        } else {
          notification.authError(result.error)
        }

      } else if (context.loginStep === 2) {
        // Paso 2: Seleccionar método 2FA
        if (context.verificationMethod === 'sms' && !validateForm(2)) {
          return
        }

        // Formatear teléfono si es necesario
        if (context.verificationMethod === 'sms') {
          const formattedPhone = formatPhone(loginData.phone)
          updateLoginData('phone', formattedPhone)
        }

        const contact = context.verificationMethod === 'sms' 
          ? loginData.phone 
          : loginData.email

        const result = await context.sendVerificationCode(
          context.verificationMethod,
          contact
        )

        if (result.success) {
          context.setLoginStep(3)
          notification.codeResent(
            context.verificationMethod === 'sms' ? 'SMS' : 'Email'
          )
        } else {
          notification.error('Error', result.error)
        }

      } else if (context.loginStep === 3) {
        // Paso 3: Verificar código 2FA
        if (!validateForm(3)) {
          return
        }

        const result = await context.verify2FA(
          loginData.code,
          context.verificationMethod
        )

        if (result.success) {
          notification.authSuccess('Acceso autorizado correctamente')
          // El contexto maneja la navegación
        } else {
          notification.error('Código Incorrecto', result.error)
        }
      }

    } catch (error) {
      notification.error('Error Inesperado', error.message)
    } finally {
      setIsLoading(false)
    }
  }, [
    context,
    loginData,
    validateForm,
    clearErrors,
    notification,
    updateLoginData,
  ])

  // Función de logout mejorada
  const handleLogout = useCallback(async () => {
    try {
      await context.logout()
      notification.info('Sesión Cerrada', 'Has cerrado sesión correctamente')
      
      // Limpiar datos locales
      setLoginData({
        email: '',
        password: '',
        phone: '',
        code: '',
      })
      clearErrors()
      
    } catch (error) {
      notification.error('Error', 'No se pudo cerrar la sesión correctamente')
    }
  }, [context, notification, clearErrors])

  // Función de autenticación biométrica mejorada
  const handleBiometricAuth = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await context.biometricAuth()
      
      if (result.success) {
        notification.authSuccess('Autenticación biométrica exitosa')
      } else {
        notification.authError(result.error)
      }
      
    } catch (error) {
      notification.error(
        'Error Biométrico', 
        'No se pudo completar la autenticación biométrica'
      )
    } finally {
      setIsLoading(false)
    }
  }, [context, notification])

  // Reenviar código
  const handleResendCode = useCallback(async () => {
    try {
      const contact = context.verificationMethod === 'sms' 
        ? loginData.phone 
        : loginData.email

      const result = await context.sendVerificationCode(
        context.verificationMethod,
        contact
      )

      if (result.success) {
        notification.codeResent(
          context.verificationMethod === 'sms' ? 'SMS' : 'Email'
        )
      } else {
        notification.error('Error', 'No se pudo reenviar el código')
      }
      
    } catch (error) {
      notification.error('Error', 'Error al reenviar el código')
    }
  }, [context, loginData, notification])

  // Función para volver al paso anterior
  const handleGoBack = useCallback(() => {
    if (context.loginStep > 1) {
      context.setLoginStep(context.loginStep - 1)
      clearErrors()
    }
  }, [context, clearErrors])

  // Verificar si el formulario actual es válido
  const isFormValid = useCallback(() => {
    if (context.loginStep === 1) {
      return loginData.email && 
             loginData.password && 
             !errors.email && 
             !errors.password
    } else if (context.loginStep === 2) {
      return context.verificationMethod === 'email' || 
             (loginData.phone && !errors.phone)
    } else if (context.loginStep === 3) {
      return loginData.code && !errors.code
    }
    return false
  }, [context.loginStep, context.verificationMethod, loginData, errors])

  // Determinar si hay soporte biométrico
  const biometricSupported = 'credentials' in navigator && 'PublicKeyCredential' in window

  return {
    // Estado del contexto
    ...context,
    
    // Estado local
    loginData,
    errors,
    isLoading: isLoading || context.isLoading,
    biometricSupported,
    
    // Funciones de manejo
    handleLogin,
    handleLogout,
    handleBiometricAuth,
    handleResendCode,
    handleGoBack,
    
    // Funciones de validación
    handleEmailChange,
    handlePhoneChange,
    updateLoginData,
    validateForm,
    clearErrors,
    isFormValid,
    
    // Utilidades
    canGoBack: context.loginStep > 1,
    isStep: (step) => context.loginStep === step,
    stepTitle: {
      1: 'Iniciar Sesión',
      2: 'Verificación 2FA',
      3: 'Código de Verificación',
    }[context.loginStep],
  }
}