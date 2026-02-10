# Project conventions

## Branch naming

Branches follow the pattern `jancizmar/<short-description>` (e.g., `jancizmar/window-tolgee-api`).

## Before committing

Always run these checks before creating a commit:

1. **Prettier** — format changed files: `npx prettier --write <files>`
2. **Unit tests** — run tests for the affected package, e.g.: `cd packages/web && npx jest --no-coverage`

## Commits and PRs

- Use [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `chore:`, `refactor:`).
- Do NOT add `Co-Authored-By` or any AI author attribution to commits.
- PR descriptions must start with the user pain / problem being solved, then explain the solution.
