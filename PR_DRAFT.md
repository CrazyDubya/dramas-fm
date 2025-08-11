# PR: Consolidate Dramas.FM foundation, Cloudflare D1 integration, and security hardening

Summary
- Make `main` authoritative; reconcile remote divergence and merge history
- Add Cloudflare D1 search integration (server-side), show details API and page
- Remove hard-coded tokens from client; use server env only
- Optional KV caching and basic rate limiting for API routes
- Add CI (build, lint, typecheck, optional D1 smoke test)
- Add SECURITY.md and security headers

Changes
- src/lib/cloudflare.ts: typed D1 access and search utility
- src/app/api/search/route.ts: server-side search mapped to UI
- src/app/api/shows/[id]/route.ts and /shows/[id]/page.tsx: show details and audio files
- src/lib/kv.ts (optional caching), src/lib/rateLimit.ts (basic limiter)
- .github/workflows/ci.yml: Next build/lint and optional D1 smoke test
- SECURITY.md: policy summary
- next.config.ts: add X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- .env.local.example tracked; .gitignore adjusted

Security
- No secrets in client or repo; env only on server-side
- Optional KV caching requires CF_KV_NAMESPACE_ID

Testing
- npm ci && npm run dev
- Set .env.local with CF_API_TOKEN, CF_ACCOUNT_ID, [CF_D1_DB_ID or CF_D1_DB_NAME]
- Search: /search?q=burns
- Show: /shows/<id>

Follow-ups
- Provide CF_KV_NAMESPACE_ID or allow creation to enable caching
- Replace homepage featured with live D1 data and expand search facets
- Branch protections and required CI on `main`
