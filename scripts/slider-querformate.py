# Baut die Querformate für den Slider der Startseite: src/assets/slider/motiv-<nr>.jpg (1800 × 1200),
# Motiv so groß wie möglich auf Weiß, ohne Text (die Zeile darunter steht in src/pages/index.astro).
# Aufruf im Projektordner: python3 scripts/slider-querformate.py
import re, glob
from PIL import Image
W, H, RAND = 1800, 1200, 30
nummern = sorted(int(m.group(1)) for p in glob.glob('src/assets/motive/d-wie-demokratie-motiv-*.png')
                 if (m := re.search(r'motiv-(\d+)\.png$', p)))
for n in nummern:
    im = Image.new('RGB', (W, H), (255, 255, 255))
    a = Image.open(f'src/assets/motive/d-wie-demokratie-motiv-{n}.png').convert('RGBA')
    a = a.crop(a.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())
    s = min((W - 2 * RAND) / a.width, (H - 2 * RAND) / a.height)
    ow, oh = round(a.width * s), round(a.height * s)
    a = a.resize((ow, oh), Image.LANCZOS)
    im.paste(a, ((W - ow) // 2, (H - oh) // 2), a)
    im.save(f'src/assets/slider/motiv-{n}.jpg', quality=88)
    print(n, ow, oh)
