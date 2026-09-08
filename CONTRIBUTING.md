# Working on this project

Use Node.js 24 and pnpm 11.19.0. Run `pnpm install --frozen-lockfile` after cloning.

Before opening a pull request:

```sh
pnpm format
pnpm check
pnpm test
pnpm audit --prod --audit-level high
```

Keep changes small enough to explain. When changing authentication or game rules, add a test of observable behavior, including a rejection case. Never commit real accounts, secrets, `.env` files, dependency directories, or database files. Preserve attribution for third-party libraries and assets in the early experiments.

For UI changes, check keyboard navigation and a narrow mobile viewport as well as desktop. Describe what changed and how it was verified in the pull request.
