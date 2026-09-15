import NProgress from '@/plugins/nprogress'
import router from '@/router'
import { useUserStore } from '@/stores'

/**
 * 路由权限守卫
 */
export function setupPermissionGuard() {
  const whiteList = ['/auth/login', '/auth/reset-password', '/login']

  router.beforeEach(async (to, _from) => {
    NProgress.start()

    try {
      const isLoggedIn = useUserStore().isLoggedIn()

      // 未登录处理
      if (!isLoggedIn) {
        if (whiteList.includes(to.path)) {
          return
        }
        NProgress.done()
        return `/auth/login?redirect=${encodeURIComponent(to.fullPath)}`
      }

      // 已登录访问登录/注册页，重定向到首页
      if (whiteList.includes(to.path)) {
        return { path: '/' }
      }

      // 路由 404 检查
      if (to.matched.length === 0) {
        if (_from.path === '/auth/login' || _from.path === '/login') {
          return { path: '/', replace: true }
        }
        return '/404'
      }

      // 动态标题
      const title = (to.params.title as string) || (to.query.title as string)
      if (title) {
        to.meta.title = title
      }
    } catch (error) {
      console.error('Route guard error:', error)
      await useUserStore().resetAllState()
      NProgress.done()
      return '/auth/login'
    }
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
