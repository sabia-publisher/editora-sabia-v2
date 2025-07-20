import { useUserStore } from '../stores/user'

/**
 * Simplified Auth User Composable
 * Focus: Basic authentication for LoginForm.vue and Header.vue
 */
export const useAuthUser = () => {
  const userStore = useUserStore()
  
  // Initialize auth state listener on first use
  if (process.client) {
    userStore.initAuth()
  }
  
  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const user = await userStore.signIn({ email, password })
      return { user, error: null }
    } catch (error) {
      return { user: null, error: error.code || error.message }
    }
  }

  // Sign up with basic user data
  const signUp = async (signupData) => {
    try {
      const user = await userStore.signUp(signupData)
      return { user, error: null }
    } catch (error) {
      return { user: null, error: error.code || error.message }
    }
  }

  // Send password reset email
  const sendPasswordReset = async (email) => {
    try {
      await userStore.sendPasswordReset(email)
      return { error: null }
    } catch (error) {
      return { error: error.code || error.message }
    }
  }

  // Send email verification
  const sendEmailVerification = async () => {
    try {
      await userStore.sendVerificationEmail()
      return { error: null }
    } catch (error) {
      return { error: error.code || error.message }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await userStore.signOut()
      return { error: null }
    } catch (error) {
      return { error: error.code || error.message }
    }
  }

  return {
    // State from store - ensure reactivity
    user: computed(() => userStore.currentUser),
    isLoading: computed(() => userStore.isLoading),
    isAuthenticated: computed(() => userStore.isAuthenticated),
    
    // Authentication actions
    initAuth: userStore.initAuth,
    signIn,
    signUp,
    signOut,
    
    // Password management
    sendPasswordReset,
    sendEmailVerification,
    
    // Store instance for advanced usage
    store: userStore
  }
} 