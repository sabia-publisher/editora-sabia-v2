<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <LoginForm
        custom-title="Editorial Sabia"
        description="Acesse o sistema editorial"
        redirect-after-login="/dashboard"
        @to-recover="handlePasswordRecovery"
        @to-register="handleRegister"
        @auth-success="handleAuthSuccess"
        @auth-error="handleAuthError"
      />
    </div>
  </div>
</template>

<script setup>
// Page metadata
definePageMeta({
  layout: false,
  title: 'Login - Editorial Sabia'
})

// Composables
const router = useRouter()

// Event handlers
const handlePasswordRecovery = () => {
  // Navigate to password recovery page
  router.push('/recuperar-senha')
}

const handleRegister = () => {
  // Navigate to registration page
  router.push('/cadastro')
}

const handleAuthSuccess = ({ user, redirectTo }) => {
  console.log('Login successful:', user)
  
  // Redirect to specified URL or default to editorial dashboard
  const targetUrl = redirectTo || '/dashboard'
  router.push(targetUrl)
}

const handleAuthError = (error) => {
  console.error('Login failed:', error)
  // Error handling is already done in the LoginForm component
}
</script>

<style scoped>
/* Additional page-specific styles if needed */
</style> 