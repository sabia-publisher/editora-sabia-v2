<template>
  <div class="min-h-screen bg-secondary-50 p-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-secondary-900 mb-8">Ecommerce Admin Dashboard</h1>
      
      <Card variant="elevated" class="mb-6">
        <template #header>
          <h2 class="text-xl font-semibold text-secondary-800">Welcome to the Admin Panel</h2>
        </template>
        
        <p class="text-secondary-700 mb-4">
          This is the ecommerce back-office application using shared components from the layer.
        </p>
        
        <div class="flex gap-4">
          <Button @click="handlePrimaryClick">Primary Button</Button>
          <Button variant="secondary" @click="handleSecondaryClick">Secondary Button</Button>
          <Button variant="outline" size="sm">Small Outline</Button>
        </div>
        
        <template #footer>
          <span class="text-sm text-secondary-600">Using shared components from @repo/layer</span>
        </template>
      </Card>
      
      <NuxtRouteAnnouncer />
    </div>
  </div>
</template>

<script setup>
const handlePrimaryClick = () => {
  console.log('Primary button clicked!')
}

const handleSecondaryClick = () => {
  console.log('Secondary button clicked!')
}
</script>
