# Baut ein Bild für den WhatsApp-Status (1080 × 1920, JPG) zu einem Motiv:
# Streifen Schwarz-Rot-Gold oben und unten, „Neues Motiv“, Titel in Rot, Motiv groß in der Mitte,
# darunter Hinweis auf Download und Shop und d-wie-demokratie.de.
# Aufruf im Projektordner:  python3 scripts/whatsapp-status.py 16      (auch mehrere Nummern: 15 16)
# Ergebnis: ~/Downloads/whatsapp-status-motiv-<nr>.jpg
# Titel kommt aus src/data/motive.ts, das Bild aus src/assets/motive/d-wie-demokratie-motiv-<nr>.png
# (erste Fassung; Durchsichtiges wird weiß).
import re, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
SCHWARZ, ROT, GOLD, WEISS = (0, 0, 0), (221, 0, 0), (255, 206, 0), (255, 255, 255)
SCHRIFT = '/System/Library/Fonts/Helvetica.ttc'  # index 1 = fett


def schrift(groesse, fett=True):
    return ImageFont.truetype(SCHRIFT, groesse, index=1 if fett else 0)


def titel_von(nr):
    ts = Path('src/data/motive.ts').read_text(encoding='utf-8')
    m = re.search(r"\bnr:\s*%d,\s*name:\s*'((?:[^'\\]|\\.)*)'" % nr, ts)
    if not m:
        sys.exit(f'Motiv {nr} nicht in src/data/motive.ts gefunden')
    return m.group(1).replace("\\'", "'")


def zeilen(d, text, font, breite):
    # bricht den Titel an Leerzeichen um, damit er in die Breite passt; bei zwei Zeilen möglichst gleich lang,
    # gern nach einem Satzzeichen („Hinschauen. Zuhören. / Mund aufmachen.“)
    if d.textlength(text, font=font) <= breite:
        return [text]
    woerter = text.split()
    beste = None
    for i in range(1, len(woerter)):
        a, b = ' '.join(woerter[:i]), ' '.join(woerter[i:])
        la, lb = d.textlength(a, font=font), d.textlength(b, font=font)
        if max(la, lb) > breite:
            continue
        wert = abs(la - lb) - (200 if a[-1] in '.,!?:;' else 0)
        if beste is None or wert < beste[0]:
            beste = (wert, [a, b])
    if beste:
        return beste[1]
    aktuell, ergebnis = '', []
    for w in woerter:
        probe = f'{aktuell} {w}'.strip()
        if d.textlength(probe, font=font) <= breite or not aktuell:
            aktuell = probe
        else:
            ergebnis.append(aktuell)
            aktuell = w
    ergebnis.append(aktuell)
    return ergebnis


def bauen(nr):
    im = Image.new('RGB', (W, H), WEISS)
    d = ImageDraw.Draw(im)
    for i, farbe in enumerate([SCHWARZ, ROT, GOLD]):
        d.rectangle([0, i * 18, W, (i + 1) * 18], fill=farbe)
        d.rectangle([0, H - 54 + i * 18, W, H - 54 + (i + 1) * 18], fill=farbe)

    def mitte(y, text, font, farbe=SCHWARZ):
        d.text(((W - d.textlength(text, font=font)) / 2, y), text, font=font, fill=farbe)

    # Kopf: „Neues Motiv“ und der Titel (höchstens zwei Zeilen, sonst kleiner)
    mitte(300, 'Neues Motiv', schrift(84))
    groesse = 58
    while True:
        tz = zeilen(d, titel_von(nr), schrift(groesse), 960)
        if len(tz) <= 2 or groesse <= 40:
            break
        groesse -= 4
    y = 410 if len(tz) == 1 else 395
    for z in tz:
        mitte(y, z, schrift(groesse), ROT)
        y += round(groesse * 1.2)

    # Motiv: so groß wie möglich im Feld 900 × 900 (unter dem Titel, über dem Text unten)
    m = Image.open(f'src/assets/motive/d-wie-demokratie-motiv-{nr}.png').convert('RGBA')
    m = m.crop(m.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())
    feld_y, feld = 560 if len(tz) == 1 else 590, 900
    s = min(feld / m.width, feld / m.height)
    mw, mh = round(m.width * s), round(m.height * s)
    m = m.resize((mw, mh), Image.LANCZOS)
    im.paste(m, ((W - mw) // 2, feld_y + (feld - mh) // 2), m)

    # Fuß
    mitte(1540, 'Kostenlos herunterladen', schrift(48, False))
    mitte(1605, 'oder im Non-Profit-Shop bestellen:', schrift(48, False))
    mitte(1690, 'd-wie-demokratie.de', schrift(64))

    ziel = Path.home() / 'Downloads' / f'whatsapp-status-motiv-{nr}.jpg'
    im.save(ziel, quality=90)
    print(ziel)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit('Aufruf: python3 scripts/whatsapp-status.py <Motivnummer> [weitere Nummern]')
    for n in sys.argv[1:]:
        bauen(int(n))
