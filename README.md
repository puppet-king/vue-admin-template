# <%= appName %> (<%= projectName %>)

基于 **Vue 3 + Vite + TypeScript + Element Plus** 构建的现代化企业级中后台管理系统模版。

---

## ✨ 核心特性

- ⚡ **现代化技术栈**：基于 Vue 3.5+、Vite 8、TypeScript 5.9、Element Plus、Tailwind CSS 4
- 🔐 **认证与双 Token 刷新**：内置登录 (`/auth/login`)、重置密码 (`/auth/reset-password`) 与 Axios 无感 Token 刷新机制
- 🎨 **响应式后台骨架**：内置 `DefaultLayout`（侧边栏折叠、顶部导航、面包屑、TagsView 多标签历史与暗黑主题切换）
- 🤖 **AI Agent 规范**：开箱集成 `.agents/rules` 与 `.agents/skills`

---

## 🚀 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 启动本地开发服务
pnpm dev

# 3. 生产环境打包构建
pnpm build
```

---

## 📁 目录架构

```text
src/
├── api/             # 后端 API 接口定义 (如 auth 登录与双 Token 刷新)
├── assets/          # 静态资源 (图片、SVG 图标等)
├── components/      # 通用全局组件 (Breadcrumb, Hamburger, ThemeSwitch, LangSelect 等)
├── enums/           # 枚举常量定义
├── layouts/         # 后台布局系统 (DefaultLayout, Sidebar, Navbar, Breadcrumb, TagsView)
│   └── DefaultLayout.vue
├── router/          # 路由配置与权限守卫
├── stores/          # Pinia 状态管理 (user, app, settings, tags-view)
├── styles/          # 全局样式、SCSS 变量与 Tailwind 配置
├── utils/           # 核心工具库 (request 请求封装, auth 缓存等)
├── views/           # 页面视图
│   ├── auth/
│   │   ├── Login.vue          # 登录页
│   │   └── ResetPassword.vue  # 重置密码页
│   ├── dashboard/
│   │   └── index.vue          # 仪表盘主面板
│   └── error/
│       └── 404.vue            # 404 页面
├── App.vue
├── main.ts
└── settings.ts
```
