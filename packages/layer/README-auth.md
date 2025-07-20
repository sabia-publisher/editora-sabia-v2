# Cross-Subdomain Authentication System

This documentation explains how authentication works across all three applications (website, ecommerce, editorial) in the Editora Sabia V2 monorepo.

## 🎯 **Overview**

The authentication system is designed to provide **seamless single sign-on (SSO)** across all subdomains:
- `website.editora-sabia.com` - Main website
- `ecommerce.editora-sabia.com` - E-commerce platform  
- `editorial.editora-sabia.com` - Editorial CMS

When a user logs in on any subdomain, they are automatically authenticated on all other subdomains.

## 🏗️ **Architecture**

### **Components**

1. **Cookie-Based Persistence** (`utils/auth-cookies.js`)
   - Cross-subdomain cookies using Nuxt's `useCookie`
   - Automatic serialization/deserialization
   - Secure configuration for production

2. **Pinia Colada Store** (`stores/user.js`)
   - Centralized state management
   - Reactive queries for user data
   - Mutation handling for auth operations

3. **Auth Sync Plugin** (`plugins/auth-sync.client.js`)
   - Real-time synchronization across browser tabs
   - Cross-tab communication using localStorage events
   - Window focus synchronization

4. **Enhanced Firebase Plugin** (`plugins/firebase.client.js`)
   - Firebase Auth configuration for cross-subdomain support
   - Token management and refresh
   - Error handling and persistence

## 🍪 **Cookie Strategy**

### **Cookies Created**

| Cookie Name | Purpose | Data |
|-------------|---------|------|
| `editora-auth-token` | Firebase ID token | `{ token, timestamp, uid }` |
| `editora-user-session` | Basic user info | `{ uid, email, displayName, photoURL, timestamp }` |
| `editora-auth-state` | Authentication status | `boolean` |

### **Cookie Configuration**

```javascript
{
  domain: '.editora-sabia.com',    // Works across all subdomains
  secure: true,                    // HTTPS only in production
  sameSite: 'lax',                // Allow cross-site authentication
  httpOnly: false,                // Allow JavaScript access
  maxAge: 60 * 60 * 24 * 7        // 7 days
}
```

## 🔄 **Authentication Flow**

### **Login Flow**

1. User logs in on any subdomain (e.g., ecommerce.editora-sabia.com)
2. Firebase Auth authenticates the user
3. System gets Firebase ID token
4. **Cookies are set** with domain `.editora-sabia.com`
5. **Auth sync broadcasts** login to other tabs
6. User is now authenticated on all subdomains

### **Cross-Tab Synchronization**

1. Tab A: User logs in
2. **localStorage event** is triggered with auth state
3. Tab B: Receives storage event
4. Tab B: **Syncs from cookies** and updates local state
5. Tab B: User appears as logged in **immediately**

### **Cross-Subdomain Navigation**

1. User visits different subdomain (e.g., from ecommerce to editorial)
2. **Cookies are automatically sent** with the request
3. Store **initializes from cookies** on page load
4. User appears as authenticated **immediately**

## 🛠️ **Implementation Details**

### **Environment Configuration**

Add to your `.env` file:

```bash
# For production
AUTH_COOKIE_DOMAIN=.editora-sabia.com

# For development (leave empty)
AUTH_COOKIE_DOMAIN=
```

### **Domain Detection**

The system automatically detects the appropriate domain:

- **Development**: Uses browser default (localhost)
- **Production**: Uses `.editora-sabia.com` or `AUTH_COOKIE_DOMAIN`
- **Auto-detection**: Extracts root domain from current hostname

### **Usage in Components**

```vue
<script setup>
// Same API as before - no changes needed!
const { user, isLoading, signIn, hasPermission } = useAuthUser()

// Advanced usage - direct store access
const userStore = useUserStore()
const { refreshToken, lastSyncTime } = userStore
</script>
```

## 🔐 **Security Considerations**

### **Cookie Security**

- **HTTPS Only**: Secure flag in production
- **Domain Scoped**: Only accessible to editora-sabia.com subdomains
- **Base64 Encoded**: Data is encoded (not encrypted, but obscured)
- **SameSite**: Lax policy allows authentication flows

### **Token Management**

- **Auto-Refresh**: Firebase tokens are automatically refreshed
- **Expiration**: Tokens expire according to Firebase settings
- **Revocation**: Logout clears all tokens across subdomains

### **Storage Events**

- **Timestamp Validation**: Prevents replay attacks
- **Source Validation**: Only processes editora-specific events
- **Cleanup**: Events are automatically cleaned up

## 🐛 **Debugging**

### **Check Authentication State**

```javascript
// In browser console
const userStore = useUserStore()
console.log({
  user: userStore.currentUser,
  isAuthenticated: userStore.isAuthenticated,
  cookies: {
    token: userStore.authTokenCookie,
    session: userStore.userSessionCookie,
    state: userStore.authStateCookie
  },
  lastSync: userStore.lastSyncTime
})
```

### **Manual Sync**

```javascript
// Force sync from cookies
const { $authSync } = useNuxtApp()
$authSync.syncFromCookies()

// Broadcast events manually
$authSync.broadcastLogin(user)
$authSync.broadcastLogout()
```

### **Clear All Auth Data**

```javascript
// Complete auth reset
import { clearAuthCookies } from '@/utils/auth-cookies'
clearAuthCookies()
localStorage.clear()
sessionStorage.clear()
```

## 📊 **Monitoring**

### **Storage Events**

The system uses these localStorage keys for cross-tab communication:

- `editora-last-auth-sync` - Timestamp of last sync
- `editora-auth-state-sync` - Temporary event data

### **Console Logs**

In development mode, you'll see:

- Firebase Auth state changes
- Cross-tab sync events
- Cookie updates
- Token refresh attempts

## 🚀 **Production Deployment**

### **Domain Setup**

1. **Set AUTH_COOKIE_DOMAIN**: `.editora-sabia.com`
2. **HTTPS Required**: Cookies only work over HTTPS in production
3. **Firebase Configuration**: Ensure auth domain matches your setup

### **Testing Cross-Subdomain**

1. Deploy to staging subdomains
2. Login on one subdomain
3. Navigate to another subdomain
4. Verify immediate authentication
5. Test logout synchronization

### **Performance**

- **Cookie Size**: Minimized user data in cookies
- **Event Debouncing**: Prevents excessive sync events
- **Lazy Loading**: Auth sync only loads when needed

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Not working on localhost**: 
   - Expected behavior, cookies don't work across localhost subdomains
   - Use different ports for testing

2. **Auth not syncing**:
   - Check `AUTH_COOKIE_DOMAIN` is set correctly
   - Verify HTTPS in production
   - Check browser cookie settings

3. **Token expired errors**:
   - System should auto-refresh
   - Check Firebase token expiration settings
   - Verify network connectivity

### **Manual Recovery**

If authentication gets stuck:

```javascript
// Complete reset
const userStore = useUserStore()
await userStore.signOut()
clearAuthCookies()
location.reload()
```

---

This system provides a seamless, secure, and maintainable cross-subdomain authentication experience for all users of the Editora Sabia platform. 