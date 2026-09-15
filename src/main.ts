import { createApp } from 'vue'
import App from './App.vue'

// ===== 样式导入 =====
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/tailwind.css'
import '@/styles/index.scss'
import 'animate.css'

// ===== 核心配置 =====
import { setupDirective } from '@/directives'
import { setupI18n } from '@/lang'
import { setupRouter } from '@/router'
import { setupStore } from '@/stores'

// ===== 全局 Lucide 图标 =====
import * as LucideIcons from '@lucide/vue'

// ===== 路由守卫 =====
import { setupPermissionGuard } from '@/router/guards/permission'

const app = createApp(App)

// 1. 核心插件
setupDirective(app)
setupRouter(app)
setupStore(app)
setupI18n(app)

// 2. 注册 Lucide 图标
Object.entries(LucideIcons).forEach(([name, comp]) => {
  if (typeof comp === 'object' || typeof comp === 'function') {
    app.component(name, comp as any)
  }
})

// 3. 常见图标别名映射
const legacyIconAliases: Record<string, any> = {
  Close: LucideIcons.X,
  Right: LucideIcons.ArrowRight,
  Setting: LucideIcons.Settings,
  Edit: LucideIcons.Pencil,
  Delete: LucideIcons.Trash2,
  Refresh: LucideIcons.RotateCw,
  RefreshLeft: LucideIcons.RotateCcw,
  DocumentCopy: LucideIcons.Copy,
  Timer: LucideIcons.Clock,
  Top: LucideIcons.ArrowUp,
  Operation: LucideIcons.SlidersHorizontal,
  QuestionFilled: LucideIcons.HelpCircle,
  FullScreen: LucideIcons.Maximize,
  Sunny: LucideIcons.Sun,
  User: LucideIcons.User,
  Lock: LucideIcons.Lock,
  Message: LucideIcons.Mail,
}
Object.entries(legacyIconAliases).forEach(([name, comp]) => {
  if (comp && !app.component(name)) {
    app.component(name, comp)
  }
})

// 4. 路由守卫
setupPermissionGuard()

// 5. 挂载应用
app.mount('#app')
