// COMMENTED OUT: Pinia Colada Plugin
// 
// This plugin was used for advanced query caching with the complex user store.
// Since we've simplified the authentication system, we no longer need Pinia Colada.
// Uncomment and reinstall @pinia/colada when you need advanced query features.

/*
import { PiniaColada } from '@pinia/colada'

export default defineNuxtPlugin({
  name: 'pinia-colada',
  setup(nuxtApp) {
    // Install Pinia Colada with configuration
    // Note: Pinia is already set up by @pinia/nuxt module
    nuxtApp.vueApp.use(PiniaColada, {
      // Global options for queries
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      // refetchOnWindowFocus: false,
      // retry: 3,
    })
  }
}) 
*/ 