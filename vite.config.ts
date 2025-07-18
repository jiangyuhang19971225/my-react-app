import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteMockServe } from 'vite-plugin-mock';
// import legacy from '@vitejs/plugin-legacy'; // 新增导入

export default defineConfig({
  plugins: [
    react(),
    viteMockServe({
      mockPath: 'src/mock',
      enable: true,
    }),
    // legacy({
    //   // 新增插件配置
    //   targets: ['defaults', 'not IE 11'], // 支持现代浏览器和 IE 11 之外的浏览器
    //   modernPolyfills: true, // 启用现代 polyfills
    // }),
  ],
  base: './', // 保持相对路径但需要确保文件层级正确
  server: {
    host: '0.0.0.0',
    port: 9999,
    // proxy: {
    //   '/api': {
    //     // target: 'http://182.92.86.145:3000/',
    //     target: 'http://127.0.0.1:3001',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
  // 新增配置，确保子应用能正确被主应用加载
  build: {
    lib: {
      entry: './src/main.jsx',
      name: 'ReactSubApp',
      fileName: 'react-sub-app',
      formats: ['umd'],
    },
    rollupOptions: {
      output: {
        // 确保打包后的代码不会被重复加载
        manualChunks: undefined,
        // 确保打包后的文件使用自执行函数
        format: 'system',
      },
    },
    // 关闭代码分割
    modulePreload: {
      polyfill: false,
    },
    // 确保打包后的文件可以跨域访问
    assetsInlineLimit: 0,
  },
});
