import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import viteMdx from './plugins/vite-mdx'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vueJsx()],
  plugins: [
    viteMdx(),
    vueJsx({
      // 默认只有jsx/tsx，需要告诉它要处理mdx的代码
      include: /\.(jsx|tsx|mdx)/
    })
  ],
  // plugins: [vue(), vueJsx()],
  // esbuild: {
  //   jsxInject: `import React from 'react'`
  // },

  resolve: {
    alias: {
      '@styles': '/src/styles'
    }
  },
  build: {
    rollupOptions: {
      plugins: []
    }
  }
})
