### 2.0.7

Security hardening — all issues found via an internal audit. No GHSA because the attack surface is build-time (an attacker who controls `lng` typically already controls the build pipeline), but the defences are worth shipping.

- security: validate `lng` at the top of the SSG entry point — reject values containing path separators (`/`, `\`), `..`, control characters, prototype keys (`__proto__`, `constructor`, `prototype`), or > 128 chars. Prevents path traversal via the `outputFile.replace('{{lng}}', lng)` step (a crafted `lng = '../../etc/passwd'` would otherwise write outside the output dir) and defends the downstream `lang` attribute and JS-source interpolation sites.
- security: interpolate `lng` into the generated HTML's JS source via `JSON.stringify(lng)` instead of naïve template strings. Prior to 2.0.7, `serialized.replace('locizify.init({', \`locizify.init({ lng: '${lng}', \`)` would inject arbitrary JavaScript if `lng` contained a single quote or `;` — e.g. `lng = "x'; evil(); //"` escapes the string literal and runs attacker code in the generated HTML. The `isSafeLng` check above already rejects this in practice; `JSON.stringify` is a second safety layer for any future code path that bypasses the check.
- chore: bump `locizify` 9.0.8 → **9.0.10** (security release — see its CHANGELOG for the chain of upstream fixes).
- chore: ignore `.env*` and `*.pem`/`*.key` files in `.gitignore`.
