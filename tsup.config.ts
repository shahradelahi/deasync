import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['index.ts'],
  external: [/\.node$/],
  format: ['cjs'],
  outDir: 'dist',
});
