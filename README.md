# Dramas.FM

A comprehensive radio drama streaming platform featuring curated channels, advanced search, and user-generated playlists.

## Cloudflare D1 integration

Server-side API routes now query a Cloudflare D1 database containing Archive.org metadata.

Setup:
- Copy .env.local.example to .env.local
- Fill CF_ACCOUNT_ID and CF_API_TOKEN
- Optionally set CF_D1_DB_ID (otherwise CF_D1_DB_NAME is used to resolve the id)
- Run the dev server: npm install && npm run dev

Search API:
- GET /api/search?q=burns&page=1&limit=20
- Returns { success, data: { shows[], totalCount, facets } }

Security:
- Do not expose CF_API_TOKEN in client-side code. Only server API routes use it.
- Remove hard-coded tokens in src/lib/database.ts for production.
