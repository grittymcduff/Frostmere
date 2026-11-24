/* ==========================================================================
   ART MANIFEST — optional painted art that replaces the procedural sprites.
   1. Put a transparent PNG in /assets (see ART_GUIDE.md for sizes/prompts).
   2. Add its file name to `files` below.  3. Run build.py.
   Anything left empty keeps the drawn-in-code art, so you can swap pieces in
   one at a time. Sizes are in world units; paint PNGs at 2× (or more) these.
   w,h  = how big the sprite is drawn in the world
   ox,oy = the anchor point inside it: where it touches the ground (base center)
   ========================================================================== */
const ART={
  base:'assets/',
  sprites:{
    // key        files (several = random variants)          w    h   ox   oy
    pines:     {files:[], multi:true, w:120, h:190, ox:60, oy:178},   // snowy pines (Signpost Woods + village)
    pinesV:    {files:[], multi:true, w:120, h:190, ox:60, oy:178},   // violet pines (Lantern Hollow)
    pinesB:    {files:[], multi:true, w:120, h:190, ox:60, oy:178},   // ice-blue pines (Crystal Reach)
    birch:     {files:[], multi:true, w:170, h:210, ox:85, oy:200},   // bare white birches
    rocks:     {files:[], multi:true, w:64,  h:52,  ox:32, oy:40},
    bush:      {files:[], multi:true, w:70,  h:50,  ox:35, oy:40},    // berry bushes
    flowers:   {files:[], multi:true, w:40,  h:30,  ox:20, oy:22},    // winter roses
    crystals:  {files:[], multi:true, w:110, h:120, ox:55, oy:104},
    cabins:    {files:[], multi:true, w:246, h:218, ox:123,oy:198,    // log cabins; lights/smoke use `info`
                info:{w:176,bodyH:74,roofH:98,windows:[[-53,-45],[53,-45]],chimney:[42,-146]}},
    lamp:      {files:[], w:36,  h:104, ox:18, oy:96},
    crate:     {files:[], w:44,  h:48,  ox:22, oy:40},
    barrel:    {files:[], w:40,  h:50,  ox:20, oy:42},
    snowman:   {files:[], w:60,  h:84,  ox:30, oy:76},
    sign:      {files:[], w:60,  h:70,  ox:30, oy:62},
    firepit:   {files:[], w:110, h:60,  ox:55, oy:40},                // stones + logs only; flames are animated in code
    gate:      {files:[], w:190, h:170, ox:95, oy:150},
    stone:     {files:[], w:70,  h:110, ox:35, oy:98},                // study stone
    owl:       {files:[], w:60,  h:100, ox:30, oy:92},                // Warden Quill on a perch
    lectern:   {files:[], w:56,  h:72,  ox:28, oy:64},                // waypoint
    ice:       {files:[], w:84,  h:120, ox:42, oy:104},               // frozen-stone overlay (semi-transparent)
    cache:     {files:[], w:56,  h:52,  ox:28, oy:42},                // closed supply cache
    cacheOpen: {files:[], w:56,  h:52,  ox:28, oy:42},
    fgPine:    {files:[], w:320, h:520, ox:160,oy:515},               // dark foreground silhouette
  },
  // Player sprite sheet: rows = down, left, right, up; `frames` walk frames per row.
  player:{file:'', fw:128, fh:160, frames:4, w:44, h:55, ox:22, oy:52},
  // Optional seamless ground textures (tile), one per area.
  ground:{hub:'', woods:'', hollow:'', reach:''}, groundScale:.5,
};
