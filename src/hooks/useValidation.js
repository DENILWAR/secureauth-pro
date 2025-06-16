import { useState, useCallback, useMemo } from 'react'

/**
 * Hook personalizado para validación de formularios
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationRules - Reglas de validación
 * @param {Object} options - Opciones adicionales
 */
export const useValidation = (initialValues = {}, validationRules = {}, options = {}) => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    showFirstErrorOnly = false,
  } = options

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Función para validar un campo específico
  const validateField = useCallback((fieldName, value) => {
    const rules = validationRules[fieldName]
    if (!rules) return []

    const fieldErrors = []

    // Recorrer todas las reglas para el campo
    for (const rule of rules) {
      try {
        const result = rule.validator(value, values)
        if (!result) {
          fieldErrors.push(rule.message)
          if (showFirstErrorOnly) break
        }
      } catch (error) {
        fieldErrors.push(`Error de validación: ${error.message}`)
      }
    }

    return fieldErrors
  }, [validationRules, values, showFirstErrorOnly])

  // Función para validar todos los campos
  const validateAllFields = useCallback(() => {
    const newErrors = {}
    
    Object.keys(validationRules).forEach(fieldName => {
      const fieldErrors = validateField(fieldName, values[fieldName])
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [validationRules, validateField, values])

  // Función para establecer valor de un campo
  const setValue = useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value,
    }))

    // Validar en tiempo real si está habilitado
    if (validateOnChange && touched[fieldName]) {
      const fieldErrors = validateField(fieldName, value)
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldErrors.length > 0 ? fieldErrors : undefined,
      }))
    }
  }, [validateOnChange, validateField, touched])

  // Función para manejar blur de un campo
  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true,
    }))

    if (validateOnBlur) {
      const fieldErrors = validateField(fieldName, values[fieldName])
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldErrors.length > 0 ? fieldErrors : undefined,
      }))
    }
  }, [validateOnBlur, validateField, values])

  // Función para limpiar errores
  const clearErrors = useCallback((fieldName) => {
    if (fieldName) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined,
      }))
    } else {
      setErrors({})
    }
  }, [])

  // Función para establecer error manual
  const setError = useCallback((fieldName, errorMessage) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: [errorMessage],
    }))
  }, [])

  // Función para resetear el formulario
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  // Validar si el formulario es válido
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && 
           Object.keys(errors).every(key => !errors[key] || errors[key].length === 0)
  }, [errors])

  // Verificar si hay campos tocados
  const isDirty = useMemo(() => {
    return Object.keys(touched).some(key => touched[key])
  }, [touched])

  // Obtener primer error de un campo
  const getFieldError = useCallback((fieldName) => {
    const fieldErrors = errors[fieldName]
    return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : undefined
  }, [errors])

  // Verificar si un campo tiene error
  const hasFieldError = useCallback((fieldName) => {
    const fieldErrors = errors[fieldName]
    return fieldErrors && fieldErrors.length > 0
  }, [errors])

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    setValue,
    handleBlur,
    validateField,
    validateAllFields,
    clearErrors,
    setError,
    reset,
    getFieldError,
    hasFieldError,
  }
}

// Reglas de validación predefinidas
export const validationRules = {
  required: (message = 'Este campo es requerido') => ({
    validator: (value) => {
      if (typeof value === 'string') {
        return value.trim().length > 0
      }
      return value !== null && value !== undefined && value !== ''
    },
    message,
  }),

  email: (message = 'Formato de email inválido') => ({
    validator: (value) => {
      if (!value) return true // Solo validar si hay valor
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    message,
  }),

  minLength: (min, message) => ({
    validator: (value) => {
      if (!value) return true
      return value.length >= min
    },
    message: message || `Debe tener al menos ${min} caracteres`,
  }),

  maxLength: (max, message) => ({
    validator: (value) => {
      if (!value) return true
      return value.length <= max
    },
    message: message || `No debe exceder ${max} caracteres`,
  }),

  password: (message = 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números') => ({
    validator: (value) => {
      if (!value) return true
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
      return passwordRegex.test(value)
    },
    message,
  }),

  phone: (message = 'Formato de teléfono inválido') => ({
    validator: (value) => {
      if (!value) return true
      const phoneRegex = /^(\+34|0034|34)?[6789]\d{8}$/
      return phoneRegex.test(value.replace(/\s/g, ''))
    },
    message,
  }),

  numeric: (message = 'Solo se permiten números') => ({
    validator: (value) => {
      if (!value) return true
      return /^\d+$/.test(value)
    },
    message,
  }),

  alphanumeric: (message = 'Solo se permiten letras y números') => ({
    validator: (value) => {
      if (!value) return true
      return /^[a-zA-Z0-9]+$/.test(value)
    },
    message,
  }),

  twoFactorCode: (message = 'El código debe tener exactamente 6 dígitos') => ({
    validator: (value) => {
      if (!value) return true
      return /^\d{6}$/.test(value)
    },
    message,
  }),

  url: (message = 'URL inválida') => ({
    validator: (value) => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message,
  }),

  custom: (validatorFn, message) => ({
    validator: validatorFn,
    message,
  }),
}

// Hook específico para validación de login
export const useLoginValidation = () => {
  return useValidation(
    {
      email: '',
      password: '',
      phone: '',
      code: '',
    },
    {
      email: [
        validationRules.required('El email es requerido'),
        validationRules.email(),
      ],
      password: [
        validationRules.required('La contraseña es requerida'),
        validationRules.minLength(6, 'La contraseña debe tener al menos 6 caracteres'),
      ],
      phone: [
        validationRules.phone(),
      ],
      code: [
        validationRules.required('El código es requerido'),
        validationRules.twoFactorCode(),
      ],
    },
    {
      validateOnChange: true,
      validateOnBlur: true,
    }
  )
}

// Hook para validación de registro
export const useRegisterValidation = () => {
  return useValidation(
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    {
      firstName: [
        validationRules.required('El nombre es requerido'),
        validationRules.minLength(2, 'El nombre debe tener al menos 2 caracteres'),
      ],
      lastName: [
        validationRules.required('El apellido es requerido'),
        validationRules.minLength(2, 'El apellido debe tener al menos 2 caracteres'),
      ],
      email: [
        validationRules.required('El email es requerido'),
        validationRules.email(),
      ],
      phone: [
        validationRules.required('El teléfono es requerido'),
        validationRules.phone(),
      ],
      password: [
        validationRules.required('La contraseña es requerida'),
        validationRules.password(),
      ],
      confirmPassword: [
        validationRules.required('Confirma tu contraseña'),
        validationRules.custom(
          (value, allValues) => value === allValues.password,
          'Las contraseñas no coinciden'
        ),
      ],
      terms: [
        validationRules.custom(
          (value) => value === true,
          'Debes aceptar los términos y condiciones'
        ),
      ],
    }
  )
}

export default useValidation