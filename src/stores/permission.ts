import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from '@/router'
import { store } from '@/stores'

export const usePermissionStore = defineStore('permission', () => {
  // 所有路由（只使用静态路由）
  const routes = ref<RouteRecordRaw[]>([...constantRoutes])
  // 混合布局的左侧菜单路由
  const mixLayoutSideMenus = ref<RouteRecordRaw[]>([])
  // 动态路由是否已生成 - 我们不需要动态路由，始终设为 true
  const isRouteGenerated = ref(true)

  const isRefreshing = ref(false)

  /** 设置混合布局左侧菜单 */
  const setMixLayoutSideMenus = (parentPath: string) => {
    const parentMenu = routes.value.find((item: RouteRecordRaw) => item.path === parentPath)
    mixLayoutSideMenus.value = parentMenu?.children || []
  }

  /** 重置路由状态 */
  const resetRouter = () => {
    routes.value = [...constantRoutes]
    mixLayoutSideMenus.value = []
    isRouteGenerated.value = true
  }

  const reloadPermissionSnapshotOnce = async () => {
    if (isRefreshing.value) return
    isRefreshing.value = true
    try {
      console.log('正在重新同步权限快照...')
      // 这里写你实际的后端 API 请求，例如：
      // const { permissions } = await authApi.getUserInfo()
      // 更新权限相关的 state...
    } finally {
      isRefreshing.value = false
    }
  }

  return {
    routes,
    mixLayoutSideMenus,
    isRouteGenerated,
    setMixLayoutSideMenus,
    reloadPermissionSnapshotOnce,
    resetRouter,
  }
})

/** 非组件环境使用权限store */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
