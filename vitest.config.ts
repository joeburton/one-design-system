import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react() as never],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}', 'components/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'storybook-static'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['components/**/*', 'hooks/**/*', 'utils/**/*'],
      exclude: ['**/*.stories.tsx', '**/*.module.css', '**/index.ts'],
      thresholds: {
        // Thresholds reflect current coverage (Button + Input + utils only).
        // Raise these as component test suites are added (issues #6, #7).
        statements: 20,
        branches: 70,
        functions: 35,
        lines: 20,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@components': resolve(__dirname, './components'),
      '@tokens': resolve(__dirname, './tokens'),
      '@styles': resolve(__dirname, './styles'),
      '@hooks': resolve(__dirname, './hooks'),
      '@utils': resolve(__dirname, './utils'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
