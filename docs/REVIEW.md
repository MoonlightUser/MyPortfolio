# Repository review - September 2026

## Scope

Reviewed the tracked structure, main portfolio, legacy authentication/database endpoints, game mutations, realtime events, dependency packaging, deployment files and selected highlighted experiments. This is a source review plus automated validation, not a penetration test or a complete audit of every historical experiment/third-party asset.

## Findings addressed

| Finding                                                         | Change                                                                    |
| --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Plaintext passwords and password logging                        | New scrypt-based credential storage; no credentials in logs               |
| JWT issued without credential verification; password in payload | Verified sign-in and server-side revocable opaque sessions                |
| User records exposed through unprotected API                    | Old endpoints retired; no user-list API                                   |
| Game writes and events trusted client identity                  | Session-based membership, seat and turn checks                            |
| Client-only moves and incomplete persistence                    | Server chess.js validation and stored move history                        |
| Chat inserted with `innerHTML`                                  | Text-only rendering                                                       |
| Service secrets and sample personal accounts in tracked source  | Retired stack removed from current tree; new DB contains no seed accounts |
| Thousands of tracked dependency files                           | Removed from current tree; lockfile and ignore rules added                |
| Hard-coded localhost/old hosting URLs                           | Same-origin API and explicit origin configuration                         |
| Outdated apprenticeship positioning                             | BSc 2026-2030 and Summer 2027 messaging                                   |
| Fractal input could create excessive DOM nodes or loop forever  | Whole-number range checks, bounded loop, clearing previous points         |
| No maintained automated checks                                  | Node tests, formatting/link checks, dependency audit and CI               |

## Owner follow-up

- Revoke old provider credentials and any reused passwords. Git history was not rewritten.
- The September 2026 internship CV replaces the historical apprenticeship CV. Official Media/Computing qualification names and grades are not yet included.
- Other repositories such as `diplom-chess` can still contain old code and credentials. They were not rewritten by this update.
- No remote deployment has been performed. Docker verification runs in CI; this workstation has no Docker runtime.
