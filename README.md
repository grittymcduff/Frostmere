# Frostmere — Study Quest

A single-player, storybook-style browser game for studying **Applied Business Research Tools**: walk a snowy world, restore study stones, and answer trivia and data puzzles from the course.

**Play:** https://grittymcduff.github.io/Frostmere/

## How it's built
- `src/` holds the source. Edit there, never `index.html` directly.
  - `src/js/` – engine (rendering, movement, world, puzzle engine, game loop)
  - `src/content/` – course content: `00_course.js` is the region map; `m1.js` … `m6.js` hold each module's stones (with waypoints inline from Module 2 on); `m1_waypoints.js` holds Module 1's mini-lessons. Add `m7.js`… to unseal Crystal Reach. `z_caches.js` holds the supply-cache problems.
  - `src/style.css`, `src/body.html` – page shell
- `python3 build.py` bundles everything into a single self-contained `index.html`, which GitHub Pages serves.

## Art
All art is drawn in code by default. Painted PNGs (e.g. from Gemini) can replace any sprite one at a time — see **[ART_GUIDE.md](ART_GUIDE.md)** for sizes, anchors, the style bible, and prompts. Art lives in `assets/` and is listed in `src/content/00_art.js`.

## Workflow
1. Edit files in `src/`.
2. Run `python3 build.py`.
3. Commit `src/` **and** `index.html`, then push to `main`.

## Game rules
- **Study stones** hold a module's main challenges (5 each). Restore a stone with **at most one miss**.
- **Waypoints** (lecterns on the path before each stone) are short lessons with practice questions, in order. They're optional — but miss **2 or more** on a stone and it **freezes** until you finish its waypoints.
- Restore every stone in a region to unseal the next region's gate.
- **Supply caches** are hidden off the paths near each stone (look for sparkles). Solve the problem on the lock to win an item, usable only during a stone challenge:
  - **Lens** – strikes out one wrong answer (multiple choice)
  - **Feather** – reveals the first step (calculation questions)
  - **Warding Charm** – arm it before answering; your next miss on that question doesn't count
- A **calculator** is available on every challenge (arithmetic, powers, √, ln/log/exp, and `sum`, `mean`, `sumsq`, `var`, `sd` for lists).

## Notes
- Data puzzles generate fresh datasets every attempt; answers are computed in code (OLS, t and F p-values verified against SciPy).
- Progress saves in the browser (localStorage). The quest log (Q) has a save code for moving between devices.
- Course slides and the original PDFs are **not** in this repo. Questions are written from them; slide content is not copied.
