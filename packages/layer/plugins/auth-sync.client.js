/**
 * Auth Sync Plugin for Cross-Tab and Cross-Subdomain Authentication
 * Ensures authentication state is synchronized across all browser tabs and subdomains
 */

export default defineNuxtPlugin({
  name: 'auth-sync',
  setup() {
    if (process.server) return

    // Event names for cross-tab communication
    const AUTH_EVENTS = {
      LOGIN: 'editora-auth-login',
      LOGOUT: 'editora-auth-logout',
      TOKEN_REFRESH: 'editora-auth-token-refresh',
      USER_UPDATE: 'editora-auth-user-update'
    }

    // Storage keys
    const STORAGE_KEYS = {
      LAST_SYNC: 'editora-last-auth-sync',
      AUTH_STATE: 'editora-auth-state-sync'
    }

    let isInitialized = false

    // Initialize auth sync listeners
    const initAuthSync = () => {
      if (isInitialized) return
      isInitialized = true

      // Listen for storage changes (cross-tab communication)
      window.addEventListener('storage', handleStorageChange)
      
      // Listen for focus events to sync state when returning to tab
      window.addEventListener('focus', handleWindowFocus)
      
      // Listen for custom auth events
      Object.values(AUTH_EVENTS).forEach(eventName => {
        window.addEventListener(eventName, handleAuthEvent)
      })

      // Cleanup on page unload
      window.addEventListener('beforeunload', cleanup)
    }

    // Handle storage changes from other tabs
    const handleStorageChange = (event) => {
      if (!event.key || !event.key.startsWith('editora-')) return

      switch (event.key) {
        case STORAGE_KEYS.LAST_SYNC:
          // Another tab updated auth state, sync our state
          syncAuthStateFromCookies()
          break
        
        case STORAGE_KEYS.AUTH_STATE:
          // Explicit auth state change
          const newState = event.newValue ? JSON.parse(event.newValue) : null
          if (newState) {
            handleAuthStateChange(newState)
          }
          break
      }
    }

    // Handle window focus to ensure state is current
    const handleWindowFocus = () => {
      // Small delay to ensure cookies are updated
      setTimeout(() => {
        syncAuthStateFromCookies()
      }, 100)
    }

    // Handle custom auth events
    const handleAuthEvent = (event) => {
      const { type, data } = event.detail || {}
      
      switch (event.type) {
        case AUTH_EVENTS.LOGIN:
          broadcastAuthChange('login', data)
          break
        case AUTH_EVENTS.LOGOUT:
          broadcastAuthChange('logout', data)
          break
        case AUTH_EVENTS.TOKEN_REFRESH:
          broadcastAuthChange('token_refresh', data)
          break
        case AUTH_EVENTS.USER_UPDATE:
          broadcastAuthChange('user_update', data)
          break
      }
    }

    // Sync authentication state from cookies
    const syncAuthStateFromCookies = async () => {
      try {
        const { getAuthFromCookies } = await import('../utils/auth-cookies')
        const { user, isAuthenticated } = getAuthFromCookies()
        
        if (isAuthenticated && user) {
          // Emit login event to update stores
          emitAuthEvent(AUTH_EVENTS.LOGIN, { user })
        } else {
          // Emit logout event to clear stores
          emitAuthEvent(AUTH_EVENTS.LOGOUT, {})
        }
      } catch (error) {
        console.error('Error syncing auth state from cookies:', error)
      }
    }

    // Handle auth state changes
    const handleAuthStateChange = (stateChange) => {
      const { action, user, timestamp } = stateChange
      
      // Prevent processing old events
      const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC)
      if (lastSync && timestamp < parseInt(lastSync)) {
        return
      }

      switch (action) {
        case 'login':
          if (user) {
            emitAuthEvent(AUTH_EVENTS.LOGIN, { user })
          }
          break
        case 'logout':
          emitAuthEvent(AUTH_EVENTS.LOGOUT, {})
          break
        case 'user_update':
          if (user) {
            emitAuthEvent(AUTH_EVENTS.USER_UPDATE, { user })
          }
          break
      }
    }

    // Broadcast auth change to other tabs
    const broadcastAuthChange = (action, data) => {
      const stateChange = {
        action,
        user: data?.user || null,
        timestamp: Date.now()
      }

      try {
        localStorage.setItem(STORAGE_KEYS.AUTH_STATE, JSON.stringify(stateChange))
        // Remove after broadcasting to prevent duplicate processing
        setTimeout(() => {
          localStorage.removeItem(STORAGE_KEYS.AUTH_STATE)
        }, 1000)
      } catch (error) {
        console.error('Error broadcasting auth change:', error)
      }
    }

    // Emit custom auth event
    const emitAuthEvent = (eventName, data) => {
      const event = new CustomEvent(eventName, {
        detail: { data, timestamp: Date.now() }
      })
      window.dispatchEvent(event)
    }

    // Cleanup function
    const cleanup = () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleWindowFocus)
      window.removeEventListener('beforeunload', cleanup)
      
      Object.values(AUTH_EVENTS).forEach(eventName => {
        window.removeEventListener(eventName, handleAuthEvent)
      })
    }

    // Public API for manual synchronization
    const authSync = {
      // Force sync from cookies
      syncFromCookies: syncAuthStateFromCookies,
      
      // Broadcast login to other tabs
      broadcastLogin: (user) => broadcastAuthChange('login', { user }),
      
      // Broadcast logout to other tabs
      broadcastLogout: () => broadcastAuthChange('logout', {}),
      
      // Broadcast user update to other tabs
      broadcastUserUpdate: (user) => broadcastAuthChange('user_update', { user }),
      
      // Initialize (called automatically)
      init: initAuthSync,
      
      // Cleanup (called automatically on beforeunload)
      cleanup
    }

    // Auto-initialize when plugin loads
    initAuthSync()

    // Make auth sync available globally
    return {
      provide: {
        authSync
      }
    }
  }
}) 