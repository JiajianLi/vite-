import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import testPlugin from './plugins/test-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), testPlugin()],
  resolve: {
    alias: {
      '@diy': ''
    }
  },
  build: {
    manifest: true
  }
})
