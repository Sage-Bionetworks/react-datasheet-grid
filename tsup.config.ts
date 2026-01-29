import { defineConfig } from 'tsup';
import fs from 'fs';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  splitting: false,
  outDir: 'dist',
  // automatically copy CSS whenever the build succeeds
  async onSuccess() {
    if (fs.existsSync('src/style.css')) {
      fs.copyFileSync('src/style.css', 'dist/style.css');
      console.log('✅ style.css copied to dist/');
    }
  },
});
