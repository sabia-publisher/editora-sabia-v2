<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <Header />
    
    <!-- Main content -->
    <main>
      <slot />
    </main>
    
    <!-- Footer placeholder - can be added later -->
    <footer class="bg-gray-100 dark:bg-gray-800 mt-auto py-8">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          © 2024 Editora Sábia. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// No additional logic needed for basic layout
</script>

<style scoped>
/* Layout specific styles if needed */
</style> 