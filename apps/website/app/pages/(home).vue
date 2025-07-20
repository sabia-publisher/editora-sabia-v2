<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Hero Section -->
    <section class="text-center py-20">
      <h1 class="text-5xl font-bold text-terra dark:text-laranjeira mb-6">
        Bem-vindo à Editora Sábia
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Descobrindo e compartilhando as melhores histórias da literatura brasileira
      </p>
      
      <div class="space-x-4">
        <NuxtLink 
          to="/catalogo" 
          class="inline-block px-8 py-3 bg-laranjeira hover:bg-urucum text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Explorar Catálogo
        </NuxtLink>
        <NuxtLink 
          to="/publicar" 
          class="inline-block px-8 py-3 border-2 border-laranjeira text-laranjeira hover:bg-laranjeira hover:text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Publicar Comigo
        </NuxtLink>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center p-6">
          <div class="text-4xl mb-4">📚</div>
          <h3 class="text-xl font-semibold text-terra dark:text-laranjeira mb-2">
            Catálogo Diverso
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            Uma seleção cuidadosa de livros que representam a riqueza da literatura brasileira
          </p>
        </div>

        <div class="text-center p-6">
          <div class="text-4xl mb-4">✍️</div>
          <h3 class="text-xl font-semibold text-terra dark:text-laranjeira mb-2">
            Apoio aos Autores
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            Oferecemos suporte completo para autores que desejam publicar suas obras
          </p>
        </div>

        <div class="text-center p-6">
          <div class="text-4xl mb-4">🌱</div>
          <h3 class="text-xl font-semibold text-terra dark:text-laranjeira mb-2">
            Sustentabilidade
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            Comprometidos com práticas sustentáveis na produção e distribuição
          </p>
        </div>
      </div>
    </section>

    <!-- Authentication Status Section -->
    <section class="py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-terra dark:text-laranjeira mb-4">
          Status da Autenticação
        </h2>
        
        <div v-if="!isAuthenticated" class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            Você não está logado. Faça login para acessar recursos exclusivos.
          </p>
          <NuxtLink 
            to="/auth/login" 
            class="inline-block px-6 py-2 bg-laranjeira hover:bg-urucum text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Fazer Login
          </NuxtLink>
        </div>

        <div v-if="isAuthenticated" class="space-y-4">
          <p class="text-green-600 dark:text-green-400 font-semibold">
            ✅ Você está logado como: {{ user?.displayName || user?.email }}
          </p>
          <p class="text-gray-600 dark:text-gray-300">
            Agora você pode testar o botão de logout no header!
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Get authentication state
const { user, isAuthenticated } = useAuthUser()

// Page meta
useHead({
  title: 'Editora Sábia - Literatura Brasileira de Qualidade',
  meta: [
    {
      name: 'description',
      content: 'Descubra a riqueza da literatura brasileira com a Editora Sábia. Catálogo diverso, apoio aos autores e compromisso com a sustentabilidade.'
    }
  ]
})
</script>

<style scoped>
/* Page specific styles if needed */
</style> 