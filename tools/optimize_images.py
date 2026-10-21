"""画像最適化: python -m pip install Pillow; python tools/optimize_images.py
元画像は assets-original/events/<event-id>/flyer.png, setlist.png に置く。
原本フォルダは公開対象から除外しておくことを推奨。
"""
from pathlib import Path
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parent.parent
SOURCE=ROOT/'assets-original'/'events'
DEST=ROOT/'assets'/'events'
for event in SOURCE.iterdir() if SOURCE.exists() else []:
    if not event.is_dir():continue
    for kind in ('flyer','setlist'):
        candidates=[p for p in event.iterdir() if p.stem.lower()==kind and p.suffix.lower() in ('.png','.jpg','.jpeg','.webp')]
        if not candidates:continue
        with Image.open(candidates[0]) as original:
            im=ImageOps.exif_transpose(original).convert('RGB')
            out=DEST/event.name;out.mkdir(parents=True,exist_ok=True)
            for label,width,quality in [('thumb',400,75),('full',1200,86)]:
                copy=im.copy();copy.thumbnail((width,99999),Image.Resampling.LANCZOS)
                path=out/f'{kind}-{label}.webp';copy.save(path,'WEBP',quality=quality,method=6)
                print(path.relative_to(ROOT),f'{path.stat().st_size/1024:.0f} KB',copy.size)
