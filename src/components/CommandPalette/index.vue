<template>
  <div>
    <div
      class="flex h-8 cursor-pointer items-center justify-between gap-2.5 rounded-full border border-border-lighter bg-fill-light px-3 transition-colors select-none hover:border-border focus-visible:outline-2 focus-visible:outline-primary"
      role="button"
      tabindex="0"
      aria-label="打开搜索面板"
      @click="open"
      @keydown.enter.prevent="open"
      @keydown.space.prevent="open"
    >
      <div class="flex items-center gap-2 text-secondary">
        <Search :size="14" />
        <span class="text-xs whitespace-nowrap">搜索菜单</span>
      </div>
      <kbd
        class="inline-flex items-center justify-center rounded-lg border border-border-lighter bg-bg-overlay px-2 py-0.5 text-xs leading-none whitespace-nowrap text-secondary"
      >
        Ctrl K
      </kbd>
    </div>

    <el-dialog v-model="visible" width="720px" :close-on-click-modal="true" :show-close="false" @close="close">
      <div class="flex flex-col gap-3.5">
        <el-input
          ref="inputRef"
          v-model="keyword"
          class="rounded-xl!"
          placeholder="搜索菜单"
          @input="onSearch"
          @keydown="handleInputKeydown"
        >
          <template #prefix>
            <Search :size="16" class="text-secondary" />
          </template>
          <template #suffix>
            <div class="inline-flex items-center">
              <X
                :size="16"
                role="button"
                tabindex="0"
                aria-label="关闭"
                class="cursor-pointer text-secondary transition-colors hover:text-primary"
                @click="close"
              />
            </div>
          </template>
        </el-input>

        <div class="max-h-[48vh] overflow-y-auto">
          <div v-if="displayList.length === 0" class="py-6 text-center text-xs text-secondary">没有搜索历史</div>

          <ul v-else class="m-0 flex list-none flex-col gap-1.5 p-0">
            <li
              v-for="(item, idx) in displayList"
              :key="item.path + idx"
              class="cursor-pointer rounded-lg p-2.5 transition-colors hover:bg-fill-light"
              :class="{ 'bg-primary-light-9!': activeIndex === idx }"
              @mouseenter="activeIndex = idx"
              @click="onGo(item)"
            >
              <div class="text-sm font-medium text-main">{{ item.title }}</div>
              <div class="mt-0.5 text-xs text-secondary">{{ item.path }}</div>
            </li>
          </ul>
        </div>

        <div class="flex items-center gap-3.5 border-t border-border-lighter pt-2.5 text-xs text-secondary">
          <div class="inline-flex items-center gap-1.5">
            <div
              class="inline-flex h-6 items-center justify-center rounded-lg border border-border-lighter bg-bg-overlay px-2 text-xs text-secondary"
            >
              <ArrowUp :size="12" />
            </div>
            <div
              class="inline-flex h-6 items-center justify-center rounded-lg border border-border-lighter bg-bg-overlay px-2 text-xs text-secondary"
            >
              <ArrowDown :size="12" />
            </div>
            <span>切换</span>
          </div>
          <div class="inline-flex items-center gap-1.5">
            <div
              class="inline-flex h-6 items-center justify-center rounded-lg border border-border-lighter bg-bg-overlay px-2 text-xs text-secondary"
            >
              <CornerDownLeft :size="12" />
            </div>
            <span>选择</span>
          </div>
          <div class="inline-flex items-center gap-1.5">
            <div
              class="inline-flex h-6 items-center justify-center rounded-lg border border-border-lighter bg-bg-overlay px-2 text-xs text-secondary"
            >
              <span class="text-xs">Esc</span>
            </div>
            <span>关闭</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Search, X, ArrowUp, ArrowDown, CornerDownLeft } from '@lucide/vue'
import { useCommandPalette } from './useCommandPalette'

const { visible, keyword, results, history, activeIndex, inputRef, open, close, onSearch, onSelect, onNavigate, onGo } =
  useCommandPalette()

const displayList = computed(() => (results.value.length ? results.value : history.value))

const handleInputKeydown: (evt: KeyboardEvent | Event) => any = (evt) => {
  if (!(evt instanceof KeyboardEvent)) return
  const e = evt
  const key = e.key.toLowerCase()

  if (key === 'escape') {
    e.preventDefault()
    close()
    return
  }

  if (key === 'arrowup') {
    e.preventDefault()
    onNavigate('up')
    return
  }

  if (key === 'arrowdown') {
    e.preventDefault()
    onNavigate('down')
    return
  }

  if (key === 'enter') {
    e.preventDefault()
    if (displayList.value.length === 0) return
    if (activeIndex.value < 0) activeIndex.value = 0
    onSelect()
  }
}
</script>
