import { LayoutMode, ComponentSize, SidebarColor, ThemeMode, LanguageEnum } from '@/enums'

const env = import.meta.env
const prefersDark = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false

export const appConfig = {
  name: 'admin-template',
  version: '1.0.0',
  title: (env.VITE_APP_TITLE as string) || '管理控制台',
} as const

export const defaults = {
  theme: prefersDark ? ThemeMode.DARK : ThemeMode.LIGHT,
  themeColor: '#1677FF',
  sidebarColorScheme: SidebarColor.CLASSIC_BLUE,
  layout: LayoutMode.LEFT,
  size: ComponentSize.DEFAULT,
  language: LanguageEnum.ZH_CN,
  showTagsView: true,
  showAppLogo: true,
  showWatermark: false,
  pageSwitchingAnimation: 'fade-slide',
  showSettings: true,
  watermarkContent: 'Admin Template',
} as const

export const themeColorPresets = [
  '#1677FF',
  '#2563EB',
  '#4F46E5',
  '#0D9488',
  '#1890FF',
  '#409EFF',
  '#FA8C16',
  '#722ED1',
  '#52C41A',
  '#F5222D',
] as const
