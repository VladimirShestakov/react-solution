import noBundlePlugin from 'vite-plugin-no-bundle';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'vite';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(params => {
  return {
    plugins: [
      noBundlePlugin({
        root: 'packages',
      }),
      viteStaticCopy({
        targets: [
          //{ src: 'packages/types/', dest: '' },
          { src: 'packages/package.json', dest: '' },
          { src: 'README.md', dest: '' },
          { src: 'LICENSE', dest: '' },
        ],
      }),
    ],
    build: {
      manifest: false,
      minify: false,
      ssr: true,
      outDir: 'dist/packages',
      emptyOutDir: true,

      lib: {
        entry: {
          index: path.resolve(__dirname, 'packages/index.ts'),
          server: path.resolve(__dirname, 'packages/server.ts'),
        },
        formats: ['es', 'cjs'],
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
            outDir: 'dist/packages',
            rootDir: './packages',
          }),
        ],
      },
    },
  };
});
