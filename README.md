# ⚽ Fußball Quiz

Eine einfache PWA für Handy & Tablet, mit der Kinder Vereinswappen (Bundesliga,
2. Bundesliga, 3. Liga – Saison 2026/27) und Fußball-Legenden spielerisch lernen –
per Multiple-Choice-Quiz mit Bild, Ton und Sprachausgabe.

## Funktionen

- **Quiz-Modus**: Wappen wird angezeigt, 2–4 Vereinsnamen stehen zur Auswahl.
  Die Antwortmöglichkeiten werden automatisch vorgelesen (und über den 🔊-Button
  jederzeit erneut). Bei richtiger Antwort: Konfetti, Jingle, und der Vereinsname
  wird automatisch laut vorgelesen. Bei falscher Antwort: sanfter Hinweiston,
  beliebig oft neu versuchen.
- **Entdecken-Modus**: Alle 18 Wappen zum freien Durchblättern, mit Sprachausgabe –
  gut zum ersten Kennenlernen vor dem eigentlichen Quiz.
- **Einstellungen** (⚙️ auf dem Startbildschirm, für Erwachsene): Anzahl der
  Antwortmöglichkeiten (2–4), Sound an/aus, Sprachausgabe an/aus, Vorlesetempo,
  Fortschritt zurücksetzen.
- Funktioniert als installierbare PWA offline (Service Worker cached die App).
- Läuft komplett ohne Server-Backend – nur statische Dateien.

## Echte Vereinswappen ergänzen

Aktuell zeigt die App **Platzhalter** (Vereinsfarben + Kürzel), damit sofort
gespielt werden kann. Um echte Wappen-Bilder zu ergänzen:

1. Bild besorgen (z. B. offizielles Vereinslogo als PNG mit transparentem
   Hintergrund, am besten quadratisch, min. 256×256 px).
2. Datei in den Ordner `logos/` legen, benannt nach dem `slug` aus `data.js`,
   z. B. `logos/bayern.png` für den FC Bayern München.
3. Fertig – die App erkennt die Datei automatisch beim nächsten Laden und
   zeigt sie statt des Platzhalters.

Slugs (siehe `data.js`): `bayern`, `dortmund`, `leipzig`, `stuttgart`,
`hoffenheim`, `leverkusen`, `freiburg`, `frankfurt`, `augsburg`, `mainz`,
`union-berlin`, `gladbach`, `hamburg`, `koeln`, `bremen`, `schalke`,
`elversberg`, `paderborn`.

> Hinweis: Vereinswappen sind i. d. R. Marken der jeweiligen Vereine. Für den
> rein privaten, nicht-öffentlichen Gebrauch (wie hier) ist das unkritisch;
> die App sollte aber nicht öffentlich mit echten Wappen weiterverbreitet werden.

## Lokal testen

```bash
cd vereinswappen-quiz
python3 -m http.server 8642
# dann im Browser: http://localhost:8642
```

## Auf GitHub Pages veröffentlichen (kostenlos, mit HTTPS)

1. Auf [github.com](https://github.com) ein neues, öffentliches Repository anlegen,
   z. B. `wappen-quiz` (ohne README/License, das Repo bleibt sonst leer).
2. In diesem Ordner:
   ```bash
   git remote add origin https://github.com/<dein-github-name>/wappen-quiz.git
   git branch -M main
   git add -A
   git commit -m "Wappen-Quiz PWA"
   git push -u origin main
   ```
3. Auf GitHub: **Settings → Pages → Source → Deploy from a branch**, Branch
   `main`, Ordner `/ (root)` auswählen, speichern.
4. Nach 1–2 Minuten ist die App unter
   `https://<dein-github-name>.github.io/wappen-quiz/` erreichbar.

## Auf Handy/Tablet installieren

1. Die GitHub-Pages-URL auf dem Handy/Tablet im Browser öffnen (Chrome/Safari).
2. **Android (Chrome)**: Menü (⋮) → „App installieren" bzw. „Zum Startbildschirm
   hinzufügen".
3. **iPad/iPhone (Safari)**: Teilen-Symbol → „Zum Home-Bildschirm".
4. Die App startet danach wie eine normale App, im Vollbild, auch ohne Internet
   (nach dem ersten Laden).

## Projektstruktur

```
index.html          Grundgerüst / alle Bildschirme
styles.css           Gesamtes Styling
data.js              Vereinsliste (Namen, Farben, Kürzel)
app.js                Spiellogik, Sprachausgabe, Sound, Konfetti
manifest.json         PWA-Manifest
service-worker.js     Offline-Caching
icons/                App-Icons
logos/                Hier echte Wappen-PNGs ablegen (siehe oben)
scripts/make_icons.py Skript, mit dem die Icons erzeugt wurden
```
