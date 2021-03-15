import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: 'SpaceYard'
    },
    rollupOptions: {
      external: ['react', 'react-dom']
    }
  },
  server: {
    port: 3004
  }
})
