import { store } from '@/stores'
import { STORAGE_KEYS } from '@/constants'

export interface DictItemOption {
  value: string | number
  label: string
  tagType?: '' | 'success' | 'warning' | 'info' | 'danger'
}

export const useDictStore = defineStore('dict', () => {
  const dictCache = useStorage<Record<string, DictItemOption[]>>(STORAGE_KEYS.DICT_CACHE, {})

  const cacheDictItems = (dictCode: string, data: DictItemOption[]) => {
    dictCache.value[dictCode] = data
  }

  const loadDictItems = async (dictCode: string) => {
    if (dictCache.value[dictCode]) return
    dictCache.value[dictCode] = []
  }

  const getDictItems = (dictCode: string): DictItemOption[] => {
    return dictCache.value[dictCode] || []
  }

  const removeDictItem = (dictCode: string) => {
    if (dictCache.value[dictCode]) {
      Reflect.deleteProperty(dictCache.value, dictCode)
    }
  }

  const clearDictCache = () => {
    dictCache.value = {}
  }

  return {
    loadDictItems,
    getDictItems,
    removeDictItem,
    clearDictCache,
    cacheDictItems,
  }
})

export function useDictStoreHook() {
  return useDictStore(store)
}
