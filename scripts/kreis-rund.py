# Aufruf: python3 scripts/kreis-rund.py <eingabe.png> <ausgabe.png>
# Ersetzt den welligen äußeren Ring eines runden KI-Motivs durch einen exakt runden Ring gleicher Stärke (2026-11-23, Motive 3–10, 12 für die Website).
# Macht den äußeren Ring eines runden Motivs exakt kreisrund.
import sys, math
from PIL import Image, PngImagePlugin
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src); info = dict(im.info); im = im.convert('RGBA')
W, H = im.size; px = im.load()
lum = lambda p: 0.299*p[0]+0.587*p[1]+0.114*p[2]
# grober Mittelpunkt aus der Begrenzung
l,t,r,b = im.getchannel('A').point(lambda v:255 if v>128 else 0).getbbox()
cx0, cy0 = (l+r)/2, (t+b)/2
N = 720
def aussen(cx, cy):
    pts=[]
    for k in range(N):
        a=2*math.pi*k/N; ca,sa=math.cos(a),math.sin(a)
        rr=None
        for s in range(int(min(W,H)*0.75), 0, -1):
            x=int(cx+s*ca); y=int(cy+s*sa)
            if 0<=x<W and 0<=y<H and px[x,y][3]>128: rr=s; break
        pts.append((cx+rr*ca, cy+rr*sa, rr))
    return pts
pts = aussen(cx0, cy0)
# Kreis-Anpassung (Kasa): x²+y² + D x + E y + F = 0
Sx=Sy=Sxx=Syy=Sxy=Sz=Sxz=Syz=0.0; n=len(pts)
for x,y,_ in pts:
    z=x*x+y*y; Sx+=x; Sy+=y; Sxx+=x*x; Syy+=y*y; Sxy+=x*y; Sz+=z; Sxz+=x*z; Syz+=y*z
A=[[Sxx,Sxy,Sx],[Sxy,Syy,Sy],[Sx,Sy,n]]; B=[-Sxz,-Syz,-Sz]
def det(m): return (m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]))
d=det(A); sol=[]
for i in range(3):
    M=[row[:] for row in A]
    for j in range(3): M[j][i]=B[j]
    sol.append(det(M)/d)
D,E,F=sol; cx,cy=-D/2,-E/2; R=math.sqrt(cx*cx+cy*cy-F)
pts = aussen(cx, cy)
radien=[p[2] for p in pts]
# Ringstärke: dunkle Pixel vom Außenrand nach innen
dicken=[]
for k in range(0,N,4):
    a=2*math.pi*k/N; ca,sa=math.cos(a),math.sin(a); s=radien[k]; c=0
    while s>0:
        p=px[int(cx+s*ca),int(cy+s*sa)]
        if p[3]>128 and lum(p)<110: c+=1; s-=1
        elif c==0: s-=1
        else: break
    dicken.append(c)
dicken.sort(); T=dicken[len(dicken)//2]
dunkel=[px[int(cx+(radien[k]-T/2)*math.cos(2*math.pi*k/N)),int(cy+(radien[k]-T/2)*math.sin(2*math.pi*k/N))] for k in range(0,N,8)]
dunkel.sort(key=lum); ring=dunkel[len(dunkel)//2][:3]
abw=max(abs(x-R) for x in radien)
# Innenkante des alten Rings je Richtung (dunkler Lauf von außen nach innen, mit Kantenglättung)
innen=[]
for k in range(N):
    a_=2*math.pi*k/N; ca,sa=math.cos(a_),math.sin(a_); s=radien[k]; gesehen=False; lauf=0
    while s>radien[k]-3*T:
        p=px[int(cx+s*ca),int(cy+s*sa)]
        if p[3]>128 and lum(p)<200: gesehen=True; lauf=0
        elif gesehen:
            lauf+=1
            if lauf>=2: break
        s-=1
    innen.append(max(s+lauf, radien[k]-int(1.6*T)-3))  # nie tiefer als die übliche Ringstärke (Inhalt am Ring schützen)

print(f'Mitte {cx:.0f},{cy:.0f} R {R:.0f} Ring {T} Abweichung max {abw:.0f}px Ringfarbe {ring}')
innen_weiss=(255,255,255)
# neues Bild: Fläche bis R+abw+4 bearbeiten
r_in_neu=R-T
for y in range(max(0,int(cy-R-abw-6)), min(H,int(cy+R+abw+6))):
    for x in range(max(0,int(cx-R-abw-6)), min(W,int(cx+R+abw+6))):
        dx=x+0.5-cx; dy=y+0.5-cy; rr=math.hypot(dx,dy)
        if rr < r_in_neu - abw - 2*T - 6: continue
        k=int((math.atan2(dy,dx)%(2*math.pi))/(2*math.pi)*N)%N
        alt_aussen=radien[k]
        aussen_cov=max(0.0,min(1.0,R-rr+0.5))      # Anteil innerhalb des neuen Außenrands
        ring_cov=max(0.0,min(1.0,rr-r_in_neu+0.5))  # Anteil außerhalb des neuen Innenrands
        if aussen_cov<=0: px[x,y]=(0,0,0,0); continue
        p=px[x,y]
        if ring_cov>0:
            # im neuen Ring (mit Kantenglättung zur Innenseite)
            base = p if rr<innen[k]-3 else (innen_weiss+(255,))
            base = base if base[3]>0 else (innen_weiss+(255,))
            c=tuple(int(ring[i]*ring_cov+base[i]*(1-ring_cov)) for i in range(3))
            px[x,y]=c+(int(255*aussen_cov),)
        else:
            # innerhalb des neuen Rings: Reste des alten Rings weiß machen
            if rr>=innen[k]-3 or p[3]<255:
                px[x,y]=innen_weiss+(255,)
q=im.quantize(256,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE).convert('RGBA')
pi=PngImagePlugin.PngInfo()
for k_,v in info.items():
    if isinstance(v,str): pi.add_itxt(k_,v)
q.save(dst,optimize=True,icc_profile=info.get('icc_profile'),pnginfo=pi)
