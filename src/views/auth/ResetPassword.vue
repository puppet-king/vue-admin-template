<template>
  <div class="auth-view">
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
      <section class="auth-panel mx-auto">
        <div class="auth-panel__brand">
          <div class="auth-panel__logo-wrap">
            <el-image :src="logo" class="auth-panel__logo" />
          </div>
          <div class="auth-panel__meta">
            <span class="auth-panel__title">{{ appConfig.title }}</span>
            <el-text size="small" type="info">{{ t('login.resetPassword') }}</el-text>
          </div>
        </div>

        <div class="auth-panel__form">
          <h3 class="auth-panel-form__title text-center">{{ t('login.resetPassword') }}</h3>
          <el-form ref="formRef" :model="formModel" :rules="rules" size="large">
            <el-form-item prop="username">
              <el-input v-model.trim="formModel.username" :placeholder="t('login.username')">
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="email">
              <el-input v-model.trim="formModel.email" placeholder="注册邮箱地址">
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="warning" class="w-full" :loading="loading" @click="handleSubmit">
                {{ t('login.resetPassword') }}
              </el-button>
            </el-form-item>
          </el-form>

          <div class="flex items-center justify-center gap-2 mt-4 text-sm">
            <el-text>{{ t('login.thinkOfPasswd') }}</el-text>
            <router-link to="/auth/login" class="text-primary hover:underline">
              {{ t('login.login') }}
            </router-link>
          </div>
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
import ThemeSwitch from '@/components/ThemeSwitch/index.vue'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formModel = ref({
  username: '',
  email: '',
})

const rules = computed(() => ({
  username: [
    {
      required: true,
      trigger: 'blur',
      message: t('login.message.username.required'),
    },
  ],
  email: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入注册邮箱地址',
    },
  ],
}))

async function handleSubmit() {
  const valid = await formRef.value?.validate().then(
    () => true,
    () => false,
  )
  if (!valid) return

  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('重置密码申请已提交，请检查您的注册邮箱！')
  }, 800)
}
</script>

<style lang="scss" scoped>
.auth-view {
  --auth-page-bg: #f5f7ff;
  --auth-toolbar-bg: rgba(255, 255, 255, 0.85);
  --auth-toolbar-border: rgba(22, 93, 255, 0.15);
  --auth-toolbar-shadow: 0 10px 30px rgba(22, 93, 255, 0.12);
  --auth-panel-bg: rgba(255, 255, 255, 0.95);
  --auth-panel-border: rgba(22, 93, 255, 0.1);
  --auth-panel-shadow: 0 16px 48px rgba(22, 93, 255, 0.12);
  --auth-brand-border: rgba(22, 93, 255, 0.06);
  --auth-panel-title: var(--el-text-color-primary);
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
  --auth-toolbar-bg: rgba(24, 28, 43, 0.9);
  --auth-toolbar-border: rgba(64, 128, 255, 0.35);
  --auth-toolbar-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  --auth-panel-bg: rgba(26, 32, 48, 0.9);
  --auth-panel-border: rgba(86, 140, 255, 0.28);
  --auth-panel-shadow: 0 20px 60px rgba(0, 0, 0, 0.58);
  --auth-brand-border: rgba(64, 128, 255, 0.12);
  --auth-panel-title: rgba(245, 248, 255, 0.95);
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
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.auth-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: min(420px, 100%);
  min-height: 480px;
  padding: clamp(1.5rem, 3vw, 2rem);
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

  &__form {
    width: 100%;
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
  margin: 0 0 1.25rem;
  font-size: 1.125rem;
  font-weight: 600;
}
</style>
