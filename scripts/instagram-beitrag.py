# Baut ein Bild für einen Instagram-Beitrag (1080 × 1350, Hochformat 4:5, JPG) zu einem Motiv:
# Streifen Schwarz-Rot-Gold oben und unten, Motiv groß in der Mitte, darunter der Hinweis auf Download, Shop
# und den Link im Profil. Kein Titel und keine Adresse extra: beides steht schon im Motiv (Titel kommt in den Text).
# Alles Wichtige liegt in der Mitte, damit auch der 3:4-Ausschnitt im Profilraster passt.
# Aufruf im Projektordner:  python3 scripts/instagram-beitrag.py 17      (auch mehrere Nummern: 16 17)
# Ergebnis: ~/Downloads/instagram-motiv-<nr>.jpg
# Titel kommt aus src/data/motive.ts, das Bild aus src/assets/motive/d-wie-demokratie-motiv-<nr>.png
# (erste Fassung; Durchsichtiges wird weiß). Gemeinsame Teile kommen aus scripts/whatsapp-status.py.
import importlib.util, sys
from pathlib import Path
from PIL import Image, ImageDraw

spec = importlib.util.spec_from_file_location('wa', Path(__file__).with_name('whatsapp-status.py'))
wa = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wa)

W, H = 1080, 1350


def bauen(nr):
    im = Image.new('RGB', (W, H), wa.WEISS)
    d = ImageDraw.Draw(im)
    for i, farbe in enumerate([wa.SCHWARZ, wa.ROT, wa.GOLD]):
        d.rectangle([0, i * 14, W, (i + 1) * 14], fill=farbe)
        d.rectangle([0, H - 42 + i * 14, W, H - 42 + (i + 1) * 14], fill=farbe)

    def mitte(y, text, font, farbe=wa.SCHWARZ):
        d.text(((W - d.textlength(text, font=font)) / 2, y), text, font=font, fill=farbe)

    # Motiv: so groß wie möglich im Feld zwischen den Streifen und dem Hinweis unten
    m = Image.open(f'src/assets/motive/d-wie-demokratie-motiv-{nr}.png').convert('RGBA')
    m = m.crop(m.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())
    oben, feld_h, feld_b = 95, 1000, 980
    s = min(feld_b / m.width, feld_h / m.height)
    mw, mh = round(m.width * s), round(m.height * s)
    m = m.resize((mw, mh), Image.LANCZOS)
    im.paste(m, ((W - mw) // 2, oben + (feld_h - mh) // 2), m)

    mitte(1135, 'Kostenlos herunterladen', wa.schrift(46, False))
    mitte(1192, 'oder im Non-Profit-Shop bestellen', wa.schrift(46, False))
    mitte(1252, 'Link im Profil', wa.schrift(46), wa.ROT)

    ziel = Path.home() / 'Downloads' / f'instagram-motiv-{nr}.jpg'
    im.save(ziel, quality=92)
    print(ziel)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit('Aufruf: python3 scripts/instagram-beitrag.py <Motivnummer> [weitere Nummern]')
    for n in sys.argv[1:]:
        bauen(int(n))
