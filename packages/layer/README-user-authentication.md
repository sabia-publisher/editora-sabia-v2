# Firebase Email/Password Authentication with Brazilian User Management

This documentation covers the comprehensive user authentication and profile management system for the Editora Sabia V2 platform, featuring Brazilian-specific validation, documents, and address management.

## 🎯 **Overview**

The authentication system uses **Firebase Authentication with Email/Password only** and stores comprehensive user profiles in **Firestore** with full Brazilian compliance including:

- **CPF/CNPJ validation** with proper algorithms
- **CEP address lookup** with ViaCEP integration  
- **Business and individual accounts** with different requirements
- **Permission-based access control** across applications
- **Cross-subdomain authentication** with cookies
- **Comprehensive profile management** with validation

## 🏗️ **Architecture**

### **Core Components**

1. **Zod Schemas** (`packages/zod-schemas/user.js`)
   - Comprehensive validation for all user data
   - Brazilian-specific validators (CPF, CNPJ, CEP)
   - Multiple schemas for different operations

2. **User Store** (`packages/layer/stores/user.js`)
   - Pinia Colada-powered reactive state management
   - Firebase Authentication integration
   - Firestore data persistence

3. **Validation Composables** (`packages/layer/composables/useUserValidation.js`)
   - Reactive form validation
   - Real-time error handling
   - Brazilian document and address validation

4. **Brazilian Utilities** (`packages/layer/utils/brazilian-validators.js`)
   - CEP lookup with ViaCEP API
   - Document formatting and validation
   - Address and phone number formatting

## 📋 **User Data Structure**

### **Complete User Schema**

```javascript
{
  // Firebase Authentication
  uid: "string",
  email: "email@example.com",
  emailVerified: false,
  displayName: "João Silva",
  photoURL: "https://...",
  
  // Account Type
  accountType: "individual" | "business",
  
  // Personal Information
  personalInfo: {
    firstName: "João",
    lastName: "Silva", 
    fullName: "João Silva",
    birthDate: "1990-01-01T00:00:00Z",
    gender: "masculino" | "feminino" | "outro" | "nao_informado",
    nationality: "brasileira",
    profession: "Editor",
    bio: "..."
  },
  
  // Contact Information
  contactInfo: {
    email: "joao@example.com",
    emailVerified: false,
    phone: "+5511999999999",
    phoneVerified: false,
    alternativePhone: "+5511888888888",
    preferredContact: "email" | "phone" | "both"
  },
  
  // Documents
  documents: {
    cpf: "12345678901",        // Individual accounts
    cnpj: "12345678000195",    // Business accounts  
    rg: "123456789",
    rgIssuer: "SSP-SP",
    rgIssueDate: "2010-01-01T00:00:00Z",
    passport: "BR123456",
    driverLicense: "12345678901"
  },
  
  // Addresses (array for multiple addresses)
  addresses: [{
    street: "Rua das Flores",
    number: "123",
    complement: "Apto 45",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234567",
    country: "Brasil",
    isMain: true,
    label: "Casa"
  }],
  
  // Business Information (if business account)
  businessInfo: {
    companyName: "Editora ABC Ltda",
    tradeName: "ABC Livros",
    businessType: "ltda",
    businessArea: "Editorial",
    website: "https://abclivros.com",
    cnpj: "12345678000195"
  },
  
  // Permissions and Roles
  permissions: {
    canAccessEcommerce: false,
    canAccessEditorial: true,
    canAccessWebsite: true,
    canCreateContent: false,
    canEditContent: true,
    canPublishContent: false,
    canDeleteContent: false,
    canManageAuthors: false,
    canManageProducts: false,
    canManageOrders: false,
    canViewSales: false,
    canManageCustomers: false,
    canManageUsers: false,
    canAccessAnalytics: false,
    canManageSettings: false,
    isSuperAdmin: false
  },
  
  // User Preferences
  preferences: {
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    currency: "BRL",
    theme: "system",
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    },
    privacy: {
      profilePublic: false,
      showEmail: false,
      showPhone: false
    }
  },
  
  // Account Metadata
  meta: {
    status: "active",
    verificationLevel: "email",
    tags: ["cliente-premium"],
    notes: "Admin notes...",
    referralCode: "ABC123",
    referredBy: "user-uid-here"
  },
  
  // Timestamps
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

## 🔧 **Implementation Guide**

### **1. User Signup**

```vue
<script setup>
import { useAuthUser } from '@/composables/useAuthUser'

const { signUp } = useAuthUser()

const handleSignup = async (formData) => {
  const signupData = {
    // Authentication
    email: "user@example.com",
    password: "SecurePassword123",
    confirmPassword: "SecurePassword123",
    
    // Personal Info
    firstName: "João",
    lastName: "Silva",
    phone: "(11) 99999-9999",
    
    // Account Type
    accountType: "individual", // or "business"
    
    // Documents
    cpf: "123.456.789-01",      // for individual
    cnpj: "12.345.678/0001-95", // for business
    companyName: "Empresa ABC", // for business
    
    // Address
    address: {
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Centro", 
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      country: "Brasil",
      isMain: true
    },
    
    // Agreements
    agreeToTerms: true,
    agreeToPrivacy: true,
    agreeToMarketing: false
  }
  
  const { user, error } = await signUp(signupData)
  
  if (error) {
    console.error('Signup failed:', error)
  } else {
    console.log('User created:', user)
  }
}
</script>
```

### **2. User Login**

```vue
<script setup>
import { useAuthUser } from '@/composables/useAuthUser'

const { signIn, isLoading } = useAuthUser()

const handleLogin = async (email, password) => {
  const { user, error } = await signIn(email, password)
  
  if (error) {
    console.error('Login failed:', error)
  } else {
    console.log('User logged in:', user)
    // User is now authenticated across all subdomains
  }
}
</script>
```

### **3. Profile Management**

```vue
<script setup>
import { useAuthUser } from '@/composables/useAuthUser'

const { 
  user, 
  updateProfile, 
  getAddresses, 
  getBusinessInfo,
  isBusinessAccount,
  getProfileCompletionPercentage 
} = useAuthUser()

// Update user profile
const handleProfileUpdate = async (updateData) => {
  const { user: updatedUser, error } = await updateProfile({
    personalInfo: {
      firstName: "João",
      lastName: "Silva Santos",
      profession: "Editor Sênior"
    },
    contactInfo: {
      phone: "(11) 98888-8888",
      preferredContact: "phone"
    }
  })
  
  if (error) {
    console.error('Update failed:', error)
  }
}

// Check profile completion
const completionPercentage = getProfileCompletionPercentage()
console.log(`Profile ${completionPercentage.value}% complete`)
</script>
```

### **4. Permission Checking**

```vue
<script setup>
import { useAuthUser } from '@/composables/useAuthUser'

const { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions 
} = useAuthUser()

// Single permission
const canEdit = hasPermission('canEditContent')

// Multiple permissions (any)
const canManageContent = hasAnyPermission([
  'canCreateContent', 
  'canEditContent', 
  'canPublishContent'
])

// Multiple permissions (all)
const isFullAdmin = hasAllPermissions([
  'canManageUsers',
  'canAccessAnalytics', 
  'canManageSettings'
])
</script>

<template>
  <div>
    <button v-if="canEdit.value">Edit Article</button>
    <nav v-if="canManageContent.value">Content Menu</nav>
    <admin-panel v-if="isFullAdmin.value" />
  </div>
</template>
```

### **5. Address Management with CEP**

```vue
<script setup>
import { useAddressValidation } from '@/composables/useUserValidation'

const {
  address,
  fillAddressFromCEP,
  cepLoading,
  cepError,
  validateAddress
} = useAddressValidation()

// Auto-fill address from CEP
const handleCEPLookup = async (cep) => {
  try {
    await fillAddressFromCEP(cep)
    console.log('Address filled:', address.value)
  } catch (error) {
    console.error('CEP lookup failed:', error)
  }
}

// Validate complete address
const handleAddressValidation = async () => {
  const { success, data, error } = await validateAddress()
  
  if (success) {
    console.log('Valid address:', data)
  } else {
    console.error('Invalid address:', error)
  }
}
</script>

<template>
  <div>
    <input 
      v-model="address.zipCode"
      @blur="handleCEPLookup(address.zipCode)"
      placeholder="00000-000"
    />
    <div v-if="cepLoading">Buscando CEP...</div>
    <div v-if="cepError" class="error">{{ cepError }}</div>
    
    <!-- Address fields auto-filled -->
    <input v-model="address.street" placeholder="Logradouro" />
    <input v-model="address.number" placeholder="Número" />
    <input v-model="address.neighborhood" placeholder="Bairro" />
    <input v-model="address.city" placeholder="Cidade" />
    <select v-model="address.state">
      <option value="SP">São Paulo</option>
      <!-- ... other states -->
    </select>
  </div>
</template>
```

### **6. Document Validation**

```vue
<script setup>
import { useDocumentValidation } from '@/composables/useUserValidation'

const {
  documentType,
  documentValue,
  isValid,
  error,
  validateDocument,
  formatDocument
} = useDocumentValidation()

// Switch between CPF and CNPJ
const handleAccountTypeChange = (type) => {
  documentType.value = type === 'business' ? 'cnpj' : 'cpf'
  documentValue.value = ''
}

// Format and validate document
const handleDocumentInput = () => {
  formatDocument()
  validateDocument()
}
</script>

<template>
  <div>
    <select @change="handleAccountTypeChange($event.target.value)">
      <option value="individual">Pessoa Física</option>
      <option value="business">Pessoa Jurídica</option>
    </select>
    
    <input
      v-model="documentValue"
      @input="handleDocumentInput"
      :placeholder="documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'"
      :class="{ 'error': error, 'valid': isValid }"
    />
    
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="isValid" class="success">✓ Documento válido</div>
  </div>
</template>
```

## 🛡️ **Security Features**

### **Authentication Security**
- **Email/Password only** - No third-party providers
- **Strong password requirements** - 8+ chars, mixed case, numbers
- **Email verification** - Required for full account access
- **Password reset** - Secure reset via email
- **Cross-subdomain cookies** - Secure, HTTP-only in production

### **Data Validation**
- **Zod schema validation** - Type-safe validation at all levels
- **Brazilian document validation** - Real CPF/CNPJ algorithm checking
- **Address validation** - CEP validation with ViaCEP lookup
- **Input sanitization** - All inputs cleaned and validated

### **Permission System**
- **Granular permissions** - Fine-grained access control
- **Role-based access** - Different permission sets for different roles
- **Application-specific permissions** - Separate permissions for each app
- **Permission inheritance** - Super admin has all permissions

## 📊 **Validation Schemas**

### **Available Schemas**

| Schema | Purpose | Usage |
|--------|---------|-------|
| `UserSignupSchema` | New user registration | Signup forms |
| `UserUpdateSchema` | Profile updates | Edit profile |
| `UserSchema` | Complete user validation | Data integrity |
| `CPFSchema` | CPF validation | Document fields |
| `CNPJSchema` | CNPJ validation | Business documents |
| `CEPSchema` | ZIP code validation | Address forms |
| `AddressSchema` | Address validation | Address management |
| `PhoneSchema` | Phone validation | Contact info |

### **Validation Usage**

```javascript
import { 
  validateUserSignup,
  validateUserUpdate,
  validateUser
} from '@repo/zod-schemas'

// Validate signup data
try {
  const validData = validateUserSignup(formData)
  console.log('Valid signup data:', validData)
} catch (error) {
  console.error('Validation errors:', error.errors)
}

// Validate user update
try {
  const validUpdate = validateUserUpdate(updateData)
  console.log('Valid update data:', validUpdate)
} catch (error) {
  console.error('Update validation failed:', error.errors)
}
```

## 🔍 **Debugging and Monitoring**

### **User State Debugging**

```javascript
// In browser console
const userStore = useUserStore()

console.log({
  // Current user state
  user: userStore.currentUser,
  isAuthenticated: userStore.isAuthenticated,
  isLoading: userStore.isLoading,
  
  // Profile completion
  isComplete: userStore.isProfileComplete,
  verificationLevel: userStore.verificationStatus,
  
  // Permissions
  permissions: userStore.currentUser?.permissions,
  
  // Addresses and documents
  addresses: userStore.currentUser?.addresses,
  documents: userStore.currentUser?.documents,
  
  // Business info (if applicable)
  businessInfo: userStore.currentUser?.businessInfo
})
```

### **Validation Testing**

```javascript
// Test CPF validation
import { validateCPF, formatCPF } from '@/utils/brazilian-validators'

console.log(validateCPF('12345678901')) // true/false
console.log(formatCPF('12345678901'))   // '123.456.789-01'

// Test CEP lookup
import { lookupCEP } from '@/utils/brazilian-validators'

lookupCEP('01310-100').then(address => {
  console.log('Address found:', address)
}).catch(error => {
  console.error('CEP lookup failed:', error)
})
```

## 🚀 **Production Deployment**

### **Environment Variables**

```bash
# Firebase Configuration
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Cross-subdomain Authentication
AUTH_COOKIE_DOMAIN=.editora-sabia.com

# Development
USE_FIREBASE_EMULATORS=false
```

### **Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admins can read all users
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.canManageUsers == true;
    }
  }
}
```

## 🧪 **Testing**

### **Component Testing**

```vue
<!-- Test signup form -->
<template>
  <SignupForm @submit="handleTestSignup" />
</template>

<script setup>
const handleTestSignup = async (data) => {
  console.log('Signup data:', data)
  
  // Test validation
  try {
    const validated = validateUserSignup(data)
    console.log('✓ Validation passed')
  } catch (error) {
    console.error('✗ Validation failed:', error.errors)
  }
}
</script>
```

### **Manual Testing Checklist**

- [ ] **Individual signup** with CPF validation
- [ ] **Business signup** with CNPJ validation  
- [ ] **CEP lookup** auto-fills address correctly
- [ ] **Email verification** sends and works
- [ ] **Password reset** functions properly
- [ ] **Cross-subdomain login** works across apps
- [ ] **Permission checking** restricts access correctly
- [ ] **Profile updates** save and sync properly
- [ ] **Document validation** catches invalid docs
- [ ] **Address validation** requires all fields

---

This authentication system provides a complete, Brazilian-compliant user management solution for the Editora Sabia platform with robust validation, security, and user experience features. 