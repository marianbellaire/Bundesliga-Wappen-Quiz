// Erzeugt alle Sprachausgabe-Audiodateien der App per ElevenLabs TTS (einmalig).
// Aufruf: ELEVENLABS_API_KEY=... node scripts/generate_voice.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const KEY = process.env.ELEVENLABS_API_KEY || fs.readFileSync(path.join(ROOT, ".elevenlabs_key"), "utf8").trim();
const VOICE_ID = "SfNQWfFVL6TQ3DIRvFyM"; // Barbara Brave (native deutsche Stimme)
const MODEL_ID = "eleven_turbo_v2_5"; // unterstützt language_code (erzwingt Deutsch statt Auto-Erkennung)

// data.js in einem Sandbox-Kontext laden, um an LEAGUES zu kommen
const dataSrc = fs.readFileSync(path.join(ROOT, "data.js"), "utf8");
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dataSrc + "\nglobalThis.__LEAGUES = LEAGUES;", sandbox);
const LEAGUES = sandbox.__LEAGUES;

function audioFolder(league) {
  // "logos/2. Bundesliga" -> "audio/2. Bundesliga"
  return league.folder.replace(/^logos\//, "audio/");
}

// Sorgt für ein Satzzeichen am Ende – ohne das schwankte die Generierungs-
// länge zufällig (z. B. wurde bei "Hannover 96" ohne Punkt gelegentlich
// die "96" abgeschnitten).
function withPunctuation(text) {
  return /[.!?…"”]$/.test(text.trim()) ? text : text.trim() + ".";
}

const jobs = [];

// Richtig/Falsch-Phrasen ("Richtig! Das ist" bleibt bewusst ohne Punkt am
// Ende, da direkt der Namens-Clip drangehängt wird)
jobs.push({ out: "audio/phrases/richtig.mp3", text: "Richtig! Das ist" });
jobs.push({ out: "audio/phrases/falsch.mp3", text: "Leider falsch!" });

for (const [key, league] of Object.entries(LEAGUES)) {
  const folder = audioFolder(league);
  for (const club of league.clubs) {
    jobs.push({ out: `${folder}/${club.slug}.mp3`, text: withPunctuation(club.tts || club.short) });
    if (club.facts) {
      jobs.push({ out: `${folder}/facts-${club.slug}.mp3`, text: withPunctuation(club.facts) });
    }
  }
}

console.log(`${jobs.length} Audiodateien geplant.`);

async function generate(text, outPath) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      language_code: "de",
      voice_settings: { stability: 0.8, similarity_boost: 0.8 }
    })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status} für "${text}": ${body}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
}

let ok = 0, failed = 0;
for (const job of jobs) {
  const outPath = path.join(ROOT, job.out);
  if (fs.existsSync(outPath)) {
    console.log("skip (existiert schon):", job.out);
    ok++;
    continue;
  }
  try {
    await generate(job.text, outPath);
    console.log("ok:", job.out);
    ok++;
  } catch (e) {
    console.error("FEHLER:", job.out, "-", e.message);
    failed++;
  }
}

console.log(`\nFertig: ${ok} ok, ${failed} Fehler.`);
