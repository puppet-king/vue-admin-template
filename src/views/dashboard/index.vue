<template>
  <div class="page-container flex h-full flex-1 flex-col space-y-5 p-5">
    <!-- 欢迎 Banner -->
    <el-card shadow="never" class="border-0 bg-gradient-to-r from-primary-light-9 to-fill-light">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <el-avatar :size="60" class="bg-primary text-2xl font-bold text-white shadow-md">
            {{ userNickname.charAt(0).toUpperCase() || 'A' }}
          </el-avatar>
          <div>
            <div class="flex items-center gap-3 text-2xl font-bold text-main">
              {{ greetings }}
              <el-tag type="primary" effect="light" class="font-medium">{{ userRoleLabel }}</el-tag>
            </div>
            <div class="mt-1.5 text-sm text-secondary">
              欢迎使用 {{ appConfig.title }}（Vue 3 + Vite + TypeScript + Element Plus）。
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 统计指标卡片 -->
    <el-row :gutter="16">
      <el-col v-for="stat in statistics" :key="stat.title" :xs="24" :sm="12" :lg="6" class="mb-4">
        <el-card shadow="never" class="border-border-lighter transition-all duration-200 hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-secondary">{{ stat.title }}</div>
              <div class="mt-2 text-2xl font-bold text-main">{{ stat.value }}</div>
              <div class="mt-1 text-xs" :class="stat.trendUp ? 'text-success' : 'text-danger'">
                <span>{{ stat.trendUp ? '↑' : '↓' }} {{ stat.trend }}</span>
                <span class="text-secondary ml-1">较上周</span>
              </div>
            </div>
            <div class="rounded-xl p-3 text-3xl" :class="stat.bgClass">
              {{ stat.icon }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 核心能力与架构指引 -->
    <el-row :gutter="16">
      <el-col :xs="24" :lg="16" class="mb-4">
        <el-card shadow="never" class="h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-base font-semibold text-main">
                <span>🛡️ 核心能力与脚手架特性</span>
              </div>
              <el-tag type="success" size="small" effect="plain">Production Ready</el-tag>
            </div>
          </template>

          <el-row :gutter="16">
            <el-col v-for="feature in systemFeatures" :key="feature.title" :xs="24" :sm="12" class="mb-4">
              <div
                class="h-full rounded-lg border border-border-lighter bg-fill-blank p-4 transition-colors hover:border-primary/40"
              >
                <div class="mb-2 flex items-center gap-2.5">
                  <span class="text-xl">{{ feature.icon }}</span>
                  <span class="text-sm font-semibold text-main">{{ feature.title }}</span>
                </div>
                <p class="mb-3 text-xs leading-relaxed text-secondary">
                  {{ feature.description }}
                </p>
                <div class="flex flex-wrap gap-1">
                  <el-tag
                    v-for="tag in feature.tags"
                    :key="tag"
                    size="small"
                    type="info"
                    effect="plain"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 开发者规范指南 -->
      <el-col :xs="24" :lg="8" class="mb-4">
        <el-card shadow="never" class="h-full">
          <template #header>
            <div class="flex items-center gap-2 text-base font-semibold text-main">
              <span>📖 开发者规范指南</span>
            </div>
          </template>

          <div class="space-y-4 text-xs leading-relaxed">
            <div class="rounded border border-primary-light-7 bg-primary-light-9 p-3">
              <div class="mb-1 font-semibold text-primary">🔄 双 Token 无感刷新机制</div>
              <div class="text-secondary">
                内置 Axios 拦截器与并发队列锁，当 AccessToken 过期时自动触发 RefreshToken 刷新并无感重试。
              </div>
            </div>

            <div class="rounded border border-warning-light-7 bg-warning-light-9 p-3">
              <div class="mb-1 font-semibold text-warning">⚠️ 生产构建校验</div>
              <div class="text-secondary">
                提交代码前建议执行
                <code class="rounded bg-fill-light px-1 py-0.5 font-mono font-bold text-warning">pnpm type-check</code>
                与
                <code class="rounded bg-fill-light px-1 py-0.5 font-mono font-bold text-warning">pnpm build</code>
                验证类型与打包。
              </div>
            </div>

            <div class="rounded border border-info-light-7 bg-info-light-9 p-3">
              <div class="mb-1 font-semibold text-info">🤖 AI Agent 规范集成</div>
              <div class="text-secondary">
                项目内置 <code class="rounded bg-fill-light px-1 py-0.5 font-mono text-info">.agents/rules</code> 与
                <code class="rounded bg-fill-light px-1 py-0.5 font-mono text-info">.agents/skills</code>，面向智能助手优化。
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Dashboard',
})

import { computed } from 'vue'
import { appConfig } from '@/settings'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const currentDate = new Date()

const userNickname = computed(() => userStore.userInfo.nickname || userStore.userInfo.username || '管理员')

const userRoleLabel = computed(() => {
  const role = userStore.userInfo.role || 'admin'
  return role.toUpperCase() === 'ADMIN' ? '超级管理员' : role
})

const greetings = computed(() => {
  const hours = currentDate.getHours()
  if (hours >= 6 && hours < 12) return `上午好，${userNickname.value}！`
  if (hours >= 12 && hours < 18) return `下午好，${userNickname.value}！`
  if (hours >= 18 && hours < 24) return `晚上好，${userNickname.value}！`
  return `夜深了，${userNickname.value}，请注意休息。`
})

const statistics = [
  {
    title: '总访问量',
    value: '128,430',
    trend: '12.5%',
    trendUp: true,
    icon: '📊',
    bgClass: 'bg-primary-light-9 text-primary',
  },
  {
    title: '活跃用户数',
    value: '8,920',
    trend: '8.2%',
    trendUp: true,
    icon: '👥',
    bgClass: 'bg-success-light-9 text-success',
  },
  {
    title: '系统接口调用',
    value: '1,420,800',
    trend: '3.1%',
    trendUp: true,
    icon: '⚡',
    bgClass: 'bg-warning-light-9 text-warning',
  },
  {
    title: '异常错误率',
    value: '0.02%',
    trend: '0.01%',
    trendUp: false,
    icon: '🛡️',
    bgClass: 'bg-info-light-9 text-info',
  },
]

const systemFeatures = [
  {
    title: '双 Token 无感刷新与权限认证',
    icon: '🔐',
    description: '自动维护 AccessToken / RefreshToken 声明周期，支持记住我与过期自动刷新，无缝对接 Go 模板。',
    tags: ['JWT', '无感刷新', '安全防爆破'],
  },
  {
    title: '响应式后台布局与多主题',
    icon: '🎨',
    description: '支持侧边栏折叠、面包屑导航、标签页历史（TagsView）、深色模式切换与全套主题配色。',
    tags: ['DefaultLayout', '深色模式', 'TagsView'],
  },
  {
    title: 'Element Plus 自动按需导入',
    icon: '⚡',
    description: '集成 unplugin-vue-components 与 unplugin-auto-import，无需手动 import 组件与 API。',
    tags: ['AutoImport', 'Element Plus', 'Vite 8'],
  },
  {
    title: 'TypeScript 全链路类型保障',
    icon: '✨',
    description: '完整的数据模型、请求响应 DTO 与 Pinia Store 状态类型定义，提供绝佳的 IDE 补全与编译检查。',
    tags: ['TypeScript', 'Pinia', 'Vue 3.5'],
  },
]
</script>

<style scoped>
.page-container {
  width: 100%;
}
</style>
