# Unified Commerce & Content Platform - Editora Sabia

A modern, scalable monorepo built with Nuxt 4, Turborepo, and Firebase that provides three integrated applications with authentic **Brazilian brand identity**:

- **Ecommerce**: Back-office administration for store management
- **Editorial**: Content creation and management platform  
- **Website**: Public-facing website consuming content and products

## 🇧🇷 **Brazilian Brand Identity**

This platform features an **authentic Brazilian color palette** with Portuguese names that celebrate the rich culture and nature of Brazil:

### **Cores Brasileiras**
- 🏖️ **Areia** (`#FFF7E0`) - Golden beach sand
- 🐦 **Canarinho** (`#FFDC78`) - Bright canary yellow  
- 🍊 **Laranjeira** (`#FFA03C`) - Orange tree fruit
- 🌶️ **Urucum** (`#CD2800`) - Annatto seed red
- 🌍 **Terra** (`#690000`) - Rich Brazilian earth
- 🐉 **Pitaia** (`#FF3CA0`) - Dragon fruit pink
- 🦜 **Arara** (`#0028CD`) - Macaw blue
- 🐟 **Salmão** (`#FFCDAB`) - Salmon pink

### **Typography System**
- **Google Fonts**: Libre Franklin, Alegreya
- **Brand Fonts**: Now, Hyperlegible, Faune, Crimson
- **Accessibility**: OpenDyslexic, Atkinson (Hyperlegible)

## 🏗️ Architecture

This project uses a **Turborepo monorepo** structure with shared packages for maximum code reuse and consistency:

- **Apps**: Three Nuxt 4 applications (`ecommerce`, `editorial`, `website`)
- **Shared Layer**: Common components, composables, and configurations
- **Packages**: Modular utilities for Tailwind config, Zod schemas, and Firebase setup

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended)
- Firebase account

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Firebase Setup

1. Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password provider)
3. Enable Cloud Firestore
4. Enable Firebase Hosting with three sites:
   - `your-project` (default) → website
   - `your-project-ecommerce` → ecommerce  
   - `your-project-editorial` → editorial

### 3. Environment Configuration

Create `.env` files for each application with Firebase configuration:

```bash
# .env (root level)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### 4. Firebase CLI Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (select your project)
firebase init

# Configure hosting targets
firebase target:apply hosting website your-project
firebase target:apply hosting ecommerce your-project-ecommerce  
firebase target:apply hosting editorial your-project-editorial
```

### 5. Development

Start all three applications:

```bash
pnpm turbo dev
```

Access the applications:
- **Ecommerce**: http://localhost:3000
- **Editorial**: http://localhost:3001  
- **Website**: http://localhost:3002 *(🇧🇷 Features Brazilian brand showcase)*

## 📁 Project Structure

```
├── apps/
│   ├── ecommerce/          # Admin back-office
│   ├── editorial/          # Content management
│   └── website/            # Public website (Brazilian brand showcase)
├── packages/
│   ├── layer/              # Shared Nuxt layer
│   ├── tailwind-config/    # Brazilian design system
│   ├── zod-schemas/        # Data validation
│   └── firebase-config/    # Firebase setup
└── .github/workflows/      # CI/CD pipeline
```

## 🎨 Brazilian Design System

### **Using Brazilian Colors**

```vue
<template>
  <!-- Primary brand colors -->
  <div class="bg-areia text-terra">
    <h1 class="text-urucum">Título em Urucum</h1>
    <p class="text-gray-coat">Texto em cinza</p>
  </div>

  <!-- Interactive elements -->
  <button class="bg-pitaia hover:bg-terra text-white">
    Botão Pitaia
  </button>
  
  <button class="bg-arara hover:bg-blue-julio text-white">
    Botão Arara
  </button>
</template>
```

### **Typography System**

```vue
<template>
  <!-- Google Fonts -->
  <h1 class="LibreFranklin text-4xl text-terra">
    Elegant Headlines
  </h1>
  
  <p class="Alegreya text-lg text-gray-coat">
    Beautiful editorial content
  </p>

  <!-- Tailwind utilities -->
  <h2 class="font-display text-3xl text-urucum">
    Display Font (Now)
  </h2>
  
  <p class="font-body text-base text-gray-dark">
    Optimized body text (Hyperlegible)
  </p>
  
  <!-- Accessibility -->
  <p class="Atkinson text-lg">
    Enhanced readability
  </p>
</template>
```

### **Dark Mode Support**

```vue
<template>
  <div class="bg-areia dark:bg-gray-darker">
    <h1 class="text-terra dark:text-canarinho">
      Automatic theme adaptation
    </h1>
    
    <button class="bg-urucum hover:bg-terra dark:bg-pitaia dark:hover:bg-arara">
      Theme-responsive button
    </button>
  </div>
</template>
```

## 🔐 Authentication & Permissions

Users have granular permissions stored in Firestore:

```javascript
const { user, signIn, signOut, hasPermission } = useAuthUser()

// Check permissions
const canAccessEcommerce = hasPermission('canAccessEcommerce')
const canPublishContent = hasPermission('canPublishContent')
```

### Route Protection

```vue
<script setup>
// Protect routes with middleware
definePageMeta({
  middleware: 'auth',
  requiredPermission: 'canAccessEcommerce'
})
</script>
```

## 🏗️ Building & Deployment

### Build All Apps

```bash
pnpm turbo build
```

### Build Specific App

```bash
pnpm turbo build --filter=@apps/ecommerce
```

### Deploy to Firebase

```bash
# Deploy all sites
firebase deploy

# Deploy specific site
firebase deploy --only hosting:website
```

## 🔄 CI/CD Pipeline

The GitHub Actions workflow automatically:

1. Builds only affected applications (using Turborepo)
2. Deploys changes to the appropriate Firebase hosting targets
3. Runs only when changes are detected in specific app directories

### Required Secrets

Add to your GitHub repository secrets:

- `FIREBASE_TOKEN`: Get with `firebase login:ci`

## 📦 Package Scripts

### Root Level

- `pnpm turbo dev` - Start all dev servers
- `pnpm turbo build` - Build all apps
- `pnpm turbo lint` - Lint all packages

### Individual Apps

- `pnpm --filter @apps/ecommerce dev` - Start ecommerce app
- `pnpm --filter @apps/editorial build` - Build editorial app

## 🛠️ Tech Stack

- **Framework**: Nuxt 4
- **Monorepo**: Turborepo  
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS (with Brazilian brand colors)
- **Typography**: Google Fonts + Custom brand fonts
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **Validation**: Zod
- **Language**: JavaScript (ES6+)

## 🎯 Brazilian Brand Features

- **🎨 Authentic Colors**: Portuguese names inspired by Brazilian culture
- **🔤 Typography System**: Complete font system with Google Fonts integration
- **🌓 Dark Mode**: Full dark mode support with Brazilian color adaptations
- **♿ Accessibility**: OpenDyslexic and Hyperlegible fonts for enhanced readability
- **📱 Responsive**: Optimized for all devices with consistent brand experience
- **📋 Implementation Steps**: `building_rules/`

## 🚀 Firebase Deployment

Deploy all three applications to Firebase Hosting with automated CI/CD:

### **Setup Instructions**
1. **Create 3 hosting sites** in Firebase Console:
   - `editora-sabia-website`
   - `editora-sabia-ecommerce`
   - `editora-sabia-editorial`

2. **Get Firebase token** for CI/CD:
   ```bash
   firebase login:ci
   ```

3. **Add GitHub Secrets**:
   - `FIREBASE_TOKEN`
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

### **Deploy Commands**
```bash
# Deploy all sites
pnpm firebase:deploy

# Deploy individual sites
pnpm firebase:deploy:website
pnpm firebase:deploy:ecommerce
pnpm firebase:deploy:editorial
```

**📖 For detailed Firebase setup, see the Firebase Console documentation**

## 🎯 Next Steps

1. **Complete Firebase Setup**: Create your Firebase project and configure environment variables
2. **User Management**: Set up initial admin users with appropriate permissions in Firestore
3. **Content Structure**: Define your content schemas in the `zod-schemas` package
4. **Brand Application**: Apply Brazilian colors and fonts across all applications
5. **Custom Components**: Extend the shared layer with domain-specific components

## 📚 Development Guidelines

- **Commits**: Use Conventional Commits format
- **Branches**: Feature branches with descriptive names
- **Pull Requests**: Required for all changes to main
- **Code Sharing**: Prefer layer components over duplicating code
- **Permissions**: Always check user permissions in protected routes
- **Brand Consistency**: Use Brazilian colors and typography system

---

**🇧🇷 Editora Sabia - Celebrating Brazilian culture through modern technology!** 