// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxthub/core'
  ],
  
  content: {
    preview: {
      api: 'https://sabia-publisher.nuxt.dev'
    }
  },
  
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
})