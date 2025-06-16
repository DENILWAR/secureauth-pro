import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '@/utils/api'
import { validateEmail, validatePhone } from '@/utils/validation'

// Tipos de acciones para el reducer
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_2FA_STEP: 'SET_2FA_STEP',
  SET_VERIFICATION_METHOD: 'SET_VERIFICATION_METHOD',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
}

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginStep: 1, // 1: credentials, 2: 2FA method selection, 3: 2FA verification
  verificationMethod: 'email', // 'email' | 'sms'
  loginData: {
    email: '',
    password: '',
    phone: '',
    code: '',
  },
  sessionInfo: {
    loginTime: null,
    lastActivity: null,
    ipAddress: null,
    userAgent: null,
  },
}

// Reducer para manejar el estado de autenticación
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        isLoading: false,
        error: null,
        sessionInfo: {
          ...state.sessionInfo,
          loginTime: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          ...action.payload.sessionInfo,
        },
      }

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload,
      }

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loginData: initialState.loginData,
      }

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }

    case AUTH_ACTIONS.SET_2FA_STEP:
      return {
        ...state,
        loginStep: action.payload,
      }

    case AUTH_ACTIONS.SET_VERIFICATION_METHOD:
      return {
        ...state,
        verificationMethod: action.payload,
      }

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

// Crear el contexto
const AuthContext = createContext()

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('secureauth_user')
        const storedToken = localStorage.getItem('secureauth_token')
        
        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser)
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user,
              sessionInfo: {
                loginTime: user.lastLogin,
                lastActivity: new Date().toISOString(),
              },
            },
          })
        }
      } catch (error) {
        console.error('Error loading user from storage:', error)
        // Limpiar storage corrupto
        localStorage.removeItem('secureauth_user')
        localStorage.removeItem('secureauth_token')
      }
    }

    loadUserFromStorage()
  }, [])

  // Actualizar última actividad
  useEffect(() => {
    if (state.isAuthenticated) {
      const updateLastActivity = () => {
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: { lastActivity: new Date().toISOString() },
        })
      }

      const interval = setInterval(updateLastActivity, 60000) // Cada minuto
      return () => clearInterval(interval)
    }
  }, [state.isAuthenticated])

  // Funciones de autenticación
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START })

    try {
      // Validar credenciales
      if (!validateEmail(credentials.email)) {
        throw new Error('Formato de email inválido')
      }

      if (!credentials.password || credentials.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }

      // Simular llamada a API
      const response = await authAPI.login(credentials)
      
      if (response.success) {
        const userData = {
          id: response.user.id,
          email: credentials.email,
          name: response.user.name,
          role: response.user.role,
          lastLogin: new Date().toISOString(),
          preferences: response.user.preferences || {},
        }

        // Guardar en localStorage
        localStorage.setItem('secureauth_user', JSON.stringify(userData))
        localStorage.setItem('secureauth_token', response.token)

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: userData,
            sessionInfo: {
              ipAddress: response.sessionInfo?.ipAddress,
              userAgent: navigator.userAgent,
            },
          },
        })

        return { success: true }
      } else {
        throw new Error(response.message || 'Error de autenticación')
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message,
      })
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      // Simular llamada a API para logout
      await authAPI.logout()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Limpiar storage y estado
      localStorage.removeItem('secureauth_user')
      localStorage.removeItem('secureauth_token')
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
    }
  }

  const verify2FA = async (code, method) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })

    try {
      if (!code || code.length !== 6) {
        throw new Error('El código debe tener 6 dígitos')
      }

      // Simular verificación 2FA
      const response = await authAPI.verify2FA({
        code,
        method,
        email: state.loginData.email,
        phone: state.loginData.phone,
      })

      if (response.success) {
        // El login principal ya se completó, solo actualizamos el estado
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
        return { success: true }
      } else {
        throw new Error(response.message || 'Código de verificación inválido')
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message,
      })
      return { success: false, error: error.message }
    }
  }

  const sendVerificationCode = async (method, contact) => {
    try {
      if (method === 'sms' && !validatePhone(contact)) {
        throw new Error('Número de teléfono inválido')
      }

      if (method === 'email' && !validateEmail(contact)) {
        throw new Error('Email inválido')
      }

      // Simular envío de código
      const response = await authAPI.sendVerificationCode({
        method,
        contact,
      })

      return response
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message,
      })
      return { success: false, error: error.message }
    }
  }

  const updateProfile = async (profileData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })

    try {
      const response = await authAPI.updateProfile(profileData)
      
      if (response.success) {
        const updatedUser = { ...state.user, ...profileData }
        
        // Actualizar localStorage
        localStorage.setItem('secureauth_user', JSON.stringify(updatedUser))
        
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: profileData,
        })

        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
        return { success: true }
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message,
      })
      return { success: false, error: error.message }
    }
  }

  const biometricAuth = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })

    try {
      // Verificar soporte de WebAuthn
      if (!window.PublicKeyCredential) {
        throw new Error('Autenticación biométrica no soportada en este navegador')
      }

      // Simular autenticación biométrica
      const response = await authAPI.biometricAuth()

      if (response.success) {
        const userData = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          lastLogin: new Date().toISOString(),
          authMethod: 'biometric',
        }

        localStorage.setItem('secureauth_user', JSON.stringify(userData))
        localStorage.setItem('secureauth_token', response.token)

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: userData,
            sessionInfo: {
              ipAddress: response.sessionInfo?.ipAddress,
              userAgent: navigator.userAgent,
            },
          },
        })

        return { success: true }
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message,
      })
      return { success: false, error: error.message }
    }
  }

  // Funciones de utilidad
  const setLoginStep = (step) => {
    dispatch({ type: AUTH_ACTIONS.SET_2FA_STEP, payload: step })
  }

  const setVerificationMethod = (method) => {
    dispatch({ type: AUTH_ACTIONS.SET_VERIFICATION_METHOD, payload: method })
  }

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  const updateLoginData = (data) => {
    // Esta función se maneja en el componente local, pero podríamos centralizarla aquí
  }

  // Verificar si la sesión ha expirado
  const isSessionValid = () => {
    if (!state.isAuthenticated) return false

    const token = localStorage.getItem('secureauth_token')
    if (!token) return false

    // Aquí podrías agregar lógica para verificar expiración del token
    return true
  }

  // Valor del contexto
  const value = {
    // Estado
    ...state,
    
    // Funciones
    login,
    logout,
    verify2FA,
    sendVerificationCode,
    updateProfile,
    biometricAuth,
    setLoginStep,
    setVerificationMethod,
    clearError,
    updateLoginData,
    isSessionValid,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext