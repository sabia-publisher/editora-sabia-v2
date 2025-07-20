/**
 * Brazilian Validation Utilities
 * Provides CEP lookup, document validation, and address formatting for Brazilian users
 */

// CEP API service (using ViaCEP)
export const lookupCEP = async (cep) => {
  const cleanCEP = cep.replace(/\D/g, '')
  
  if (cleanCEP.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos')
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
    const data = await response.json()
    
    if (data.erro) {
      throw new Error('CEP não encontrado')
    }
    
    return {
      zipCode: cleanCEP,
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      country: 'Brasil',
      complement: data.complemento || ''
    }
  } catch (error) {
    console.error('Error looking up CEP:', error)
    throw new Error('Erro ao buscar CEP. Verifique sua conexão.')
  }
}

// Document formatting utilities
export const formatCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '')
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const formatCNPJ = (cnpj) => {
  const cleaned = cnpj.replace(/\D/g, '')
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

export const formatCEP = (cep) => {
  const cleaned = cep.replace(/\D/g, '')
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
}

export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

// Document validation helpers
export const cleanDocument = (doc) => doc?.replace(/\D/g, '') || ''

export const validateCPF = (cpf) => {
  const cleaned = cleanDocument(cpf)
  if (cleaned.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleaned)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  return remainder === parseInt(cleaned.charAt(10))
}

export const validateCNPJ = (cnpj) => {
  const cleaned = cleanDocument(cnpj)
  if (cleaned.length !== 14) return false
  if (/^(\d)\1{13}$/.test(cleaned)) return false

  let length = cleaned.length - 2
  let numbers = cleaned.substring(0, length)
  let digits = cleaned.substring(length)
  let sum = 0
  let pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false

  length = length + 1
  numbers = cleaned.substring(0, length)
  sum = 0
  pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return result === parseInt(digits.charAt(1))
}

export const validateCEP = (cep) => {
  const cleaned = cleanDocument(cep)
  return /^\d{8}$/.test(cleaned)
}

// Brazilian states
export const BRAZILIAN_STATES = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' }
]

// Business type options
export const BUSINESS_TYPES = [
  { value: 'mei', label: 'MEI - Microempreendedor Individual' },
  { value: 'ltda', label: 'LTDA - Sociedade Limitada' },
  { value: 'sa', label: 'S.A. - Sociedade Anônima' },
  { value: 'eireli', label: 'EIRELI - Empresa Individual de Responsabilidade Limitada' },
  { value: 'outro', label: 'Outro' }
]

// Gender options
export const GENDER_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'outro', label: 'Outro' },
  { value: 'nao_informado', label: 'Prefiro não informar' }
]

// Contact preference options
export const CONTACT_PREFERENCES = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Telefone' },
  { value: 'both', label: 'Ambos' }
]

// Account status options
export const ACCOUNT_STATUS = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'suspended', label: 'Suspenso' },
  { value: 'pending_verification', label: 'Aguardando Verificação' }
]

// Verification levels
export const VERIFICATION_LEVELS = [
  { value: 'none', label: 'Nenhuma' },
  { value: 'email', label: 'Email Verificado' },
  { value: 'phone', label: 'Telefone Verificado' },
  { value: 'documents', label: 'Documentos Verificados' },
  { value: 'full', label: 'Verificação Completa' }
]

// Utility to validate if a state code is valid
export const isValidState = (stateCode) => {
  return BRAZILIAN_STATES.some(state => state.code === stateCode.toUpperCase())
}

// Utility to get state name from code
export const getStateName = (stateCode) => {
  const state = BRAZILIAN_STATES.find(s => s.code === stateCode.toUpperCase())
  return state?.name || stateCode
}

// Utility to format full address
export const formatAddress = (address) => {
  const parts = []
  
  if (address.street) parts.push(address.street)
  if (address.number) parts.push(address.number)
  if (address.complement) parts.push(address.complement)
  if (address.neighborhood) parts.push(address.neighborhood)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.zipCode) parts.push(formatCEP(address.zipCode))
  
  return parts.join(', ')
}

// Composable for CEP lookup with reactive state
export const useCEPLookup = () => {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)
  
  const lookup = async (cep) => {
    loading.value = true
    error.value = null
    data.value = null
    
    try {
      const result = await lookupCEP(cep)
      data.value = result
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const reset = () => {
    loading.value = false
    error.value = null
    data.value = null
  }
  
  return {
    loading: readonly(loading),
    error: readonly(error),
    data: readonly(data),
    lookup,
    reset
  }
} 