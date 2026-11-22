# Baut die Querformate für den Slider der Startseite: src/assets/slider/motiv-<nr>.jpg (1800 × 1200),
# Motiv so groß wie möglich auf Weiß, darunter „Motiv <nr> · im Shop“ (ohne Shop-Link nur „Motiv <nr>“).
# Aufruf im Projektordner: python3 scripts/slider-querformate.py
import re, glob
from PIL import Image, ImageDraw, ImageFont
W,H=1800,1200
src=open('src/data/motive.ts').read()
mitShop=set(int(n) for n in re.findall(r"nr: (\d+),\n(?:(?!\n\t\t\{|nr:).)*?\n\t\tshop:",src,re.S))
f2=ImageFont.truetype('/Library/Fonts/Muli-Bold.ttf',52)
nummern=sorted(int(re.search(r'motiv-(\d+)\.png$',p).group(1)) for p in glob.glob('src/assets/motive/d-wie-demokratie-motiv-*.png') if re.search(r'motiv-\d+\.png$',p))
for n in nummern:
    im=Image.new('RGB',(W,H),(255,255,255))
    a=Image.open(f'src/assets/motive/d-wie-demokratie-motiv-{n}.png').convert('RGBA')
    a=a.crop(a.getchannel('A').point(lambda v:255 if v>8 else 0).getbbox())
    t2=f'Motiv {n} · im Shop' if n in mitShop else f'Motiv {n}'
    d=ImageDraw.Draw(im); b2=d.textbbox((0,0),t2,font=f2)
    top,gap,bottom=40,35,50
    oh=H-top-gap-(b2[3]-b2[1])-bottom
    ow=round(oh*a.width/a.height)
    if ow>W-80: ow=W-80; oh=round(ow*a.height/a.width)
    a=a.resize((ow,oh),Image.LANCZOS)
    y0=top+(H-top-gap-(b2[3]-b2[1])-bottom-oh)//2
    im.paste(a,((W-ow)//2,y0),a)
    y=y0+oh+gap
    d.text(((W-(b2[2]-b2[0]))//2-b2[0],y-b2[1]),t2,font=f2,fill=(0,0,0))
    im.save(f'src/assets/slider/motiv-{n}.jpg',quality=88)
    print(n,t2,ow,oh)
