import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { UserSchema } from '@repo/zod-schemas'

export const useAuthUser = () => {
  const { $firebase } = useNuxtApp()
  const user = useState('auth.user', () => null)
  const isLoading = useState('auth.loading', () => true)

  // Initialize auth state listener
  const initAuth = () => {
    onAuthStateChanged($firebase.auth, async (firebaseUser) => {
      isLoading.value = true
      
      if (firebaseUser) {
        try {
          // Get user document from Firestore
          const userDoc = await getDoc(doc($firebase.firestore, 'users', firebaseUser.uid))
          
          if (userDoc.exists()) {
            // Validate and set user data
            const userData = UserSchema.parse({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              permissions: userDoc.data().permissions
            })
            user.value = userData
          } else {
            // Create default user document
            const defaultPermissions = {
              canAccessEcommerce: false,
              canAccessEditorial: false,
              canPublishContent: false,
              isSuperAdmin: false
            }
            
            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || null,
              permissions: defaultPermissions
            }
            
            await setDoc(doc($firebase.firestore, 'users', firebaseUser.uid), {
              permissions: defaultPermissions,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || null,
              createdAt: new Date(),
              updatedAt: new Date()
            })
            
            user.value = UserSchema.parse(userData)
          }
        } catch (error) {
          console.error('Error loading user data:', error)
          user.value = null
        }
      } else {
        user.value = null
      }
      
      isLoading.value = false
    })
  }

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword($firebase.auth, email, password)
      return { user: result.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  }

  // Sign up with email and password
  const signUp = async (email, password, displayName = '') => {
    try {
      const result = await createUserWithEmailAndPassword($firebase.auth, email, password)
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(result.user, { displayName })
      }
      
      return { user: result.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  }

  // Sign out
  const signOutUser = async () => {
    try {
      await signOut($firebase.auth)
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return computed(() => {
      return user.value?.permissions?.[permission] || false
    })
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => {
    return !!user.value
  })

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    isAuthenticated,
    initAuth,
    signIn,
    signUp,
    signOut: signOutUser,
    hasPermission
  }
} 