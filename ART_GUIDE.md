# Free Market Quest — Art Guide

Every object in the world is currently drawn in code. Any of them can be replaced with painted art (e.g. from Gemini / Nano Banana) **one piece at a time**. The engine keeps doing the lighting, glow, snow, wind sway, depth sorting, and frozen-stone effects on top of whatever art you drop in.

## How to swap in a piece of art

1. Make a **transparent PNG** at the size in the table below (2× the in-game size, so it stays crisp on phones).
2. Put it in `assets/` (e.g. `assets/pine_1.png`).
3. Open `src/content/00_art.js` and add the file name to that sprite's `files` list:
   ```js
   pines: {files:['pine_1.png','pine_2.png','pine_3.png'], multi:true, w:120, h:190, ox:60, oy:178},
   ```
   Several files = random variants (good for trees, rocks, bushes).
4. Run `python3 build.py`, then test with `python3 -m http.server` and open <http://localhost:8000>.
5. Commit `assets/`, `src/`, and `index.html`.

If a file is missing or fails to load, the game quietly falls back to the drawn version.

## Style bible (paste this at the top of every prompt)

> **Style:** cozy storybook fantasy game asset, hand-painted gouache look with soft brush texture, clean readable shapes, gentle rounded forms, muted winter palette with warm accents. **Camera:** three-quarter top-down view (looking down at about 40°, as in a top-down RPG), seen from the south. **Light:** soft light from the upper left; shade on the right side. **Snow:** a soft cap of snow on upward-facing surfaces. **Isolated single object, centered, full object visible, transparent background** (or a flat pure #FF00FF background to cut out). **No** text, **no** drop shadow beyond a small soft contact shadow directly under the base, **no** glow, bloom, or lighting effects (the game adds those), **no** ground plane or scenery.

Rules that keep everything consistent:

- **Same camera angle for everything.** Mixing angles is the #1 thing that makes assets look pasted-in.
- **Base at the bottom center.** The object should touch the ground at the anchor point in the table (bottom center, a few pixels above the image edge).
- **Don't paint light sources glowing.** Paint lantern glass a bright warm yellow, but let the game add the glow.
- **Palette by region:**
  - Frostmere Village / Signpost Woods: snow `#EEF3F8`, shadow blue `#9FB3CF`, pine teal `#2F6B5E`→`#173C3C`, wood `#76503A`, accent red `#C8433A`, gold `#E2B65A`
  - Lantern Hollow: violet pines `#5B3B7A`→`#2A1A3E`, paper-lantern reds and oranges `#D9473A` `#E9833A`, gold `#F1C25C`
  - Crystal Reach: ice-blue pines `#2E5C7A`→`#112A3E`, crystal cyan `#6FD0F0`→violet `#5038B0`

### Recommended workflow with Nano Banana

1. Generate a **style reference sheet** first: *"a sheet of six cozy storybook winter game props (pine tree, log cabin, lantern post, rock, berry bush, wooden crate) in one consistent style"* plus the style bible. Pick the one you like.
2. For every asset after that, attach that reference image and say *"match the style of the attached image exactly"*.
3. Generate on flat `#FF00FF` magenta if transparency comes out messy, then remove the background (Photopea magic wand, or remove.bg) and save as PNG.
4. Resize/crop to the exact size below so the base lands on the anchor.

## Asset list

Sizes are the PNG size to export (2× the in-game size). **Anchor** = the pixel where the object meets the ground.

| Key in `00_art.js` | Suggested files | PNG size | Anchor (x, y) | What it is |
|---|---|---|---|---|
| `pines` | `pine_1…6.png` | 240 × 380 | 120, 356 | Snowy teal pine, 4 tiers, snow on upper-left slopes |
| `pinesV` | `pine_violet_1…4.png` | 240 × 380 | 120, 356 | Same pine, violet needles (Lantern Hollow) |
| `pinesB` | `pine_blue_1…3.png` | 240 × 380 | 120, 356 | Same pine, ice-blue needles (Crystal Reach) |
| `birch` | `birch_1…4.png` | 340 × 420 | 170, 400 | Bare white birch, dark bark marks, snow on branches |
| `rocks` | `rock_1…5.png` | 128 × 104 | 64, 80 | Grey-blue boulder with snow cap |
| `bush` | `bush_1…4.png` | 140 × 100 | 70, 80 | Round evergreen bush, red winter berries, snow on top |
| `flowers` | `flowers_1…3.png` | 80 × 60 | 40, 44 | Tiny cluster of red winter roses poking from snow |
| `crystals` | `crystals_1…3.png` | 220 × 240 | 110, 208 | Cluster of 5–6 cyan-to-violet crystal shards in a snow mound |
| `cabins` | `cabin_1…5.png` | 492 × 436 | 246, 396 | Log cabin, front wall facing camera, door center, **two lit windows** left and right, thick snow roof, chimney on right roof slope |
| `lamp` | `lamp.png` | 72 × 208 | 36, 192 | Iron lamp post with lantern on top, snow cap |
| `crate` | `crate.png` | 88 × 96 | 44, 80 | Wooden crate, snow on lid |
| `barrel` | `barrel.png` | 80 × 100 | 40, 84 | Wooden barrel with iron bands, snow on lid |
| `snowman` | `snowman.png` | 120 × 168 | 60, 152 | Snowman, top hat, red scarf, stick arms, carrot nose |
| `sign` | `sign.png` | 120 × 140 | 60, 124 | Wooden notice board on a post |
| `firepit` | `firepit.png` | 220 × 120 | 110, 80 | Ring of stones with crossed logs — **no flames** (animated in code) |
| `gate` | `gate.png` | 380 × 340 | 190, 300 | Stone-pillar archway with wooden beam, red banner, two small hanging lanterns |
| `stone` | `study_stone.png` | 140 × 220 | 70, 196 | Standing runestone obelisk with a carved, faintly gold glyph of a trend line through dots |
| `owl` | `owl.png` | 120 × 200 | 60, 184 | Wise brown owl on a wooden perch post, tiny graduation cap, holding a small red book |
| `lectern` | `lectern.png` | 112 × 144 | 56, 128 | Wooden lectern on a post holding an open book |
| `ice` | `ice_shell.png` | 168 × 240 | 84, 208 | **Semi-transparent** ice shards that encase the study stone (overlay, ~60% opacity) |
| `cache` | `cache_closed.png` | 112 × 104 | 56, 84 | Small iron-banded wooden chest, gold lock with a blue rune, snow on lid |
| `cacheOpen` | `cache_open.png` | 112 × 104 | 56, 84 | Same chest, lid open, empty |
| `fgPine` | `fg_pine.png` | 640 × 1040 | 320, 1030 | Very dark navy pine **silhouette** (`#070E1C`), faint blue rim on the left edge — foreground depth |

### Prompts (add the style bible to each)

- **Pine:** *"a single tall snowy pine tree with four tiers of teal-green branches, snow resting on the upper-left of each tier, short brown trunk"* (for the variants, swap in *violet-purple needles* or *ice-blue needles*)
- **Birch:** *"a single bare white birch tree in winter, slender pale trunk with dark bark marks, branching crown, thin lines of snow on the branches"*
- **Cabin:** *"a small cozy log cabin, front wall facing the viewer with a round-top wooden door in the center and two warm yellow lit windows either side, thick soft snow covering the roof with small icicles, stone chimney on the right side of the roof, stone foundation"*
- **Study stone:** *"a tall standing runestone obelisk of blue-grey stone with a rounded top capped in snow, a carved rectangular panel showing a faint gold glyph of a straight trend line passing through scattered dots"*
- **Owl:** *"a friendly wise brown owl with big amber eyes perched on a short wooden post, wearing a tiny black graduation cap with a gold tassel, holding a small red book"*
- **Gate:** *"a wide stone archway made of two stacked-stone pillars capped in snow, joined by a wooden beam with a hanging red banner with a gold diamond emblem, two small lanterns hanging from the beam"*
- **Cache:** *"a small wooden treasure chest with iron bands and a gold lock set with a glowing blue rune, light snow on the curved lid"* (open version: *"…lid open, empty inside"*)
- **Lectern:** *"a wooden reading lectern on a single post holding an open book with handwritten pages and a red ribbon bookmark"*
- **Firepit:** *"a ring of grey stones around crossed split logs, unlit, no flames, light snow around the stones"*
- **Lamp post:** *"a slender black iron lamp post with a small square lantern on top, warm yellow glass, snow on the lantern roof"*
- Rocks, bushes, crates, barrels, snowman, sign, flowers, crystals: describe the object in one sentence using the table above.

## Player character (optional)

The player is drawn in code with smooth walk animation. Replacing it needs a **sprite sheet**, which AI tools find harder to keep consistent, so do this last.

- **Sheet:** 512 × 640 PNG = 4 columns × 4 rows of **128 × 160** frames.
- **Rows (top to bottom):** walking **down** (toward camera), **left**, **right**, **up** (away).
- **Columns:** a 4-frame walk cycle (contact, pass, contact, pass).
- **Feet** at about (64, 151) in every frame. Keep the character the same size in every frame.
- The character: a small chibi adventurer in a teal hooded cloak with a red scarf, carrying a small lantern.
- In `00_art.js`: `player:{file:'player.png', …}`.

## Ground textures (optional)

- One **seamless, tileable** 1024 × 1024 texture per area: `ground_hub.png`, `ground_woods.png`, `ground_hollow.png`, `ground_reach.png`.
- Top-down view of soft snow with subtle drifts, no objects, no strong features that would visibly repeat.
- Paths, cobblestones, the pond, footprints, and region tint are still drawn on top by the game.

## Checklist before committing art

- [ ] Transparent background (no white or magenta halo around the edges)
- [ ] Exact PNG size from the table; base sits on the anchor
- [ ] Same camera angle and light direction as the other assets
- [ ] No painted glow, bloom, or long shadows
- [ ] File listed in `src/content/00_art.js`, `build.py` re-run
