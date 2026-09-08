# Security

This repository is a learning project, not a security certification. Do not use an important or reused password in the demo.

If you find a vulnerability, email the maintainer at tymurmarenych@gmail.com with the affected file and a minimal reproduction. Avoid posting credentials or personal data in public issues.

The previous implementation committed service credentials and stored plaintext passwords. Those values must be treated as compromised if they were ever used. The replacement service no longer uses those credentials, but historical commits may still contain them. Rotate/revoke them at their providers; deleting files alone does not revoke a credential.

Before exposing the application publicly, follow [the migration checklist](docs/MIGRATION.md), configure HTTPS and secure cookies, and arrange private backups and monitoring. Current limitations are documented in [Architecture](docs/ARCHITECTURE.md).
