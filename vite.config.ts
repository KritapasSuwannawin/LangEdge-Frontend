import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint2';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json',
      },
    }),
    eslint({ cache: false, emitWarningAsError: true }),
  ],
  server: {
    port: 3000,
  },
});
