# Branching and Release

- `main`: release branch, protected.
- `staging`: pre-release integration branch, protected.
- `dev`: development branch, default writable.
- `agents/experimental`: sandbox for agents; merge into `dev` only.

Protect `main` and `staging` in GitHub settings:
- Require PR reviews
- Require status checks (CI) to pass
- Restrict force pushes
