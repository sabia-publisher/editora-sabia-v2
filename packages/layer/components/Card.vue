<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-secondary-200">
      <slot name="header" />
    </div>
    <div :class="bodyClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-secondary-200 bg-secondary-50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'elevated', 'outline'].includes(value)
  },
  padding: {
    type: Boolean,
    default: true
  }
})

const cardClasses = computed(() => {
  const baseClasses = 'bg-white rounded-lg overflow-hidden'
  
  const variantClasses = {
    default: 'border border-secondary-200',
    elevated: 'shadow-lg border border-secondary-100',
    outline: 'border-2 border-secondary-300'
  }
  
  return [baseClasses, variantClasses[props.variant]].join(' ')
})

const bodyClasses = computed(() => {
  return props.padding ? 'p-6' : ''
})
</script> 