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
    port: 3002
  },
  nitro: {
    preset: 'static'
  },
  ssr: false
}) 