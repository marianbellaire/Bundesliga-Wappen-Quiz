"use strict";

/* ============================================================
   Einstellungen (persistiert in localStorage)
   ============================================================ */
const Settings = {
  choices: 3,
  sound: true,
  speech: true,
  rate: 0.85,
  voiceURI: null,

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
        rate: this.rate, voiceURI: this.voiceURI
      }));
    } catch (e) { /* ignore */ }
  }
};
Settings.load();

/* ============================================================
   Sprachausgabe (Web Speech API)
   ============================================================ */
const Speech = {
  voice: null,
  onVoicesReady: null,

  init() {
    if (!("speechSynthesis" in window)) return;
    const pick = () => {
      const voices = this.germanVoices();
      this.voice =
        (Settings.voiceURI && voices.find(v => v.voiceURI === Settings.voiceURI)) ||
        voices.find(v => /anna/i.test(v.name)) ||
        voices.find(v => /google/i.test(v.name)) ||
        voices.find(v => /natürlich|natural|online|enhanced|premium/i.test(v.name)) ||
        voices.find(v => v.lang === "de-DE") ||
        voices.find(v => v.lang && v.lang.startsWith("de")) ||
        null;
      if (this.onVoicesReady) this.onVoicesReady();
    };
    pick();
    speechSynthesis.onvoiceschanged = pick;
  },

  germanVoices() {
    if (!("speechSynthesis" in window)) return [];
    return speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith("de"));
  },

  setVoice(voiceURI) {
    Settings.voiceURI = voiceURI || null;
    Settings.save();
    const voices = this.germanVoices();
    this.voice = (voiceURI && voices.find(v => v.voiceURI === voiceURI)) || this.voice;
  },

  say(text, { onend } = {}) {
    if (!("speechSynthesis" in window) || !Settings.speech) {
      if (onend) onend();
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    if (this.voice) u.voice = this.voice;
    u.rate = Settings.rate;
    u.pitch = 1.0; // normale Tonhöhe – Auswahl der Stimme selbst macht den Ton freundlich
    if (onend) u.onend = onend;
    speechSynthesis.speak(u);
  },

  stop() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }
};
Speech.init();

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
  Speech.stop();
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

  refillBag() {
    this.bag = this.league.clubs.map(c => c.slug);
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  },

  start(leagueKey) {
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
    const crestEl = document.getElementById("crest");
    crestEl.classList.remove("bounce", "shake");
    renderCrest(crestEl, this.current.correctClub, this.league.folder, this.league.cropPosition);

    document.getElementById("hint-label").textContent = this.league.promptLabel || "Wer oder was ist das?";

    const factsPanel = document.getElementById("facts-panel");
    const facts = this.current.correctClub.facts;
    if (facts) {
      document.getElementById("facts-text").textContent = facts;
      factsPanel.hidden = false;
      setTimeout(() => Speech.say(facts), 500);
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
        Speech.say(club.short);
      });

      row.appendChild(btn);
      row.appendChild(speakBtn);
      wrap.appendChild(row);
    });
  },

  choose(club, btn) {
    if (this.locked) return;
    Sound.tap();
    const isCorrect = club.slug === this.current.correctClub.slug;
    const crestEl = document.getElementById("crest");

    if (isCorrect) {
      this.locked = true;
      btn.classList.add("correct");
      crestEl.classList.add("bounce");
      Sound.correct();
      confettiBurst(document.getElementById("feedback-layer"));
      this.doneSlugs.add(club.slug);
      this.updateDots();
      Speech.say(`Richtig! Das ist ${club.name}.`);

      document.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);
      setTimeout(() => this.nextRound(), 2600);
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
      Speech.say("Leider falsch!");
      setTimeout(() => crestEl.classList.remove("shake"), 400);
      setTimeout(() => btn.classList.remove("wrong"), 500);
    }
  },

  finish() {
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
    Speech.say(club.short);
  },

  move(delta) {
    this.index = (this.index + delta + this.pool.length) % this.pool.length;
    this.render();
  },

  say() {
    Sound.ensureCtx();
    Speech.say(this.pool[this.index].short);
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
  populateVoiceList();
}

function populateVoiceList() {
  const select = document.getElementById("opt-voice");
  const voices = Speech.germanVoices();
  const current = select.value || Settings.voiceURI || "";
  select.innerHTML = "";

  const autoOpt = document.createElement("option");
  autoOpt.value = "";
  autoOpt.textContent = "Automatisch (empfohlen)";
  select.appendChild(autoOpt);

  voices.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.voiceURI;
    opt.textContent = v.name + (v.lang !== "de-DE" ? ` (${v.lang})` : "");
    select.appendChild(opt);
  });

  select.value = voices.some(v => v.voiceURI === current) ? current : "";
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
  document.getElementById("mode-legenden").addEventListener("click", () => {
    Sound.ensureCtx();
    Sound.bling();
    Quiz.start("legenden");
  });
  document.getElementById("btn-facts-replay").addEventListener("click", () => {
    Sound.ensureCtx();
    Speech.say(Quiz.current.correctClub.facts);
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
  document.getElementById("opt-voice").addEventListener("change", e => {
    Speech.setVoice(e.target.value);
    Speech.say("Hallo! So klinge ich jetzt.");
  });
  document.getElementById("btn-reset-progress").addEventListener("click", () => {
    Quiz.doneSlugs.clear();
    if (Quiz.league) Quiz.renderDots();
  });

  document.getElementById("btn-quiz-home").addEventListener("click", () => showScreen("screen-start"));
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
  Speech.onVoicesReady = populateVoiceList;
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
});
