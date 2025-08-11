# Contributing

## Branching model
- `main`: production-ready, protected.
- `staging`: integration branch before release.
- `dev`: default branch for ongoing development.
- `agents/experimental` (optional): sandbox for agents to experiment. PRs into `dev`.

## Workflow
1. Create a feature branch from `dev`.
2. Commit, push, and open PR to `dev`.
3. When stable, PR `dev` -> `staging`.
4. Release via PR `staging` -> `main`.

## CI
- CI builds, lints, and optionally runs D1 smoke test if repo secrets are set.

## Secrets
- Do not commit secrets. Use `.env.local` for local dev and GitHub Secrets for CI.
