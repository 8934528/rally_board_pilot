# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| V1.x    | Yes       |
| Older   | No        |

---

## Reporting a Vulnerability

If you find a security issue, **do not open a public GitHub issue**.

Report it privately to the project maintainer instead.

Please include:

- A clear description of the issue
- Which file or part of the app is affected
- Steps to reproduce it
- The possible impact
- Any proof-of-concept (only what is safe to share)
- A suggested fix, if you have one

Give the maintainer time to look into it before you tell anyone else.

---

## Security Expectations

### Do Not Commit Secrets

Never commit:

- Passwords
- API keys
- Access tokens
- Private keys
- Production credentials
- Private config values

Use environment variables. Local `.env` files must not be committed.

Use `.env.example` to show what variables are needed, without the real values.

---

## Input Validation

The server should validate all data that comes from clients.

This includes:

- Team IDs and names
- Score values
- Round numbers and names
- Board page names
- Timer values
- Wheel entries
- Announcement content
- Theme config
- Team colours

Never rely only on client-side checks.

---

## Socket.IO

Socket.IO events can change the live game state.

Server handlers should:

1. Validate the incoming data
2. Check that the action is allowed
3. Reject bad data
4. Block unsupported actions
5. Not trust permissions sent by the client
6. Prevent unexpected state changes

---

## API

API endpoints should only return the data they need to return.

If authentication is added in a future version, sensitive endpoints must require it.

---

## CORS

Development uses a restricted origin:

```text
http://localhost:5173
```

Production deployments should set CORS to the specific frontend URL. Do not use `*` for sensitive deployments.

---

## XSS Prevention

User content — such as team names, announcements, and wheel entries — must not be shown as raw HTML unless it has been sanitised.

Use React's normal text rendering. Avoid `dangerouslySetInnerHTML`.

---

## Dependencies

Keep dependencies reasonably up to date.

Before committing dependency changes, run:

```bash
npm audit
```

When adding a new package, consider:

- Is it actively maintained?
- Does it have a good security record?
- Is it really needed?
- What is its licence?

---

## Production Checklist

For production deployments:

- Use HTTPS
- Restrict CORS to your frontend URL
- Protect environment variables
- Do not expose development credentials
- Keep Node.js and packages updated
- Use firewall rules
- Do not expose server ports you do not need
- Add authentication before making Controller or Host public
- Consider rate limiting on public APIs and Socket.IO

---

## V1 Limitations

RBP V1 uses in-memory state and has no authentication system.

Current limitations:

- No user accounts
- No role-based access control
- No database
- No audit logs
- Controller and Host access is application-level only

V1 is best used as a **private or controlled-event tool**, not a public internet service.

---

## Responsible Disclosure

Please allow time for a fix before making a vulnerability public.

Thank you for helping keep RBP secure.
