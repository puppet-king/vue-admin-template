<template>
  <div class="auth-view">
    <!-- 右上角工具栏：语言切换、明暗主题切换 -->
    <div class="auth-view__toolbar">
      <el-tooltip :content="t('login.themeToggle')" placement="bottom">
        <div class="toolbar-item">
          <ThemeSwitch />
        </div>
      </el-tooltip>
      <el-tooltip :content="t('login.languageToggle')" placement="bottom">
        <div class="toolbar-item">
          <LangSelect size="text-20px" />
        </div>
      </el-tooltip>
    </div>

    <div class="auth-view__wrapper">
      <!-- 左侧平台特色介绍 -->
      <section class="auth-feature">
        <div class="auth-feature__badge">
          <span class="auth-feature__dot" />
          Enterprise Admin Platform
        </div>
        <h1 class="auth-feature__title">{{ appConfig.title }}</h1>
        <p class="auth-feature__subtitle">
          基于 Vue 3 + TypeScript + Element Plus 构建的企业级微服务管理后台，开箱即用、规范严谨。
        </p>
      </section>

      <!-- 右侧登录面板 -->
      <section class="auth-panel">
        <div class="auth-panel__brand">
          <div class="auth-panel__logo-wrap">
            <el-image :src="logo" class="auth-panel__logo" />
          </div>
          <div class="auth-panel__meta">
            <div class="auth-panel__title-row">
              <span class="auth-panel__title">{{ appConfig.title }}</span>
            </div>
            <div class="auth-panel__version-row">
              <el-text size="small" type="info">VERSION</el-text>
              <el-tag size="small" effect="light" round>
                {{ `v${appConfig.version || '1.0.0'}` }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="auth-panel__form">
          <h3 class="auth-panel-form__title text-center">{{ t('login.login') }}</h3>
          <el-form
            ref="loginFormRef"
            :model="loginFormData"
            :rules="loginRules"
            size="large"
            :validate-on-rule-change="false"
          >
            <!-- 用户名 -->
            <el-form-item prop="username">
              <el-input v-model.trim="loginFormData.username" :placeholder="t('login.username')">
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <!-- 密码 -->
            <el-tooltip :visible="isCapsLock" :content="t('login.capsLock')" placement="right">
              <el-form-item prop="password">
                <el-input
                  v-model.trim="loginFormData.password"
                  :placeholder="t('login.password')"
                  type="password"
                  show-password
                  @keyup="checkCapsLock"
                  @keyup.enter="handleLoginSubmit"
                >
                  <template #prefix>
                    <el-icon><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-tooltip>

            <div class="flex w-full justify-between items-center mb-4">
              <el-checkbox v-model="loginFormData.rememberMe">{{ t('login.rememberMe') }}</el-checkbox>
              <router-link to="/auth/reset-password" class="text-sm text-primary hover:underline">
                {{ t('login.forgetPassword') }}
              </router-link>
            </div>

            <!-- 登录按钮 -->
            <el-form-item>
              <el-button :loading="loading" type="primary" class="w-full" @click="handleLoginSubmit">
                {{ t('login.login') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <footer class="auth-panel__footer">
          <el-text size="small">
            Copyright © 2024 - 2026 {{ appConfig.title }}. All Rights Reserved.
          </el-text>
        </footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import logo from '@/assets/images/logo.png'
import { appConfig } from '@/settings'
import { useUserStore } from '@/stores'
import ThemeSwitch from '@/components/ThemeSwitch/index.vue'

const { t } = useI18n()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const isCapsLock = ref(false)

const loginFormData = ref({
  username: 'admin',
  password: 'admin',
  rememberMe: true,
})

const loginRules = computed(() => ({
  username: [
    {
      required: true,
      trigger: 'blur',
      message: t('login.message.username.required'),
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      message: t('login.message.password.required'),
    },
    {
      min: 4,
      message: t('login.message.password.min'),
      trigger: 'blur',
    },
  ],
}))

async function handleLoginSubmit() {
  const valid = await loginFormRef.value?.validate().then(
    () => true,
    () => false,
  )
  if (!valid) return

  loading.value = true
  try {
    await userStore.login(loginFormData.value)
    ElMessage.success(t('login.message.loginSuccess') || '登录成功')
    const redirectPath = (route.query.redirect as string) || '/'
    await router.push(decodeURIComponent(redirectPath))
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

function checkCapsLock(event: KeyboardEvent) {
  if (event instanceof KeyboardEvent) {
    isCapsLock.value = event.getModifierState('CapsLock')
  }
}
</script>

<style lang="scss" scoped>
.auth-view {
  --auth-page-bg: #f5f7ff;
  --auth-overlay: linear-gradient(120deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
  --auth-toolbar-bg: rgba(255, 255, 255, 0.85);
  --auth-toolbar-border: rgba(22, 93, 255, 0.15);
  --auth-toolbar-shadow: 0 10px 30px rgba(22, 93, 255, 0.12);
  --auth-feature-text: var(--el-text-color-primary);
  --auth-badge-text: rgba(22, 93, 255, 0.95);
  --auth-badge-bg: rgba(22, 93, 255, 0.1);
  --auth-dot-bg: #165dff;
  --auth-subtitle-text: var(--el-text-color-regular);
  --auth-highlight-text: var(--el-text-color-primary);
  --auth-highlight-bg: rgba(255, 255, 255, 0.9);
  --auth-highlight-border: rgba(64, 128, 255, 0.08);
  --auth-highlight-accent: rgba(22, 93, 255, 0.8);
  --auth-panel-bg: rgba(255, 255, 255, 0.95);
  --auth-panel-border: rgba(22, 93, 255, 0.1);
  --auth-panel-shadow: 0 16px 48px rgba(22, 93, 255, 0.12), 0 4px 16px rgba(22, 93, 255, 0.08);
  --auth-brand-border: rgba(22, 93, 255, 0.06);
  --auth-panel-title: var(--el-text-color-primary);
  --auth-version-label: var(--el-text-color-secondary);
  --auth-version-tag-bg: rgba(22, 93, 255, 0.1);
  --auth-version-tag-border: rgba(22, 93, 255, 0.12);
  --auth-version-tag-text: rgba(22, 93, 255, 0.9);
  --auth-logo-bg: radial-gradient(circle at 30% 20%, #ffffff, #e6efff);
  --auth-logo-shadow: 0 8px 20px rgba(22, 93, 255, 0.16);
  --auth-footer-border: rgba(22, 93, 255, 0.06);

  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: clamp(1rem, 3vw, 2rem);
  background-color: var(--auth-page-bg);
}

.dark .auth-view {
  --auth-page-bg: #08101f;
  --auth-overlay: linear-gradient(120deg, rgba(7, 12, 24, 0.4), rgba(7, 12, 24, 0));
  --auth-toolbar-bg: rgba(24, 28, 43, 0.9);
  --auth-toolbar-border: rgba(64, 128, 255, 0.35);
  --auth-toolbar-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  --auth-feature-text: rgba(240, 245, 255, 0.92);
  --auth-badge-text: rgba(160, 190, 255, 0.95);
  --auth-badge-bg: rgba(64, 128, 255, 0.12);
  --auth-dot-bg: #7aa2ff;
  --auth-subtitle-text: rgba(220, 230, 255, 0.75);
  --auth-highlight-text: rgba(230, 236, 255, 0.85);
  --auth-highlight-bg: rgba(18, 22, 36, 0.7);
  --auth-highlight-border: rgba(98, 149, 255, 0.18);
  --auth-highlight-accent: rgba(122, 162, 255, 0.9);
  --auth-panel-bg: rgba(26, 32, 48, 0.9);
  --auth-panel-border: rgba(86, 140, 255, 0.28);
  --auth-panel-shadow: 0 20px 60px rgba(0, 0, 0, 0.58), 0 4px 16px rgba(0, 0, 0, 0.36);
  --auth-brand-border: rgba(64, 128, 255, 0.12);
  --auth-panel-title: rgba(245, 248, 255, 0.95);
  --auth-version-label: rgba(186, 202, 236, 0.78);
  --auth-version-tag-bg: rgba(86, 140, 255, 0.16);
  --auth-version-tag-border: rgba(104, 156, 255, 0.2);
  --auth-version-tag-text: rgba(214, 226, 255, 0.96);
  --auth-logo-bg: radial-gradient(circle at 30% 20%, #1f2438, #141827);
  --auth-logo-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
  --auth-footer-border: rgba(64, 128, 255, 0.12);
}

.auth-view__toolbar {
  display: inline-flex;
  gap: 0.75rem;
  align-self: flex-end;
  padding: 0.5rem 0.75rem;
  background-color: var(--auth-toolbar-bg);
  border: 1px solid var(--auth-toolbar-border);
  border-radius: 999px;
  box-shadow: var(--auth-toolbar-shadow);

  .toolbar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 8px;
  }
}

.auth-view__wrapper {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1.5rem, 3vw, 3rem);
  align-items: stretch;
  padding: clamp(1.5rem, 2vw, 2.5rem);
}

.auth-feature {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(1.5rem, 3vw, 3rem);
  color: var(--auth-feature-text);

  &__badge {
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    width: fit-content;
    padding: 0.3rem 0.9rem;
    font-size: 0.875rem;
    color: var(--auth-badge-text);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: var(--auth-badge-bg);
    border-radius: 999px;
  }

  &__dot {
    width: 0.5rem;
    height: 0.5rem;
    background: var(--auth-dot-bg);
    border-radius: 50%;
  }

  &__title {
    margin: 1.5rem 0 0.5rem;
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 600;
    line-height: 1.2;
  }

  &__subtitle {
    margin-bottom: 1.5rem;
    font-size: 1rem;
    line-height: 1.7;
    color: var(--auth-subtitle-text);
  }
}

@media (max-width: 768px) {
  .auth-view__wrapper {
    display: block;
    padding: 1.25rem 0.75rem;
  }
  .auth-feature {
    display: none;
  }
}

.auth-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-self: center;
  justify-self: end;
  width: min(420px, 100%);
  min-height: 520px;
  padding: clamp(1.5rem, 3vw, 2rem);
  margin-inline: auto;
  background: var(--auth-panel-bg);
  border: 1px solid var(--auth-panel-border);
  border-radius: 24px;
  box-shadow: var(--auth-panel-shadow);

  &__brand {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding-bottom: 0.875rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--auth-brand-border);
  }

  &__logo-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    background: var(--auth-logo-bg);
    border-radius: 18px;
    box-shadow: var(--auth-logo-shadow);
  }

  &__logo {
    width: 32px;
    height: 32px;
  }

  &__meta {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.35rem;
  }

  &__title {
    font-size: 1.2rem;
    font-weight: 650;
    color: var(--auth-panel-title);
  }

  &__version-row {
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.78rem;
  }

  &__form {
    width: 100%;
    min-height: 320px;
  }

  &__footer {
    padding-top: 0.875rem;
    margin-top: auto;
    font-size: 0.875rem;
    text-align: center;
    border-top: 1px solid var(--auth-footer-border);
  }
}

.auth-panel-form__title {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 600;
}
</style>
