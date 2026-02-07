# ✈️ Mechanical Split-Flap Display 

A high-fidelity, physics-informed digital recreation of the iconic Solari-style split-flap displays. Built with **Angular 21** and **Tailwind 4**, this project focuses on the intersection of mechanical realism and a seamless, modern user experience.

## 🚀 Technical Highlights

* **Trapezoidal Velocity Profile:** Simulates motor torque and physical inertia by accelerating during long character transitions and decelerating as it approaches the target for a "soft landing."
* **Reactive State Engine:** Built using **Angular Signals**, ensuring sub-millisecond reactivity where only the specific flaps requiring an update are re-rendered.
* **Coordinated Cascading:** Mimics real-world electrical sequencing by propagating signal updates through the board with configurable hardware communication delays.
* **Sub-millisecond Frame Sync:** Animation cycles are managed via a recursive logic loop utilizing `requestAnimationFrame` for perfect synchronization and layout-drift prevention.

## ✨ Key Features & UX Refinements

* **Immutable URL State Sharing:** The entire board configuration—including dimensions, animation intervals, and the full multi-slide message queue—is serialized into a **Base64-encoded URL string**. The URL updates reactively as you type without triggering page reloads, making sharing your exact display state as simple as copying the link.
* **Unified "Command Center":** A consolidated, bottom-docked control block optimized for responsiveness and mobile comfort. It features:
    * **Context-Aware Minimization:** A collapsible UI that shrinks to a slim status bar to maximize board visibility on small screens while retaining essential dimension stats.
    * **Sticky Focus Logic:** Specialized `touchstart` interception allows users to adjust board dimensions while the keyboard is open without losing focus or accidentally closing the editor.
    * **Per-Line Real-Time Validation:** An intelligent "Ghost Layer" editor that visually darkens characters or lines that exceed the board's current physical dimensions, providing instant feedback on content fit.
* **Zero-Bleed Aesthetics:** Optimized for iOS and Android with `viewport-fit=cover` and deep-zinc background matching to eliminate browser "white-bar" artifacts and overscroll flickering.

## 🏗️ Roadmap

- [ ] **Dynamic Character Sets:** Expanding beyond A-Z0-9 to include punctuation, specialized airport symbols, and color-blocks.
- [ ] **Sound Engine:** Implementing the Web Audio API for velocity-tracked mechanical clicks that match the animation speed.

## 🔗 Links

* **Live Demo:** [Experience the Motion](https://ningelschlingel.github.io/split-flap-display/)
* **Inspiration / Iteration:** A Tailwind-based evolution of the simpler split-flap-display version showcased with [Turbaero](https://github.com/ningelschlingel/turbaero)

---
*Developed with a focus on tactile digital experiences.*