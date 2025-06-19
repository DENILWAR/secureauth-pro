import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Fingerprint, AlertTriangle, Eye, EyeOff, Smartphone, CheckCircle, XCircle, Activity, Globe, Clock } from 'lucide-react';

// Componente de fondo estrellado memoizado
const StarryBackground = React.memo(() => {
  // Generar estrellas una sola vez
  const stars = useMemo(() => {
    const starElements = [];
    
    // Estrellas grandes
    for (let i = 0; i < 50; i++) {
      starElements.push({
        id: `star-large-${i}`,
        type: 'large',
        left: Math.random() * 100,
        top: Math.random() * 100,
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        animationDelay: Math.random() * 3,
        animationDuration: Math.random() * 2 + 2
      });
    }
    
    // Estrellas medianas
    for (let i = 0; i < 100; i++) {
      starElements.push({
        id: `star-medium-${i}`,
        type: 'medium',
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 4,
        animationDuration: Math.random() * 4 + 2
      });
    }
    
    // Estrellas pequeñas
    for (let i = 0; i < 200; i++) {
      starElements.push({
        id: `star-small-${i}`,
        type: 'small',
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 6,
        animationDuration: Math.random() * 6 + 3
      });
    }
    
    return starElements;
  }, []);

  return (
    <div className="absolute inset-0">
      {/* Renderizar estrellas memoizadas */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute bg-white rounded-full ${
            star.type === 'large' ? 'animate-pulse' : star.type === 'medium' ? 'opacity-70' : 'opacity-40'
          }`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.type === 'large' ? `${star.width}px` : star.type === 'medium' ? '2px' : '1px',
            height: star.type === 'large' ? `${star.height}px` : star.type === 'medium' ? '2px' : '1px',
            animation: star.type === 'large' 
              ? `pulse ${star.animationDuration}s ease-in-out infinite`
              : `twinkle ${star.animationDuration}s ease-in-out infinite`,
            animationDelay: `${star.animationDelay}s`
          }}
        />
      ))}
      
      {/* Estrellas fugaces - estas sí pueden ser estáticas */}
      <div 
        className="absolute w-1 h-1 bg-white rounded-full opacity-80"
        style={{
          left: '10%',
          top: '20%',
          animation: 'shootingStar 8s linear infinite',
          boxShadow: '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff'
        }}
      />
      <div 
        className="absolute w-1 h-1 bg-blue-200 rounded-full opacity-60"
        style={{
          left: '80%',
          top: '60%',
          animation: 'shootingStar 12s linear infinite',
          animationDelay: '4s',
          boxShadow: '0 0 8px #bfdbfe, 0 0 16px #bfdbfe'
        }}
      />
    </div>
  );
});

StarryBackground.displayName = 'StarryBackground';

// Componente LoginForm separado para evitar re-renders
const LoginForm = ({ 
  loginStep, 
  setLoginStep, 
  loginData, 
  setLoginData, 
  showPassword, 
  setShowPassword, 
  verificationMethod, 
  setVerificationMethod, 
  biometricSupported, 
  handleLogin, 
  handleBiometricAuth, 
  sendVerificationCode 
}) => (
  <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
    {/* Fondo de estrellas memoizado */}
    <StarryBackground />

    {/* Gradiente sutil sobre las estrellas */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black opacity-70"></div>
    
    {/* Contenido del formulario */}
    <div className="relative z-10 bg-gray-900/20 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-gray-700/30 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg shadow-blue-500/25">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">SecureAuth Pro</h1>
        <p className="text-gray-300">Autenticación ultra-segura</p>
      </div>

      {loginStep === 1 ? (
        /* Paso 1: Email y Contraseña */
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData(prev => ({...prev, email: e.target.value}))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({...prev, password: e.target.value}))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25"
          >
            Continuar
          </button>

          {biometricSupported && (
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-3">O usa autenticación biométrica</p>
              <button
                type="button"
                onClick={handleBiometricAuth}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-green-500/25"
              >
                <Fingerprint className="w-5 h-5 mr-2" />
                Huella Dactilar
              </button>
            </div>
          )}
        </div>
      ) : loginStep === 2 ? (
        /* Paso 2: Configurar Teléfono y Método 2FA */
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4 shadow-lg shadow-purple-500/25">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Configurar 2FA</h2>
            <p className="text-gray-300 text-sm">Añade tu teléfono para mayor seguridad</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Número de Teléfono</label>
            <input
              type="tel"
              value={loginData.phone}
              onChange={(e) => {
                // Solo permitir números, espacios, guiones y el símbolo +
                const value = e.target.value.replace(/[^0-9+\-\s]/g, '');
                setLoginData(prev => ({...prev, phone: value}));
              }}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
              placeholder="+34 600 123 456"
            />
          </div>

          {/* Selector de método de verificación */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Método de verificación 2FA</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVerificationMethod('email')}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  verificationMethod === 'email'
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                📧 Email
              </button>
              <button
                type="button"
                onClick={() => setVerificationMethod('sms')}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  verificationMethod === 'sms'
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                📱 SMS
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25"
          >
            Continuar con 2FA
          </button>

          <button
            onClick={() => setLoginStep(1)}
            className="w-full text-gray-400 text-sm hover:text-white transition-colors"
          >
            ← Volver
          </button>
        </div>
      ) : (
        /* Paso 3: Verificación 2FA */
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mb-4 shadow-lg shadow-green-500/25">
              {verificationMethod === 'sms' ? (
                <Smartphone className="w-6 h-6 text-white" />
              ) : (
                <span className="text-white text-lg">📧</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Verificación 2FA</h2>
            <p className="text-gray-300 text-sm">
              {verificationMethod === 'sms' 
                ? `Código enviado por SMS a ${loginData.phone}`
                : `Código enviado por email a ${loginData.email}`
              }
            </p>
            <button
              onClick={() => sendVerificationCode()}
              className="mt-2 text-blue-400 text-sm hover:text-blue-300 transition-colors"
            >
              ↻ Reenviar código
            </button>
          </div>

          <div>
            <div className="mb-6">
              <input
                type="text"
                value={loginData.code}
                onChange={(e) => {
                  // Solo permitir números y limitar a 6 dígitos
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                  setLoginData(prev => ({...prev, code: value}));
                }}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm"
                placeholder="000000"
                maxLength="6"
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-green-500/25"
            >
              Verificar & Acceder
            </button>
          </div>

          <button
            onClick={() => setLoginStep(2)}
            className="w-full text-gray-400 text-sm hover:text-white transition-colors"
          >
            ← Volver
          </button>
        </div>
      )}
    </div>
    
    {/* CSS para animaciones de estrellas */}
    <style jsx>{`
      @keyframes twinkle {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      
      @keyframes shootingStar {
        0% {
          transform: translateX(-100px) translateY(-100px);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateX(100vw) translateY(100vh);
          opacity: 0;
        }
      }
    `}</style>
  </div>
);

// Componente Dashboard separado
const Dashboard = ({ suspiciousAttempts, setCurrentView }) => (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">SecureAuth Pro Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              Sistema Activo
            </div>
            <button
              onClick={() => setCurrentView('login')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accesos Exitosos</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Intentos Bloqueados</p>
              <p className="text-2xl font-bold text-gray-900">43</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-gray-900">99.8%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Alerts */}
      <div className="bg-white rounded-xl shadow-sm border mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            Intentos de Acceso Sospechosos
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {suspiciousAttempts.map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    attempt.status === 'blocked' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {attempt.status === 'blocked' ? 
                      <XCircle className="w-4 h-4 text-red-600" /> : 
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {attempt.ip} - {attempt.location}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {attempt.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    attempt.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {attempt.status === 'blocked' ? 'BLOQUEADO' : 'ADVERTENCIA'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{attempt.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Características de Seguridad</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-gray-700">Autenticación 2FA/3FA</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-gray-700">Verificación Biométrica</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-gray-700">Detección de Anomalías</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-gray-700">Alertas en Tiempo Real</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Protección Garantizada</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">99.8%</p>
            <p className="text-gray-600 text-sm">Reducción de riesgo de hackeo</p>
            <div className="mt-4 p-3 bg-white/50 rounded-lg">
              <p className="text-xs text-gray-700">
                <strong>SecureAuth Pro</strong> utiliza múltiples capas de seguridad para proteger tu organización
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente principal
const SecureAuthPro = () => {
  const [currentView, setCurrentView] = useState('login');
  const [loginStep, setLoginStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '', phone: '', code: '' });
  const [verificationMethod, setVerificationMethod] = useState('email');
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [suspiciousAttempts] = useState([
    { id: 1, ip: '192.168.1.100', location: 'Madrid, España', time: '2025-06-14 14:30', status: 'blocked', reason: 'IP sospechosa' },
    { id: 2, ip: '10.0.0.5', location: 'Barcelona, España', time: '2025-06-14 14:25', status: 'warning', reason: 'Múltiples intentos' },
    { id: 3, ip: '203.0.113.1', location: 'Beijing, China', time: '2025-06-14 14:20', status: 'blocked', reason: 'Geolocalización inusual' }
  ]);

  useEffect(() => {
    // Simular verificación de soporte biométrico
    if (navigator.credentials && window.PublicKeyCredential) {
      setBiometricSupported(true);
    }
  }, []);

  const handleBiometricAuth = async () => {
    try {
      // Simulación de autenticación biométrica
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentView('dashboard');
    } catch (error) {
      alert('Error en autenticación biométrica');
    }
  };

  const handleLogin = () => {
    if (loginStep === 1 && loginData.email && loginData.password) {
      // Paso 1: Email y contraseña completados, ir a configurar teléfono
      setLoginStep(2);
    } else if (loginStep === 2 && loginData.phone) {
      // Paso 2: Teléfono configurado, enviar código y ir a verificación
      setLoginStep(3);
      sendVerificationCode();
    } else if (loginStep === 3 && loginData.code) {
      // Paso 3: Código verificado, acceder al dashboard
      setCurrentView('dashboard');
    }
  };

  const sendVerificationCode = async () => {
    console.log(`📱 Enviando código ${verificationMethod === 'sms' ? 'SMS' : 'Email'} a:`, 
                verificationMethod === 'sms' ? loginData.phone : loginData.email);
    
    try {
      // Simulación del envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`✅ Código enviado por ${verificationMethod === 'sms' ? 'SMS' : 'Email'}`);
    } catch (error) {
      alert('❌ Error al enviar código');
    }
  };

  return currentView === 'login' ? (
    <LoginForm 
      loginStep={loginStep}
      setLoginStep={setLoginStep}
      loginData={loginData}
      setLoginData={setLoginData}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      verificationMethod={verificationMethod}
      setVerificationMethod={setVerificationMethod}
      biometricSupported={biometricSupported}
      handleLogin={handleLogin}
      handleBiometricAuth={handleBiometricAuth}
      sendVerificationCode={sendVerificationCode}
    />
  ) : (
    <Dashboard 
      suspiciousAttempts={suspiciousAttempts}
      setCurrentView={setCurrentView}
    />
  );
};

export default SecureAuthPro;