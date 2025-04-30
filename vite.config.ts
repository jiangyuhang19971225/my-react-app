import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import legacy from '@vitejs/plugin-legacy'; // 新增导入

export default defineConfig({
  plugins: [
    react(),
    // legacy({
    //   // 新增插件配置
    //   targets: ['defaults', 'not IE 11'], // 支持现代浏览器和 IE 11 之外的浏览器
    //   modernPolyfills: true, // 启用现代 polyfills
    // }),
  ],
  base: './', // 保持相对路径但需要确保文件层级正确
  server: {
    host: '0.0.0.0',
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://182.92.86.145:3000/',
        // target: 'http://127.0.0.1:3000/api',

        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
