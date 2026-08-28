// Erzeugt alle Sprachausgabe-Audiodateien der App per ElevenLabs TTS (einmalig).
// Aufruf: ELEVENLABS_API_KEY=... node scripts/generate_voice.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const KEY = process.env.ELEVENLABS_API_KEY || fs.readFileSync(path.join(ROOT, ".elevenlabs_key"), "utf8").trim();
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah
const MODEL_ID = "eleven_multilingual_v2";

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

const jobs = [];

// Richtig/Falsch-Phrasen
jobs.push({ out: "audio/phrases/richtig.mp3", text: "Richtig! Das ist" });
jobs.push({ out: "audio/phrases/falsch.mp3", text: "Leider falsch!" });

for (const [key, league] of Object.entries(LEAGUES)) {
  const folder = audioFolder(league);
  for (const club of league.clubs) {
    jobs.push({ out: `${folder}/${club.slug}.mp3`, text: club.short });
    if (club.facts) {
      jobs.push({ out: `${folder}/facts-${club.slug}.mp3`, text: club.facts });
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
      voice_settings: { stability: 0.5, similarity_boost: 0.8 }
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
