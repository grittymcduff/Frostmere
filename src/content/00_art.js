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
    pines:     {files:['pine_1.png','pine_2.png','pine_3.png','pine_4.png','pine_5.png','pine_6.png'], multi:true, w:120, h:190, ox:60, oy:178},   // snowy pines (Signpost Woods + village)
    pinesV:    {files:['pine_violet_1.png','pine_violet_2.png'], multi:true, w:120, h:190, ox:60, oy:178},   // violet pines (Lantern Hollow)
    pinesB:    {files:['pine_blue_1.png','pine_blue_2.png'], multi:true, w:120, h:190, ox:60, oy:178},   // ice-blue pines (Crystal Reach)
    birch:     {files:['birch_1.png','birch_2.png','birch_3.png'], multi:true, w:170, h:210, ox:85, oy:200},   // bare white birches
    rocks:     {files:['rock_1.png','rock_2.png','rock_3.png'], multi:true, w:64,  h:52,  ox:32, oy:40},
    bush:      {files:['bush_1.png','bush_2.png','bush_3.png'], multi:true, w:70,  h:50,  ox:35, oy:40},    // berry bushes
    flowers:   {files:['flowers_1.png','flowers_2.png'], multi:true, w:40,  h:30,  ox:20, oy:22},    // winter roses
    crystals:  {files:['crystals_1.png','crystals_2.png','crystals_3.png'], multi:true, w:110, h:120, ox:55, oy:104},
    cabins:    {files:['cabin_1.png','cabin_3.png','cabin_4.png','cabin_5.png'], multi:true, w:246, h:218, ox:123,oy:198,
                info:{w:176,bodyH:74,roofH:98,windows:[[-53,-45],[53,-45]],chimney:[42,-146]},   // default
                // per-file window/chimney positions (from tools/prep_art.py) so glow + smoke line up
                infos:[{w:154,bodyH:74,roofH:110,windows:[[-63,-82],[0,-56]],chimney:[45,-180]},
                       {w:176,bodyH:74,roofH:110,windows:[[-54,-118],[-15,-80]],chimney:[59,-181]},
                       {w:151,bodyH:74,roofH:110,windows:[[-61,-79],[0,-55]],chimney:[43,-175]},
                       {w:153,bodyH:74,roofH:110,windows:[[-62,-81],[1,-56]],chimney:[45,-180]}]},
    lamp:      {files:['lamp.png'], w:36,  h:104, ox:18, oy:96},
    crate:     {files:['crate.png'], w:44,  h:48,  ox:22, oy:40},
    barrel:    {files:['barrel.png'], w:40,  h:50,  ox:20, oy:42},
    snowman:   {files:['snowman.png'], w:60,  h:84,  ox:30, oy:76},
    sign:      {files:['sign.png'], w:60,  h:70,  ox:30, oy:62},
    firepit:   {files:['firepit.png'], w:110, h:80,  ox:55, oy:50},                // stones + logs only; flames are animated in code
    gate:      {files:['gate.png'], w:190, h:170, ox:95, oy:150},
    stone:     {files:['study_stone.png'], w:70,  h:110, ox:35, oy:98},                // study stone
    owl:       {files:['owl.png'], w:60,  h:100, ox:30, oy:92},                // Warden Quill on a perch
    lectern:   {files:['lectern.png'], w:56,  h:72,  ox:28, oy:64},                // waypoint
    ice:       {files:['ice_shell.png'], w:84,  h:120, ox:42, oy:104},               // frozen-stone overlay (semi-transparent)
    cache:     {files:['cache_closed.png'], w:56,  h:52,  ox:28, oy:42},                // closed supply cache
    cacheOpen: {files:['cache_open.png'], w:56,  h:52,  ox:28, oy:42},
    fgPine:    {files:['fg_pine.png'], w:320, h:520, ox:160,oy:515},               // dark foreground silhouette
  },
  // Player sprite sheet: rows = down, left, right, up; `frames` walk frames per row.
  player:{file:'', fw:128, fh:160, frames:4, w:44, h:55, ox:22, oy:52},
  // Optional seamless ground textures (tile), one per area.
  ground:{hub:'', woods:'', hollow:'', reach:''}, groundScale:.5,
};
