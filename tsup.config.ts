import { defineConfig } from 'tsup';

export default defineConfig({
  bundle: false,
  clean: true,
  dts: true,
  entry: ['index.ts', 'bindings.js'],
  format: ['cjs'],
  outDir: 'dist',
});
