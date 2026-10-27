# Audio Credits & Licensing

This document lists all sound effects used in the Rally Board Pilot (RBP) system, their technical origin, licenses, and attribution information.

All sound effects in Rally Board Pilot are procedurally synthesized in real-time using the **Web Audio API**. This guarantees:

1. **100% legal safety**: No copyrighted audio files, rip-offs, or unlicensed media are used.
2. **Zero external asset dependencies**: Sounds work reliably offline and cannot trigger 404 network errors or latency issues.
3. **Dynamic synchronization**: Real-time parameter modulation (e.g. dynamic decelerating wheel ticks matching animation curve physics).

---

## Sound Registry

| Sound Name            | Generator / Implementation | Source | Creator | License | Attribution Requirement |
| :-------------------- | :--- | :--- | :--- | :--- | :--- |
| `buttonClick`         | Web Audio Oscillator (Sine sweep 600Hz &rarr; 150Hz)           | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |
| `buttonConfirm`       | Web Audio Oscillator (Harmonic dual chime C5 &rarr; E5)        | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |
| `buttonError`         | Web Audio Oscillator (Sawtooth alert pulse 220Hz &rarr; 165Hz) | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |
| `scoreUp`             | Web Audio Oscillator (Ascending major arpeggio C5-E5-G5-C6)    | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |
| `scoreDown`           | Web Audio Oscillator (Descending mellow tone 440Hz &rarr; 311Hz)      | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |
| `roundTransition`     | Web Audio Oscillator (Dynamic triad sweep with high-frequency ramp)       | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |
| `timerWarning`        | Web Audio Oscillator (Pulsed sine tone 880Hz) | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain)     | None required |
| `timerEnd`            | Web Audio Oscillator (Buzzer timbre 220Hz with decay)         | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |
| `wheelStart`          | Web Audio BufferSource (Bandpass filtered white-noise burst) | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |
| `wheelTick`           | Web Audio Oscillator (High-snap triangle transient 1100Hz &rarr; 180Hz) | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |
| `wheelStop`           | Web Audio Oscillator (Low-frequency latch & brake transient) | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |
| `wheelResult`         | Web Audio Oscillator (Pentatonic shimmer 5-tone sequence) | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |
| `winner`              | Web Audio Oscillator (Triumphant fanfare motif) | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |
| `announcement`        | Web Audio Oscillator (Dual chime tone D5 &rarr; A5) | Procedural Synth (`client/src/audio/audioManager.js`) | Rally Board Pilot Team | CC0 1.0 Universal (Public Domain) | None required |

---

## Accessibility and Settings

- Sounds are completely optional; all game critical indicators and score states maintain full visual representation.
- Users can toggle mute or adjust master volume via the UI sound toggle or programmatically using `audioManager.setVolume()` and `audioManager.setMuted()`.
- Browser autoplay policies are handled gracefully by initializing and resuming AudioContext upon user interaction.
