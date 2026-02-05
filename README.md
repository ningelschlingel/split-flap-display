# ✈️ Mechanical Split-Flap Display 

A high-fidelity, physics-informed digital recreation of the iconic Solari-style split-flap displays. Built with **Angular 21** and **Tailwind 4**, this project focuses on the intersection of mechanical realism and performant web animation.



## 🚀 Technical Highlights

* **Trapezoidal Velocity Profile:** Unlike standard linear animations, this display features mechanical "ramping." It simulates motor torque by accelerating during long character transitions and decelerating as it approaches the target index for a "soft landing."
* **Reactive State Engine:** Built using **Angular Signals**, ensuring that only the specific flaps requiring an update are re-rendered, improving performance.
* **Coordinated Cascading:** Implements update patterns where signals propagate through the board (linearly or diagonally) to mimic real-world electrical sequencing and hardware communication delays.
* **Sub-millisecond Reactivity:** Animation cycles are managed via a recursive logic loop that utilizes `requestAnimationFrame` for perfect frame synchronization and layout-drift prevention.

## 🔗 Links

* **Live Demo:** [Experience the Motion](https://ningelschlingel.github.io/split-flap-display/)
* **Inspiration:** This is a Tailwind-based evolution of [Turbaero](https://github.com/ningelschlingel/turbaero), shifting from static assets to a fully procedural, code-driven animation system.

## 🏗️ Roadmap

- [ ] **Character Sets:** Expanding beyond A-Z0-9 to include punctuation, specialized airport symbols, colors and more.
- [ ] **Responsive Refinement:** Fine-tuning for smaller touch devices.
- [ ] **Sound Engine:** Implementing the Web Audio API for velocity-tracked mechanical clicks.