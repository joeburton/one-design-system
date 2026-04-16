import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function bundleCss(): Plugin {
  return {
    name: 'bundle-base-css',
    apply: 'build',
    closeBundle() {
      const tokens = readFileSync(resolve(__dirname, 'styles/tokens.css'), 'utf-8');
      const global = readFileSync(resolve(__dirname, 'styles/global.css'), 'utf-8');
      const components = readFileSync(resolve(__dirname, 'dist/one-design-system.css'), 'utf-8');
      writeFileSync(
        resolve(__dirname, 'dist/one-design-system.css'),
        `${tokens}\n${global}\n${components}`
      );
    },
  };
}

export default defineConfig(async ({ command }) => {
  const isLibraryBuild = command === 'build';
  const { default: dts } = isLibraryBuild ? await import('vite-plugin-dts') : { default: null };

  return {
    plugins: [
      react(),
      ...(isLibraryBuild && dts
        ? [
            dts({
              include: ['components', 'hooks', 'utils'],
              exclude: ['**/*.stories.tsx', '**/*.test.tsx', '**/*.test.ts'],
              outDir: 'dist',
              insertTypesEntry: true,
            }),
            bundleCss(),
          ]
        : []),
    ],
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
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'components/index.ts'),
        name: 'OneDesignSystem',
        fileName: (format) => `one-ds.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'ReactJsxRuntime',
          },
        },
      },
    },
  };
});
