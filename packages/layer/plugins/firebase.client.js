import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

export default defineNuxtPlugin({
  name: 'firebase',
  setup(nuxtApp) {
    const config = useRuntimeConfig()
    
    // Debug logging to see what we're getting
    console.log('🔍 Firebase Debug - Runtime Config Values:')
    console.log('API Key:', config.public.firebaseApiKey ? `${config.public.firebaseApiKey.substring(0, 8)}...` : 'MISSING')
    console.log('Auth Domain:', config.public.firebaseAuthDomain || 'MISSING')
    console.log('Project ID:', config.public.firebaseProjectId || 'MISSING')
    console.log('Storage Bucket:', config.public.firebaseStorageBucket || 'MISSING')
    console.log('Messaging Sender ID:', config.public.firebaseMessagingSenderId || 'MISSING')
    console.log('App ID:', config.public.firebaseAppId ? `${config.public.firebaseAppId.substring(0, 8)}...` : 'MISSING')
    
    // Firebase configuration
    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId
    }
    
    // Validate configuration before initializing
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
      console.error('❌ Firebase Error: API Key is missing or undefined')
      console.error('Check your .env file and make sure FIREBASE_API_KEY is set correctly')
      throw new Error('Firebase configuration incomplete - API key missing')
    }
    
    if (!firebaseConfig.projectId || firebaseConfig.projectId === 'undefined') {
      console.error('❌ Firebase Error: Project ID is missing or undefined')
      console.error('Check your .env file and make sure FIREBASE_PROJECT_ID is set correctly')
      throw new Error('Firebase configuration incomplete - Project ID missing')
    }

    console.log('🚀 Initializing Firebase with config:', {
      apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 8)}...` : 'MISSING',
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 8)}...` : 'MISSING'
    })

    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    
    // Initialize Auth with cross-subdomain support
    const auth = getAuth(app)
    
    // Configure auth for cross-subdomain cookies
    // This ensures Firebase Auth works across subdomains
    if (process.env.NODE_ENV === 'production') {
      // In production, set the auth domain for cross-subdomain support
      // This will use cookies that work across *.editora-sabia.com
      auth.tenantId = null // Ensure we're not using multi-tenancy
      
      // Set persistence to work with our custom cookie implementation
      setPersistence(auth, browserLocalPersistence).catch((error) => {
        console.warn('Could not set Firebase Auth persistence:', error)
      })
    }
    
    // Initialize Firestore
    const firestore = getFirestore(app)

    // Connect to emulators in development
    if (config.public.useFirebaseEmulators && process.env.NODE_ENV === 'development') {
      try {
        // Only connect if not already connected
        if (!auth._emulator) {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
        }
        if (!firestore._delegate._databaseId._host.includes('localhost')) {
          connectFirestoreEmulator(firestore, 'localhost', 8080)
        }
      } catch (error) {
        console.warn('Firebase emulator connection failed:', error)
      }
    }

    // Enhanced Firebase instance with cross-subdomain support
    const firebase = {
      app,
      auth,
      firestore,
      
      // Helper methods for cross-subdomain authentication
      async getIdToken(forceRefresh = false) {
        if (auth.currentUser) {
          try {
            return await auth.currentUser.getIdToken(forceRefresh)
          } catch (error) {
            console.error('Failed to get ID token:', error)
            return null
          }
        }
        return null
      },
      
      // Check if user is authenticated across subdomains
      isAuthenticated() {
        return !!auth.currentUser
      },
      
      // Get current user with fresh token
      async getCurrentUserWithToken() {
        if (auth.currentUser) {
          const token = await this.getIdToken()
          return {
            user: auth.currentUser,
            token
          }
        }
        return { user: null, token: null }
      }
    }

    // Make Firebase instances available globally for modular API
    // No $firebase object - just the instances directly
    nuxtApp.provide('firebaseApp', app)
    nuxtApp.provide('firebaseAuth', auth)
    nuxtApp.provide('firebaseFirestore', firestore)
    
    // Global error handler for Firebase operations
    const handleFirebaseError = (error) => {
      console.error('Firebase error:', error)
      
      // Handle specific Firebase errors that might affect cross-subdomain auth
      switch (error.code) {
        case 'auth/network-request-failed':
          console.warn('Network error - check internet connection')
          break
        case 'auth/user-token-expired':
          console.warn('User token expired - will attempt refresh')
          // The store will handle token refresh
          break
        case 'auth/invalid-user-token':
          console.warn('Invalid user token - user may need to re-authenticate')
          break
      }
    }

    // Set up global error handlers
    auth.onAuthStateChanged(
      (user) => {
        // User state changed - this will be handled by the store
        // but we can log for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('Firebase Auth state changed:', user?.uid || 'logged out')
        }
      },
      handleFirebaseError
    )

    console.log('✅ Firebase initialized successfully with modular API')
  }
}) 