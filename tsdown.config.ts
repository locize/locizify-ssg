import { defineConfig } from 'tsdown'

const srcEntry = { index: 'src/index.js' }

export default defineConfig([
  // ── ESM build (consumed via `import` / `./esm` subpath) ──
  // Dependencies stay external — Node consumers install jsdom + locizify
  // themselves.
  {
    entry: srcEntry,
    format: ['esm'],
    outDir: 'dist/esm',
    outExtensions: () => ({ js: '.js' }),
    dts: false,
    sourcemap: false,
    clean: true,
  },
  // ── CJS build (consumed via `require` / `./cjs` subpath, plus by the
  //    `bin/locizify-ssg.js` shim which uses `require('../')`) ──
  {
    entry: srcEntry,
    format: ['cjs'],
    outDir: 'dist/cjs',
    outExtensions: () => ({ js: '.js' }),
    dts: false,
    sourcemap: false,
    clean: true,
  },
])
