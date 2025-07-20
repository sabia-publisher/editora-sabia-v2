import { z } from 'zod'

// =============================================================================
// SIMPLIFIED USER SCHEMAS FOR BASIC AUTHENTICATION
// =============================================================================
// 
// NOTE: This file has been simplified for the initial project stage.
// The complex validation logic below is commented out and can be
// progressively uncommented and enhanced as the project grows.
//
// Current focus: Basic authentication with LoginForm.vue
// =============================================================================

// Basic user schema for authentication
export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email('Email inválido'),
  emailVerified: z.boolean().default(false),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

// Basic signup schema
export const UserSignupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  agreeToTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos de uso'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

// Basic update schema
export const UserUpdateSchema = z.object({
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  updatedAt: z.string().optional(),
})

// Validation helpers
export const validateUser = (data) => UserSchema.parse(data)
export const validateUserSignup = (data) => UserSignupSchema.parse(data)
export const validateUserUpdate = (data) => UserUpdateSchema.parse(data)

// =============================================================================
// COMPLEX VALIDATION SCHEMAS (COMMENTED OUT FOR LATER)
// =============================================================================
// 
// Uncomment and enhance these schemas progressively as needed:
//
// - Brazilian document validation (CPF, CNPJ, CEP)
// - Address validation
// - Business information
// - User permissions and roles
// - User preferences
// - Account metadata
// - And much more...
//
// =============================================================================

/*
// Brazilian document validation helpers
const cleanDocument = (doc) => doc?.replace(/\D/g, '') || ''

const validateCPF = (cpf) => {
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

const validateCNPJ = (cnpj) => {
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

const validateCEP = (cep) => {
  const cleaned = cleanDocument(cep)
  return /^\d{8}$/.test(cleaned)
}

// Document schemas
export const CPFSchema = z
  .string()
  .min(1, 'CPF é obrigatório')
  .refine((cpf) => validateCPF(cpf), 'CPF inválido')
  .transform(cleanDocument)

export const CNPJSchema = z
  .string()
  .min(1, 'CNPJ é obrigatório')
  .refine((cnpj) => validateCNPJ(cnpj), 'CNPJ inválido')
  .transform(cleanDocument)

export const CEPSchema = z
  .string()
  .min(1, 'CEP é obrigatório')
  .refine((cep) => validateCEP(cep), 'CEP deve ter 8 dígitos')
  .transform(cleanDocument)

export const PhoneSchema = z
  .string()
  .min(10, 'Telefone deve ter pelo menos 10 dígitos')
  .max(15, 'Telefone deve ter no máximo 15 dígitos')
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Formato de telefone inválido')

// Address schema for Brazilian addresses
export const AddressSchema = z.object({
  street: z.string().min(1, 'Logradouro é obrigatório').max(255),
  number: z.string().min(1, 'Número é obrigatório').max(20),
  complement: z.string().max(100).optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório').max(100),
  city: z.string().min(1, 'Cidade é obrigatória').max(100),
  state: z.string().min(2, 'Estado é obrigatório').max(2),
  zipCode: CEPSchema,
  country: z.string().default('Brasil'),
  isMain: z.boolean().default(true),
  label: z.string().max(50).optional(), // "Casa", "Trabalho", etc.
})

// Document information
export const DocumentsSchema = z.object({
  cpf: CPFSchema.optional(),
  cnpj: CNPJSchema.optional(),
  rg: z.string().max(20).optional(),
  rgIssuer: z.string().max(10).optional(), // Órgão emissor
  rgIssueDate: z.string().datetime().optional(),
  passport: z.string().max(20).optional(),
  driverLicense: z.string().max(20).optional(),
}).refine((data) => data.cpf || data.cnpj, {
  message: 'CPF ou CNPJ é obrigatório',
  path: ['cpf']
})

// Personal information
export const PersonalInfoSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório').max(100),
  lastName: z.string().min(1, 'Sobrenome é obrigatório').max(100),
  fullName: z.string().max(200), // Auto-generated from firstName + lastName
  birthDate: z.string().datetime().optional(),
  gender: z.enum(['masculino', 'feminino', 'outro', 'nao_informado']).optional(),
  nationality: z.string().default('brasileira'),
  profession: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
})

// Contact information
export const ContactInfoSchema = z.object({
  email: z.string().email('Email inválido'),
  emailVerified: z.boolean().default(false),
  phone: PhoneSchema.optional(),
  phoneVerified: z.boolean().default(false),
  alternativePhone: PhoneSchema.optional(),
  preferredContact: z.enum(['email', 'phone', 'both']).default('email'),
})

// Account type and business information
export const AccountTypeSchema = z.enum(['individual', 'business'])

export const BusinessInfoSchema = z.object({
  companyName: z.string().min(1, 'Razão social é obrigatória').max(200),
  tradeName: z.string().max(200).optional(), // Nome fantasia
  businessType: z.enum(['mei', 'ltda', 'sa', 'eireli', 'outro']).optional(),
  businessArea: z.string().max(100).optional(), // Área de atuação
  website: z.string().url().optional(),
  cnpj: CNPJSchema,
}).optional()

// User permissions and roles
export const UserPermissionsSchema = z.object({
  // Basic access permissions
  canAccessEcommerce: z.boolean().default(false),
  canAccessEditorial: z.boolean().default(false),
  canAccessWebsite: z.boolean().default(true),
  
  // Editorial permissions
  canCreateContent: z.boolean().default(false),
  canEditContent: z.boolean().default(false),
  canPublishContent: z.boolean().default(false),
  canDeleteContent: z.boolean().default(false),
  canManageAuthors: z.boolean().default(false),
  
  // Ecommerce permissions
  canManageProducts: z.boolean().default(false),
  canManageOrders: z.boolean().default(false),
  canViewSales: z.boolean().default(false),
  canManageCustomers: z.boolean().default(false),
  
  // Admin permissions
  canManageUsers: z.boolean().default(false),
  canAccessAnalytics: z.boolean().default(false),
  canManageSettings: z.boolean().default(false),
  isSuperAdmin: z.boolean().default(false),
})

// User preferences
export const UserPreferencesSchema = z.object({
  language: z.string().default('pt-BR'),
  timezone: z.string().default('America/Sao_Paulo'),
  currency: z.string().default('BRL'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    push: z.boolean().default(true),
    marketing: z.boolean().default(false),
  }).default({}),
  privacy: z.object({
    profilePublic: z.boolean().default(false),
    showEmail: z.boolean().default(false),
    showPhone: z.boolean().default(false),
  }).default({}),
})

// Account status and metadata
export const AccountMetaSchema = z.object({
  status: z.enum(['active', 'inactive', 'suspended', 'pending_verification']).default('pending_verification'),
  verificationLevel: z.enum(['none', 'email', 'phone', 'documents', 'full']).default('none'),
  tags: z.array(z.string()).default([]), // For categorizing users
  notes: z.string().max(1000).optional(), // Admin notes
  referralCode: z.string().optional(),
  referredBy: z.string().optional(),
})

// Firebase Auth data (minimal)
export const FirebaseAuthSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  createdAt: z.string().datetime().optional(),
  lastLoginAt: z.string().datetime().optional(),
})

// Main User Schema - Complete user profile
export const UserSchema = z.object({
  // Firebase authentication data
  uid: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  
  // Account type and business info
  accountType: AccountTypeSchema.default('individual'),
  businessInfo: BusinessInfoSchema.optional(),
  
  // Personal information
  personalInfo: PersonalInfoSchema,
  
  // Contact information
  contactInfo: ContactInfoSchema,
  
  // Documents
  documents: DocumentsSchema,
  
  // Addresses (array to support multiple addresses)
  addresses: z.array(AddressSchema).default([]),
  
  // Permissions and roles
  permissions: UserPermissionsSchema.default({}),
  
  // User preferences
  preferences: UserPreferencesSchema.default({}),
  
  // Account metadata
  meta: AccountMetaSchema.default({}),
  
  // Timestamps
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).refine((data) => {
  // If business account, business info is required
  if (data.accountType === 'business') {
    return !!data.businessInfo
  }
  return true
}, {
  message: 'Informações da empresa são obrigatórias para contas empresariais',
  path: ['businessInfo']
}).refine((data) => {
  // For business accounts, CNPJ in documents should match business CNPJ
  if (data.accountType === 'business' && data.businessInfo?.cnpj && data.documents.cnpj) {
    return data.businessInfo.cnpj === data.documents.cnpj
  }
  return true
}, {
  message: 'CNPJ da empresa deve coincidir com o CNPJ nos documentos',
  path: ['businessInfo', 'cnpj']
})

// Schemas for different operations
export const UserSignupSchema = z.object({
  // Required for signup
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string(),
  
  // Personal info required for signup
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  phone: PhoneSchema.optional(),
  
  // Account type
  accountType: AccountTypeSchema.default('individual'),
  
  // Documents
  cpf: CPFSchema.optional(),
  cnpj: CNPJSchema.optional(),
  
  // Business info (if business account)
  companyName: z.string().optional(),
  
  // Address (at least one required)
  address: AddressSchema,
  
  // Agreements
  agreeToTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos de uso'),
  agreeToPrivacy: z.boolean().refine(val => val === true, 'Você deve aceitar a política de privacidade'),
  agreeToMarketing: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
}).refine((data) => {
  // Require CPF for individual or CNPJ for business
  if (data.accountType === 'individual') {
    return !!data.cpf
  } else {
    return !!data.cnpj && !!data.companyName
  }
}, {
  message: 'CPF é obrigatório para pessoas físicas, CNPJ e razão social para empresas',
  path: ['cpf']
})

// Schema for user profile updates
export const UserUpdateSchema = UserSchema.omit({
  uid: true,
  createdAt: true,
}).partial().extend({
  updatedAt: z.string().datetime()
})

// Schema for admin user management
export const AdminUserUpdateSchema = UserSchema.partial().extend({
  uid: z.string(), // Required for admin updates
  updatedAt: z.string().datetime(),
  adminNotes: z.string().max(1000).optional(),
})

// Additional validation helpers
export const validateUserSignup = (data) => UserSignupSchema.parse(data)
export const validateUserUpdate = (data) => UserUpdateSchema.parse(data)
export const validateAdminUserUpdate = (data) => AdminUserUpdateSchema.parse(data)

// Type exports for TypeScript (will be ignored in JavaScript)
export const UserSchemaType = UserSchema
export const UserSignupSchemaType = UserSignupSchema
export const UserUpdateSchemaType = UserUpdateSchema 
*/ 