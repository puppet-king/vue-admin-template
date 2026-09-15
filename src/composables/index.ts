// 表格相关
export { useTableSelection } from './useTableSelection'

// 最近访问菜单
export { useRecentMenus } from './useRecentMenus'
export type { RecentMenuItem } from './useRecentMenus'

// SSE 同步
export { useDictSync } from './sse/useDictSync'
export type { DictMessage } from './sse/useDictSync'

// 空 SSE 清理函数（兼容旧代码）
export function cleanupSseServices() {}
