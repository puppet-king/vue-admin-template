<template>
  <div class="svg-icon" :class="className" v-html="iconContent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  className?: string
}>()

const iconContent = computed(() => {
  const iconModules = import.meta.glob('/src/assets/icons/*.svg', { as: 'raw' })
  const iconPath = `/src/assets/icons/${props.name}.svg`
  return iconModules[iconPath] || ''
})
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
