<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Account Type -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Tipo de Conta
      </label>
      <div class="flex space-x-4">
        <label class="flex items-center">
          <input
            v-model="form.accountType"
            type="radio"
            value="individual"
            class="mr-2"
          />
          <span>Pessoa Física</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="form.accountType"
            type="radio"
            value="business"
            class="mr-2"
          />
          <span>Pessoa Jurídica</span>
        </label>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <input
          v-model="form.firstName"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500': hasFieldError('firstName').value }"
        />
        <p v-if="getFieldError('firstName').value" class="text-red-500 text-sm mt-1">
          {{ getFieldError('firstName').value }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Sobrenome *
        </label>
        <input
          v-model="form.lastName"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500': hasFieldError('lastName').value }"
        />
        <p v-if="getFieldError('lastName').value" class="text-red-500 text-sm mt-1">
          {{ getFieldError('lastName').value }}
        </p>
      </div>
    </div>

    <!-- Business Name (if business account) -->
    <div v-if="form.accountType === 'business'">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Razão Social *
      </label>
      <input
        v-model="form.companyName"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': hasFieldError('companyName').value }"
      />
      <p v-if="getFieldError('companyName').value" class="text-red-500 text-sm mt-1">
        {{ getFieldError('companyName').value }}
      </p>
    </div>

    <!-- Email and Phone -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          v-model="form.email"
          type="email"
          required
          @blur="validateEmailField(form.email)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500': hasFieldError('email').value }"
        />
        <p v-if="getFieldError('email').value" class="text-red-500 text-sm mt-1">
          {{ getFieldError('email').value }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Telefone
        </label>
        <input
          v-model="form.phone"
          type="tel"
          @input="formatPhoneInput"
          @blur="validatePhoneField(form.phone)"
          placeholder="(11) 99999-9999"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500': hasFieldError('phone').value }"
        />
        <p v-if="getFieldError('phone').value" class="text-red-500 text-sm mt-1">
          {{ getFieldError('phone').value }}
        </p>
      </div>
    </div>

    <!-- Documents -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ form.accountType === 'business' ? 'CNPJ *' : 'CPF *' }}
      </label>
      <input
        v-if="form.accountType === 'individual'"
        v-model="form.cpf"
        type="text"
        @input="formatCPFInput"
        @blur="validateCPFField(form.cpf)"
        placeholder="000.000.000-00"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': hasFieldError('cpf').value }"
      />
      <input
        v-else
        v-model="form.cnpj"
        type="text"
        @input="formatCNPJInput"
        @blur="validateCNPJField(form.cnpj)"
        placeholder="00.000.000/0000-00"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': hasFieldError('cnpj').value }"
      />
      <p v-if="getFieldError('cpf').value || getFieldError('cnpj').value" class="text-red-500 text-sm mt-1">
        {{ getFieldError('cpf').value || getFieldError('cnpj').value }}
      </p>
    </div>

    <!-- Address Section -->
    <div class="border-t pt-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
      
      <!-- CEP with auto-fill -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          CEP *
        </label>
        <div class="flex space-x-2">
          <input
            v-model="form.address.zipCode"
            type="text"
            @input="formatCEPInput"
            @blur="handleCEPLookup"
            placeholder="00000-000"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': hasFieldError('address.zipCode').value }"
          />
          <button
            type="button"
            @click="handleCEPLookup"
            :disabled="cepLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ cepLoading ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>
        <p v-if="cepError" class="text-red-500 text-sm mt-1">{{ cepError }}</p>
        <p v-if="getFieldError('address.zipCode').value" class="text-red-500 text-sm mt-1">
          {{ getFieldError('address.zipCode').value }}
        </p>
      </div>

      <!-- Street and Number -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Logradouro *
          </label>
          <input
            v-model="form.address.street"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': hasFieldError('address.street').value }"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Número *
          </label>
          <input
            v-model="form.address.number"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': hasFieldError('address.number').value }"
          />
        </div>
      </div>

      <!-- Complement and Neighborhood -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Complemento
          </label>
          <input
            v-model="form.address.complement"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Bairro *
          </label>
          <input
            v-model="form.address.neighborhood"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': hasFieldError('address.neighborhood').value }"
          />
        </div>
      </div>

      <!-- City and State -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Cidade *
          </label>
          <input
            v-model="form.address.city"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': hasFieldError('address.city').value }"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Estado *
          </label>
          <select
            v-model="form.address.state"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': hasFieldError('address.state').value }"
          >
            <option value="">Selecione o estado</option>
            <option v-for="state in BRAZILIAN_STATES" :key="state.code" :value="state.code">
              {{ state.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Password Section -->
    <div class="border-t pt-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Senha</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Senha *
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': passwordErrors.password }"
          />
          <p v-if="passwordErrors.password" class="text-red-500 text-sm mt-1">
            {{ passwordErrors.password }}
          </p>
          
          <!-- Password Strength Indicator -->
          <div v-if="password" class="mt-2">
            <div class="flex justify-between text-sm">
              <span>Força da senha:</span>
              <span :class="`text-${passwordStrengthColor}`">{{ passwordStrengthLabel }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-300"
                :class="`bg-${passwordStrengthColor}-500`"
                :style="{ width: `${passwordStrength}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Senha *
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': passwordErrors.confirmPassword }"
          />
          <p v-if="passwordErrors.confirmPassword" class="text-red-500 text-sm mt-1">
            {{ passwordErrors.confirmPassword }}
          </p>
        </div>
      </div>
    </div>

    <!-- Terms and Conditions -->
    <div class="space-y-3">
      <label class="flex items-start">
        <input
          v-model="form.agreeToTerms"
          type="checkbox"
          required
          class="mt-1 mr-3"
        />
        <span class="text-sm text-gray-700">
          Eu aceito os <a href="#" class="text-blue-600 hover:underline">Termos de Uso</a> *
        </span>
      </label>

      <label class="flex items-start">
        <input
          v-model="form.agreeToPrivacy"
          type="checkbox"
          required
          class="mt-1 mr-3"
        />
        <span class="text-sm text-gray-700">
          Eu aceito a <a href="#" class="text-blue-600 hover:underline">Política de Privacidade</a> *
        </span>
      </label>

      <label class="flex items-start">
        <input
          v-model="form.agreeToMarketing"
          type="checkbox"
          class="mt-1 mr-3"
        />
        <span class="text-sm text-gray-700">
          Eu gostaria de receber emails sobre novidades e promoções
        </span>
      </label>
    </div>

    <!-- Submit Button -->
    <div>
      <button
        type="submit"
        :disabled="isSubmitting || hasErrors"
        class="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? 'Criando conta...' : 'Criar Conta' }}
      </button>
    </div>

    <!-- Error Summary -->
    <div v-if="hasErrors && showErrorSummary" class="bg-red-50 border border-red-200 rounded-md p-4">
      <h4 class="text-red-800 font-medium mb-2">Corrija os seguintes erros:</h4>
      <ul class="text-red-700 text-sm space-y-1">
        <li v-for="(error, field) in errors" :key="field">
          • {{ error }}
        </li>
      </ul>
    </div>
  </form>
</template>

<script setup>
import { useUserValidation, usePasswordValidation } from '../composables/useUserValidation'
import { useCEPLookup } from '../utils/brazilian-validators'
import { BRAZILIAN_STATES } from '../utils/brazilian-validators'

// Props
const props = defineProps({
  onSubmit: {
    type: Function,
    required: true
  }
})

// Composables
const {
  errors,
  hasErrors,
  validateSignupData,
  getFieldError,
  hasFieldError,
  formatCPF,
  formatCNPJ,
  formatCEP,
  formatPhone,
  validateEmailField,
  validateCPFField,
  validateCNPJField,
  validatePhoneField
} = useUserValidation()

const {
  password,
  confirmPassword,
  errors: passwordErrors,
  passwordStrength,
  passwordStrengthLabel,
  passwordStrengthColor
} = usePasswordValidation()

const { lookup: lookupCEP, loading: cepLoading, error: cepError } = useCEPLookup()

// State
const isSubmitting = ref(false)
const showErrorSummary = ref(false)

// Form data
const form = ref({
  accountType: 'individual',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  cpf: '',
  cnpj: '',
  companyName: '',
  address: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    isMain: true
  },
  agreeToTerms: false,
  agreeToPrivacy: false,
  agreeToMarketing: false
})

// Format inputs
const formatCPFInput = () => {
  form.value.cpf = formatCPF(form.value.cpf)
}

const formatCNPJInput = () => {
  form.value.cnpj = formatCNPJ(form.value.cnpj)
}

const formatCEPInput = () => {
  form.value.address.zipCode = formatCEP(form.value.address.zipCode)
}

const formatPhoneInput = () => {
  form.value.phone = formatPhone(form.value.phone)
}

// CEP lookup
const handleCEPLookup = async () => {
  if (!form.value.address.zipCode) return
  
  try {
    const result = await lookupCEP(form.value.address.zipCode)
    
    // Auto-fill address fields
    form.value.address = {
      ...form.value.address,
      street: result.street,
      neighborhood: result.neighborhood,
      city: result.city,
      state: result.state
    }
  } catch (error) {
    console.warn('CEP lookup failed:', error.message)
  }
}

// Form submission
const handleSubmit = async () => {
  isSubmitting.value = true
  showErrorSummary.value = false
  
  try {
    // Prepare signup data
    const signupData = {
      ...form.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    }
    
    // Validate form data
    const validation = await validateSignupData(signupData)
    
    if (!validation.success) {
      showErrorSummary.value = true
      return
    }
    
    // Call parent submit handler
    await props.onSubmit(validation.data)
    
  } catch (error) {
    console.error('Signup error:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Watch account type changes
watch(() => form.value.accountType, (newType) => {
  // Clear document fields when switching account type
  if (newType === 'individual') {
    form.value.cnpj = ''
    form.value.companyName = ''
  } else {
    form.value.cpf = ''
  }
})
</script> 