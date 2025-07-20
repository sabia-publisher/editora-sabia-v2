<template>
  <form @submit.prevent="handleLogin" class="px-10 md:px-0">
    <!-- Title -->
    <h1 v-if="showTitle" class="text-terra dark:text-laranjeira text-5xl font-bold font-display mb-10 mt-10">
      {{ customTitle || 'Login' }}
    </h1>

    <!-- Description -->
    <p v-if="description" class="mb-10 text-lg">
      {{ description }}
    </p>

    <!-- Email Field -->
    <label for="email" class="w-full block mb-6">
      <input
        ref="emailInput"
        v-model="form.email"
        type="email"
        placeholder="E-mail"
        autocomplete="email"
        :disabled="isLoading"
        class="w-full placeholder-gray-coat text-gray-dark
               focus:border-urucum dark:focus:border-laranjeira
               focus:ring-urucum dark:focus:ring-laranjeira
               border-2 border-gray-300 rounded-md px-4 py-3 transition-colors
               disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{ 
          'border-red-500 focus:border-red-500 focus:ring-red-500': hasFieldError('email').value
        }"
        @blur="validateEmailField(form.email)"
        @input="clearFieldError('email')"
      />
      <p v-if="getFieldError('email').value" class="text-red-500 text-sm mt-1">
        {{ getFieldError('email').value }}
      </p>
    </label>

    <!-- Password Field -->
    <label for="password" class="w-full block mb-6">
      <div class="relative">
        <input
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Senha"
          autocomplete="current-password"
          :disabled="isLoading"
          class="w-full placeholder-gray-coat text-gray-dark
                 focus:border-urucum dark:focus:border-laranjeira
                 focus:ring-urucum dark:focus:ring-laranjeira
                 border-2 border-gray-300 rounded-md px-4 py-3 pr-12 transition-colors
                 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{ 
            'border-red-500 focus:border-red-500 focus:ring-red-500': hasFieldError('password').value
          }"
          @blur="validatePasswordField"
          @input="clearFieldError('password')"
        />
        <button
          type="button"
          @click="togglePasswordVisibility"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          :disabled="isLoading"
        >
          <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
          </svg>
        </button>
      </div>
      <p v-if="getFieldError('password').value" class="text-red-500 text-sm mt-1">
        {{ getFieldError('password').value }}
      </p>
    </label>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="px-4 py-3 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-md"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        {{ errorMessage }}
      </div>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="px-4 py-3 mb-6 bg-green-100 border border-green-400 text-green-700 rounded-md"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        {{ successMessage }}
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between items-center mb-6">
      <button
        type="submit"
        :disabled="isLoading || hasValidationErrors"
        class="px-6 py-3 rounded-md font-medium transition-all duration-200
               bg-transparent border-2 border-laranjeira text-laranjeira
               hover:bg-laranjeira hover:text-white
               dark:border-urucum dark:text-urucum
               dark:hover:bg-urucum dark:hover:text-white
               disabled:opacity-50 disabled:cursor-not-allowed
               focus:ring-2 focus:ring-offset-2 focus:ring-laranjeira
               dark:focus:ring-urucum focus:outline-none"
      >
        <div class="flex items-center space-x-2">
          <svg v-if="isLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isLoading ? 'Entrando...' : 'Entrar' }}</span>
        </div>
      </button>

      <button
        type="button"
        @click="emitToRecover"
        :disabled="isLoading"
        class="text-sm text-urucum dark:text-laranjeira hover:underline
               transition-colors duration-200 disabled:opacity-50"
      >
        Esqueceu a senha?
      </button>
    </div>

    <!-- Register Link -->
    <div class="text-center border-t pt-6">
      <p class="text-gray-coat dark:text-white mb-4">
        Não tem uma conta?
      </p>
      <button
        type="button"
        @click="emitToRegister"
        :disabled="isLoading"
        class="text-urucum dark:text-laranjeira hover:underline font-medium
               transition-colors duration-200 disabled:opacity-50"
      >
        Criar conta
      </button>
    </div>

    <!-- Remember Me (Optional) -->
    <div v-if="showRememberMe" class="mt-6">
      <label class="flex items-center">
        <input
          v-model="form.rememberMe"
          type="checkbox"
          :disabled="isLoading"
          class="rounded border-gray-300 text-urucum
                 focus:border-urucum focus:ring-urucum
                 dark:border-gray-600 dark:bg-gray-700"
        />
        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
          Manter-me conectado
        </span>
      </label>
    </div>
  </form>
</template>

<script setup>
import { useAuthUser } from '../composables/useAuthUser'
import { useUserValidation } from '../composables/useUserValidation'

// Props
const props = defineProps({
  customTitle: {
    type: String,
    default: null
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: null
  },
  showRememberMe: {
    type: Boolean,
    default: false
  },
  redirectAfterLogin: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits(['to-recover', 'to-register', 'auth-success', 'auth-error'])

// Composables
const { signIn, isLoading } = useAuthUser()
const {
  getFieldError,
  hasFieldError,
  clearFieldError,
  setFieldError,
  validateEmailField
} = useUserValidation()

// State
const emailInput = ref(null)
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Form data
const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

// Computed
const hasValidationErrors = computed(() => {
  return hasFieldError('email').value || hasFieldError('password').value
})

// Methods
const validatePasswordField = () => {
  if (!form.value.password) {
    setFieldError('password', 'Senha é obrigatória')
    return false
  }
  if (form.value.password.length < 6) {
    setFieldError('password', 'Senha deve ter pelo menos 6 caracteres')
    return false
  }
  clearFieldError('password')
  return true
}

const validateForm = () => {
  let isValid = true
  
  // Clear previous errors
  clearFieldError('email')
  clearFieldError('password')
  errorMessage.value = ''
  
  // Validate email
  if (!form.value.email) {
    setFieldError('email', 'E-mail é obrigatório')
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    setFieldError('email', 'E-mail inválido')
    isValid = false
  }
  
  // Validate password
  if (!form.value.password) {
    setFieldError('password', 'Senha é obrigatória')
    isValid = false
  }
  
  return isValid
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validate form
  if (!validateForm()) {
    return
  }
  
  try {
    const { user, error } = await signIn(form.value.email, form.value.password)
    
    if (error) {
      // Handle specific Firebase error codes
      const errorMessages = {
        'auth/user-not-found': 'Usuário não encontrado. Verifique seu e-mail.',
        'auth/wrong-password': 'Senha incorreta. Tente novamente.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/user-disabled': 'Esta conta foi desativada.',
        'auth/too-many-requests': 'Muitas tentativas de login. Tente novamente mais tarde.',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
        'auth/invalid-credential': 'Credenciais inválidas. Verifique seu e-mail e senha.'
      }
      
      errorMessage.value = errorMessages[error] || 'Erro ao fazer login. Tente novamente.'
      emit('auth-error', error)
    } else {
      successMessage.value = 'Login realizado com sucesso!'
      
      // Clear form
      form.value.password = ''
      
      // Emit success event
      emit('auth-success', { user, redirectTo: props.redirectAfterLogin })
      
      // Auto-clear success message after 2 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 2000)
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Erro inesperado. Tente novamente.'
    emit('auth-error', error)
  }
}

const emitToRecover = () => {
  emit('to-recover')
}

const emitToRegister = () => {
  emit('to-register')
}

// Focus email input on mount
onMounted(() => {
  nextTick(() => {
    if (emailInput.value) {
      emailInput.value.focus()
    }
  })
})

// Watch for authentication state changes
const { isAuthenticated } = useAuthUser()
watch(isAuthenticated, (newValue) => {
  if (newValue) {
    successMessage.value = 'Você está conectado!'
  }
})

// Keyboard shortcuts
const handleKeydown = (event) => {
  // Enter key to submit form
  if (event.key === 'Enter' && !isLoading.value) {
    handleLogin()
  }
  
  // Escape key to clear errors
  if (event.key === 'Escape') {
    errorMessage.value = ''
    successMessage.value = ''
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Input field styling using existing brand colors */
input[type="email"],
input[type="password"],
input[type="text"] {
  @apply block w-full rounded-md shadow-sm;
}

/* Disable browser autofill styling to match brand colors */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px white inset;
  -webkit-text-fill-color: #808080; /* gray.dark from brand colors */
}

.dark input:-webkit-autofill,
.dark input:-webkit-autofill:hover,
.dark input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #1f2937 inset;
  -webkit-text-fill-color: #f9fafb;
}
</style> 