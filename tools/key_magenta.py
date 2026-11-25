#!/usr/bin/env python3
"""Key out a solid magenta background (and its magenta-tinted drop shadow) from
a JPEG/PNG, then save an RGBA PNG for prep_art.py / crack frames.
  python3 tools/key_magenta.py in.jpg out.png"""
import sys, numpy as np
from PIL import Image
a=np.array(Image.open(sys.argv[1]).convert('RGB')).astype(np.float32)
r,g,b=a[...,0],a[...,1],a[...,2]
mag=np.minimum(r,b)-g                       # magenta-ness: bg ~ +250, ice/snow <= ~20
alpha=np.clip(1-(mag-30)/70,0,1)
# un-mix the magenta from semi-transparent edge pixels
bg=np.array([255,0,255],np.float32)
al=alpha[...,None]
rgb=np.where(al>0.02,(a-(1-al)*bg)/np.maximum(al,0.02),0)
out=np.dstack([np.clip(rgb,0,255),alpha*255]).astype(np.uint8)
Image.fromarray(out,'RGBA').save(sys.argv[2])
