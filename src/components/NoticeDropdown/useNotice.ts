/**
 * 通知中心逻辑
 */
import { ref } from 'vue'

export interface NoticeItem {
  id: string
  title: string
  type: string
  level: string
  publishTime: string
}

export interface NoticeDetail {
  id: string
  title: string
  content: string
  publishTime: string
}

export function useNotice() {
  const list = ref<NoticeItem[]>([
    {
      id: '1',
      title: '欢迎使用后台管理系统模版',
      type: '1',
      level: 'L',
      publishTime: new Date().toLocaleDateString(),
    },
  ])
  const unreadTotal = ref(1)
  const detail = ref<NoticeDetail | null>(null)
  const dialogVisible = ref(false)

  async function fetchList() {
    // 默认通知
  }

  async function read(id: string) {
    const item = list.value.find((i) => i.id === id)
    if (item) {
      detail.value = {
        id: item.id,
        title: item.title,
        content: '欢迎使用基于 Vue 3 + Vite + TypeScript + Element Plus 的后台管理系统模板！',
        publishTime: item.publishTime,
      }
      dialogVisible.value = true
    }
    const idx = list.value.findIndex((i) => i.id === id)
    if (idx >= 0) list.value.splice(idx, 1)
    if (unreadTotal.value > 0) unreadTotal.value -= 1
  }

  async function readAll() {
    list.value = []
    unreadTotal.value = 0
    ElMessage.success('已全部标记为已读')
  }

  function goMore() {
    // 更多通知
  }

  return {
    list,
    unreadTotal,
    detail,
    dialogVisible,
    fetchList,
    read,
    readAll,
    goMore,
  }
}
