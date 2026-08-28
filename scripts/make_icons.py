"""Erzeugt die App-Icons aus dem App-Ball-Logo (logos/ball-icon.png)."""
from PIL import Image
import os

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "logos", "ball-icon.png")
OUT = os.path.join(ROOT, "icons")
os.makedirs(OUT, exist_ok=True)

BG = (11, 15, 20, 255)  # #0b0f14 – dunkler App-Hintergrund, passend zum Design

def square_canvas(scale=1.0):
    """Ball-Icon zentriert auf ein quadratisches, dunkles Canvas –
    `scale` verkleinert das Motiv zusätzlich (Sicherheitsrand für maskable icons)."""
    icon = Image.open(SRC).convert("RGBA")
    size = max(icon.size)
    canvas = Image.new("RGBA", (size, size), BG)

    if scale != 1.0:
        w, h = icon.size
        icon = icon.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    x = (size - icon.width) // 2
    y = (size - icon.height) // 2
    canvas.alpha_composite(icon, (x, y))
    return canvas

def save(canvas, px, fname):
    canvas.resize((px, px), Image.LANCZOS).convert("RGBA").save(os.path.join(OUT, fname))

base = square_canvas(scale=0.92)
save(base, 192, "icon-192.png")
save(base, 512, "icon-512.png")
save(base, 180, "apple-touch-icon.png")

maskable = square_canvas(scale=0.62)  # mehr Rand, damit Android-Masken nichts abschneiden
save(maskable, 512, "icon-maskable-512.png")

print("Icons erzeugt in", OUT)
