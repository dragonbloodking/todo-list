import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const currentUser = ref(null)

export function useAuth() {
  const router = useRouter()

  onMounted(() => {
    // 页面加载时检查登录状态
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
      try {
        currentUser.value = JSON.parse(userStr)
      } catch (e) {
        localStorage.removeItem('currentUser')
        currentUser.value = null
      }
    }
  })

  const logout = () => {
    localStorage.removeItem('currentUser')
    currentUser.value = null
    router.push('/login')
  }

  const checkAuth = () => {
    const userStr = localStorage.getItem('currentUser')
    if (!userStr) {
      currentUser.value = null
      router.push('/login')
      return false
    }
    try {
      currentUser.value = JSON.parse(userStr)
      return true
    } catch (e) {
      localStorage.removeItem('currentUser')
      currentUser.value = null
      router.push('/login')
      return false
    }
  }

  return {
    currentUser,
    logout,
    checkAuth
  }
} 