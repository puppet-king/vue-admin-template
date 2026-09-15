import { store } from '@/stores'
import AuthAPI from '@/api/auth'
import type { LoginRequest } from '@/api/auth'
import { AuthStorage } from '@/utils/auth'
import { usePermissionStoreHook } from '@/stores/permission'
import { useTagsViewStore } from '@/stores/tags-view'

interface UserInfo {
  id?: number
  userId?: string
  username?: string
  nickname?: string
  role?: string
  roles?: string[]
  perms?: string[]
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({})
  const rememberMe = ref(AuthStorage.getRememberMe())

  /**
   * 登录
   */
  async function login(loginRequest: LoginRequest): Promise<void> {
    const res = await AuthAPI.login(loginRequest)
    rememberMe.value = loginRequest.rememberMe ?? false
    const accessToken = res.accessToken || res.token || ''
    const refreshToken = res.refreshToken || ''
    AuthStorage.setTokens(accessToken, refreshToken, rememberMe.value)

    userInfo.value = {
      id: res.user?.id,
      username: res.user?.username,
      nickname: res.user?.nickname,
      role: res.user?.role,
      roles: res.user?.role ? [res.user.role] : ['admin'],
      perms: [],
      avatar: '',
    }
  }

  let refreshPromise: Promise<void> | null = null

  /**
   * 刷新 token（单飞模式）
   */
  function refreshTokenOnce(): Promise<void> {
    if (refreshPromise) return refreshPromise

    refreshPromise = doRefreshToken().finally(() => {
      refreshPromise = null
    })

    return refreshPromise
  }

  /**
   * 获取用户信息
   */
  async function getUserInfo(): Promise<UserInfo> {
    if (!userInfo.value.username) {
      const stored = AuthStorage.getUserInfo()
      if (stored) {
        userInfo.value = stored
      }
    }
    return userInfo.value
  }

  /**
   * 登出
   */
  async function logout(): Promise<void> {
    try {
      await AuthAPI.logout()
    } finally {
      await resetAllState()
    }
  }

  /**
   * 重置所有系统状态
   */
  async function resetAllState(): Promise<void> {
    resetUserState()
    try {
      usePermissionStoreHook().resetRouter()
      useTagsViewStore().delAllViews()
    } catch (e) {
      console.warn('reset state error:', e)
    }
  }

  /**
   * 重置用户状态
   */
  function resetUserState(): void {
    AuthStorage.clearAuth()
    userInfo.value = {}
  }

  /**
   * 刷新 token
   */
  async function doRefreshToken(): Promise<void> {
    const currentRefreshToken = AuthStorage.getRefreshToken()

    if (!currentRefreshToken) {
      throw new Error('没有有效的刷新令牌')
    }

    const res = await AuthAPI.refreshToken(currentRefreshToken)
    const newAccessToken = res.accessToken || res.token || ''
    const newRefreshToken = res.refreshToken || currentRefreshToken
    AuthStorage.setTokens(newAccessToken, newRefreshToken, AuthStorage.getRememberMe())
  }

  return {
    userInfo,
    rememberMe,
    isLoggedIn: () => !!AuthStorage.getAccessToken(),
    login,
    logout,
    getUserInfo,
    resetAllState,
    resetUserState,
    refreshToken: doRefreshToken,
    refreshTokenOnce,
  }
})

export function useUserStoreHook() {
  return useUserStore(store)
}
