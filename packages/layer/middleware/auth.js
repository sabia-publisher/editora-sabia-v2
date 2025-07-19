export default defineNuxtRouteMiddleware((to, from) => {
  const { user, isLoading, isAuthenticated } = useAuthUser()

  // Wait for auth state to load
  if (isLoading.value) {
    return
  }

  // Check if user is authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }

  // Check for required permission if specified in route meta
  if (to.meta?.requiredPermission) {
    const hasRequiredPermission = user.value?.permissions?.[to.meta.requiredPermission]
    
    if (!hasRequiredPermission) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access Denied',
        message: 'You do not have permission to access this page.'
      })
    }
  }
}) 