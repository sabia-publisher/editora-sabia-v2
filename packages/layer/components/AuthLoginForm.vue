<template>
  <Card variant="elevated" class="w-full max-w-md mx-auto">
    <template #header>
      <h2 class="text-2xl font-bold text-center text-secondary-900">Sign In</h2>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-secondary-700 mb-2">
          Email
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-secondary-700 mb-2">
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter your password"
        />
      </div>

      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <Button
        type="submit"
        :disabled="isSubmitting"
        class="w-full"
      >
        {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
      </Button>
    </form>

    <template #footer>
      <div class="text-center">
        <span class="text-sm text-secondary-600">
          Don't have an account?
          <button 
            @click="$emit('toggle-mode')" 
            class="text-primary-600 hover:text-primary-500 font-medium"
          >
            Sign up
          </button>
        </span>
      </div>
    </template>
  </Card>
</template>

<script setup>
const emit = defineEmits(['toggle-mode', 'success'])

const { signIn } = useAuthUser()

const email = ref('')
const password = ref('')
const error = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  error.value = ''

  try {
    const { user, error: authError } = await signIn(email.value, password.value)
    
    if (authError) {
      error.value = authError
    } else {
      emit('success', user)
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
  } finally {
    isSubmitting.value = false
  }
}
</script> 