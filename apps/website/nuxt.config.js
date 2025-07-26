export default defineNuxtConfig({
  extends: [
    '../../packages/layer'
  ],
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  tailwindcss: {
    configPath: '../../packages/tailwind-config/tailwind.config.js'
  },
  devServer: {
    port: 3000
  },
  ssr: true,
  nitro: {
    preset: 'firebase'
  }
}) 