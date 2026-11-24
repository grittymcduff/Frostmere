#!/usr/bin/env python3
"""Clean up AI-generated sprites before they go into assets/.

  python3 tools/prep_art.py <kind> <in.png> [<out.png>]

kind = a key from src/content/00_art.js (pines, cabins, owl, stone, ...).

What it does:
  1. Removes the magenta/pink fringe left by background removal
     (neutralizes the color cast; drops faint fringe pixels).
  2. Re-anchors the art so its base sits exactly on the anchor point,
     centered, and (for trees) scales undersized art up to a standard height.
  3. For cabins, finds the lit windows and chimney and prints an `info`
     block for 00_art.js so window glow and chimney smoke line up.
Requires Pillow and NumPy.
"""
import sys, json
import numpy as np
from PIL import Image

SPEC = {  # PNG size (2x) and anchor, mirrors src/content/00_art.js
  'pines':(240,380,120,356),'pinesV':(240,380,120,356),'pinesB':(240,380,120,356),
  'birch':(340,420,170,400),'rocks':(128,104,64,80),'bush':(140,100,70,80),'flowers':(80,60,40,44),
  'crystals':(220,240,110,208),'cabins':(492,436,246,396),'lamp':(72,208,36,192),'crate':(88,96,44,80),
  'barrel':(80,100,40,84),'snowman':(120,168,60,152),'sign':(120,140,60,124),'firepit':(220,120,110,80),
  'gate':(380,340,190,300),'stone':(140,220,70,196),'owl':(120,200,60,184),'lectern':(112,144,56,128),
  'ice':(168,240,84,208),'cache':(112,104,56,84),'cacheOpen':(112,104,56,84),'fgPine':(640,1040,320,1030),
}
TREE_H = {'pines':343,'pinesV':343,'pinesB':343}  # standard content height for trees

def defringe(a):
    a = a.astype(np.float32)
    r, g, b, al = a[...,0], a[...,1], a[...,2], a[...,3]
    mag = np.minimum(r, b) - g                      # how magenta a pixel is
    cast = (mag > 12) & (al > 0)
    faint = cast & (al < 140)
    a[faint, 3] = 0                                 # drop faint pink halo pixels
    keep = cast & ~faint
    k = np.clip((mag[keep] - 8) / 20, 0, 1)         # neutralize the cast toward cool grey
    lum = 0.3*r[keep] + 0.59*g[keep] + 0.11*b[keep]
    a[keep,0] = r[keep]*(1-k) + (lum*.86)*k
    a[keep,1] = g[keep]*(1-k) + (lum*.92)*k
    a[keep,2] = b[keep]*(1-k) + (lum*1.05)*k
    return np.clip(a, 0, 255).astype(np.uint8)

def reanchor(img, kind):
    W, H, ax, ay = SPEC[kind]
    a = np.array(img)
    al = a[...,3]
    ys, xs = np.where(al > 40)
    top, bot, left, right = ys.min(), ys.max(), xs.min(), xs.max()
    crop = img.crop((left, top, right+1, bot+1))
    scale = 1.0
    if kind in TREE_H and (bot-top+1) < TREE_H[kind]*0.95:
        scale = TREE_H[kind] / (bot-top+1)
    if scale != 1.0:
        crop = crop.resize((round(crop.width*scale), round(crop.height*scale)), Image.LANCZOS)
    c = np.array(crop)[...,3]
    if kind in TREE_H or kind in ('birch','lamp','sign','owl','lectern'):   # center on the trunk/post
        rows = c[max(0, c.shape[0]-int(c.shape[0]*.12)):]
        bx = np.where(rows.max(axis=0) > 40)[0]
        base_cx = (bx.min()+bx.max())/2 if len(bx) else crop.width/2
    else:
        base_cx = crop.width/2
    out = Image.new('RGBA', (W, H), (0,0,0,0))
    px, py = round(ax - base_cx), round(ay - crop.height + 1)
    out.alpha_composite(crop, (max(0,min(W-crop.width,px)), max(0,py)))
    return out

def cabin_info(img):
    W, H, ax, ay = SPEC['cabins']
    a = np.array(img).astype(int); r, g, b, al = a[...,0], a[...,1], a[...,2], a[...,3]
    try:
        from scipy import ndimage
    except ImportError:
        return None
    yellow = (r > 150) & (g > 115) & (b < 120) & (r-b > 70) & (al > 200)
    yellow = ndimage.binary_closing(yellow, iterations=6)   # join panes split by mullions
    lab, n = ndimage.label(yellow)
    comps = sorted(((len(np.where(lab==i)[0]), i) for i in range(1, n+1)), reverse=True)
    wins = []
    for size, i in comps[:3]:
        ys, xs = np.where(lab == i)
        if size > 300: wins.append(((xs.mean()-ax)/2, (ys.mean()-ay)/2))
    grey = (abs(r-g) < 18) & (abs(g-b) < 22) & (r > 60) & (r < 150) & (al > 200)
    grey[int(H*.45):] = False
    lab, n = ndimage.label(grey)
    best = None
    for i in range(1, n+1):
        ys, xs = np.where(lab == i)
        if len(ys) > 150 and (best is None or len(ys) > best[0]): best = (len(ys), xs.mean(), ys.min())
    ys, xs = np.where(al > 40)
    info = {'w': round((xs.max()-xs.min())/2*.78), 'bodyH': 74, 'roofH': round((ay-ys.min())/2-80),
            'windows': [[round(x), round(y)] for x, y in sorted(wins)][:4]}
    if best: info['chimney'] = [round((best[1]-ax)/2), round((best[2]-ay)/2)]
    return info

if __name__ == '__main__':
    kind, src = sys.argv[1], sys.argv[2]
    dst = sys.argv[3] if len(sys.argv) > 3 else src
    img = Image.fromarray(defringe(np.array(Image.open(src).convert('RGBA'))))
    img = reanchor(img, kind)
    img.save(dst, optimize=True)
    if kind == 'cabins':
        print(json.dumps(cabin_info(img)))
