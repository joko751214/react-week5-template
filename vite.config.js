import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite'
import * as antd from 'antd';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const API_URL = env.VITE_API_BASE_URL;
  const antdComponents = Object.keys(antd).filter(key => key !== 'default');
  return {
    plugins: [
      react(),
      AutoImport({
        imports: [
          'react',
          {
            'antd': antdComponents
          }
        ],
        dts: false,
        eslintrc: { enabled: true },
      }),],
    base: '/react-week5-template/',
    server: {
      host: '0.0.0.0',
      port: 8080,
      open: true,
      proxy: {
        '/api': {
          target: API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^/api`), API_URL),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
