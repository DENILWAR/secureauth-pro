import { useState, useCallback, useEffect } from 'react'
import { useNotification } from './useNotification'

/**
 * Hook personalizado para manejar autenticación biométrica WebAuthn
 */
export const useBiometric = () => {
  const notification = useNotification()
  const [isSupported, setIsSupported] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Verificar soporte de WebAuthn
  useEffect(() => {
    const checkSupport = async () => {
      try {
        // Verificar si el navegador soporta WebAuthn
        const supported = 'credentials' in navigator && 'PublicKeyCredential' in window
        setIsSupported(supported)

        if (supported) {
          // Verificar si hay autenticadores disponibles
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
          setIsAvailable(available)
        }
      } catch (error) {
        console.error('Error checking biometric support:', error)
        setIsSupported(false)
        setIsAvailable(false)
      }
    }

    checkSupport()
  }, [])

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Registrar credencial biométrica
  const registerBiometric = useCallback(async (userInfo = {}) => {
    if (!isSupported || !isAvailable) {
      const errorMsg = 'Autenticación biométrica no disponible en este dispositivo'
      setError(errorMsg)
      notification.showBiometricError(errorMsg)
      return { success: false, error: errorMsg }
    }

    setIsLoading(true)
    setError(null)

    try {
      // Configuración para el registro de credencial
      const publicKeyCredentialCreationOptions = {
        challenge: new TextEncoder().encode('challenge-' + Date.now()),
        rp: {
          name: 'SecureAuth Pro',
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userInfo.id || 'user-' + Date.now()),
          name: userInfo.email || 'user@secureauth-pro.com',
          displayName: userInfo.name || 'Usuario SecureAuth',
        },
        pubKeyCredParams: [
          {
            alg: -7, // ES256
            type: 'public-key',
          },
          {
            alg: -257, // RS256
            type: 'public-key',
          },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          requireResidentKey: false,
        },
        timeout: 60000,
        attestation: 'direct',
      }

      // Crear credencial
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })

      if (credential) {
        // Simular almacenamiento de credencial en el servidor
        const credentialData = {
          id: credential.id,
          rawId: Array.from(new Uint8Array(credential.rawId)),
          type: credential.type,
          response: {
            attestationObject: Array.from(new Uint8Array(credential.response.attestationObject)),
            clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
          },
        }

        // Guardar en localStorage para la demo
        localStorage.setItem('secureauth_biometric_credential', JSON.stringify(credentialData))

        notification.showBiometricSuccess()
        return { success: true, credential: credentialData }
      }

    } catch (error) {
      console.error('Error registering biometric:', error)
      let errorMessage = 'Error al registrar autenticación biométrica'

      if (error.name === 'NotAllowedError') {
        errorMessage = 'El usuario canceló el registro biométrico'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Autenticación biométrica no soportada'
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Error de seguridad en el registro biométrico'
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'Ya existe una credencial registrada'
      }

      setError(errorMessage)
      notification.showBiometricError(errorMessage)
      return { success: false, error: errorMessage }

    } finally {
      setIsLoading(false)
    }
  }, [isSupported, isAvailable, notification])

  // Autenticar con biometría
  const authenticateWithBiometric = useCallback(async () => {
    if (!isSupported || !isAvailable) {
      const errorMsg = 'Autenticación biométrica no disponible'
      setError(errorMsg)
      notification.showBiometricError(errorMsg)
      return { success: false, error: errorMsg }
    }

    // Verificar si hay credencial registrada
    const storedCredential = localStorage.getItem('secureauth_biometric_credential')
    if (!storedCredential) {
      const errorMsg = 'No hay credencial biométrica registrada'
      setError(errorMsg)
      notification.showBiometricError(errorMsg)
      return { success: false, error: errorMsg }
    }

    setIsLoading(true)
    setError(null)

    try {
      const credential = JSON.parse(storedCredential)

      // Configuración para la autenticación
      const publicKeyCredentialRequestOptions = {
        challenge: new TextEncoder().encode('auth-challenge-' + Date.now()),
        allowCredentials: [
          {
            id: new Uint8Array(credential.rawId),
            type: 'public-key',
            transports: ['internal'],
          },
        ],
        userVerification: 'required',
        timeout: 60000,
      }

      // Autenticar
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      })

      if (assertion) {
        // Simular verificación en el servidor
        const authData = {
          id: assertion.id,
          rawId: Array.from(new Uint8Array(assertion.rawId)),
          type: assertion.type,
          response: {
            authenticatorData: Array.from(new Uint8Array(assertion.response.authenticatorData)),
            clientDataJSON: Array.from(new Uint8Array(assertion.response.clientDataJSON)),
            signature: Array.from(new Uint8Array(assertion.response.signature)),
            userHandle: assertion.response.userHandle 
              ? Array.from(new Uint8Array(assertion.response.userHandle)) 
              : null,
          },
        }

        notification.showBiometricSuccess()
        return { success: true, assertion: authData }
      }

    } catch (error) {
      console.error('Error authenticating with biometric:', error)
      let errorMessage = 'Error en la autenticación biométrica'

      if (error.name === 'NotAllowedError') {
        errorMessage = 'El usuario canceló la autenticación'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Autenticación biométrica no soportada'
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Error de seguridad en la autenticación'
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'Estado inválido del autenticador'
      } else if (error.name === 'UnknownError') {
        errorMessage = 'Error desconocido en el autenticador'
      }

      setError(errorMessage)
      notification.showBiometricError(errorMessage)
      return { success: false, error: errorMessage }

    } finally {
      setIsLoading(false)
    }
  }, [isSupported, isAvailable, notification])

  // Verificar si hay credencial registrada
  const hasRegisteredCredential = useCallback(() => {
    return localStorage.getItem('secureauth_biometric_credential') !== null
  }, [])

  // Eliminar credencial registrada
  const removeCredential = useCallback(() => {
    localStorage.removeItem('secureauth_biometric_credential')
    notification.info('Credencial Eliminada', 'La credencial biométrica ha sido eliminada')
  }, [notification])

  // Obtener información del dispositivo
  const getDeviceInfo = useCallback(async () => {
    if (!isSupported) {
      return null
    }

    try {
      const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        webauthnSupported: isSupported,
        platformAuthenticatorAvailable: isAvailable,
        touchSupported: 'ontouchstart' in window,
        timestamp: new Date().toISOString(),
      }

      return info
    } catch (error) {
      console.error('Error getting device info:', error)
      return null
    }
  }, [isSupported, isAvailable])

  // Verificar si el dispositivo es confiable
  const isTrustedDevice = useCallback(() => {
    // En una implementación real, esto verificaría con el servidor
    const trustedDevices = JSON.parse(
      localStorage.getItem('secureauth_trusted_devices') || '[]'
    )
    
    const deviceFingerprint = btoa(navigator.userAgent + navigator.platform)
    return trustedDevices.includes(deviceFingerprint)
  }, [])

  // Marcar dispositivo como confiable
  const trustDevice = useCallback(() => {
    const trustedDevices = JSON.parse(
      localStorage.getItem('secureauth_trusted_devices') || '[]'
    )
    
    const deviceFingerprint = btoa(navigator.userAgent + navigator.platform)
    
    if (!trustedDevices.includes(deviceFingerprint)) {
      trustedDevices.push(deviceFingerprint)
      localStorage.setItem('secureauth_trusted_devices', JSON.stringify(trustedDevices))
      notification.success('Dispositivo Confiable', 'Este dispositivo ha sido marcado como confiable')
    }
  }, [notification])

  return {
    // Estado
    isSupported,
    isAvailable,
    isLoading,
    error,
    
    // Funciones principales
    registerBiometric,
    authenticateWithBiometric,
    hasRegisteredCredential,
    removeCredential,
    
    // Funciones de utilidad
    getDeviceInfo,
    isTrustedDevice,
    trustDevice,
    clearError,
    
    // Estado calculado
    canUseBiometric: isSupported && isAvailable,
    isReady: isSupported && isAvailable && hasRegisteredCredential(),
  }
}

export default useBiometric