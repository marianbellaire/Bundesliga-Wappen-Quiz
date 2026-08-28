"""Erzeugt einfache App-Icons (Fußball-Motiv) fürs Wappen-Quiz, ohne externe Assets."""
from PIL import Image, ImageDraw
import math, os

OUT = os.path.join(os.path.dirname(__file__), "..", "icons")
os.makedirs(OUT, exist_ok=True)

def draw_ball(draw, cx, cy, r):
    # Weißer Ball
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill="#ffffff", outline="#1b2b34", width=max(2, int(r // 22)))
    # zentrales schwarzes Fünfeck
    pent = []
    for i in range(5):
        ang = -math.pi / 2 + i * 2 * math.pi / 5
        pent.append((cx + r * 0.34 * math.cos(ang), cy + r * 0.34 * math.sin(ang)))
    draw.polygon(pent, fill="#1b2b34")
    # umliegende Fünfecke (angedeutet als Linien vom Zentrum-Fünfeck nach außen)
    for i in range(5):
        ang = -math.pi / 2 + i * 2 * math.pi / 5
        x1 = cx + r * 0.34 * math.cos(ang)
        y1 = cy + r * 0.34 * math.sin(ang)
        ang2 = ang + math.pi / 5
        x2 = cx + r * 0.72 * math.cos(ang2)
        y2 = cy + r * 0.72 * math.sin(ang2)
        draw.line([x1, y1, x2, y2], fill="#1b2b34", width=max(2, int(r // 26)))

def make(size, maskable=False, fname=None):
    img = Image.new("RGB", (size, size))
    draw = ImageDraw.Draw(img)
    # Himmel/Rasen-Hintergrund
    horizon = int(size * 0.56)
    for y in range(size):
        if y < horizon:
            t = y / max(horizon, 1)
            c = tuple(int(a + (b - a) * t) for a, b in zip((110, 198, 255), (191, 233, 255)))
        else:
            t = (y - horizon) / max(size - horizon, 1)
            c = tuple(int(a + (b - a) * t) for a, b in zip((62, 163, 74), (47, 138, 61)))
        draw.line([(0, y), (size, y)], fill=c)

    pad = size * (0.18 if maskable else 0.06)
    r = (size - 2 * pad) * 0.30
    draw_ball(draw, size / 2, size * 0.52, r)

    if not maskable:
        # abgerundete Ecken für "any"-Icon
        mask = Image.new("L", (size, size), 0)
        mdraw = ImageDraw.Draw(mask)
        radius = int(size * 0.22)
        mdraw.rounded_rectangle([0, 0, size, size], radius=radius, fill=255)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        out.save(fname)
    else:
        img.save(fname)

make(192, False, os.path.join(OUT, "icon-192.png"))
make(512, False, os.path.join(OUT, "icon-512.png"))
make(512, True, os.path.join(OUT, "icon-maskable-512.png"))
print("Icons erzeugt in", OUT)
