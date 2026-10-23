# Security Policy

## Overview

game-show control and scoreboard system built with React, Vite, Node.js, Express, and Socket.IO

security is important because the application can control live game information, including scores, team configuration, timers, announcements, and public display content

this document explains how to report security vulnerabilities and provides basic security expectations for contributors and deployments

---

## Supported Versions

Rally Board Pilot is currently under active development.

| Version         | Supported |
|-----------------|-----------|
| V1.x            | Yes       |
| Older versions  | No        |

Because this project is currently in development, security support may change as the application evolves.

---

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public GitHub issue** containing sensitive details.

Instead, report the issue privately to the project maintainer.

When reporting a vulnerability, please include:

- A clear description of the vulnerability
- The affected component or file
- Steps to reproduce the issue
- The potential impact
- Any proof-of-concept information that can safely be shared
- Suggested mitigation, if known

Please give the maintainer reasonable time to investigate and address the issue before publicly disclosing the vulnerability.

---

## Security Expectations

Contributors should follow these principles when working on Rally Board Pilot.

### Never Commit Secrets

Do not commit:

- Passwords
- API keys
- Access tokens
- Private keys
- Authentication secrets
- Production credentials
- Private environment configuration

Use environment variables instead.

Local environment files such as:

```text
.env
.env.local
.env.production.local
```

must not be committed to the repository.

Use `.env.example` to document required environment variables without exposing their values.

---

## Environment Variables

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
VITE_SERVER_URL=http://localhost:3001
```

Production credentials and private configuration must be stored outside the source code.

---

## Input Validation

All client-provided game actions should be treated as untrusted input.

The server should validate:

- Team identifiers
- Score values
- Score adjustment amounts
- Team names
- Team colours
- Round numbers
- Round names
- Board page names
- Timer values
- Wheel entries
- Announcement content
- Theme configuration

The server should never rely solely on client-side validation.

---

## Socket.IO Security

Socket.IO events can modify live game state.

Server-side event handlers should therefore:

1. Validate incoming data.
2. Validate the requested action.
3. Reject malformed payloads.
4. Restrict unsupported actions.
5. Avoid trusting client-provided permissions.
6. Prevent unexpected state mutations.

Example:

```text
Client
  |
  | Untrusted event
  v
Socket.IO Server
  |
  | Validate
  v
Game State
```

---

## API Security

API endpoints should validate incoming requests and avoid exposing information that is not required by clients.

For example:

```text
GET /api/health
GET /api/game-state
```

should only expose the information necessary for their intended purpose.

If authentication or authorization is introduced in a future version, sensitive endpoints should require appropriate authorization.

---

## CORS

The development environment uses a restricted client origin such as:

```text
http://localhost:5173
```

Production deployments should configure CORS explicitly for the trusted frontend origin.

Avoid using unrestricted origins such as:

```text
*
```

for sensitive production deployments.

---

## XSS Prevention

User-controlled content such as:

- Announcements
- Team names
- Round names
- Wheel entries

must not be rendered as raw HTML unless it has been explicitly sanitized.

React's normal text rendering should be preferred over unsafe HTML injection.

Avoid unnecessary use of:

```jsx
dangerouslySetInnerHTML
```

---

## Dependency Security

Keep project dependencies reasonably up to date.

Before committing dependency changes, review:

```bash
npm audit
```

Contributors should avoid introducing unnecessary dependencies.

When adding a dependency, consider:

- Maintenance status
- Security history
- Package size
- License
- Whether the functionality can reasonably be implemented without it

---

## Production Deployment

For production deployments:

- Use HTTPS.
- Restrict CORS.
- Protect server environment variables.
- Do not expose development credentials.
- Keep Node.js and dependencies updated.
- Use appropriate firewall rules.
- Do not expose unnecessary server ports.
- Consider authentication before exposing Controller or Host interfaces publicly.
- Consider rate limiting for public-facing APIs and Socket.IO connections.

---

## Current V1 Security Limitations

Rally Board Pilot V1 intentionally focuses on the real-time game engine and uses in-memory state.

Current limitations may include:

- No persistent authentication system
- No user accounts
- No role-based authentication
- No database
- No persistent audit storage
- Controller and Host access are currently application-level concepts rather than full identity-based authorization

Therefore, V1 should be treated as a controlled/private event application rather than a hardened public internet service.

---

## Responsible Disclosure

Please allow the maintainer reasonable time to investigate reported vulnerabilities.

Security reports should not be publicly disclosed before a fix or mitigation has been coordinated where practical.

Thank you for helping keep Rally Board Pilot secure.
