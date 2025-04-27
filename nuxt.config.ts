// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/icon', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: '/text-check/', // ⚡ <- replace with your GitHub repo name!
  },
})