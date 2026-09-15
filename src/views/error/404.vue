<template>
  <div class="flex h-full w-full flex-col items-center justify-center p-8 text-center min-h-[60vh]">
    <div class="text-8xl font-extrabold text-primary opacity-80">404</div>
    <div class="mt-4 text-2xl font-bold text-main">页面不存在</div>
    <div class="mt-2 text-sm text-secondary">抱歉，您访问的页面不存在或已被移除。</div>
    <div class="mt-6">
      <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>
