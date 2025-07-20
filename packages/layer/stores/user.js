import { defineStore } from 'pinia'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  getIdToken,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { 
  validateUserSignup,
  validateUser
} from '@repo/zod-schemas'
import { 
  useAuthTokenCookie, 
  useUserSessionCookie, 
  useAuthStateCookie,
  setAuthCookies,
  clearAuthCookies,
  getAuthFromCookies
} from '../utils/auth-cookies'

/**
 * Simplified User Store for Basic Authentication
 * Focus: LoginForm.vue and basic auth operations
 */
export const useUserStore = defineStore('user', () => {
  const { $firebaseAuth, $firebaseFirestore } = useNuxtApp()
  
  // Basic user state
  const user = ref(null)
  const isInitialized = ref(false)
  const loading = ref(false)
  const error = ref(null)
  
  // Cookie refs for reactive updates
  const authTokenCookie = useAuthTokenCookie()
  const userSessionCookie = useUserSessionCookie()
  const authStateCookie = useAuthStateCookie()
  
  // Initialize from cookies on store creation
  const initializeFromCookies = () => {
    const cookieData = getAuthFromCookies()
    if (cookieData.isAuthenticated && cookieData.user) {
      user.value = {
        uid: cookieData.user.uid,
        email: cookieData.user.email,
        displayName: cookieData.user.displayName,
        photoURL: cookieData.user.photoURL,
        emailVerified: cookieData.user.emailVerified || false
      }
    }
  }
  
  // Sign in with email and password
  const signIn = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const { email, password } = credentials
      const result = await signInWithEmailAndPassword($firebaseAuth, email, password)
      
      // Get Firebase ID token
      const idToken = await getIdToken(result.user)
      
      // Set user data
      user.value = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        emailVerified: result.user.emailVerified
      }
      
      // Set cookies for cross-subdomain authentication
      setAuthCookies(result.user, idToken)
      
      loading.value = false
      return result.user
      
    } catch (err) {
      error.value = err
      loading.value = false
      throw err
    }
  }
  
  // Sign up with email and password
  const signUp = async (signupData) => {
    loading.value = true
    error.value = null
    
    try {
      // Validate signup data with simplified schema
      const validatedData = validateUserSignup(signupData)
      
      // Create Firebase user
      const result = await createUserWithEmailAndPassword(
        $firebaseAuth, 
        validatedData.email, 
        validatedData.password
      )
      
      // Update Firebase profile
      await updateProfile(result.user, {
        displayName: `${validatedData.firstName} ${validatedData.lastName}`
      })
      
      // Get ID token
      const idToken = await getIdToken(result.user)
      
      // Create basic user document in Firestore
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: `${validatedData.firstName} ${validatedData.lastName}`,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        emailVerified: result.user.emailVerified,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Save to Firestore
      await setDoc(doc($firebaseFirestore, 'users', result.user.uid), userData)
      
      // Send email verification
      if (!result.user.emailVerified) {
        try {
          await sendEmailVerification(result.user)
        } catch (error) {
          console.warn('Could not send verification email:', error)
        }
      }
      
      // Set user data
      user.value = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        emailVerified: result.user.emailVerified
      }
      
      // Set cookies
      setAuthCookies(result.user, idToken)
      
      loading.value = false
      return result.user
      
    } catch (err) {
      error.value = err
      loading.value = false
      throw err
    }
  }
  
  // Sign out
  const signOut = async () => {
    loading.value = true
    error.value = null
    
    try {
      await firebaseSignOut($firebaseAuth)
      
      // Force clear user state immediately
      user.value = null
      clearAuthCookies()
      
      // Force trigger reactivity
      nextTick(() => {
        user.value = null
      })
      
      loading.value = false
      console.log('Store: User signed out, user.value is now:', user.value)
      
    } catch (err) {
      error.value = err
      loading.value = false
      throw err
    }
  }
  
  // Send password reset email
  const sendPasswordReset = async (email) => {
    loading.value = true
    error.value = null
    
    try {
      await sendPasswordResetEmail($firebaseAuth, email)
      loading.value = false
      return true
      
    } catch (err) {
      error.value = err
      loading.value = false
      throw err
    }
  }
  
  // Send email verification
  const sendVerificationEmail = async () => {
    if (!$firebaseAuth.currentUser) {
      throw new Error('User not authenticated')
    }
    
    loading.value = true
    error.value = null
    
    try {
      await sendEmailVerification($firebaseAuth.currentUser)
      loading.value = false
      return true
      
    } catch (err) {
      error.value = err
      loading.value = false
      throw err
    }
  }
  
  // Initialize auth state listener
  const initAuth = () => {
    if (isInitialized.value) return
    
    // Initialize from cookies first
    initializeFromCookies()
    
    // Set up Firebase auth state listener
    onAuthStateChanged($firebaseAuth, async (firebaseUser) => {
      console.log('Store: Firebase auth state changed:', firebaseUser ? 'signed in' : 'signed out')
      
      if (firebaseUser) {
        // User is signed in
        user.value = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified
        }
        
        console.log('Store: User state set to:', user.value)
        
        // Update cookies with fresh token
        try {
          const idToken = await getIdToken(firebaseUser)
          setAuthCookies(firebaseUser, idToken)
        } catch (error) {
          console.warn('Could not get ID token:', error)
          setAuthCookies(firebaseUser)
        }
      } else {
        // User is signed out
        console.log('Store: Clearing user state')
        user.value = null
        clearAuthCookies()
        console.log('Store: User state cleared, user.value is now:', user.value)
      }
      
      if (!isInitialized.value) {
        isInitialized.value = true
      }
    })
  }
  
  // Computed properties
  const isAuthenticated = computed(() => {
    return !!user.value
  })
  
  const currentUser = computed(() => {
    return user.value
  })
  
  const isLoading = computed(() => {
    return loading.value
  })
  
  // Watch for cookie changes and sync state (cross-subdomain)
  if (process.client) {
    watch([authStateCookie, userSessionCookie], ([authState, userSession]) => {
      console.log('Store: Cookie change detected - ', { authState, userSession, currentUser: user.value?.uid })
      
      // Only sync if there's a meaningful change
      if (authState && userSession && userSession.uid !== user.value?.uid) {
        console.log('Store: Syncing user from cookies (cross-subdomain login)')
        user.value = {
          uid: userSession.uid,
          email: userSession.email,
          displayName: userSession.displayName,
          photoURL: userSession.photoURL,
          emailVerified: userSession.emailVerified || false
        }
      } else if (!authState && user.value) {
        console.log('Store: Clearing user from cookies (cross-subdomain logout)')
        user.value = null
      }
    }, { immediate: false })
    
    // Listen for custom auth events from other subdomains
    window.addEventListener('editora-auth-login', (event) => {
      console.log('Store: Received login event from', event.detail?.domain)
      if (event.detail?.user && event.detail.user.uid !== user.value?.uid) {
        console.log('Store: Syncing login from other subdomain')
        // Force cookie check to sync state
        nextTick(() => {
          const cookieData = getAuthFromCookies()
          if (cookieData.isAuthenticated && cookieData.user) {
            user.value = cookieData.user
          }
        })
      }
    })
    
    window.addEventListener('editora-auth-logout', (event) => {
      console.log('Store: Received logout event from', event.detail?.domain)
      if (user.value) {
        console.log('Store: Syncing logout from other subdomain')
        user.value = null
      }
    })
  }
  
  return {
    // State
    user: readonly(user),
    currentUser,
    isAuthenticated,
    isLoading,
    isInitialized: readonly(isInitialized),
    error: readonly(error),
    
    // Actions
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    sendVerificationEmail,
    initAuth,
    
    // Cookie refs (for debugging)
    authTokenCookie: readonly(authTokenCookie),
    userSessionCookie: readonly(userSessionCookie),
    authStateCookie: readonly(authStateCookie)
  }
}) 