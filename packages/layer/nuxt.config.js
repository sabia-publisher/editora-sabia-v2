import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt'
  ],
  css: [
    // Include the fonts CSS file with absolute path
    resolve(__dirname, 'assets/css/fonts.css')
  ],
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      useFirebaseEmulators: process.env.USE_FIREBASE_EMULATORS === 'true',
      authCookieDomain: process.env.AUTH_COOKIE_DOMAIN || undefined
    }
  }
}) 