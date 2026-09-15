<template>
  <div :class="['navbar-actions', navbarActionsClass]">
    <!-- 桌面端工具项 -->
    <template v-if="isDesktop">
      <!-- 搜索 -->
      <div class="navbar-actions__item">
        <CommandPalette />
      </div>

      <!-- 全屏 -->
      <div class="navbar-actions__item">
        <Fullscreen />
      </div>

      <!-- 布局大小 -->
      <div class="navbar-actions__item">
        <SizeSelect />
      </div>

      <!-- 语言选择 -->
      <div class="navbar-actions__item">
        <LangSelect />
      </div>

      <!-- 通知 -->
      <div class="navbar-actions__item">
        <NoticeDropdown />
      </div>
    </template>

    <!-- 用户菜单 -->
    <div class="navbar-actions__item">
      <el-dropdown trigger="click">
        <div class="user-profile">
          <div style="width: 28px; height: 28px; overflow: hidden; border-radius: 50%" class="bg-primary flex items-center justify-center text-white font-bold text-xs">
            {{ (userStore.userInfo.username || 'A').charAt(0).toUpperCase() }}
          </div>
          <span class="user-profile__name">{{ userStore.userInfo.nickname || userStore.userInfo.username || 'Admin' }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">
              {{ t('navbar.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 系统设置 -->
    <div v-if="defaults.showSettings" class="navbar-actions__item" @click="handleSettingsClick">
      <el-icon><Settings /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { defaults } from '@/settings'
import { DeviceEnum, SidebarColor, ThemeMode, LayoutMode } from '@/enums/settings'
import { useAppStore, useSettingsStore, useUserStore } from '@/stores'

// 导入子组件
import CommandPalette from '@/components/CommandPalette/index.vue'
import Fullscreen from '@/components/Fullscreen/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import NoticeDropdown from '@/components/NoticeDropdown/index.vue'

const { t } = useI18n()
const appStore = useAppStore()
const settingStore = useSettingsStore()
const userStore = useUserStore()

const route = useRoute()
const router = useRouter()

// 是否为桌面设备
const isDesktop = computed(() => appStore.device === DeviceEnum.DESKTOP)

// 根据主题和侧边栏配色方案选择样式类
const navbarActionsClass = computed(() => {
  const { resolvedTheme, sidebarColorScheme, layout } = settingStore

  // 暗黑主题下，所有布局都使用白色文字
  if (resolvedTheme === ThemeMode.DARK) {
    return 'navbar-actions--white-text'
  }

  // 明亮主题下
  if (resolvedTheme === ThemeMode.LIGHT) {
    if (layout === LayoutMode.TOP || layout === LayoutMode.MIX) {
      if (sidebarColorScheme === SidebarColor.CLASSIC_BLUE) {
        return 'navbar-actions--white-text'
      } else {
        return 'navbar-actions--dark-text'
      }
    }
  }

  return 'navbar-actions--dark-text'
})

/**
 * 退出登录
 */
function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    lockScroll: false,
  }).then(() => {
    userStore.logout().then(() => {
      const redirect = ['/404', '/401'].includes(route.path) ? '/' : route.fullPath
      router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`)
    })
  })
}

/**
 * 打开系统设置页面
 */
function handleSettingsClick() {
  settingStore.settingsVisible = true
}
</script>

<style lang="scss" scoped>
.navbar-actions {
  display: flex;
  align-items: center;
  min-height: 44px;

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 44px;
    padding: 0 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    :deep(.el-dropdown),
    :deep(.el-tooltip) {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 44px;
    }

    :deep(.el-icon) {
      font-size: 18px;
      line-height: 1;
      color: var(--el-text-color-regular);
      transition: color 0.3s;
    }

    &:hover {
      background: var(--el-fill-color-light);

      :deep(.el-icon) {
        color: var(--el-color-primary);
      }
    }
  }

  .user-profile {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    padding: 0 8px;

    &__name {
      margin-left: 8px;
      color: var(--el-text-color-regular);
      white-space: nowrap;
      transition: color 0.3s;
    }
  }
}

.navbar-actions--white-text {
  .navbar-actions__item {
    :deep(.el-icon) {
      color: color-mix(in srgb, var(--el-color-white) 85%, transparent);
    }

    &:hover {
      background: color-mix(in srgb, var(--el-color-white) 10%, transparent);

      :deep(.el-icon) {
        color: var(--el-color-white);
      }
    }
  }

  .user-profile__name {
    color: color-mix(in srgb, var(--el-color-white) 85%, transparent);
  }
}

.navbar-actions--dark-text {
  .navbar-actions__item {
    :deep(.el-icon) {
      color: var(--el-text-color-regular) !important;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.04);

      :deep(.el-icon) {
        color: var(--el-color-primary) !important;
      }
    }
  }

  .user-profile__name {
    color: var(--el-text-color-regular) !important;
  }
}
</style>
