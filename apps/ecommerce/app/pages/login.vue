<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 min-h-full flex-1">
    <div class="grid-span-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <LoginForm custom-title="Login" redirect-after-login="/" @to-recover="handlePasswordRecovery"
        @to-register="handleRegister" @auth-success="handleAuthSuccess" @auth-error="handleAuthError"
        :allow-register="false" :allow-recover="false" />
    </div>
    <div class="relative hidden lg:flex w-0 grid-span-1 h-full w-full">
      <img class="absolute inset-0 size-full object-cover" src="/images/santos-sabia.png"
        alt="Santos Sabia - Editora Sabia" />
      <a href="https://instagram.com/yarasantxs?igshid=1jfiaqct81t5s" target="_blank" class="absolute bottom-1 right-1 pt-1 px-2 \
				bg-gray-800 text-sm text-areia inline-block
				opacity-60 hover:opacity-80 transition-opacity duration-75
				cursor-pointer rounded
			">
        Yara Santos
      </a>
    </div>
  </div>
</template>

<script setup>

// Page metadata
definePageMeta({
  layout: 'login',
  title: 'Login - Editora Sabia'
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
  
  // Redirect to specified URL or default to shop home
  const targetUrl = redirectTo || '/'
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