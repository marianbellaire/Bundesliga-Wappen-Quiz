"""Erzeugt die App-Icons aus dem echten Bundesliga-Logo (logos/bundesliga-icon.png)."""
from PIL import Image
import os

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "logos", "bundesliga-icon.png")
OUT = os.path.join(ROOT, "icons")
os.makedirs(OUT, exist_ok=True)

RED = (209, 2, 20, 255)  # Bundesliga-Rot, aus dem Logo selbst gesampelt

def square_canvas(scale=1.0):
    """Bundesliga-Icon zentriert auf ein quadratisches, komplett rotes Canvas –
    `scale` verkleinert das Motiv zusätzlich (Sicherheitsrand für maskable icons)."""
    icon = Image.open(SRC).convert("RGBA")
    size = max(icon.size)
    canvas = Image.new("RGBA", (size, size), RED)

    if scale != 1.0:
        w, h = icon.size
        icon = icon.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    x = (size - icon.width) // 2
    y = (size - icon.height) // 2
    canvas.alpha_composite(icon, (x, y))
    return canvas

def save(canvas, px, fname):
    canvas.resize((px, px), Image.LANCZOS).convert("RGBA").save(os.path.join(OUT, fname))

base = square_canvas(scale=1.0)
save(base, 192, "icon-192.png")
save(base, 512, "icon-512.png")
save(base, 180, "apple-touch-icon.png")

maskable = square_canvas(scale=0.72)  # mehr Rand, damit Android-Masken nichts abschneiden
save(maskable, 512, "icon-maskable-512.png")

print("Icons erzeugt in", OUT)
