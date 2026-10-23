# Rally Board Pilot

Rally Board Pilot is a live two-team game-show control and scoreboard system built for real-time event control.

It provides separate interfaces for the **Controller**, **Host**, and public **Game Board**, with live synchronization powered by Socket.IO.

---

## Stack

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## Overview

Rally Board Pilot is designed as a live game-show control system rather than a traditional administration dashboard.

The system separates game operation into three main interfaces:

- **Controller** — full control of the live game.
- **Host** — limited controls for the person running the game.
- **Game Board** — public-facing display for players and audience.

All interfaces communicate with the same live game state through the Node.js server and Socket.IO.

---

## Architecture

```text
                         ┌─────────────────────┐
                         │     Controller      │
                         │                     │
                         │  Full Game Control  │
                         └──────────┬──────────┘
                                    │
                                    │ Socket.IO
                                    ▼
                         ┌─────────────────────┐
                         │    Node / Express   │
                         │                     │
                         │   Live Game State   │
                         │                     │
                         │      Socket.IO      │
                         └──────────┬──────────┘
                                    │
                                    │ Socket.IO
                                    ▼
                         ┌─────────────────────┐
                         │     Game Board      │
                         │                     │
                         │   Public Display    │
                         └─────────────────────┘

                         ┌─────────────────────┐
                         │        Host         │
                         │                     │
                         │  Limited Controls   │
                         └──────────┬──────────┘
                                    │
                                    │ Socket.IO
                                    ▼
                         ┌─────────────────────┐
                         │    Node / Express   │
                         └─────────────────────┘
```

### Live State Flow

```text
Controller / Host
       │
       │ Game Action
       ▼
Socket.IO Server
       │
       │ Update State
       ▼
In-Memory Game State
       │
       │ Broadcast
       ▼
All Connected Clients
       │
       ├── Controller
       ├── Host
       └── Game Board
```

---

## Application Modes

### Controller

The Controller is the main game operator interface.

```text
/controller
```

#### Controller Features

- Team scores
- Add and subtract points
- Team names
- Team colours
- Round management
- Game status
- Board page control
- Theme control
- Game reset
- Live board preview
- Activity log
- Timer controls
- Spin wheel controls
- Announcements
- Winner display

---

### Host

The Host interface provides simplified controls for the person actively presenting or running the game.

```text
/host
```

#### Host Features

- Live score controls
- Round controls
- Game status controls
- Spin wheel controls
- Limited game actions

The Host does not need access to the full Controller configuration.

---

### Game Board

The Game Board is the public-facing display.

```text
/board
```

It is designed to run on a projector, television, second monitor, or large display.

#### Board Modes

- Scoreboard
- Round Intro
- Timer
- Spin Wheel
- Announcement
- Winner

The Game Board receives its state from the server and updates automatically when the Controller or Host makes changes.

---

## Board Pages

### Scoreboard

Displays:

- Team names
- Team colours
- Team scores
- Current round
- Game status

### Round Intro

Displays the current round and round title in a large presentation format.

### Timer

Displays the live countdown timer.

### Spin Wheel

Displays the configured wheel entries and the selected result.

### Announcement

Displays large custom announcements for the audience.

### Winner

Displays the winning team and final result.

---

## Real-Time Communication

Rally Board Pilot uses **Socket.IO** for live communication between the Controller, Host, Server, and Game Board.

```text
Controller
    │
    │ SCORE_ADJUST
    ▼
Socket.IO Server
    │
    │ Update game state
    ▼
Game Board
    │
    │ Render new score
    ▼
Audience Display
```

When a score changes on the Controller, the Game Board updates without requiring a browser refresh.

---

## Requirements

Before running Rally Board Pilot, install:

- Node.js
- npm
- Git

Verify the installation:

```bash
node --version
npm --version
```

---

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd rally_board_pilot
```

Install dependencies:

```bash
npm install
```

---

## Environment Configuration

Create a local `.env` file when required.

Example:

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
VITE_SERVER_URL=http://localhost:3001
```

The project also includes:

```text
.env.example
```

Do not commit your local `.env` file to Git.

---

## Development

Start the complete development environment:

```bash
npm run dev
```

### Controller

```text
http://localhost:5173/controller
```

### Host

```text
http://localhost:5173/host
```

### Game Board

```text
http://localhost:5173/board
```

### Server Health

```text
http://localhost:3001/api/health
```

### Current Game State

```text
http://localhost:3001/api/game-state
```

---

## Development Workflow

```text
1. Start the server
       ↓
2. Open Controller
       ↓
3. Open Host if required
       ↓
4. Open Game Board on the display
       ↓
5. Configure teams
       ↓
6. Select the active board page
       ↓
7. Start the game
       ↓
8. Control scores and rounds
       ↓
9. Use Timer / Wheel / Announcements
       ↓
10. Display the Winner
```

---

## Production Build

Build the React application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Start the Node.js server:

```bash
npm start
```

---

## API

### Health Check

```http
GET /api/health
```

Example response:

```json
{
  "success": true,
  "system": "Rally Board Pilot",
  "status": "online"
}
```

### Game State

```http
GET /api/game-state
```

Returns the current live game state held by the server.

---

## Live Game Actions

The application communicates using Socket.IO events.

Examples include:

```text
SCORE_ADJUST
SET_TEAM
SET_PAGE
SET_ROUND
SET_STATUS
SET_THEME
TIMER_SET
TIMER_START
TIMER_PAUSE
TIMER_RESET
WHEEL_SET_ENTRIES
WHEEL_SPIN
WHEEL_CLEAR_RESULT
ANNOUNCEMENT_SET
ANNOUNCEMENT_CLEAR
RESET_GAME
```

The server validates actions, updates the game state, and broadcasts the updated state to connected clients.

---

## Design

Rally Board Pilot is designed to feel like a **broadcast/game-show control room**, not a standard CRUD dashboard.

The interface focuses on:

- Fast live controls
- Large readable game information
- Clear team identity
- Immediate visual feedback
- Presentation-ready board pages
- Minimal friction during a live event
- Separation between operator controls and public display

The Game Board remains clean and audience-focused while the Controller provides the detailed controls required by the operator.

---

## Version

Version 1 intentionally uses **in-memory state**.

No database is required.

This keeps the initial system simple and fast while the real-time game engine is being developed.

### Important

The current game state is lost when the Node.js server restarts.

Future versions may add persistent storage if required.

---

## Future Improvements

Potential future features include:

- Persistent game sessions
- Multiple game rooms
- Room codes
- Host permission management
- Undo / redo
- Game history
- Saved themes
- Saved wheel presets
- Advanced animations
- Sound effects
- Fullscreen presentation mode
- Keyboard shortcuts
- Multiple teams
- Question / challenge management
- Game statistics
- Event/session export
- Authentication
- Database persistence

---

## License
