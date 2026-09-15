<template>
  <div class="fullscreen-trigger" @click="toggle">
    <el-icon>
      <component :is="isFullscreen ? Minimize : Maximize" />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { Maximize, Minimize } from '@lucide/vue'

const { isFullscreen, toggle } = useFullscreen()
</script>

<style lang="scss" scoped>
.fullscreen-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
