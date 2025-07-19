/** @type {import('tailwindcss').Config} */
import colors from './colors.js'

export default {
  // Enable dark mode with class strategy
  darkMode: 'class',
  
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    // Additional patterns from the original purge config
    'nuxt.config.js'
  ],
  
  theme: {
    extend: {
      colors: {
        // Import all brand colors
        ...colors
      },
      
      fontFamily: {
        // Modern system fonts (keep existing)
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['ui-serif', 'Georgia'],
        mono: ['ui-monospace', 'SFMono-Regular'],
        
        // Legacy fonts from WindiCSS config
        display: ['Now', 'Poppins', 'Open-sans', 'sans-serif'],
        body: ['Hyperlegible', 'Arial', 'sans-serif'],
        
        // Brand-specific fonts from CSS
        'libre-franklin': ['Libre Franklin', 'sans-serif'],
        alegreya: ['Alegreya', 'serif'],
        now: ['Now', 'sans-serif'],
        hyperlegible: ['Hyperlegible', 'sans-serif'],
        faune: ['Faune', 'serif'],
        larken: ['Larken', 'serif'],
        crimson: ['Crimson', 'serif'],
        'open-dyslexic': ['OpenDyslexic', 'sans-serif'],
        
        // Alias for accessibility font
        atkinson: ['Hyperlegible', 'sans-serif']
      },
      
      spacing: {
        // Keep existing spacing
        '18': '4.5rem',
        // Add all spacing from WindiCSS config
        '80': '20rem',
        '88': '22rem',
        '96': '24rem',
        '104': '26rem',
        '112': '28rem',
        '120': '30rem',
        '128': '32rem',
        '192': '48rem',
        '256': '64rem'
      },
      
      zIndex: {
        // Custom z-index values from WindiCSS config
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        '11': 11,
        '12': 12,
        '13': 13
      },
      
      minHeight: {
        // Custom min-height values from WindiCSS config
        '80': '20rem',
        '88': '22rem',
        '96': '24rem',
        '104': '26rem',
        '112': '28rem',
        '120': '30rem',
        '128': '32rem',
        '136': '38rem',
        '192': '48rem',
        '256': '64rem'
      }
    }
  },
  
  plugins: [
    // Include forms plugin (Tailwind CSS equivalent of windicss/plugin/forms)
    require('@tailwindcss/forms'),
    
    // Custom plugin to recreate the "high" variant from WindiCSS
    function({ addVariant, e }) {
      addVariant('high', ({ modifySelectors, separator }) => {
        modifySelectors(({ selector }) => {
          return `.high ${selector.replace(/^\./, `.high${separator}`)}`
        })
      })
    },
    
    // Custom plugin to add font family utility classes
    function({ addUtilities }) {
      const fontUtilities = {
        '.LibreFranklin': {
          fontFamily: "'Libre Franklin', sans-serif"
        },
        '.Crimson': {
          fontFamily: "'Crimson', sans-serif"
        },
        '.Alegreya': {
          fontFamily: "'Alegreya', serif !important"
        },
        '.Faune': {
          fontFamily: "'Faune', serif"
        },
        '.OpenDyslexic': {
          fontFamily: "'OpenDyslexic', sans-serif !important"
        },
        '.Atkinson': {
          fontFamily: "'Hyperlegible', sans-serif !important"
        }
      }
      addUtilities(fontUtilities)
    }
  ]
} 