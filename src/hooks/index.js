// Exports de todos los hooks personalizados
export { useAuth } from './useAuth'
export { default as useLocalStorage, useUserPreferences, useAppSettings, useSessionHistory, useTempCache } from './useLocalStorage'
export { default as useValidation, useLoginValidation, useRegisterValidation, validationRules } from './useValidation'
export { default as useNotification } from './useNotification'
export { default as useBiometric } from './useBiometric'

// Re-export de hooks de contextos para conveniencia
export { useAuth as useAuthContext } from '@/contexts/AuthContext'
export { useTheme } from '@/contexts/ThemeContext'
export { useNotification as useNotificationContext } from '@/contexts/NotificationContext'