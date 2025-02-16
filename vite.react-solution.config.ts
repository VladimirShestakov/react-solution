import noBundlePlugin from 'vite-plugin-no-bundle';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'vite';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig(params => {
  return {
    plugins: [
      noBundlePlugin({
        root: 'react-solution',
      }),
      viteStaticCopy({
        targets: [
          //{ src: 'react-solution/types/', dest: '' },
          { src: 'react-solution/package.json', dest: '' },
          { src: 'README.md', dest: '' },
          { src: 'LICENSE', dest: '' },
        ],
      }),
    ],
    build: {
      manifest: false,
      minify: false,
      ssr: true,
      outDir: 'dist/react-solution',
      emptyOutDir: true,

      lib: {
        entry: {
          index: path.resolve(__dirname, 'react-solution/index.ts'),
          server: path.resolve(__dirname, 'react-solution/server.ts'),
        },
        formats: ['es'],
      },
      rollupOptions: {
        treeshake: 'smallest',

        plugins: [
          // Пути в импортах в стандарт EcmaScript (относительным путям расширение js)
          typescriptPaths({
            preserveExtensions: true,
          }),
          // Сборка типов (d.ts файлов)
          typescript({
            sourceMap: false,
            declaration: true,
            outDir: 'dist/react-solution',
            rootDir: './react-solution',
          }),
        ],
      },
    },
  };
});
