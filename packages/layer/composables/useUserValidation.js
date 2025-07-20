import { z } from 'zod'
import { 
  validateUserSignup,
  validateUserUpdate,
  validateUser,
  UserSignupSchema,
  UserUpdateSchema,
  UserSchema
} from '@repo/zod-schemas'

/**
 * Simplified composable for basic user validation
 * Focus: LoginForm.vue and basic authentication
 */
export const useUserValidation = () => {
  const errors = ref({})
  const isValidating = ref(false)
  
  // Clear all errors
  const clearErrors = () => {
    errors.value = {}
  }
  
  // Clear specific field error
  const clearFieldError = (field) => {
    if (errors.value[field]) {
      delete errors.value[field]
    }
  }
  
  // Set field error
  const setFieldError = (field, message) => {
    errors.value[field] = message
  }
  
  // Validate email field
  const validateEmailField = (email) => {
    if (!email) {
      setFieldError('email', 'E-mail é obrigatório')
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setFieldError('email', 'E-mail inválido')
      return false
    }
    
    clearFieldError('email')
    return true
  }
  
  // Validate password field
  const validatePasswordField = (password) => {
    if (!password) {
      setFieldError('password', 'Senha é obrigatória')
      return false
    }
    
    if (password.length < 6) {
      setFieldError('password', 'Senha deve ter pelo menos 6 caracteres')
      return false
    }
    
    clearFieldError('password')
    return true
  }
  
  // Validate signup data
  const validateSignupData = async (data) => {
    isValidating.value = true
    clearErrors()
    
    try {
      const validatedData = await UserSignupSchema.parseAsync(data)
      isValidating.value = false
      return { success: true, data: validatedData, errors: {} }
    } catch (error) {
      const fieldErrors = {}
      
      error.errors?.forEach(err => {
        const field = err.path.join('.')
        fieldErrors[field] = err.message
      })
      
      errors.value = fieldErrors
      isValidating.value = false
      return { success: false, data: null, errors: fieldErrors }
    }
  }
  
  // Validate user update data
  const validateUpdateData = async (data) => {
    isValidating.value = true
    clearErrors()
    
    try {
      const validatedData = await UserUpdateSchema.parseAsync(data)
      isValidating.value = false
      return { success: true, data: validatedData, errors: {} }
    } catch (error) {
      const fieldErrors = {}
      
      error.errors?.forEach(err => {
        const field = err.path.join('.')
        fieldErrors[field] = err.message
      })
      
      errors.value = fieldErrors
      isValidating.value = false
      return { success: false, data: null, errors: fieldErrors }
    }
  }
  
  // Check if form has any errors
  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })
  
  // Get error for specific field
  const getFieldError = (field) => {
    return computed(() => errors.value[field] || null)
  }
  
  // Check if specific field has error
  const hasFieldError = (field) => {
    return computed(() => !!errors.value[field])
  }
  
  return {
    // State
    errors: readonly(errors),
    isValidating: readonly(isValidating),
    hasErrors,
    
    // Field validation
    validateEmailField,
    validatePasswordField,
    
    // Form validation
    validateSignupData,
    validateUpdateData,
    
    // Error management
    clearErrors,
    clearFieldError,
    setFieldError,
    getFieldError,
    hasFieldError
  }
}

// =============================================================================
// ADVANCED VALIDATION COMPOSABLES (COMMENTED OUT FOR LATER)
// =============================================================================
//
// Uncomment and enhance these composables as needed:
// - useAddressValidation: CEP lookup and Brazilian address validation
// - useDocumentValidation: CPF/CNPJ validation  
// - usePasswordValidation: Advanced password strength validation
//
// =============================================================================

/*
// Complex validation composables for future use

import { 
  CPFSchema,
  CNPJSchema,
  CEPSchema,
  PhoneSchema
} from '@repo/zod-schemas'
import { 
  validateCPF,
  validateCNPJ,
  validateCEP,
  formatCPF,
  formatCNPJ,
  formatCEP,
  formatPhone,
  useCEPLookup
} from '../utils/brazilian-validators'

export const useAddressValidation = () => {
  const cepLookup = useCEPLookup()
  const address = ref({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    isMain: true,
    label: ''
  })
  
  // Auto-fill address from CEP
  const fillAddressFromCEP = async (cep) => {
    try {
      const result = await cepLookup.lookup(cep)
      
      // Update address fields
      address.value = {
        ...address.value,
        street: result.street,
        neighborhood: result.neighborhood,
        city: result.city,
        state: result.state,
        zipCode: result.zipCode,
        country: result.country
      }
      
      return result
    } catch (error) {
      throw error
    }
  }
  
  // Validate complete address
  const validateAddress = async () => {
    try {
      const validatedAddress = await AddressSchema.parseAsync(address.value)
      return { success: true, data: validatedAddress, error: null }
    } catch (error) {
      const message = error.errors?.[0]?.message || 'Endereço inválido'
      return { success: false, data: null, error: message }
    }
  }
  
  // Reset address
  const resetAddress = () => {
    address.value = {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Brasil',
      isMain: true,
      label: ''
    }
  }
  
  return {
    // State
    address,
    
    // CEP lookup
    cepLoading: cepLookup.loading,
    cepError: cepLookup.error,
    cepData: cepLookup.data,
    
    // Actions
    fillAddressFromCEP,
    validateAddress,
    resetAddress,
    resetCEPLookup: cepLookup.reset
  }
}

export const useDocumentValidation = () => {
  const documentType = ref('cpf') // 'cpf' or 'cnpj'
  const documentValue = ref('')
  const isValid = ref(false)
  const error = ref(null)
  
  // Validate current document
  const validateDocument = () => {
    error.value = null
    isValid.value = false
    
    if (!documentValue.value) {
      error.value = 'Documento é obrigatório'
      return false
    }
    
    const cleaned = documentValue.value.replace(/\D/g, '')
    
    if (documentType.value === 'cpf') {
      if (!validateCPF(cleaned)) {
        error.value = 'CPF inválido'
        return false
      }
    } else if (documentType.value === 'cnpj') {
      if (!validateCNPJ(cleaned)) {
        error.value = 'CNPJ inválido'
        return false
      }
    }
    
    isValid.value = true
    return true
  }
  
  // Format document value
  const formatDocument = () => {
    if (!documentValue.value) return
    
    const cleaned = documentValue.value.replace(/\D/g, '')
    
    if (documentType.value === 'cpf') {
      documentValue.value = formatCPF(cleaned)
    } else if (documentType.value === 'cnpj') {
      documentValue.value = formatCNPJ(cleaned)
    }
  }
  
  // Watch for changes and validate
  watch([documentType, documentValue], () => {
    if (documentValue.value) {
      validateDocument()
    }
  })
  
  return {
    // State
    documentType,
    documentValue,
    isValid: readonly(isValid),
    error: readonly(error),
    
    // Actions
    validateDocument,
    formatDocument
  }
}

export const usePasswordValidation = () => {
  const password = ref('')
  const confirmPassword = ref('')
  const errors = ref({})
  
  // Password requirements
  const requirements = {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumbers: /\d/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
  }
  
  // Validate password strength
  const validatePassword = () => {
    const pwd = password.value
    errors.value = {}
    
    if (!pwd) {
      errors.value.password = 'Senha é obrigatória'
      return false
    }
    
    if (pwd.length < requirements.minLength) {
      errors.value.password = `Senha deve ter pelo menos ${requirements.minLength} caracteres`
      return false
    }
    
    if (!requirements.hasUpperCase.test(pwd)) {
      errors.value.password = 'Senha deve ter pelo menos uma letra maiúscula'
      return false
    }
    
    if (!requirements.hasLowerCase.test(pwd)) {
      errors.value.password = 'Senha deve ter pelo menos uma letra minúscula'
      return false
    }
    
    if (!requirements.hasNumbers.test(pwd)) {
      errors.value.password = 'Senha deve ter pelo menos um número'
      return false
    }
    
    return true
  }
  
  // Validate password confirmation
  const validateConfirmPassword = () => {
    if (!confirmPassword.value) {
      errors.value.confirmPassword = 'Confirmação de senha é obrigatória'
      return false
    }
    
    if (password.value !== confirmPassword.value) {
      errors.value.confirmPassword = 'Senhas não coincidem'
      return false
    }
    
    delete errors.value.confirmPassword
    return true
  }
  
  // Calculate password strength (0-100)
  const passwordStrength = computed(() => {
    const pwd = password.value
    if (!pwd) return 0
    
    let score = 0
    
    // Length score (up to 40 points)
    score += Math.min(pwd.length * 5, 40)
    
    // Character type scores (15 points each)
    if (requirements.hasUpperCase.test(pwd)) score += 15
    if (requirements.hasLowerCase.test(pwd)) score += 15
    if (requirements.hasNumbers.test(pwd)) score += 15
    if (requirements.hasSpecialChar.test(pwd)) score += 15
    
    return Math.min(score, 100)
  })
  
  // Password strength label
  const passwordStrengthLabel = computed(() => {
    const strength = passwordStrength.value
    if (strength < 30) return 'Fraca'
    if (strength < 60) return 'Média'
    if (strength < 80) return 'Forte'
    return 'Muito Forte'
  })
  
  // Password strength color
  const passwordStrengthColor = computed(() => {
    const strength = passwordStrength.value
    if (strength < 30) return 'red'
    if (strength < 60) return 'orange'
    if (strength < 80) return 'yellow'
    return 'green'
  })
  
  // Watch for changes
  watch(password, validatePassword)
  watch(confirmPassword, validateConfirmPassword)
  
  return {
    // State
    password,
    confirmPassword,
    errors: readonly(errors),
    
    // Computed
    passwordStrength,
    passwordStrengthLabel,
    passwordStrengthColor,
    
    // Actions
    validatePassword,
    validateConfirmPassword,
    
    // Requirements for UI display
    requirements
  }
}
*/ 