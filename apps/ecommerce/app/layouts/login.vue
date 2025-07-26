<template>
  <main class="h-full">
    <slot />
  </main>
</template>

<script setup>
// Set up HTML and body classes for full-height layout
useHead({
  htmlAttrs: {
    class: 'h-full'
  },
  bodyAttrs: {
    class: 'h-full bg-white dark:bg-gray-darker'
  }
})
</script>

<style>
/* Layout specific styles if needed */
#__nuxt {
  height: 100%;
}
</style>