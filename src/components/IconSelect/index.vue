<template>
  <div ref="iconSelectRef" :style="{ width: props.width }">
    <el-popover :visible="popoverVisible" :width="props.width" placement="bottom-end">
      <template #reference>
        <div @click="popoverVisible = !popoverVisible">
          <slot>
            <el-input v-model="selectedIcon" readonly placeholder="点击选择图标" class="reference">
              <template #prepend>
                <!-- 根据图标类型展示 -->
                <el-icon v-if="isLucideIcon">
                  <component :is="resolvedLucideIcon" />
                </el-icon>
                <template v-else-if="selectedIcon && svgIconMap[selectedIcon]">
                  <span class="inline-flex items-center justify-center" style="width: 1em; height: 1em">
                    <component :is="svgIconMap[selectedIcon]" />
                  </span>
                </template>
              </template>
              <template #suffix>
                <!-- 清空按钮 -->
                <el-icon v-if="selectedIcon" style="margin-right: 8px" @click.stop="clearSelectedIcon">
                  <CircleX />
                </el-icon>

                <el-icon
                  :style="{
                    transform: popoverVisible ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform .5s',
                  }"
                >
                  <ChevronDown @click.stop="togglePopover" />
                </el-icon>
              </template>
            </el-input>
          </slot>
        </div>
      </template>

      <!-- 图标选择弹窗 -->
      <div ref="popoverContentRef">
        <el-input v-model="filterText" placeholder="搜索图标" clearable @input="filterIcons" />
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="SVG 图标" name="svg">
            <el-scrollbar height="300px">
              <ul class="icon-grid">
                <li
                  v-for="icon in filteredSvgIcons"
                  :key="'svg-' + icon"
                  class="icon-grid-item"
                  @click="selectIcon(icon)"
                >
                  <el-tooltip :content="icon" placement="bottom" effect="light">
                    <span
                      v-if="svgIconMap[icon]"
                      class="inline-flex items-center justify-center"
                      style="width: 1em; height: 1em"
                    >
                      <component :is="svgIconMap[icon]" />
                    </span>
                  </el-tooltip>
                </li>
              </ul>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="Lucide 图标" name="lucide">
            <el-scrollbar height="300px">
              <ul class="icon-grid">
                <li v-for="icon in filteredLucideIcons" :key="icon" class="icon-grid-item" @click="selectIcon(icon)">
                  <el-tooltip :content="icon" placement="bottom" effect="light">
                    <el-icon :size="18">
                      <component :is="lucideIconMap[icon]" />
                    </el-icon>
                  </el-tooltip>
                </li>
              </ul>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import * as LucideIcons from '@lucide/vue'
import { CircleX, ChevronDown } from '@lucide/vue'
import type { Component } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '500px',
  },
})

const emit = defineEmits(['update:modelValue'])

const iconSelectRef = ref()
const popoverContentRef = ref()
const popoverVisible = ref(false)
const activeTab = ref('svg')

const svgIconMap = ref<Record<string, Component>>({})

// 收集 Lucide 图标
const lucideIconMap: Record<string, Component> = {}
Object.entries(LucideIcons).forEach(([name, comp]) => {
  if (
    (typeof comp === 'object' || typeof comp === 'function') &&
    name !== 'createLucideIcon' &&
    name !== 'Icon' &&
    name !== 'icons' &&
    name !== 'default'
  ) {
    lucideIconMap[name] = comp as Component
  }
})

const lucideIcons = ref<string[]>(Object.keys(lucideIconMap))
const selectedIcon = defineModel('modelValue', {
  type: String,
  required: true,
  default: '',
})

const filterText = ref('')
const filteredSvgIcons = ref<string[]>([])
const filteredLucideIcons = ref<string[]>(lucideIcons.value)

const isLucideIcon = computed(() => {
  if (!selectedIcon.value) return false
  const cleanName = selectedIcon.value.replace('el-icon-', '')
  return Boolean(lucideIconMap[cleanName] || lucideIconMap[selectedIcon.value])
})

const resolvedLucideIcon = computed(() => {
  if (!selectedIcon.value) return null
  const cleanName = selectedIcon.value.replace('el-icon-', '')
  return lucideIconMap[cleanName] || lucideIconMap[selectedIcon.value] || null
})

async function loadIcons() {
  const icons = import.meta.glob('../../assets/icons/*.svg', { as: 'component' })
  for (const path in icons) {
    const iconName = path.replace(/.*\/(.*)\.svg$/, '$1')
    svgIconMap.value[iconName] = (await icons[path]()) as Component
    filteredSvgIcons.value.push(iconName)
  }
}

function handleTabClick(tabPane: any) {
  activeTab.value = tabPane.props.name
  filterIcons()
}

function filterIcons() {
  if (activeTab.value === 'svg') {
    const allIcons = Object.keys(svgIconMap.value)
    filteredSvgIcons.value = filterText.value
      ? allIcons.filter((icon) => icon.toLowerCase().includes(filterText.value.toLowerCase()))
      : allIcons
  } else {
    filteredLucideIcons.value = filterText.value
      ? lucideIcons.value.filter((icon) => icon.toLowerCase().includes(filterText.value.toLowerCase()))
      : lucideIcons.value
  }
}

function selectIcon(icon: string) {
  emit('update:modelValue', icon)
  popoverVisible.value = false
}

function togglePopover() {
  popoverVisible.value = !popoverVisible.value
}

onClickOutside(iconSelectRef, () => (popoverVisible.value = false), {
  ignore: [popoverContentRef],
})

/**
 * 清空已选图标
 */
function clearSelectedIcon() {
  selectedIcon.value = ''
}

onMounted(() => {
  loadIcons()
  if (selectedIcon.value) {
    const cleanName = selectedIcon.value.replace('el-icon-', '')
    if (lucideIcons.value.includes(cleanName) || lucideIcons.value.includes(selectedIcon.value)) {
      activeTab.value = 'lucide'
    } else {
      activeTab.value = 'svg'
    }
  }
})
</script>

<style scoped lang="scss">
.reference :deep(.el-input__wrapper),
.reference :deep(.el-input__inner) {
  cursor: pointer;
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
}

.icon-grid-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin: 4px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: all 0.3s;
}

.icon-grid-item:hover {
  border-color: #4080ff;
  transform: scale(1.2);
}
</style>
