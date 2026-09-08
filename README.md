# Tymur - portfolio & multiplayer chess

Computer Science student at the University of Liverpool (BSc Computer Science with a Year in Industry, 2026-2030), learning web development through small projects. Interested in UK software engineering internships for Summer 2027.

This repository brings together my portfolio, Chess by Tymur and earlier visual experiments. My original chess project used Node.js, PHP/MySQL, JWT and Pusher; the maintained version uses one Node.js server with SQLite and server-validated chess rules. See the [architecture notes](docs/ARCHITECTURE.md) for the differences between versions.

[Download my CV (PDF)](blog/Tymur-Marenych-CV.pdf)

## Explore

| Project             | What to try                                                                        | Local route                       |
| ------------------- | ---------------------------------------------------------------------------------- | --------------------------------- |
| Portfolio           | Selected projects, background and contact                                          | `/`                               |
| Chess by Tymur      | Register two users in separate browser profiles, create/join a game, play and chat | `/chess/`                         |
| Barnsley fern       | Generate a fractal with repeated affine transformations                            | `/projects/paporotnik/index.html` |
| Sierpinski triangle | Explore the chaos game                                                             | `/projects/serpinsk/index.html`   |

Earlier experiments remain available from the portfolio. They are learning projects and do not all have the same level of testing as the maintained chess application.

## Run locally

Requires **Node.js 24** and **pnpm 11.19.0**.

```sh
npm install --global pnpm@11.19.0
pnpm install --frozen-lockfile
pnpm start
```

Open **http://localhost:3000**. The server creates `data/chess.sqlite` on first start. No database service, provider account or secret key is needed. Use two browser profiles (or one private window) to test multiplayer. Usernames are 3-20 letters, numbers, underscores or hyphens; passwords are 12-128 characters.

Optional: copy `.env.example` to `.env` to configure the port, origin and database path. Restart after changes. Use `pnpm dev` for server reloads.

### Docker

```sh
docker compose up --build
```

This binds to localhost:3000 and stores the database in the `chess_data_v2` volume. For a public deployment, configure HTTPS, `APP_ORIGIN` to the exact public origin and `COOKIE_SECURE=true`. Read [deployment and migration notes](docs/MIGRATION.md) before replacing an older installation: legacy MySQL accounts and games are **not automatically migrated**.

## Engineering notes

- Passwords are salted and hashed with scrypt; session tokens are opaque, hashed in storage and revocable on logout.
- The server checks game membership, turns and moves. Game history survives process restarts.
- Chat uses authenticated names and text-only rendering.
- SQLite keeps setup small; this version supports one server process and uses polling for updates.
- This is a learning project: no chess clock, matchmaking, password reset or moderation service.

## Checks

```sh
pnpm format:check
pnpm check
pnpm test
pnpm audit --prod --audit-level high
```

Tests exercise authentication, authorization, legal moves, game completion, chat, rate limits and persistence against the HTTP API. CI also builds the Docker image. Format maintained files with `pnpm format`.

## Documentation

- [Architecture, tradeoffs and attribution](docs/ARCHITECTURE.md)
- [Migration and deployment](docs/MIGRATION.md)
- [Repository review and remaining work](docs/REVIEW.md)
- [Security](SECURITY.md)
- [Contributing](CONTRIBUTING.md)

Historical commits contained credentials. Removing them from the current tree does not revoke them; see the security notes.

[GitHub profile](https://github.com/MoonlightUser)
