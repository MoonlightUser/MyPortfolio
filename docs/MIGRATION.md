# Moving from the original deployment

This is a breaking deployment change. Do not overwrite a running installation without a backup.

1. Back up the original MySQL database and deployment configuration. Preserve the old checkout and the existing `db_data` volume.
2. Revoke the previously published Pusher secret in the provider console. The new application does not use Pusher. Also change any reused passwords and signing keys. Removing source files does not erase old Git commits.
3. Review this version locally. Install Node.js 24 and pnpm 11.19.0, then run `pnpm install --frozen-lockfile`, `pnpm test`, and `pnpm start`.
4. The new application creates an empty SQLite database. Original accounts, sessions and rooms are **not migrated**; create fresh demo accounts. Previously stored plaintext passwords must not be imported into the new password-hash field.
5. For Docker, build this version with `docker compose up --build -d`. It uses the new `chess_data_v2` volume, not the old MySQL volume. Do not use `docker compose down --volumes` if you want to preserve the new games/accounts.
6. For public access, configure HTTPS at your reverse proxy, set the exact `APP_ORIGIN` and `COOKIE_SECURE=true`, and expose only that proxy. The sample Nginx file is a local HTTP proxy example, not a complete TLS configuration.
7. Verify sign-up, login, two separate players, reconnect, chat and logout on the public origin. Old chess HTML URLs redirect to `/chess/`; old API endpoints are retired.

For a consistent backup while running, use SQLite's backup facilities; copying only the database file while WAL writes are active is not sufficient. Alternatively, stop the application cleanly before copying the database directory. Store backups privately.

No live server or provider credentials were changed by preparing this repository update. Deploying this version and revoking provider credentials are separate actions.
