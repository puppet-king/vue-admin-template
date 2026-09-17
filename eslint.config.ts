import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintPluginTailwindcss from 'eslint-plugin-tailwindcss'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import * as fs from 'node:fs'

const autoImportGlobals = JSON.parse(fs.readFileSync(new URL('./.eslintrc-auto-import.json', import.meta.url), 'utf8'))

export default tseslint.config(
  // 全局忽略
  {
    ignores: [
      'node_modules',
      'dist',
      'unpackage',
      'src/utils/*.js', // 忽略 utils 下的所有 js（只校验 ts）
      '*.min.js',
      '**/*.min.js',
      'bin',
      'build',
      'src/types/auto-imports.d.ts', // 建议忽略自动生成的类型文件
      'src/types/components.d.ts',
    ],
  },

  // 基础配置预设
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  eslintPluginTailwindcss.configs.recommended,
  prettierRecommended,

  // 项目自定义主配置
  {
    // 语言选项与全局变量
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
        ...autoImportGlobals.globals,
      },
      // 针对 Vue 文件使用正确的解析器
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },

    // 插件全局设置
    settings: {
      tailwindcss: {
        cssConfigPath: './src/styles/tailwind.css',
      },
    },

    // 自定义规则
    rules: {
      // 基础规则
      semi: ['error', 'never'],
      'no-unused-vars': 'off', // 关闭原生，使用 TS 版
      'no-undef': 'off', // TypeScript 本身已具备类型与未定义变量检查

      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',

      // Prettier 规则
      'prettier/prettier': [
        'error',
        {
          semi: false,
          printWidth: 120,
          singleQuote: true,
          trailingComma: 'all',
        },
      ],

      // Vue 规则扩展
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-v-html': 'off',

      // Tailwind CSS 规则
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-arbitrary-value': 'off',
      'tailwindcss/important-modifier-suffix': 'warn', // 校验 Tailwind v4 尾缀 !
      'tailwindcss/no-contradicting-classname': 'warn',
      'tailwindcss/enforces-shorthand': 'off',
      'tailwindcss/no-custom-classname': 'off', // 允许自定义主题 Token 类名 (bg-bg, text-main 等) 及组件库样式
    },
  },
)
