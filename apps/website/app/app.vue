<template>
  <div class="min-h-screen bg-areia dark:bg-gray-darker transition-colors duration-300">
    <!-- Dark mode toggle -->
    <div class="p-4 flex justify-end">
      <Button 
        @click="toggleDarkMode" 
        variant="outline" 
        size="sm"
        class="transition-all duration-300 hover:scale-105 border-urucum text-urucum hover:bg-urucum hover:text-areia"
      >
        {{ isDark ? '☀️ Light' : '🌙 Dark' }}
      </Button>
    </div>

    <div class="max-w-6xl mx-auto p-8">
      <div class="text-center mb-12">
        <h1 class="text-6xl font-display font-bold text-terra dark:text-areia mb-4">
          Editora Sabia
        </h1>
        <p class="text-xl font-body text-gray-coat dark:text-gray-light">
          Showcasing Brazilian brand colors and typography system
        </p>
      </div>

      <!-- Brand Color Palette Showcase -->
      <Card variant="elevated" class="mb-8 bg-white dark:bg-gray-coat border-gray-light dark:border-gray-dark">
        <template #header>
          <h2 class="text-3xl font-libre-franklin font-bold text-terra dark:text-canarinho">
            Paleta de Cores Brasileira
          </h2>
        </template>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <!-- Areia (Sand) -->
          <div class="space-y-3">
            <div class="w-full h-24 bg-areia rounded-lg shadow-md border border-gray-light"></div>
            <div class="text-center">
              <h3 class="font-alegreya font-bold text-terra">Areia</h3>
              <p class="text-xs text-gray-dark">#FFF7E0</p>
            </div>
          </div>

          <!-- Canarinho (Canary) -->
          <div class="space-y-3">
            <div class="w-full h-24 bg-canarinho rounded-lg shadow-md"></div>
            <div class="text-center">
              <h3 class="font-alegreya font-bold text-terra">Canarinho</h3>
              <p class="text-xs text-gray-dark">#FFDC78</p>
            </div>
          </div>

          <!-- Laranjeira (Orange tree) -->
          <div class="space-y-3">
            <div class="w-full h-24 bg-laranjeira rounded-lg shadow-md"></div>
            <div class="text-center">
              <h3 class="font-alegreya font-bold text-white">Laranjeira</h3>
              <p class="text-xs text-gray-dark">#FFA03C</p>
            </div>
          </div>

          <!-- Urucum (Annatto) -->
          <div class="space-y-3">
            <div class="w-full h-24 bg-urucum rounded-lg shadow-md"></div>
            <div class="text-center">
              <h3 class="font-alegreya font-bold text-white">Urucum</h3>
              <p class="text-xs text-gray-dark">#CD2800</p>
            </div>
          </div>

          <!-- Terra (Earth) -->
          <div class="space-y-3">
            <div class="w-full h-24 bg-terra rounded-lg shadow-md"></div>
            <div class="text-center">
              <h3 class="font-alegreya font-bold text-white">Terra</h3>
              <p class="text-xs text-gray-dark">#690000</p>
            </div>
          </div>

          <!-- Pitaia (Dragon fruit) -->
          <div class="space-y-3">
            <div class="w-full h-24 bg-pitaia rounded-lg shadow-md"></div>
            <div class="text-center">
              <h3 class="font-alegreya font-bold text-white">Pitaia</h3>
              <p class="text-xs text-gray-dark">#FF3CA0</p>
            </div>
          </div>

          <!-- Arara (Macaw) -->
          <div class="space-y-3">
            <div class="w-full h-24 bg-arara rounded-lg shadow-md"></div>
            <div class="text-center">
              <h3 class="font-alegreya font-bold text-white">Arara</h3>
              <p class="text-xs text-gray-dark">#0028CD</p>
            </div>
          </div>

          <!-- Salmão (Salmon) -->
          <div class="space-y-3">
            <div class="w-full h-24 bg-salmao rounded-lg shadow-md"></div>
            <div class="text-center">
              <h3 class="font-alegreya font-bold text-terra">Salmão</h3>
              <p class="text-xs text-gray-dark">#FFCDAB</p>
            </div>
          </div>

          <!-- Blue Julio -->
          <div class="space-y-3">
            <div class="w-full h-24 bg-blue-julio rounded-lg shadow-md"></div>
            <div class="text-center">
              <h3 class="font-alegreya font-bold text-white">Blue Julio</h3>
              <p class="text-xs text-gray-dark">#184097</p>
            </div>
          </div>
        </div>
      </Card>

      <!-- Typography Showcase -->
      <Card variant="elevated" class="mb-8 bg-white dark:bg-gray-coat border-gray-light dark:border-gray-dark">
        <template #header>
          <h2 class="text-3xl font-libre-franklin font-bold text-terra dark:text-canarinho">
            Sistema Tipográfico
          </h2>
        </template>

        <div class="space-y-8">
          <!-- Google Fonts -->
          <div class="p-6 bg-areia dark:bg-gray-dark rounded-lg">
            <h3 class="text-lg font-bold text-terra dark:text-areia mb-4">Google Fonts</h3>
            <div class="space-y-4">
              <div>
                <span class="text-sm text-gray-dark dark:text-gray-light">Libre Franklin:</span>
                <p class="LibreFranklin text-2xl text-terra dark:text-areia">
                  Elegant and readable sans-serif typography
                </p>
              </div>
              <div>
                <span class="text-sm text-gray-dark dark:text-gray-light">Alegreya:</span>
                <p class="Alegreya text-2xl text-terra dark:text-areia">
                  Beautiful serif font for editorial content
                </p>
              </div>
            </div>
          </div>

          <!-- Brand Fonts -->
          <div class="p-6 bg-salmao dark:bg-pitaia/20 rounded-lg">
            <h3 class="text-lg font-bold text-terra dark:text-areia mb-4">Brand Fonts</h3>
            <div class="space-y-4">
              <div>
                <span class="text-sm text-gray-dark dark:text-gray-light">Display (Now):</span>
                <p class="font-display text-2xl text-terra dark:text-areia">
                  Headlines and display text
                </p>
              </div>
              <div>
                <span class="text-sm text-gray-dark dark:text-gray-light">Body (Hyperlegible):</span>
                <p class="font-body text-lg text-terra dark:text-areia">
                  Body text optimized for readability and accessibility
                </p>
              </div>
              <div>
                <span class="text-sm text-gray-dark dark:text-gray-light">Atkinson (Accessibility):</span>
                <p class="Atkinson text-lg text-terra dark:text-areia">
                  Enhanced readability for accessibility needs
                </p>
              </div>
            </div>
          </div>

          <!-- Tailwind Font Utilities -->
          <div class="p-6 bg-canarinho dark:bg-urucum/20 rounded-lg">
            <h3 class="text-lg font-bold text-terra dark:text-areia mb-4">Tailwind Font Utilities</h3>
            <div class="grid md:grid-cols-2 gap-4 text-terra dark:text-areia">
              <div>
                <code class="text-sm bg-white dark:bg-gray-darker px-2 py-1 rounded">font-libre-franklin</code>
                <p class="font-libre-franklin mt-2">Libre Franklin via Tailwind</p>
              </div>
              <div>
                <code class="text-sm bg-white dark:bg-gray-darker px-2 py-1 rounded">font-alegreya</code>
                <p class="font-alegreya mt-2">Alegreya via Tailwind</p>
              </div>
              <div>
                <code class="text-sm bg-white dark:bg-gray-darker px-2 py-1 rounded">font-crimson</code>
                <p class="font-crimson mt-2">Crimson text styling</p>
              </div>
              <div>
                <code class="text-sm bg-white dark:bg-gray-darker px-2 py-1 rounded">font-faune</code>
                <p class="font-faune mt-2">Faune serif styling</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Interactive Elements with Brand Colors -->
      <Card variant="elevated" class="mb-8 bg-white dark:bg-gray-coat border-gray-light dark:border-gray-dark">
        <template #header>
          <h2 class="text-3xl font-libre-franklin font-bold text-terra dark:text-canarinho">
            Elementos Interativos
          </h2>
        </template>

        <div class="flex flex-wrap gap-4">
          <Button class="bg-urucum hover:bg-terra text-white transition-colors">
            Urucum Button
          </Button>
          <Button class="bg-arara hover:bg-blue-julio text-white transition-colors">
            Arara Button
          </Button>
          <Button class="bg-pitaia hover:bg-accent-600 text-white transition-colors">
            Pitaia Button
          </Button>
          <Button variant="outline" class="border-terra text-terra hover:bg-terra hover:text-areia dark:border-canarinho dark:text-canarinho">
            Terra Outline
          </Button>
          <Button variant="ghost" class="text-laranjeira hover:bg-laranjeira/10 dark:text-canarinho dark:hover:bg-canarinho/10">
            Laranjeira Ghost
          </Button>
        </div>

        <div class="mt-6 p-4 bg-areia dark:bg-gray-dark rounded-lg">
          <p class="font-alegreya text-terra dark:text-areia">
            "A tipografia é a voz silenciosa da página impressa." - Usando as cores e fontes 
            que refletem a rica cultura brasileira na Editora Sabia.
          </p>
        </div>

        <template #footer>
          <span class="text-sm text-gray-dark dark:text-gray-light font-libre-franklin">
            Sistema completo de design com cores e tipografia brasileira
          </span>
        </template>
      </Card>

      <!-- Gray Scale System -->
      <Card variant="elevated" class="bg-white dark:bg-gray-coat border-gray-light dark:border-gray-dark">
        <template #header>
          <h2 class="text-3xl font-libre-franklin font-bold text-terra dark:text-canarinho">
            Sistema de Cinzas
          </h2>
        </template>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="text-center space-y-2">
            <div class="h-16 bg-gray-ice rounded shadow"></div>
            <div>
              <p class="font-alegreya font-bold text-terra">Ice</p>
              <p class="text-xs text-gray-dark">#F5F5F5</p>
            </div>
          </div>
          <div class="text-center space-y-2">
            <div class="h-16 bg-gray-light rounded shadow"></div>
            <div>
              <p class="font-alegreya font-bold text-terra">Light</p>
              <p class="text-xs text-gray-dark">#EAEAEA</p>
            </div>
          </div>
          <div class="text-center space-y-2">
            <div class="h-16 bg-gray-default rounded shadow"></div>
            <div>
              <p class="font-alegreya font-bold text-white">Default</p>
              <p class="text-xs text-gray-dark">#C4C4C4</p>
            </div>
          </div>
          <div class="text-center space-y-2">
            <div class="h-16 bg-gray-coat rounded shadow"></div>
            <div>
              <p class="font-alegreya font-bold text-white">Coat</p>
              <p class="text-xs text-gray-dark">#454545</p>
            </div>
          </div>
          <div class="text-center space-y-2">
            <div class="h-16 bg-gray-darker rounded shadow"></div>
            <div>
              <p class="font-alegreya font-bold text-white">Darker</p>
              <p class="text-xs text-gray-dark">#2D2D2D</p>
            </div>
          </div>
        </div>
      </Card>

      <NuxtRouteAnnouncer />
    </div>
  </div>
</template>

<script setup>
const isDark = ref(false)

// Initialize dark mode based on system preference
onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark') || 
    (!document.documentElement.classList.contains('light') && 
     window.matchMedia('(prefers-color-scheme: dark)').matches)
  
  updateDarkMode()
})

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  updateDarkMode()
}

const updateDarkMode = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
  } else {
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  }
}
</script>
