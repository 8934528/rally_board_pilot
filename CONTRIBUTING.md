# Contributing to RBP

Thank you for helping improve RBP!

RBP is a two-team game-show control and scoreboard system. Contributions should keep the app fast, reliable, and easy to use during a live event.

> See **README.md** for installation, URLs, and general project info.

---

## Project Goals

- Fast game control during live events
- Reliable score management
- Simple operator experience
- Clean display pages for the audience
- Clear separation between Controller, Host, and Game Board

---

## Project Structure

```text
rally_board_pilot/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── config/
│       ├── constants/
│       ├── context/
│       ├── data/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── events.js
│   ├── gameState.js
│   ├── socketHandlers.js
│   └── index.js
│
├── scripts/
├── .env.example
├── .gitignore
├── Makefile
├── package.json
├── README.md
├── CONTRIBUTING.md
└── SECURITY.md
```

---

## Getting Started

```bash
git clone <your-repository-url>
cd rally_board_pilot
npm install
npm run dev
```

---

## Before Making Changes

Pull the latest code:

```bash
git pull
```

Make sure the project runs:

```bash
npm run dev
```

For server changes, check that `/api/health` responds and that clients can connect.

---

## Branching

Make a new branch for your work.

Good names:

```text
feature/score-controls
feature/timer
feature/wheel
fix/socket-reconnect
fix/score-validation
refactor/game-state
docs/readme
```

```bash
git checkout -b feature/timer
```

Do not make large unrelated changes on the main branch.

---

## Making Changes

Keep changes focused. One task per contribution.

**Good:**
```text
Add countdown timer controls
```

**Less ideal:**
```text
Add timer + redesign controller + change socket architecture + rewrite CSS
```

Small, focused changes are easier to review and test.

---

## React Guidelines

- Use reusable components.
- Keep components focused on one thing.
- Use hooks for shared logic.
- Keep Socket.IO communication inside services, hooks, or context.
- Do not put business logic inside presentation components.
- Keep Game Board components clean and display-only.
- Keep Controller components focused on operator controls.

---

## Server Guidelines

The server holds the main game state. Do not rely on the client for this.

When adding a new game action:

```text
Client
  ↓
Socket.IO Event
  ↓
Server Validation
  ↓
Game State Update
  ↓
Broadcast Updated State
  ↓
Connected Clients
```

Validate all input on the server before changing state.

---

## Adding a New Socket Event

1. Add the event name to the constants file.
2. Write the server handler.
3. Validate the data.
4. Update the game state.
5. Broadcast the new state.
6. Add the client-side action.
7. Update the UI.
8. Test with multiple open browser windows.

---

## Game State Changes

Be careful when changing shared state. Changes can affect:

- Controller
- Host
- Game Board
- Timers
- Wheel
- Announcements
- Activity logs

When adding a new state property, place it under the right group:

```text
teams / round / board / timer / wheel / announcement / theme / status
```

---

## UI Guidelines

**Controller** — fast, clear, large controls, obvious actions, useful feedback.

**Game Board** — big text, strong visual layout, audience-readable, smooth transitions.

**Host** — fast access, simple controls, no unnecessary complexity.

---

## CSS Guidelines

Use the existing stylesheet structure:

```text
styles/
├── animations.css
├── board.css
├── controller.css
├── global.css
├── host.css
└── themes.css
```

- Board styling → `board.css`
- Controller styling → `controller.css`
- Host styling → `host.css`
- Shared styling → `global.css`
- Animations → `animations.css`
- Theme styling → `themes.css`

Do not put app-wide styles inside JSX files.

---

## Bootstrap

Bootstrap can be used for layout, grids, buttons, cards, forms, modals, and utility classes.

Use custom CSS when RBP needs something that Bootstrap does not cover.

---

## Testing Changes

Before submitting:

```bash
npm run build
```

Also test manually. For sync features, open multiple browser windows:

```text
Window 1 → Controller
Window 2 → Host
Window 3 → Game Board
```

Check that changes appear across all windows.

---

## Commit Messages

Use clear messages:

```text
feat: add score adjustment controls
feat: add countdown timer
fix: prevent negative timer values
fix: validate score actions
refactor: simplify game state helpers
style: improve controller layout
docs: update setup instructions
```

Do not use vague messages like `update`, `changes`, or `fix`.

---

## Pull Requests

Your PR should explain:

**What changed?** — describe what you did.

**Why?** — explain the problem or feature.

**How was it tested?** — list what you checked.

Example:

```text
What changed?
Added server-controlled countdown timer.

Why?
The Game Board needs to show the same timer as the Controller.

Testing:
- npm run build
- Tested Controller + Board in separate windows
- Tested timer start, pause, and reset
```

---

## Pull Request Checklist

- [ ] Project starts with no errors
- [ ] `npm run build` succeeds
- [ ] No unnecessary files committed
- [ ] No secrets committed
- [ ] `.env` not committed
- [ ] Socket changes tested with multiple clients
- [ ] Controller changes tested
- [ ] Host changes tested where needed
- [ ] Game Board changes tested where needed
- [ ] Existing features still work
- [ ] Code is clean and organised
- [ ] Docs updated if needed

---

## Reporting Bugs

Include:

- What you expected
- What actually happened
- Steps to reproduce
- Browser and version
- Node.js version
- OS
- Console or server errors
- Screenshots if useful

---

## Feature Requests

A good request explains:

1. What problem does it solve?
2. Who uses it?
3. How would it work?
4. How does it fit the game-show workflow?
5. Is it needed during a live event or only for setup?

Features that improve live speed and reliability are the most useful.

---

## Security

Do not report security issues in public GitHub issues.

Follow the instructions in `SECURITY.md`.

---

## Documentation

If your change affects how RBP is installed, set up, used, or developed — update the relevant doc file.

---

## Code of Conduct

Be respectful and professional.

Harassment, personal attacks, and deliberately disruptive contributions are not acceptable.

---

## License

By contributing, you agree your work may be used under the project's license.

---

Thank you for helping improve RBP.
