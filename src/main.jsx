import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Configuración inicial para la aplicación
console.log('🚀 SecureAuth Pro iniciando...')

// Verificar soporte para características modernas
const checkBrowserSupport = () => {
  const features = {
    webauthn: !!(navigator.credentials && window.PublicKeyCredential),
    serviceWorker: 'serviceWorker' in navigator,
    localStorage: typeof(Storage) !== "undefined",
    crypto: !!(window.crypto && window.crypto.subtle)
  }
  
  console.log('✅ Características del navegador:', features)
  return features
}

// Inicializar verificaciones de seguridad
const initSecurityFeatures = () => {
  const features = checkBrowserSupport()
  
  // Verificar WebAuthn para biometría
  if (features.webauthn) {
    console.log('🔐 Autenticación biométrica disponible')
  } else {
    console.warn('⚠️ Autenticación biométrica no disponible')
  }
  
  // Verificar LocalStorage para sesiones
  if (features.localStorage) {
    console.log('💾 Almacenamiento local disponible')
  } else {
    console.warn('⚠️ Almacenamiento local no disponible')
  }
  
  // Verificar Web Crypto API para encriptación
  if (features.crypto) {
    console.log('🔒 API de criptografía disponible')
  } else {
    console.warn('⚠️ API de criptografía no disponible')
  }
  
  return features
}

// Configurar manejo de errores global
window.addEventListener('error', (event) => {
  console.error('❌ Error global capturado:', event.error)
  // Aquí podrías enviar errores a un servicio de logging
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promise rechazada no manejada:', event.reason)
  // Aquí podrías enviar errores a un servicio de logging
})

// Inicializar características de seguridad
const securityFeatures = initSecurityFeatures()

// Configurar tema del sistema
const initTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle('dark', prefersDark)
  console.log(`🎨 Tema inicial: ${prefersDark ? 'oscuro' : 'claro'}`)
}

// Inicializar tema
initTheme()

// Escuchar cambios de tema del sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  document.documentElement.classList.toggle('dark', e.matches)
  console.log(`🎨 Tema cambiado a: ${e.matches ? 'oscuro' : 'claro'}`)
})

// Configurar PWA básico (opcional)
const initPWA = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Aquí podrías registrar un service worker para PWA
      console.log('📱 PWA features disponibles')
    })
  }
}

// Inicializar PWA
initPWA()

// Función para manejar el estado de conexión
const handleConnectionChange = () => {
  if (navigator.onLine) {
    console.log('🌐 Conexión restaurada')
    document.body.classList.remove('offline')
  } else {
    console.log('📴 Sin conexión a internet')
    document.body.classList.add('offline')
  }
}

// Escuchar cambios de conectividad
window.addEventListener('online', handleConnectionChange)
window.addEventListener('offline', handleConnectionChange)

// Verificar estado inicial de conexión
handleConnectionChange()

// Ocultar pantalla de carga cuando React cargue
const hideLoadingScreen = () => {
  const loadingElement = document.getElementById('initial-loading')
  if (loadingElement) {
    loadingElement.style.opacity = '0'
    setTimeout(() => {
      loadingElement.style.display = 'none'
    }, 300)
  }
}

// Renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'))

// Renderizar con manejo de errores
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  
  // Ocultar loading después de que React se monte
  setTimeout(hideLoadingScreen, 100)
  
  console.log('✅ SecureAuth Pro cargado correctamente')
} catch (error) {
  console.error('❌ Error al renderizar la aplicación:', error)
  
  // Fallback UI en caso de error crítico
  root.render(
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#1e293b',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ef4444' }}>
          ⚠️ Error de Inicialización
        </h1>
        <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
          SecureAuth Pro no pudo iniciarse correctamente.
        </p>
        <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
          Por favor, recarga la página.
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Recargar Página
        </button>
      </div>
    </div>
  )
}

// Performance monitoring
window.addEventListener('load', () => {
  if (performance.mark) {
    performance.mark('secureauth-loaded')
    const loadTime = performance.now()
    console.log(`🚀 SecureAuth Pro cargado en: ${loadTime.toFixed(2)}ms`)
    
    // Opcional: Enviar métricas de rendimiento
    if (loadTime > 3000) {
      console.warn('⚠️ Tiempo de carga alto:', loadTime.toFixed(2) + 'ms')
    }
  }
})