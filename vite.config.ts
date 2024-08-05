import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve('src/index.ts'),
      name: 'spatialjs',
      formats: ['es'],
      fileName: (format) => `spatialjs.${format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@react-three/fiber',
        'three',
        'zustand',
        '@react-three/uikit',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          '@react-three/fiber': 'ReactThreeFiber',
          three: 'THREE',
          zustand: 'create',
          '@react-three/uikit': 'ReactThreeUikit',
        },
      },
    },
  },
});
