<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <!--【叶子节点】显示叶子节点或唯一子节点且父节点未配置始终显示 -->
    <template
      v-if="
        // 未配置始终显示，使用唯一子节点替换父节点显示为叶子节点
        (hasOneShowingChild(item.children, item) &&
          !item.meta?.alwaysShow &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren)) ||
        // 即使配置了始终显示，但无子节点，也显示为叶子节点
        (item.meta?.alwaysShow && !item.children)
      "
    >
      <AppLink
        v-if="onlyOneChild.meta"
        :to="{
          path: resolvePath(onlyOneChild.path),
          query: onlyOneChild.meta.params,
        }"
      >
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <MenuIcon :icon="onlyOneChild.meta?.icon || item.meta?.icon" class="mr-1.5" />
          <template #title>
            <span v-if="onlyOneChild.meta?.title" class="font-semibold">
              {{ translateRouteTitle(onlyOneChild.meta.title) }}
            </span>
          </template>
        </el-menu-item>
      </AppLink>
    </template>

    <!--【非叶子节点】显示含多个子节点的父菜单，或始终显示的单子节点 -->
    <el-sub-menu v-else :index="resolvePath(item.path)" :data-path="item.path" teleported>
      <template #title>
        <template v-if="item.meta">
          <MenuIcon :icon="item.meta.icon" class="mr-1.5" />
          <span v-if="item.meta.title" class="font-semibold">
            {{ translateRouteTitle(item.meta.title) }}
          </span>
        </template>
      </template>

      <LayoutSidebarItem
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import path from 'path-browserify'
import { RouteRecordRaw } from 'vue-router'
import { isExternal } from '@/utils'
import { translateRouteTitle } from '@/lang/utils'
import { ElIcon } from 'element-plus'

defineOptions({
  name: 'LayoutSidebarItem',
  inheritAttrs: false,
})

// 菜单图标组件
const MenuIcon = defineComponent({
  props: { icon: String },
  setup(props, { attrs }) {
    const isElIcon = computed(() => props.icon?.startsWith('el-icon'))
    const iconName = computed(() => props.icon?.replace('el-icon-', '') || '')

    return () => {
      if (!props.icon) {
        return h(ElIcon, attrs, () => h('div', { style: 'width: 1em; height: 1em' }))
      }

      // 处理图标解析（优先按直接名称解析，其次按去前缀名称解析）
      const targetName = isElIcon.value ? iconName.value : props.icon
      const resolved = resolveComponent(targetName)
      if (typeof resolved !== 'string') {
        return h(ElIcon, attrs, () => h(resolved))
      }

      const svgComp = resolveComponent('SvgIcon')
      if (typeof svgComp !== 'string') {
        return h(ElIcon, attrs, () => h(svgComp, { name: props.icon }))
      }

      return h(ElIcon, attrs, () => h('div', { style: 'width: 1em; height: 1em' }))
    }
  },
})

const props = defineProps({
  /**
   * 当前路由对象
   */
  item: {
    type: Object as PropType<RouteRecordRaw>,
    required: true,
  },

  /**
   * 父级完整路径
   */
  basePath: {
    type: String,
    required: true,
  },

  /**
   * 是否为嵌套路由
   */
  isNest: {
    type: Boolean,
    default: false,
  },
})

// 可见的唯一子节点
const onlyOneChild = ref()

/**
 * 检查是否仅有一个可见子节点
 *
 * @param children 子路由数组
 * @param parent 父级路由
 * @returns 是否仅有一个可见子节点
 */
function hasOneShowingChild(children: RouteRecordRaw[] = [], parent: RouteRecordRaw) {
  // 过滤出可见子节点
  const showingChildren = children.filter((route: RouteRecordRaw) => {
    if (!route.meta?.hidden) {
      onlyOneChild.value = route
      return true
    }
    return false
  })

  // 仅有一个节点
  if (showingChildren.length === 1) {
    return true
  }

  // 无子节点
  if (showingChildren.length === 0) {
    // 父节点设置为唯一显示节点，并标记为无子节点
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }
  return false
}

/**
 * 获取完整路径，适配外部链接
 *
 * @param routePath 路由路径
 * @returns 绝对路径
 */
function resolvePath(routePath: string) {
  if (isExternal(routePath)) return routePath
  if (isExternal(props.basePath)) return props.basePath

  // 拼接父路径和当前路径
  return path.resolve(props.basePath, routePath)
}
</script>

<style lang="scss">
/* stylelint-disable no-descending-specificity */
/* 菜单图标统一样式 */
.el-menu-item,
.el-sub-menu__title {
  .el-icon {
    color: currentcolor;
  }
}

/* hideSidebar 状态下的图标 */
.hideSidebar {
  .submenu-title-noDropdown {
    position: relative;

    & > span {
      display: inline-block;
      visibility: hidden;
      width: 0;
      height: 0;
      overflow: hidden;
    }
  }

  .el-sub-menu {
    overflow: hidden;

    & > .el-sub-menu__title {
      .sub-el-icon {
        margin-left: 19px;
      }

      .el-sub-menu__icon-arrow {
        display: none;
      }
    }
  }

  .el-menu--collapse {
    width: $sidebar-width-collapsed;

    .el-sub-menu {
      & > .el-sub-menu__title > span {
        display: inline-block;
        visibility: hidden;
        width: 0;
        height: 0;
        overflow: hidden;
      }
    }
  }
}

html.dark,
html.sidebar-color-blue {
  .el-menu-item:hover,
  .el-sub-menu__title:hover {
    color: var(--el-menu-active-color) !important;
    background-color: $menu-hover !important;

    .el-icon,
    .el-sub-menu__icon-arrow {
      color: var(--el-menu-active-color) !important;
    }
  }
}

// 父菜单激活状态样式 - 当子菜单激活时，父菜单仅高亮文字与图标，不添加冲突的背景色
.el-sub-menu {
  &.has-active-child > .el-sub-menu__title {
    color: var(--el-color-primary) !important;

    .el-icon,
    .el-sub-menu__icon-arrow {
      color: var(--el-color-primary) !important;
    }
  }

  html.dark & {
    &.has-active-child > .el-sub-menu__title {
      color: var(--el-color-primary-light-3) !important;

      .el-icon,
      .el-sub-menu__icon-arrow {
        color: var(--el-color-primary-light-3) !important;
      }
    }
  }

  html.sidebar-color-blue & {
    &.has-active-child > .el-sub-menu__title {
      color: #fff !important;

      .el-icon,
      .el-sub-menu__icon-arrow {
        color: #fff !important;
      }
    }
  }
}
/* stylelint-enable no-descending-specificity */
</style>
