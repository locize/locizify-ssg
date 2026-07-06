### 3.0.1

- update locizify dep

### 3.0.0

- BREAKING: bumped `locizify` to v10. v10 dropped the `cross-fetch` dependency (via the upstream `i18next-locize-backend@10` and `i18nextify@5` bumps) and now requires native `fetch` (Node ≥ 18, modern browsers, Deno, Bun — all of which ship it). For runtimes without native `fetch`, install a ponyfill yourself, or stay on v2.x.
- BREAKING: dropped the direct `cross-fetch` dependency from `locizify-ssg` itself. Previously `src/index.js` imported `cross-fetch` and assigned it to `global.fetch` to polyfill Node < 18; now relies on Node's native `globalThis.fetch`.
- BREAKING: minimum Node version is now 18 (`engines.node = ">=18"`).
- chore: declared `"sideEffects": false` for better tree-shaking.
- build: replaced rollup 2 + babel + (commented-out) terser with [`tsdown`](https://tsdown.dev) (rolldown + oxc). One config produces ESM and CJS outputs into `dist/{esm,cjs}/`. Drops `@babel/core`, `@babel/plugin-transform-runtime`, `@babel/preset-env`, `babel-plugin-add-module-exports`, `rollup`, `rollup-plugin-babel`, `rollup-plugin-commonjs`, `rollup-plugin-node-resolve`, `rollup-plugin-terser` — 9 dev packages gone. CJS output preserves the function-as-module-exports shape that the `bin/locizify-ssg.js` shim depends on (via `require('../')`).
- chore: tightened `.npmignore` (the file used to list itself as ignored, which is harmless but odd; cleaned up + added the new `tsdown.config.ts` and `eslint.config.js`).
- chore: added `.github/workflows/node.yml` — first CI workflow for this repo. Runs lint + build on Node 20 / 22 / 24.

### 2.0.7

Security hardening — all issues found via an internal audit. No GHSA because the attack surface is build-time (an attacker who controls `lng` typically already controls the build pipeline), but the defences are worth shipping.

- security: validate `lng` at the top of the SSG entry point — reject values containing path separators (`/`, `\`), `..`, control characters, prototype keys (`__proto__`, `constructor`, `prototype`), or > 128 chars. Prevents path traversal via the `outputFile.replace('{{lng}}', lng)` step (a crafted `lng = '../../etc/passwd'` would otherwise write outside the output dir) and defends the downstream `lang` attribute and JS-source interpolation sites.
- security: interpolate `lng` into the generated HTML's JS source via `JSON.stringify(lng)` instead of naïve template strings. Prior to 2.0.7, `serialized.replace('locizify.init({', \`locizify.init({ lng: '${lng}', \`)` would inject arbitrary JavaScript if `lng` contained a single quote or `;` — e.g. `lng = "x'; evil(); //"` escapes the string literal and runs attacker code in the generated HTML. The `isSafeLng` check above already rejects this in practice; `JSON.stringify` is a second safety layer for any future code path that bypasses the check.
- chore: bump `locizify` 9.0.8 → **9.0.10** (security release — see its CHANGELOG for the chain of upstream fixes).
- chore: ignore `.env*` and `*.pem`/`*.key` files in `.gitignore`.
