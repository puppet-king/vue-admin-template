<template>
  <div class="hamburger-wrapper" :title="isActive ? '收起侧边栏' : '展开侧边栏'" @click="toggleClick">
    <el-icon :class="['hamburger', { 'is-active': isActive }, hamburgerClass]" :size="20">
      <PanelLeft />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { PanelLeft } from '@lucide/vue'
import { useSettingsStore } from '@/stores'
import { ThemeMode, SidebarColor, LayoutMode } from '@/enums/settings'

defineProps({
  isActive: { type: Boolean, required: true },
})

const emit = defineEmits(['toggleClick'])

const settingsStore = useSettingsStore()
const layout = computed(() => settingsStore.layout)

const hamburgerClass = computed(() => {
  // 如果暗黑主题
  if (settingsStore.resolvedTheme === ThemeMode.DARK) {
    return 'hamburger--white'
  }

  // 如果是混合布局 && 侧边栏配色方案是经典蓝
  if (layout.value === LayoutMode.MIX && settingsStore.sidebarColorScheme === SidebarColor.CLASSIC_BLUE) {
    return 'hamburger--white'
  }

  // 默认返回空字符串
  return ''
})

function toggleClick() {
  emit('toggleClick')
}
</script>

<style scoped lang="scss">
.hamburger-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  cursor: pointer;
  color: var(--menu-text);
  transition: color 0.2s ease;

  &:hover {
    color: var(--el-color-primary);
  }

  .hamburger {
    vertical-align: middle;
    transition: transform 0.3s ease;

    &--white {
      color: #fff;
    }
  }
}
</style>
