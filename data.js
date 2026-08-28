// Vereine der Fußball-Bundesliga, Saison 2026/27
// slug -> wird auch als Dateiname für echte Wappen genutzt: logos/<slug>.png
// Farben werden nur für die Platzhalter-Embleme benutzt (bis echte Wappen-Bilder ergänzt werden).
const CLUBS = [
  { slug: "bayern",        name: "FC Bayern München",     short: "Bayern München",   abbr: "FCB", colors: ["#DC052D", "#0C1C3D"] },
  { slug: "dortmund",      name: "Borussia Dortmund",     short: "Dortmund",         abbr: "BVB", colors: ["#FDE100", "#000000"] },
  { slug: "leipzig",       name: "RB Leipzig",            short: "Leipzig",          abbr: "RBL", colors: ["#DD0741", "#FFFFFF"] },
  { slug: "stuttgart",     name: "VfB Stuttgart",         short: "Stuttgart",        abbr: "VfB", colors: ["#E32219", "#FFFFFF"] },
  { slug: "hoffenheim",    name: "TSG 1899 Hoffenheim",   short: "Hoffenheim",       abbr: "TSG", colors: ["#1C63B7", "#FFFFFF"] },
  { slug: "leverkusen",    name: "Bayer 04 Leverkusen",   short: "Leverkusen",       abbr: "B04", colors: ["#E32219", "#000000"] },
  { slug: "freiburg",      name: "SC Freiburg",           short: "Freiburg",         abbr: "SCF", colors: ["#000000", "#E30613"] },
  { slug: "frankfurt",     name: "Eintracht Frankfurt",   short: "Frankfurt",        abbr: "SGE", colors: ["#E1000F", "#000000"] },
  { slug: "augsburg",      name: "FC Augsburg",           short: "Augsburg",         abbr: "FCA", colors: ["#BA3733", "#00953D"] },
  { slug: "mainz",         name: "1. FSV Mainz 05",       short: "Mainz 05",         abbr: "M05", colors: ["#C3141E", "#FFFFFF"] },
  { slug: "union-berlin",  name: "1. FC Union Berlin",    short: "Union Berlin",     abbr: "FCU", colors: ["#EB1923", "#FFCC00"] },
  { slug: "gladbach",      name: "Borussia Mönchengladbach", short: "Mönchengladbach", abbr: "BMG", colors: ["#000000", "#00953D"] },
  { slug: "hamburg",       name: "Hamburger SV",          short: "Hamburger SV",     abbr: "HSV", colors: ["#00224F", "#FFFFFF"] },
  { slug: "koeln",         name: "1. FC Köln",            short: "Köln",             abbr: "FCK", colors: ["#ED1C24", "#FFFFFF"] },
  { slug: "bremen",        name: "SV Werder Bremen",      short: "Werder Bremen",    abbr: "SVW", colors: ["#009036", "#FFFFFF"] },
  { slug: "schalke",       name: "FC Schalke 04",         short: "Schalke 04",       abbr: "S04", colors: ["#004C9B", "#FFFFFF"] },
  { slug: "elversberg",    name: "SV Elversberg",         short: "Elversberg",       abbr: "SVE", colors: ["#000000", "#1C63B7"] },
  { slug: "paderborn",     name: "SC Paderborn 07",       short: "Paderborn",        abbr: "SCP", colors: ["#00509F", "#000000"] },
];
