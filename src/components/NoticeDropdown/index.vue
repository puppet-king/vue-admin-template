<template>
  <el-dropdown class="notice__dropdown" trigger="click">
    <div class="notice__trigger">
      <el-badge v-if="unreadTotal > 0" :value="unreadTotal" :max="99">
        <el-icon><Bell /></el-icon>
      </el-badge>

      <el-icon v-else><Bell /></el-icon>
    </div>

    <template #dropdown>
      <div class="p-5">
        <template v-if="list.length > 0">
          <div v-for="item in list" :key="item.id" class="w-125 py-3">
            <div class="flex items-center">
              <DictTag v-model="item.type" code="notice_type" size="small" />
              <el-text size="small" class="ml-2! w-50 flex-1! cursor-pointer" truncated @click="read(item.id)">
                {{ item.title }}
              </el-text>

              <div class="text-gray text-xs">
                {{ item.publishTime }}
              </div>
            </div>
          </div>
          <el-divider />
          <div class="flex justify-between">
            <el-link type="primary" underline="never" @click="goMore">
              <span class="text-xs">查看更多</span>
              <el-icon class="text-xs">
                <ArrowRight />
              </el-icon>
            </el-link>
            <el-link v-if="list.length > 0" type="primary" underline="never" @click="readAll">
              <span class="text-xs">全部已读</span>
            </el-link>
          </div>
        </template>
        <template v-else>
          <div class="flex h-[150px] w-[350px] items-center justify-center">
            <el-empty :image-size="50" description="暂无消息" />
          </div>
        </template>
      </div>
    </template>
  </el-dropdown>

  <el-dialog
    v-model="dialogVisible"
    :title="detail?.title ?? '通知详情'"
    width="800px"
    custom-class="notification-detail"
  >
    <div v-if="detail" class="px-5">
      <div class="mb-4 flex items-center text-sm text-secondary">
        <span class="flex items-center gap-1">
          <el-icon><User /></el-icon>
          {{ detail.publisherName }}
        </span>
        <span class="ml-4 flex items-center gap-1">
          <el-icon><Clock /></el-icon>
          {{ detail.publishTime }}
        </span>
      </div>

      <div class="mb-6 max-h-[60vh] overflow-y-auto border-t border-border-lighter pt-4 text-main">
        <div v-html="detail.content"></div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { Bell, ArrowRight, User, Clock } from '@lucide/vue'
import { useNotice } from './useNotice'

const { list, unreadTotal, detail, dialogVisible, read, readAll, goMore } = useNotice()
</script>

<style lang="scss" scoped>
.notice {
  &__dropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
