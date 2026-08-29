"use strict";

/* ============================================================
   Einstellungen (persistiert in localStorage)
   ============================================================ */
const Settings = {
  choices: 3,
  sound: true,
  speech: true,
  rate: 0.85,

  load() {
    try {
      const raw = localStorage.getItem("wappenquiz.settings");
      if (raw) Object.assign(this, JSON.parse(raw));
    } catch (e) { /* ignore */ }
  },
  save() {
    try {
      localStorage.setItem("wappenquiz.settings", JSON.stringify({
        choices: this.choices, sound: this.sound, speech: this.speech,
        rate: this.rate
      }));
    } catch (e) { /* ignore */ }
  }
};
Settings.load();

// Kleine Hilfsfunktion für Wartezeiten (z. B. Konfetti/Bounce ausklingen lassen).
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ============================================================
   Sprachausgabe (Web Speech API)
   ============================================================ */
const Speech = {
  voice: null,
  pendingResolve: null, // wird aufgerufen, sobald die aktuelle Ansage endet/abbricht

  // Wird nur noch als Fallback genutzt, falls ein vorproduzierter Clip mal
  // nicht lädt - daher automatische Auswahl statt einstellbarer Stimme.
  init() {
    if (!("speechSynthesis" in window)) return;
    const pick = () => {
      const voices = this.germanVoices();
      this.voice =
        voices.find(v => /anna/i.test(v.name)) ||
        voices.find(v => /google/i.test(v.name)) ||
        voices.find(v => /natürlich|natural|online|enhanced|premium/i.test(v.name)) ||
        voices.find(v => v.lang === "de-DE") ||
        voices.find(v => v.lang && v.lang.startsWith("de")) ||
        null;
    };
    pick();
    speechSynthesis.onvoiceschanged = pick;
  },

  germanVoices() {
    if (!("speechSynthesis" in window)) return [];
    return speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith("de"));
  },

  say(text, { onend } = {}) {
    if (!("speechSynthesis" in window) || !Settings.speech) {
      if (onend) onend();
      return;
    }
    this.stop(); // vorherige Ansage sauber beenden, bevor eine neue startet
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    if (this.voice) u.voice = this.voice;
    u.rate = Settings.rate;
    u.pitch = 1.0; // normale Tonhöhe – Auswahl der Stimme selbst macht den Ton freundlich
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      if (this.pendingResolve === done) this.pendingResolve = null;
      if (onend) onend();
    };
    this.pendingResolve = done;
    u.onend = done;
    u.onerror = done;
    speechSynthesis.speak(u);
  },

  // Bricht die laufende Ansage sofort ab und löst ein evtl. wartendes
  // onend/Promise trotzdem aus (damit nichts endlos hängen bleibt).
  stop() {
    if (this.pendingResolve) {
      const done = this.pendingResolve;
      this.pendingResolve = null;
      done();
    }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }
};
Speech.init();

/* ============================================================
   Voice-Overs: vorproduzierte Audiodateien (ElevenLabs, Stimme
   "Sarah") statt Live-Sprachsynthese. Fällt automatisch auf Speech
   (Browser-TTS) zurück, falls eine Datei mal fehlt/nicht lädt.
   ============================================================ */
const Voice = {
  currentAudio: null,
  currentNodes: null, // aktive Web-Audio-Quellen (für nahtlose Übergänge, siehe playSeamlessPair)
  pendingDone: null, // wird aufgerufen, sobald der aktuelle Audio-Clip/-Übergang endet/abbricht

  toAudioFolder(folder) {
    return folder.replace(/^logos\//, "audio/");
  },

  // Stoppt sofort jede laufende Sprachausgabe (Audiodatei + Browser-TTS-
  // Fallback). Wird vor jeder neuen Ansage sowie bei jedem Screen-/Runden-
  // wechsel aufgerufen, damit sich nie zwei Voice-Clips überlagern.
  stopAll() {
    // Erst BEIDE Referenzen einfangen und auf Voice-Ebene leeren, dann erst
    // "done" aufrufen – done() räumt intern selbst this.currentAudio/
    // this.pendingDone auf, was sonst dazu führt, dass der pause()-Aufruf
    // unten fälschlich übersprungen wird, weil this.currentAudio bereits
    // null ist (Audio spielt dann unbemerkt im Hintergrund weiter).
    const audio = this.currentAudio;
    const nodes = this.currentNodes;
    const done = this.pendingDone;
    this.currentAudio = null;
    this.currentNodes = null;
    this.pendingDone = null;
    if (done) done(null); // null = absichtlich unterbrochen, kein Fallback-Speech auslösen
    if (audio) {
      try { audio.pause(); } catch (e) { /* ignore */ }
    }
    if (nodes) {
      nodes.forEach(n => { try { n.stop(); } catch (e) { /* ignore */ } });
    }
    Speech.stop();
  },

  tryPlayFile(url) {
    this.stopAll(); // vorherigen Clip immer zuerst stoppen – nie zwei gleichzeitig
    return new Promise(resolve => {
      const audio = new Audio(url);
      audio.playbackRate = Settings.rate;
      this.currentAudio = audio;
      let settled = false;
      const done = ok => {
        if (settled) return;
        settled = true;
        if (this.pendingDone === done) this.pendingDone = null;
        if (this.currentAudio === audio) this.currentAudio = null;
        resolve(ok);
      };
      this.pendingDone = done;
      audio.addEventListener("ended", () => done(true));
      audio.addEventListener("error", () => done(false));
      audio.play().catch(() => done(false));
    });
  },

  // Spielt die Datei ab und wartet auf deren vollständiges Ende (oder das
  // Ende der Fallback-Ansage). ok === null bedeutet "absichtlich
  // unterbrochen" (Screen-/Rundenwechsel) – dann KEIN Fallback-Speech.
  async playOrSay(url, fallbackText) {
    if (!Settings.speech) return;
    const ok = await this.tryPlayFile(url);
    if (ok === false) {
      await new Promise(resolve => Speech.say(fallbackText, { onend: resolve }));
    }
  },

  playName(club, folder) {
    const dir = this.toAudioFolder(folder);
    return this.playOrSay(`${dir}/${club.slug}.mp3`, club.tts || club.short);
  },

  playFacts(club, folder) {
    const dir = this.toAudioFolder(folder);
    return this.playOrSay(`${dir}/facts-${club.slug}.mp3`, club.factsTts || club.facts);
  },

  playWrong() {
    return this.playOrSay("audio/phrases/falsch.mp3", "Leider falsch!");
  },

  bufferCache: new Map(), // url -> decodiertes AudioBuffer (richtig.mp3 wird ständig wiederverwendet)

  async loadBuffer(ctx, url) {
    if (this.bufferCache.has(url)) return this.bufferCache.get(url);
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const arr = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arr);
    this.bufferCache.set(url, buf);
    return buf;
  },

  // Die ElevenLabs-Clips enthalten oft mehrere hundert ms Stille am Anfang/
  // Ende. Selbst bei perfektem Scheduling wirkt das wie eine Pause. Diese
  // Funktion ermittelt Start-/End-Offset ohne die Stille am Rand.
  trimSilence(buf, threshold = 0.01) {
    const data = buf.getChannelData(0);
    const sr = buf.sampleRate;
    let start = 0;
    for (let i = 0; i < data.length; i++) {
      if (Math.abs(data[i]) > threshold) { start = i; break; }
    }
    let end = data.length - 1;
    for (let i = data.length - 1; i >= 0; i--) {
      if (Math.abs(data[i]) > threshold) { end = i; break; }
    }
    return { offset: start / sr, duration: Math.max(0, (end - start) / sr) };
  },

  // Spielt zwei Clips nahtlos hintereinander per Web Audio API: führende/
  // nachlaufende Stille wird direkt beim Abspielen übersprungen (ohne die
  // Audiodateien selbst zu verändern), dazwischen bleibt nur eine winzige,
  // natürliche Mikropause. Läuft bewusst mit nativer Geschwindigkeit/
  // Tonhöhe statt der Vorlesegeschwindigkeit, damit der Anschluss wirklich
  // nahtlos bleibt (AudioBufferSourceNode.playbackRate verändert sonst die
  // Tonhöhe hörbar). Gibt true/false zurück, oder null bei Unterbrechung.
  async playSeamlessPair(urlA, urlB) {
    const ctx = Sound.ensureCtx();
    if (!ctx) return false;
    let bufA, bufB;
    try {
      [bufA, bufB] = await Promise.all([this.loadBuffer(ctx, urlA), this.loadBuffer(ctx, urlB)]);
    } catch (e) {
      return false;
    }

    this.stopAll(); // vorherigen Clip immer zuerst stoppen – nie zwei gleichzeitig

    const trimA = this.trimSilence(bufA);
    const trimB = this.trimSilence(bufB);
    const microGap = 0.03; // kurze, natürliche Atempause statt hartem Schnitt

    return new Promise(resolve => {
      const nodes = [];
      let settled = false;
      const done = ok => {
        if (settled) return;
        settled = true;
        if (this.pendingDone === done) this.pendingDone = null;
        if (this.currentNodes === nodes) this.currentNodes = null;
        resolve(ok);
      };
      this.pendingDone = done;
      this.currentNodes = nodes;

      const t0 = ctx.currentTime + 0.03;
      const srcA = ctx.createBufferSource();
      srcA.buffer = bufA;
      srcA.connect(ctx.destination);
      srcA.start(t0, trimA.offset, trimA.duration);
      nodes.push(srcA);

      const t1 = t0 + trimA.duration + microGap;
      const srcB = ctx.createBufferSource();
      srcB.buffer = bufB;
      srcB.connect(ctx.destination);
      srcB.onended = () => done(true);
      srcB.start(t1, trimB.offset, trimB.duration);
      nodes.push(srcB);
    });
  },

  // Wichtig: läuft vollständig durch (inkl. evtl. Fallback-Speech), bevor
  // das Promise erfüllt wird – der Aufrufer kann so zuverlässig warten,
  // bis der Lösungs-Clip komplett zu Ende gesprochen wurde.
  async playCorrect(club, folder) {
    if (!Settings.speech) return;
    const dir = this.toAudioFolder(folder);
    const ok = await this.playSeamlessPair("audio/phrases/richtig.mp3", `${dir}/${club.slug}.mp3`);
    if (ok === null) return; // unterbrochen, z. B. Screen verlassen
    if (!ok) {
      await new Promise(resolve => Speech.say(`Richtig! Das ist ${club.tts || club.name}.`, { onend: resolve }));
    }
  }
};

/* ============================================================
   Klangeffekte (Web Audio API, keine Audiodateien nötig)
   ============================================================ */
const Sound = {
  ctx: null,
  ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  },
  tone(freq, startTime, dur, type = "sine", gainPeak = 0.18) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  },
  correct() {
    if (!Settings.sound) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, t + i * 0.09, 0.35, "triangle"));
  },
  tryAgain() {
    if (!Settings.sound) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    this.tone(392, t, 0.18, "sine", 0.12);
    this.tone(330, t + 0.12, 0.22, "sine", 0.12);
  },
  tap() {
    if (!Settings.sound) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    this.tone(700, ctx.currentTime, 0.08, "sine", 0.08);
  },
  fanfare() {
    if (!Settings.sound) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this.tone(f, t + i * 0.14, 0.5, "triangle", 0.16));
  },
  bling() {
    // Dezenter, heller Klick-Ton für Menü-/Navigations-Buttons: kurzer
    // Grundton plus leiser, minimal versetzter Oberton für etwas Glanz.
    if (!Settings.sound) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    this.tone(1567.98, t, 0.16, "sine", 0.07);
    this.tone(2349.32, t + 0.015, 0.14, "sine", 0.035);
  }
};

/* ============================================================
   Wappen-Darstellung: echtes Bild falls vorhanden, sonst Platzhalter
   ============================================================ */
const logoAvailability = new Map(); // "folder/file" -> true/false

function logoUrl(folder, club) {
  return `${folder}/${club.file || club.slug + ".png"}`;
}

function checkLogo(url) {
  if (logoAvailability.has(url)) return Promise.resolve(logoAvailability.get(url));
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => { logoAvailability.set(url, true); resolve(true); };
    img.onerror = () => { logoAvailability.set(url, false); resolve(false); };
    img.src = url;
  });
}

async function renderCrest(el, club, folder, cropPosition) {
  el.style.background = "";
  el.style.backgroundPosition = cropPosition ? `${cropPosition} center` : "center";
  el.textContent = "";
  const url = logoUrl(folder, club);
  const hasLogo = await checkLogo(url);
  if (hasLogo) {
    el.style.backgroundImage = `url("${url}")`;
    el.style.backgroundColor = "#ffffff";
  } else {
    const [c1, c2] = club.colors;
    el.style.background = `linear-gradient(145deg, ${c1}, ${c2})`;
    el.textContent = club.abbr;
  }
}

/* ============================================================
   Konfetti
   ============================================================ */
function confettiBurst(layer) {
  const colors = ["#cda449", "#e6c374", "#3fa06d", "#eef2f6", "#8a6d33"];
  const count = 26;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = 1.1 + Math.random() * 0.9 + "s";
    piece.style.opacity = String(0.7 + Math.random() * 0.3);
    layer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

/* ============================================================
   Navigation zwischen Screens
   ============================================================ */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  Voice.stopAll();
}

/* ============================================================
   Quiz-Logik
   ============================================================ */
const Quiz = {
  league: null,
  leagueKey: null,
  bag: [],
  doneSlugs: new Set(),
  current: null,
  locked: false,
  token: 0, // wird bei jedem Neustart/Verlassen hochgezählt, um veraltete Timer/Awaits zu entwerten
  factsTimeout: null, // verzögertes Abspielen des Legenden-Hinweistons

  refillBag() {
    this.bag = this.league.clubs.map(c => c.slug);
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  },

  start(leagueKey) {
    this.token++;
    clearTimeout(this.factsTimeout);
    this.leagueKey = leagueKey;
    this.league = LEAGUES[leagueKey];
    this.doneSlugs.clear();
    this.refillBag();
    this.renderDots();
    this.nextRound();
    showScreen("screen-quiz");
  },

  renderDots() {
    const wrap = document.getElementById("progress-dots");
    wrap.innerHTML = "";
    this.league.clubs.forEach(c => {
      const d = document.createElement("span");
      d.className = "dot" + (this.doneSlugs.has(c.slug) ? " done" : "");
      d.dataset.slug = c.slug;
      wrap.appendChild(d);
    });
  },

  updateDots() {
    document.querySelectorAll("#progress-dots .dot").forEach(d => {
      d.classList.toggle("done", this.doneSlugs.has(d.dataset.slug));
    });
  },

  nextRound() {
    clearTimeout(this.factsTimeout);
    if (this.doneSlugs.size >= this.league.clubs.length) {
      this.finish();
      return;
    }
    if (this.bag.length === 0) this.refillBag();

    // nächstes noch nicht gelerntes Wappen bevorzugen
    let idx = this.bag.findIndex(s => !this.doneSlugs.has(s));
    if (idx === -1) idx = 0;
    const slug = this.bag.splice(idx, 1)[0];
    const correctClub = this.league.clubs.find(c => c.slug === slug);

    const pool = this.league.clubs.filter(c => c.slug !== slug);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const distractors = pool.slice(0, Settings.choices - 1);
    const options = [correctClub, ...distractors];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    this.current = { correctClub, options };
    this.locked = false;
    this.renderRound();
  },

  renderRound() {
    Voice.stopAll(); // sauberer Übergang: nie läuft noch die Ansage der vorigen Runde

    const crestEl = document.getElementById("crest");
    crestEl.classList.remove("bounce", "shake");
    renderCrest(crestEl, this.current.correctClub, this.league.folder, this.league.cropPosition);

    document.getElementById("hint-label").textContent = this.league.promptLabel || "Wer oder was ist das?";

    const factsPanel = document.getElementById("facts-panel");
    const facts = this.current.correctClub.facts;
    if (facts) {
      document.getElementById("facts-text").textContent = facts;
      factsPanel.hidden = false;
      const roundToken = this.token;
      this.factsTimeout = setTimeout(() => {
        // nur abspielen, wenn zwischenzeitlich nicht neu gestartet/verlassen wurde
        if (roundToken === this.token) Voice.playFacts(this.current.correctClub, this.league.folder);
      }, 500);
    } else {
      factsPanel.hidden = true;
    }

    const wrap = document.getElementById("choices");
    wrap.innerHTML = "";
    this.current.options.forEach(club => {
      const row = document.createElement("div");
      row.className = "choice-row";

      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.type = "button";
      btn.textContent = club.short;
      btn.addEventListener("click", () => this.choose(club, btn));

      const speakBtn = document.createElement("button");
      speakBtn.className = "speak-btn";
      speakBtn.type = "button";
      speakBtn.innerHTML = ICONS.speaker;
      speakBtn.setAttribute("aria-label", `${club.short} vorlesen`);
      speakBtn.addEventListener("click", e => {
        e.stopPropagation();
        Sound.ensureCtx();
        Voice.playName(club, this.league.folder);
      });

      row.appendChild(btn);
      row.appendChild(speakBtn);
      wrap.appendChild(row);
    });
  },

  async choose(club, btn) {
    if (this.locked) return;
    Sound.tap();
    const isCorrect = club.slug === this.current.correctClub.slug;
    const crestEl = document.getElementById("crest");

    if (isCorrect) {
      this.locked = true;
      clearTimeout(this.factsTimeout); // Legenden-Hinweiston nicht mehr verzögert nachschieben
      const roundToken = this.token;
      btn.classList.add("correct");
      crestEl.classList.add("bounce");
      Sound.correct();
      confettiBurst(document.getElementById("feedback-layer"));
      this.doneSlugs.add(club.slug);
      this.updateDots();
      document.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);

      // Erst weiter, wenn der Lösungs-Clip WIRKLICH komplett zu Ende
      // gesprochen ist (mindestens so lange wie Konfetti/Bounce brauchen).
      await Promise.all([
        Voice.playCorrect(club, this.league.folder),
        wait(1400)
      ]);
      if (roundToken !== this.token) return; // zwischenzeitlich verlassen/neu gestartet
      this.nextRound();
    } else {
      // Beliebig oft falsch auswählen dürfen – jedes Mal erneut Ton, Ansage
      // und Wackel-Animation, auch bei schnell wiederholtem Tippen auf
      // dieselbe Antwort (Animation wird per Reflow-Trick neu gestartet).
      btn.classList.remove("wrong");
      crestEl.classList.remove("shake");
      void btn.offsetWidth;
      void crestEl.offsetWidth;
      btn.classList.add("wrong");
      crestEl.classList.add("shake");
      Sound.tryAgain();
      Voice.playWrong();
      setTimeout(() => crestEl.classList.remove("shake"), 400);
      setTimeout(() => btn.classList.remove("wrong"), 500);
    }
  },

  finish() {
    clearTimeout(this.factsTimeout);
    Sound.fanfare();
    confettiBurst(document.getElementById("feedback-layer"));
    document.getElementById("complete-subtitle").textContent =
      this.league.completeText || `Du kennst jetzt alle ${this.league.label}-Einträge!`;
    showScreen("screen-complete");
  }
};

/* ============================================================
   Entdecken-Modus (freies Durchblättern)
   ============================================================ */
const Discover = {
  index: 0,
  filter: "all", // "all" | "bundesliga" | "2bundesliga"
  pool: [], // aktuell gefilterte Liste, je Eintrag { ...club, leagueLabel, folder }

  allClubs() {
    return Object.entries(LEAGUES)
      .filter(([, league]) => league.discoverable)
      .flatMap(([key, league]) =>
        league.clubs.map(c => ({ ...c, leagueKey: key, leagueLabel: league.label, folder: league.folder }))
      );
  },

  applyFilter() {
    const all = this.allClubs();
    this.pool = this.filter === "all" ? all : all.filter(c => c.leagueKey === this.filter);
    if (this.index >= this.pool.length) this.index = 0;
  },

  start() {
    this.index = 0;
    this.filter = "all";
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b.dataset.filter === "all"));
    this.applyFilter();
    this.render();
    showScreen("screen-discover");
  },

  setFilter(filter) {
    this.filter = filter;
    this.index = 0;
    this.applyFilter();
    this.render();
    document.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.filter === filter);
    });
  },

  render() {
    const club = this.pool[this.index];
    document.getElementById("discover-counter").textContent = `${this.index + 1} / ${this.pool.length}`;
    document.getElementById("discover-name").textContent = club.short;
    document.getElementById("discover-league").textContent = this.filter === "all" ? club.leagueLabel : "";
    renderCrest(document.getElementById("discover-crest"), club, club.folder);
    Voice.playName(club, club.folder);
  },

  move(delta) {
    this.index = (this.index + delta + this.pool.length) % this.pool.length;
    this.render();
  },

  say() {
    Sound.ensureCtx();
    Voice.playName(this.pool[this.index], this.pool[this.index].folder);
  }
};

/* ============================================================
   UI-Verdrahtung
   ============================================================ */
function applySettingsToUI() {
  document.getElementById("opt-choices").value = String(Settings.choices);
  document.getElementById("opt-sound").checked = Settings.sound;
  document.getElementById("opt-speech").checked = Settings.speech;
  document.getElementById("opt-rate").value = String(Settings.rate);
  document.getElementById("btn-mute").innerHTML = Settings.sound ? ICONS.speaker : ICONS.speakerMuted;
}

function wireUI() {
  applySettingsToUI();

  document.getElementById("btn-play").addEventListener("click", () => {
    Sound.ensureCtx();
    Sound.bling();
    showScreen("screen-mode");
  });
  document.getElementById("btn-learn").addEventListener("click", () => {
    Sound.ensureCtx();
    Sound.bling();
    Discover.start();
  });
  document.getElementById("btn-mode-home").addEventListener("click", () => showScreen("screen-start"));
  document.getElementById("mode-bundesliga").addEventListener("click", () => {
    Sound.ensureCtx();
    Sound.bling();
    Quiz.start("bundesliga");
  });
  document.getElementById("mode-2bundesliga").addEventListener("click", () => {
    Sound.ensureCtx();
    Sound.bling();
    Quiz.start("2bundesliga");
  });
  document.getElementById("mode-3liga").addEventListener("click", () => {
    Sound.ensureCtx();
    Sound.bling();
    Quiz.start("3liga");
  });
  document.getElementById("mode-international").addEventListener("click", () => {
    Sound.ensureCtx();
    Sound.bling();
    Quiz.start("international");
  });
  document.getElementById("mode-legenden").addEventListener("click", () => {
    Sound.ensureCtx();
    Sound.bling();
    Quiz.start("legenden");
  });
  document.getElementById("btn-facts-replay").addEventListener("click", () => {
    Sound.ensureCtx();
    Voice.playFacts(Quiz.current.correctClub, Quiz.league.folder);
  });
  document.getElementById("btn-settings").addEventListener("click", () => showScreen("screen-settings"));
  document.getElementById("btn-settings-back").addEventListener("click", () => showScreen("screen-start"));

  document.getElementById("opt-choices").addEventListener("change", e => {
    Settings.choices = parseInt(e.target.value, 10);
    Settings.save();
  });
  document.getElementById("opt-sound").addEventListener("change", e => {
    Settings.sound = e.target.checked;
    Settings.save();
    document.getElementById("btn-mute").innerHTML = Settings.sound ? ICONS.speaker : ICONS.speakerMuted;
  });
  document.getElementById("opt-speech").addEventListener("change", e => {
    Settings.speech = e.target.checked;
    Settings.save();
  });
  document.getElementById("opt-rate").addEventListener("input", e => {
    Settings.rate = parseFloat(e.target.value);
    Settings.save();
  });
  document.getElementById("btn-reset-progress").addEventListener("click", () => {
    Quiz.doneSlugs.clear();
    if (Quiz.league) Quiz.renderDots();
  });

  document.getElementById("btn-quiz-home").addEventListener("click", () => {
    Quiz.token++; // entwertet ein evtl. noch wartendes choose() -> nextRound()
    clearTimeout(Quiz.factsTimeout);
    showScreen("screen-start");
  });
  document.getElementById("btn-mute").addEventListener("click", () => {
    Settings.sound = !Settings.sound;
    Settings.save();
    document.getElementById("btn-mute").innerHTML = Settings.sound ? ICONS.speaker : ICONS.speakerMuted;
  });
  document.getElementById("btn-discover-home").addEventListener("click", () => showScreen("screen-start"));
  document.getElementById("btn-discover-prev").addEventListener("click", () => Discover.move(-1));
  document.getElementById("btn-discover-next").addEventListener("click", () => Discover.move(1));
  document.getElementById("btn-discover-say").addEventListener("click", () => Discover.say());
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      Sound.ensureCtx();
      Discover.setFilter(btn.dataset.filter);
    });
  });

  document.getElementById("btn-again").addEventListener("click", () => Quiz.start(Quiz.leagueKey));
  document.getElementById("btn-complete-home").addEventListener("click", () => showScreen("screen-start"));
}

document.addEventListener("DOMContentLoaded", () => {
  applyIcons();
  wireUI();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
});
