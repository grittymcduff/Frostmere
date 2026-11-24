# Free Market Quest

A single-player, storybook-style browser game for studying **Applied Business Research Tools**: walk a snowy world, restore study stones, and answer trivia and data puzzles from the course.

**Play:** https://grittymcduff.github.io/Free-Market-Quest/

## How it's built
- `src/` holds the source. Edit there, never `index.html` directly.
  - `src/js/` – engine (rendering, movement, world, puzzle engine, game loop)
  - `src/content/` – course content: `00_course.js` is the region map; `m1.js` is Module 1. Add `m2.js`, `m3.js`, … to unseal more stones.
  - `src/style.css`, `src/body.html` – page shell
- `python3 build.py` bundles everything into a single self-contained `index.html`, which GitHub Pages serves.

## Workflow
1. Edit files in `src/`.
2. Run `python3 build.py`.
3. Commit `src/` **and** `index.html`, then push to `main`.

## Notes
- Data puzzles generate fresh datasets every attempt; answers are computed in code (OLS, t and F p-values verified against SciPy).
- Progress saves in the browser (localStorage). The quest log (Q) has a save code for moving between devices.
- Course slides and the original PDFs are **not** in this repo. Questions are written from them; slide content is not copied.
