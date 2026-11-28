# Baut die Einzelbilder (JPG) für das Hahn-Video, 24 Bilder/s.
# Aufruf: python3 reel_hahn.py reel   -> Instagram-Reel 1080 × 1920 mit Streifen und Werbetext (Ordner reel-hahn)
#         python3 reel_hahn.py web    -> Website 1200 × 800, nur das Abzeichen auf Weiß wie im Startseiten-Bild (Ordner web-hahn)
import random, math, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops, ImageMath, ImageFont

S = Path('/private/tmp/claude-501/-Users-klauswolf-d-wie-demokratie/3810fdf8-23c3-4d3a-aa65-4fbdeaefef69/scratchpad')
M = Path.home() / 'Library/Mobile Documents/com~apple~CloudDocs/Affinity/D wie Demokratie/Motive/Motiv 16 – Hahn'
FORMAT = sys.argv[1] if len(sys.argv) > 1 else 'reel'
OUT = S / ('web-hahn' if FORMAT == 'web' else 'reel-hahn')
OUT.mkdir(exist_ok=True)
for f in OUT.glob('*.jpg'):
    f.unlink()

W, H = (1200, 800) if FORMAT == 'web' else (1080, 1920)
SCHWARZ, ROT, GOLD, WEISS = (0, 0, 0), (221, 0, 0), (255, 206, 0), (255, 255, 255)
# Layout: Abzeichen und Text als Block in der Bildmitte, sodass alles auch im quadratischen Ausschnitt
# (y 420–1500), im Feed (4:5) und im Profilraster (3:4) ganz zu sehen ist und im Vollbild über
# Beschreibung und Knöpfen bleibt
B = 840                       # Größe des Abzeichens im Reel (so groß wie möglich)
X0, Y0 = (W - B) // 2, 460    # linke obere Ecke des Abzeichens
if FORMAT == 'web':           # wie scripts/slider-querformate.py: so groß wie möglich, 20 px Rand
    B = H - 40
    X0, Y0 = (W - B) // 2, 20
k = B / 4000
SKALA, OX, OY = 3.7241, 236.4, 585.7   # Videobild (960) -> Motiv (4000)

# Pegel des Krähens (0,1-s-Schritte aus der Tonspur), 0..1
PEGEL = [5722, 3586, 7097, 4692, 7005, 6779, 6439, 7036, 7275, 6591, 5688, 4392, 6628, 7805, 7416,
         5946, 4803, 4330, 4650, 5383, 4601, 2913, 1809, 242, 59, 48, 41, 26, 18, 9]


def pegel(t):
    i = t * 10
    a = int(i)
    if a >= len(PEGEL) - 1:
        return 0.0
    v = PEGEL[a] + (PEGEL[a + 1] - PEGEL[a]) * (i - a)
    return min(1.0, v / 7800)


def farbe_zu_alpha(im):
    # Weiß wird durchsichtig, Farben bleiben (wie „Farbe zu Alpha“ in GIMP, Näherung)
    r, g, b = im.convert('RGB').split()
    mn = ImageChops.darker(ImageChops.darker(r, g), b)
    a = ImageChops.invert(mn)
    def kanal(c):
        return ImageMath.eval('convert(255 - (255 - c) * 255 / max(a, 1), "L")', c=c, a=a)
    return Image.merge('RGBA', (kanal(r), kanal(g), kanal(b), a))


ring = Image.open(M / '16-ring-unten.png').convert('RGBA').resize((B, B), Image.LANCZOS)
ring = farbe_zu_alpha(ring)
schrift = Image.open(M / '16-schrift-oben.png').convert('RGBA').resize((B, B), Image.LANCZOS)
motiv = Image.open('/Users/klauswolf/d-wie-demokratie/src/assets/motive/d-wie-demokratie-motiv-16.png').convert('RGBA').resize((B, B), Image.LANCZOS)

# Innenkreis (Maske für den Hahn): Innenkante des goldenen Rings
R_INNEN = 1921 * k
maske = Image.new('L', (B * 4, B * 4), 0)
ImageDraw.Draw(maske).ellipse([(B * 2 - R_INNEN * 4), (B * 2 - R_INNEN * 4), (B * 2 + R_INNEN * 4), (B * 2 + R_INNEN * 4)], fill=255)
maske = maske.resize((B, B), Image.LANCZOS)

vgross = round(960 * SKALA * k)
vframes = sorted((S / 'hahn-frames').glob('v*.png'))
cache = {}


def videobild(i):
    if i not in cache:
        cache[i] = Image.open(vframes[i]).convert('RGB').resize((vgross, vgross), Image.LANCZOS)
    return cache[i]


def schrift_fon(size, fett=True):
    return ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', size, index=1 if fett else 0)


grund = Image.new('RGB', (W, H), WEISS)
d = ImageDraw.Draw(grund)
for i, farbe in (enumerate([SCHWARZ, ROT, GOLD]) if FORMAT == 'reel' else []):
    d.rectangle([0, i * 14, W, (i + 1) * 14], fill=farbe)
    d.rectangle([0, H - 42 + i * 14, W, H - 42 + (i + 1) * 14], fill=farbe)
def mitte(y, text, font, farbe=SCHWARZ):
    d.text(((W - d.textlength(text, font=font)) / 2, y), text, font=font, fill=farbe)
TITEL = 'Zeig Flagge für unsere Demokratie!'
ZEILE = 'Motive downloaden · T-Shirts bestellen'
LINK = 'd-wie-demokratie.de'
if FORMAT == 'reel':
    y = Y0 + B + 22
    mitte(y, TITEL, schrift_fon(42))
    y += 56
    mitte(y, ZEILE, schrift_fon(36, False))
    y += 50
    mitte(y, LINK, schrift_fon(40), ROT)
    print('Textblock endet bei y =', y + 44)

rnd = random.Random(16)


def abzeichen(vi, staerke):
    a = Image.new('RGBA', (B, B), WEISS + (255,))
    v = Image.new('RGBA', (B, B), (0, 0, 0, 0))
    v.paste(videobild(vi), (round(OX * k), round(OY * k)))
    a.paste(v, (0, 0), ImageChops.multiply(maske, v.getchannel('A')))
    a.alpha_composite(ring)
    if staerke > 0.02:
        winkel = rnd.uniform(-1, 1) * 0.9 * staerke
        amp = 4.5 * B / 840
        dx, dy = rnd.uniform(-1, 1) * amp * staerke, rnd.uniform(-1, 1) * amp * staerke
        s = schrift.rotate(winkel, resample=Image.BICUBIC, center=(B / 2, B / 2), translate=(dx, dy))
    else:
        s = schrift
    a.alpha_composite(s)
    return a


n = 0


def speichern(a):
    global n
    im = grund.copy()
    im.paste(a.convert('RGB'), (X0, Y0), maske_kreis)
    im.save(OUT / f'r{n:04d}.jpg', quality=93)
    n += 1


# Abzeichen als Kreis einsetzen (außen bleibt der weiße Grund)
maske_kreis = Image.new('L', (B * 4, B * 4), 0)
ImageDraw.Draw(maske_kreis).ellipse([0, 0, B * 4 - 1, B * 4 - 1], fill=255)
maske_kreis = maske_kreis.resize((B, B), Image.LANCZOS)

VOR = list(range(73))
ZURUECK = list(range(72, -1, -2))  # doppelt so schnell zurück

kraeh_starts = []   # (Startzeit, Länge) des Tons
# Schrei 1 und 2: vorwärts (kräht, beruhigt sich), dann schnell zurück (holt aus)
for runde in range(2):
    kraeh_starts.append((n / 24, 2.9))
    for i in VOR:
        speichern(abzeichen(i, pegel(i / 24)))
    if runde == 0:
        for i in ZURUECK:
            speichern(abzeichen(i, 0))
# Schrei 3: in normalem Tempo rückwärts aus der Ruhe in die Krähpose, der Schrei endet mit dem letzten Bild
start3 = n / 24
LAENGE3 = 2.2
ton3 = start3 + len(VOR) / 24 - LAENGE3
kraeh_starts.append((ton3, LAENGE3))
for k_, i in enumerate(range(72, -1, -1)):
    t = k_ / 24 + start3 - ton3
    speichern(abzeichen(i, pegel(t) if t >= 0 else 0))
# Schluss: endet mit dem letzten Rückwärts-Bild in der Ausgangspose (Schnabel offen, Bein gehoben)
print('Bilder', n, 'Dauer', round(n / 24, 2)); print('TON', ' '.join(f'{a:.4f}:{b}' for a, b in kraeh_starts))
