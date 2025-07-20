<template>
  <div class="z-50">
    <!-- Placeholder for AccessibilityMenu - can be added later -->
    
    <header class="bg-areia dark:bg-gray-coat w-full px-5 md:px-10 py-1 flex justify-between items-center shadow-md relative">
      <!-- Logo placeholder - replace with actual Logo component when available -->
      <div class="h-16 my-2 transition-all duration-100">
        <NuxtLink to="/" class="flex items-center h-full">
          <div class="bg-terra dark:bg-laranjeira text-white font-bold text-xl px-4 py-2 rounded">
            Editora Sábia
          </div>
        </NuxtLink>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex justify-between space-x-4">
        <NuxtLink to="/catalogo">Catálogo</NuxtLink>
        <NuxtLink to="/publicar">Publicar</NuxtLink>
        <NuxtLink to="/sobre">Sobre Nós</NuxtLink>
        <NuxtLink to="/contato">Contato</NuxtLink>
      </nav>

      <!-- Right side actions -->
      <div class="flex items-center space-x-4">
        <!-- Cart button placeholder - can be connected to cart store later -->
        <button 
          @click="showCart" 
          title="Carrinho"
          class="relative p-2"
        >
          <!-- Simple cart icon using text for now -->
          <span class="text-terra dark:text-canarinho text-xl">🛒</span>
          <span 
            v-if="cartItemsCount > 0"
            class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-terra dark:bg-canarinho text-areia dark:text-terra text-xs flex justify-center items-center"
          >
            {{ cartItemsCount }}
          </span>
        </button>

        <!-- Authentication buttons for desktop -->
        <div v-if="!isAuthenticated" class="hidden lg:block">
          <NuxtLink to="/login" class="button ml-2 xl:ml-10">
            Login
          </NuxtLink>
        </div>

        <div v-if="isAuthenticated && user" class="hidden lg:flex items-center space-x-4">
          <span class="text-terra dark:text-canarinho">
            Olá, {{ user.displayName || user.email || 'Usuário' }}
          </span>
          <NuxtLink to="/pedidos" class="text-terra dark:text-canarinho hover:underline">
            Meus Pedidos
          </NuxtLink>
          <button 
            @click="handleLogout" 
            class="button"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Saindo...' : 'Logout' }}
          </button>
        </div>

        <!-- Mobile menu button -->
        <div class="lg:hidden">
          <div class="relative z-10">
            <button 
              @click="showMenu = !showMenu" 
              type="button" 
              class="relative w-8 h-8"
              :aria-expanded="showMenu"
              aria-label="Menu"
            >
              <div class="menu" :class="{ 'menu-open': showMenu }"></div>
              <div class="menu" :class="{ 'menu-open': showMenu }"></div>
            </button>
          </div>

          <!-- Mobile menu -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div 
              v-if="showMenu" 
              class="mobile-menu absolute z-10 right-0 transform shadow-lg w-screen"
            >
              <div class="relative">
                <nav class="p-4 pb-4 bg-areia dark:bg-gray-coat" aria-label="Menu móvel">
                  <!-- Mobile navigation links -->
                  <div class="md:hidden space-y-2">
                    <NuxtLink to="/catalogo" class="submenu-item">Catálogo</NuxtLink>
                    <NuxtLink to="/publicar" class="submenu-item">Publicar</NuxtLink>
                    <NuxtLink to="/sobre" class="submenu-item">Sobre Nós</NuxtLink>
                    <NuxtLink to="/contato" class="submenu-item">Contato</NuxtLink>
                  </div>

                  <!-- Mobile authentication section -->
                  <div v-if="!isAuthenticated" class="mt-5 border-t border-terra dark:border-areia pt-6">
                    <div class="space-y-2">
                      <NuxtLink to="/cadastro" class="button block text-center">
                        Cadastrar
                      </NuxtLink>
                      <NuxtLink to="/login" class="submenu-item">
                        Login
                      </NuxtLink>
                    </div>
                  </div>

                  <div v-if="isAuthenticated && user" class="mt-5 border-t border-terra dark:border-areia pt-6">
                    <div class="space-y-2">
                      <div class="px-4 py-2 text-terra dark:text-canarinho font-medium">
                        Olá, {{ user.displayName || user.email || 'Usuário' }}
                      </div>
                      <NuxtLink to="/pedidos" class="submenu-item">
                        Meus Pedidos
                      </NuxtLink>
                      <button 
                        @click="handleLogout" 
                        class="button w-full"
                        :disabled="isLoading"
                      >
                        {{ isLoading ? 'Saindo...' : 'Logout' }}
                      </button>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
// Composables
const { user, isAuthenticated, isLoading, signOut } = useAuthUser()

// State
const showMenu = ref(false)
const cartItemsCount = ref(0) // Placeholder for cart items count

// Methods
const handleLogout = async () => {
  try {
    console.log('Logout button clicked') // Debug log
    const { error } = await signOut()
    if (error) {
      console.error('Logout error:', error)
      // You could add a toast notification here
    } else {
      console.log('Logout successful') // Debug log
      // Close mobile menu after logout
      showMenu.value = false
      // Optionally redirect to home page
      await navigateTo('/')
    }
  } catch (error) {
    console.error('Unexpected logout error:', error)
  }
}

const showCart = () => {
  // Placeholder for cart functionality
  console.log('Show cart clicked - implement cart store later')
}

// Watch route changes to close mobile menu
const route = useRoute()
watch(() => route.path, () => {
  showMenu.value = false
})

// Close mobile menu when clicking outside (optional enhancement)
onMounted(() => {
  const handleClickOutside = (event) => {
    const mobileMenu = document.querySelector('.mobile-menu')
    const menuButton = document.querySelector('[aria-label="Menu"]')
    
    if (showMenu.value && 
        mobileMenu && 
        !mobileMenu.contains(event.target) && 
        !menuButton.contains(event.target)) {
      showMenu.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

// Debug: Log authentication state
watchEffect(() => {
  console.log('Header: Auth state changed:', { 
    isAuthenticated: isAuthenticated.value, 
    user: user.value, 
    isLoading: isLoading.value,
    userExists: !!user.value,
    userEmail: user.value?.email 
  })
})

// Watch for user changes specifically
watch(() => user.value, (newUser, oldUser) => {
  console.log('Header: User changed from', oldUser, 'to', newUser)
}, { deep: true })

// Watch for authentication state changes
watch(() => isAuthenticated.value, (newAuth, oldAuth) => {
  console.log('Header: Authentication changed from', oldAuth, 'to', newAuth)
})
</script>

<style scoped>
/* Navigation links */
nav a, a.nav {
  @apply font-body text-terra dark:text-areia py-2 hover:text-urucum dark:hover:text-canarinho hover:underline transition-colors duration-200;
}

nav a.button:hover {
  @apply text-white no-underline;
}

@media (min-width: 768px) {
  nav a, a.nav {
    @apply mx-1 px-2;
  }
}

@media (min-width: 1024px) {
  nav a, a.nav {
    @apply mx-1 px-4;
  }
}

@media (min-width: 1280px) {
  nav a, a.nav {
    @apply mx-2 px-5;
  }
}

/* Mobile menu positioning */
.mobile-menu {
  top: 100%;
  @apply inset-x-0;
}

/* Mobile menu items */
.submenu-item {
  @apply block m-0 px-4 py-2 text-base font-medium text-terra dark:text-areia hover:text-urucum dark:hover:text-canarinho hover:underline transition-colors duration-200;
}

/* Hamburger menu animation */
.menu {
  width: 30px;
  height: 2px;
  margin: 5px 0;
  @apply bg-terra dark:bg-white transition-all duration-200;
}

.menu.menu-open:nth-child(1) {
  margin: 0;
  @apply transform rotate-45;
}

.menu.menu-open:nth-child(2) {
  margin: 0;
  @apply transform -rotate-45;
}

/* Button styles using brand colors */
.button {
  @apply px-4 py-2 rounded-md font-medium transition-all duration-200
         bg-transparent border-2 border-laranjeira text-laranjeira
         hover:bg-laranjeira hover:text-white
         dark:border-urucum dark:text-urucum
         dark:hover:bg-urucum dark:hover:text-white
         disabled:opacity-50 disabled:cursor-not-allowed
         focus:ring-2 focus:ring-offset-2 focus:ring-laranjeira
         dark:focus:ring-urucum focus:outline-none;
}
</style> 