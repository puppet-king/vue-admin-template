import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { type ConfigEnv, type UserConfig, loadEnv, defineConfig, PluginOption } from 'vite'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { resolve } from 'path'

const pathSrc = resolve(import.meta.dirname, 'src')

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  return {
    resolve: {
      alias: {
        '@': pathSrc,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/base/variables.scss" as *;`,
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: +(env.VITE_APP_PORT || 9527),
      open: true,
      proxy: {
        '/backend': {
          changeOrigin: true,
          target: env.VITE_APP_API_URL || 'http://localhost:8000',
        },
      },
    },
    plugins: [
      tailwindcss(),
      vue(),
      AutoImport({
        imports: [
          'vue',
          '@vueuse/core',
          'pinia',
          'vue-router',
          'vue-i18n',
          {
            '@/router': [['default', 'router']],
          },
        ],
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
        vueTemplate: true,
        dts: false,
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
        dirs: ['src/components', 'src/**/components'],
        dts: false,
      }),
    ] as PluginOption[],
  }
})
