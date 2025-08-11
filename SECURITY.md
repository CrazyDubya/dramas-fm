# Security Policy

- Secrets are never committed to the repo. Use .env.local and GitHub Secrets for CI.
- Server-side routes are the only place that access Cloudflare (D1/KV/R2) using tokens.
- Client code must not include Authorization headers or tokens.
- Basic rate limiting is applied on API routes (best-effort in-memory).
- Security headers set via next.config.ts (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).

## Reporting a Vulnerability
Please open a private report or contact the maintainers. Do not disclose publicly until a fix is available.
