import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Firebase configuration
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  }

  // Validate configuration
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_api_key_here') {
    console.error('❌ Firebase configuration missing! Please check your .env file.')
    console.log('📝 Copy env.template to .env and fill in your Firebase project details')
    console.log('🔗 Get config from: https://console.firebase.google.com -> Project Settings')
    return
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  
  // Initialize Auth
  const auth = getAuth(app)
  
  // Initialize Firestore
  const firestore = getFirestore(app)
  
  // Connect to emulators only if explicitly enabled
  if (process.dev && config.public.useFirebaseEmulators) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099')
      connectFirestoreEmulator(firestore, 'localhost', 8080)
      console.log('🔥 Connected to Firebase emulators')
    } catch (error) {
      console.warn('⚠️ Could not connect to Firebase emulators:', error.message)
    }
  }

  return {
    provide: {
      firebase: {
        app,
        auth,
        firestore
      }
    }
  }
}) 