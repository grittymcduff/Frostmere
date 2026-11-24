#!/usr/bin/env python3
"""Bundle src/ into a single self-contained index.html (same workflow as Dino Quest)."""
from pathlib import Path
root=Path(__file__).parent; src=root/'src'
js=[*sorted((src/'js').glob('0[0-7]_*.js')),*sorted((src/'content').glob('*.js')),*sorted((src/'js').glob('0[8-9]_*.js'))]
html=f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>Frostmere — Study Quest</title>
<style>{(src/'style.css').read_text()}</style>
</head>
<body>
{(src/'body.html').read_text()}
<script>
{{
{chr(10).join(f'/* ==== {p.relative_to(src)} ==== */'+chr(10)+p.read_text() for p in js)}
}}
</script>
</body>
</html>
"""
(root/'index.html').write_text(html)
print('built index.html', len(html)//1024, 'KB from', len(js), 'files')
