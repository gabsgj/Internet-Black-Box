# Frontend Dashboard Specific Decisions

* **Styling Framework:** Tailwind CSS for fast and unified utility classes. Include custom glassmorphism overlays and CSS variable-driven dark mode color palette.
* **Graph Visualization Engine:** Sigma.js coupled with the `graphology` package. This allows us to load, configure, and render complex Neo4j node structures on a canvas smoothly.
* **Chart Library:** Recharts for quick, responsive timeline analytics, MTTR meters, and bar charts.
* **State Management:** Zustand for light, hook-based state stores (`useIncidentStore`).
* **Icons:** `lucide-react` for modern, clean iconography.
