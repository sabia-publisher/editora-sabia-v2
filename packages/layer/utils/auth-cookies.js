/**
 * Auth Cookie Utilities for Cross-Subdomain Authentication
 * Works across all subdomains of editora-sabia.com
 */

// Get the root domain for cross-subdomain cookies
// This will work for both development (localhost) and production
const getRootDomain = () => {
  if (process.server) {
    // On server, get from runtime config or environment
    const config = useRuntimeConfig()
    return config.public.authCookieDomain || 
           (process.env.NODE_ENV === 'production' ? '.editora-sabia.com' : undefined)
  }
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    
    // For localhost development
    if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
      return undefined // Let browser handle localhost
    }
    
    // For production domains like website.editora-sabia.com
    const parts = hostname.split('.')
    if (parts.length >= 2) {
      return '.' + parts.slice(-2).join('.') // .editora-sabia.com
    }
  }
  
  return undefined
}

// Cookie configuration for cross-subdomain authentication
const getAuthCookieOptions = () => ({
  domain: getRootDomain(),
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax', // Allow cross-site requests for authentication
  httpOnly: false, // Allow JavaScript access for client-side operations
  maxAge: 60 * 60 * 24 * 7, // 7 days
})

// Authentication token cookie
export const useAuthTokenCookie = () => {
  return useCookie('editora-auth-token', {
    ...getAuthCookieOptions(),
    serialize: (value) => btoa(JSON.stringify(value)), // Base64 encode
    deserialize: (value) => {
      try {
        return JSON.parse(atob(value))
      } catch {
        return null
      }
    }
  })
}

// User session cookie (lighter user data)
export const useUserSessionCookie = () => {
  return useCookie('editora-user-session', {
    ...getAuthCookieOptions(),
    serialize: (value) => btoa(JSON.stringify(value)),
    deserialize: (value) => {
      try {
        return JSON.parse(atob(value))
      } catch {
        return null
      }
    }
  })
}

// Authentication state cookie (simple boolean)
export const useAuthStateCookie = () => {
  return useCookie('editora-auth-state', {
    ...getAuthCookieOptions(),
    default: () => false
  })
}

// Utility to clear all auth cookies
export const clearAuthCookies = () => {
  const authToken = useAuthTokenCookie()
  const userSession = useUserSessionCookie()
  const authState = useAuthStateCookie()
  
  authToken.value = null
  userSession.value = null
  authState.value = false
  
  // Also clear from browser storage if on client
  if (process.client) {
    localStorage.removeItem('editora-last-auth-sync')
    sessionStorage.removeItem('editora-auth-temp')
  }
}

// Utility to set auth data in cookies
export const setAuthCookies = (user, token = null) => {
  const authToken = useAuthTokenCookie()
  const userSession = useUserSessionCookie()
  const authState = useAuthStateCookie()
  
  // Set authentication token if provided
  if (token) {
    authToken.value = {
      token,
      timestamp: Date.now(),
      uid: user.uid
    }
  }
  
  // Set user session data (minimal data for performance)
  userSession.value = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    timestamp: Date.now()
  }
  
  // Set auth state
  authState.value = true
  
  // Set sync timestamp for cross-tab communication
  if (process.client) {
    localStorage.setItem('editora-last-auth-sync', Date.now().toString())
  }
}

// Utility to get auth data from cookies
export const getAuthFromCookies = () => {
  const authToken = useAuthTokenCookie()
  const userSession = useUserSessionCookie()
  const authState = useAuthStateCookie()
  
  return {
    token: authToken.value,
    user: userSession.value,
    isAuthenticated: authState.value === true
  }
} 