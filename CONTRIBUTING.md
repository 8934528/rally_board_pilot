# Contributing to Rally Board Pilot

thank you for your interest in contributing to Rally Board Pilot.

RBP is a two-team game-show control and scoreboard system. Contributions should keep the application reliable, fast, easy to operate during live events, and visually clear on public displays.

---

## Project Goals

The project focuses on:

- Real-time game control
- Reliable score management
- Live synchronization
- Simple operator workflows
- Presentation-ready game boards
- Clear separation between Controller, Host, and Game Board
- Fast interaction during live events
- Maintainable React and Node.js architecture

---

## Technology Stack

Rally Board Pilot currently uses:

- React
- Vite
- Bootstrap
- Node.js
- Express
- Socket.IO
- CSS

---

## Project Structure

The application is separated into a client and server.

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
├── package.json
└── README.md
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd rally_board_pilot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development

```bash
npm run dev
```

The development environment should provide:

```text
Controller
http://localhost:5173/controller

Host
http://localhost:5173/host

Game Board
http://localhost:5173/board

Server
http://localhost:3001
```

---

## Before Making Changes

Before starting work:

```bash
git pull
```

Then make sure the project runs successfully:

```bash
npm run dev
```

For frontend changes, verify the relevant page.

For server changes, verify that:

```text
/api/health
```

is responding correctly and that Socket.IO clients can connect.

---

## Branching

Create a separate branch for your work.

Recommended naming:

```text
feature/score-controls
feature/timer
feature/wheel
fix/socket-reconnect
fix/score-validation
refactor/game-state
docs/readme
```

Examples:

```bash
git checkout -b feature/timer
```

or:

```bash
git checkout -b fix/socket-reconnect
```

Avoid doing large unrelated changes directly on the main branch.

---

## Making Changes

Keep changes focused.

A good contribution should generally address one main task.

For example:

```text
Good:
Add countdown timer controls

Less ideal:
Add timer + redesign controller + change socket architecture + rewrite CSS
```

Small, focused changes are easier to review and test.

---

## React Guidelines

When working on the React application:

- Prefer reusable components.
- Keep components focused.
- Avoid unnecessary duplication.
- Use hooks for reusable stateful logic.
- Keep Socket.IO communication inside services/hooks/context where appropriate.
- Avoid putting large amounts of business logic directly inside presentation components.
- Keep public Game Board components presentation-focused.
- Keep Controller components focused on operator controls.

---

## Server Guidelines

The server is responsible for the authoritative game state.

When implementing a new game action:

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

Do not rely on the client to be the authoritative source of game state.

Server-side actions should validate their input before changing state.

---

## Socket.IO Events

When adding a new event:

1. Add the event name to the appropriate constants/event definition.
2. Implement the server-side handler.
3. Validate the payload.
4. Update the game state.
5. Broadcast the new state.
6. Add the client-side action/helper.
7. Update the relevant UI.
8. Test with multiple connected clients.

Example:

```text
Controller
    │
    │ SCORE_ADJUST
    ▼
Server
    │
    │ Validate + Update
    ▼
Game State
    │
    │ Broadcast
    ▼
Controller + Host + Game Board
```

---

## Game State Changes

Be careful when modifying the shared game state.

Changes to the game state can affect:

- Controller
- Host
- Game Board
- Timers
- Wheel
- Announcements
- Activity logs
- Future clients

When adding a new state property, consider whether it belongs under:

```text
teams
round
board
timer
wheel
announcement
theme
status
```

Keep the state structure predictable.

---

## UI Guidelines

The Controller should prioritize:

- Speed
- Clarity
- Large controls
- Obvious actions
- Useful feedback
- Minimal unnecessary navigation

The Game Board should prioritize:

- Large readable text
- Strong visual hierarchy
- Audience visibility
- Smooth transitions
- Minimal controls
- Presentation quality

The Host interface should prioritize:

- Fast access
- Simple controls
- Limited complexity
- Live game operation

---

## CSS Guidelines

Use the existing stylesheet structure where possible.

```text
styles/
├── animations.css
├── board.css
├── controller.css
├── global.css
├── host.css
└── themes.css
```

Avoid placing large amounts of application-wide styling inside individual JSX files.

Keep:

- Board styling in `board.css`
- Controller styling in `controller.css`
- Host styling in `host.css`
- Shared styling in `global.css`
- Animations in `animations.css`
- Theme-specific styling in `themes.css`

---

## Bootstrap

Bootstrap can be used for:

- Layout
- Responsive grids
- Buttons
- Cards
- Forms
- Modals
- Utility classes

Custom CSS should be used when the Rally Board Pilot visual design requires something beyond standard Bootstrap components.

The goal is to combine Bootstrap's reliability with the project's custom game-show visual identity.

---

## Testing Changes

Before submitting a contribution, test the affected functionality.

At minimum:

```bash
npm run build
```

Also test the application manually when appropriate.

For real-time features, test with multiple browser windows:

```text
Browser Window 1
Controller

Browser Window 2
Host

Browser Window 3
Game Board
```

Then verify that state changes appear correctly across all clients.

---

## Real-Time Testing

For example:

```text
Controller:
Team A +10

        ↓

Server:
Team A score updated

        ↓

Host:
Updated score appears

        ↓

Game Board:
Updated score appears
```

If a change works only after refreshing the browser, the real-time synchronization is not working correctly.

---

## Commit Messages

Use clear commit messages.

Examples:

```text
feat: add score adjustment controls
feat: add countdown timer
feat: add spin wheel
fix: prevent negative timer values
fix: validate score actions
fix: reconnect socket after server restart
refactor: simplify game state helpers
style: improve controller layout
docs: update setup instructions
```

Avoid vague messages such as:

```text
update
changes
stuff
fix
new things
```

---

## Pull Requests

A pull request should explain:

### What changed?

Describe the implementation.

### Why?

Explain the problem or feature being addressed.

### How was it tested?

List the checks you performed.

Example:

```text
What changed?
Added server-controlled countdown timer.

Why?
The Game Board needs to display the same timer value as the Controller.

Testing:
- npm run build
- Tested Controller + Board in separate browser windows
- Tested timer start
- Tested pause
- Tested reset
```

---

## Pull Request Checklist

Before submitting a pull request:

- [ ] The project starts successfully.
- [ ] `npm run build` succeeds.
- [ ] No unnecessary files are committed.
- [ ] No secrets are committed.
- [ ] `.env` files are not committed.
- [ ] Socket.IO changes were tested with multiple clients.
- [ ] Controller changes were tested.
- [ ] Host changes were tested where applicable.
- [ ] Game Board changes were tested where applicable.
- [ ] Existing functionality still works.
- [ ] Code is reasonably organized.
- [ ] Documentation was updated when necessary.

---

## Reporting Bugs

When reporting a bug, include:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser and version
- Node.js version
- Operating system
- Relevant console/server errors
- Screenshots when useful

For real-time issues, mention which clients were open:

```text
Controller: Open
Host: Open
Game Board: Open
```

---

## Feature Requests

Feature requests are welcome.

A useful feature request should explain:

1. What problem does the feature solve?
2. Who uses it?
3. How would it work?
4. How does it fit the existing game-show workflow?
5. Is it required during a live event or mainly a configuration feature?

Features that improve live reliability and operator speed are especially valuable.

---

## Security

Do not report security vulnerabilities through public issues.

Please follow the instructions in:

```text
SECURITY.md
```

---

## Documentation

When adding a feature that changes how the project is installed, configured, operated, or developed, update the relevant documentation.

The main documentation is:

```text
README.md
```

Security-related guidance belongs in:

```text
SECURITY.md
```

---

## Keeping Contributions Focused

Rally Board Pilot is intended to remain easy to operate during a live event.

When proposing a feature, ask:

> Does this make the live game easier, clearer, faster, or more reliable?

If the answer is no, the feature may belong outside the core live-control experience.

---

## Code of Conduct

Contributors are expected to communicate respectfully and professionally.

Harassment, discrimination, personal attacks, malicious behavior, and intentionally disruptive contributions are not acceptable.

---

## License

By contributing to Rally Board Pilot, you agree that your contributions may be incorporated into the project under the project's applicable license and contribution terms.

If the project license changes, contributors should review the updated licensing terms before submitting substantial contributions.

---

Thank you for helping improve Rally Board Pilot.
