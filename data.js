// Ligen/Kategorien & ihre Einträge (Vereine oder – bei "legenden" – Spieler).
// Jeder Eintrag hat ein "file": der Dateiname des Bildes im jeweiligen
// Ordner unter logos/ (siehe "folder" pro Kategorie).
// Farben werden nur für die Platzhalter-Embleme benutzt (falls ein Bild fehlt).
// "facts": optionaler Text, der bei Rundenstart vorgelesen wird (aktuell nur
// bei "legenden" genutzt) – die Hinweise, an denen man die Person erkennt.
const LEAGUES = {
  bundesliga: {
    label: "Bundesliga",
    folder: "logos/Bundesliga",
    promptLabel: "Welcher Verein ist das?",
    completeText: "Du kennst jetzt alle Bundesliga-Wappen!",
    clubs: [
      { slug: "bayern",        name: "FC Bayern München",     short: "Bayern München",   abbr: "FCB", colors: ["#DC052D", "#0C1C3D"], file: "bayern.png" },
      { slug: "dortmund",      name: "Borussia Dortmund",     short: "Dortmund",         abbr: "BVB", colors: ["#FDE100", "#000000"], file: "dortmund.png" },
      { slug: "leipzig",       name: "RB Leipzig",            short: "Leipzig",          abbr: "RBL", colors: ["#DD0741", "#FFFFFF"], file: "leipzig.png" },
      { slug: "stuttgart",     name: "VfB Stuttgart",         short: "Stuttgart",        abbr: "VfB", colors: ["#E32219", "#FFFFFF"], file: "stuttgart.png" },
      { slug: "hoffenheim",    name: "TSG 1899 Hoffenheim",   short: "Hoffenheim",       abbr: "TSG", colors: ["#1C63B7", "#FFFFFF"], file: "hoffenheim.png" },
      { slug: "leverkusen",    name: "Bayer 04 Leverkusen",   short: "Leverkusen",       abbr: "B04", colors: ["#E32219", "#000000"], file: "leverkusen.png" },
      { slug: "freiburg",      name: "SC Freiburg",           short: "Freiburg",         abbr: "SCF", colors: ["#000000", "#E30613"], file: "freiburg.png" },
      { slug: "frankfurt",     name: "Eintracht Frankfurt",   short: "Frankfurt",        abbr: "SGE", colors: ["#E1000F", "#000000"], file: "frankfurt.png" },
      { slug: "augsburg",      name: "FC Augsburg",           short: "Augsburg",         abbr: "FCA", colors: ["#BA3733", "#00953D"], file: "augsburg.png" },
      { slug: "mainz",         name: "1. FSV Mainz 05",       short: "Mainz 05",         abbr: "M05", colors: ["#C3141E", "#FFFFFF"], file: "mainz.png" },
      { slug: "union-berlin",  name: "1. FC Union Berlin",    short: "Union Berlin",     abbr: "FCU", colors: ["#EB1923", "#FFCC00"], file: "union-berlin.png" },
      { slug: "gladbach",      name: "Borussia Mönchengladbach", short: "Mönchengladbach", abbr: "BMG", colors: ["#000000", "#00953D"], file: "gladbach.png" },
      { slug: "hamburg",       name: "Hamburger SV",          short: "Hamburger SV",     abbr: "HSV", colors: ["#00224F", "#FFFFFF"], file: "hamburg.png" },
      { slug: "koeln",         name: "1. FC Köln",            short: "Köln",             abbr: "FCK", colors: ["#ED1C24", "#FFFFFF"], file: "koeln.png" },
      { slug: "bremen",        name: "SV Werder Bremen",      short: "Werder Bremen",    abbr: "SVW", colors: ["#009036", "#FFFFFF"], file: "bremen.png" },
      { slug: "schalke",       name: "FC Schalke 04",         short: "Schalke 04",       abbr: "S04", colors: ["#004C9B", "#FFFFFF"], file: "schalke.png" },
      { slug: "elversberg",    name: "SV Elversberg",         short: "Elversberg",       abbr: "SVE", colors: ["#000000", "#1C63B7"], file: "elversberg.png" },
      { slug: "paderborn",     name: "SC Paderborn 07",       short: "Paderborn",        abbr: "SCP", colors: ["#00509F", "#000000"], file: "paderborn.png" },
    ]
  },

  "2bundesliga": {
    label: "2. Bundesliga",
    folder: "logos/2. Bundesliga",
    promptLabel: "Welcher Verein ist das?",
    completeText: "Du kennst jetzt alle Wappen der 2. Bundesliga!",
    clubs: [
      { slug: "magdeburg",       name: "1. FC Magdeburg",        short: "Magdeburg",        abbr: "FCM", colors: ["#004B93", "#FFFFFF"], file: "1-fc-magdeburg-logo-footylogos.png" },
      { slug: "bielefeld",       name: "Arminia Bielefeld",      short: "Bielefeld",        abbr: "DSC", colors: ["#000000", "#4A90D9"], file: "arminia-bielefeld-logo-footylogos.png" },
      { slug: "dresden",         name: "Dynamo Dresden",         short: "Dynamo Dresden",   abbr: "SGD", colors: ["#F7CF00", "#000000"], file: "dynamo-dresden-logo-footylogos.png" },
      { slug: "braunschweig",    name: "Eintracht Braunschweig", short: "Braunschweig",     abbr: "EBS", colors: ["#F6A800", "#0A2B6B"], file: "eintracht-braunschweig-logo-footylogos.png" },
      { slug: "cottbus",         name: "Energie Cottbus",        short: "Energie Cottbus",  abbr: "FCE", colors: ["#E2001A", "#FFFFFF"], file: "energie-cottbus-logo-footylogos.png" },
      { slug: "heidenheim",      name: "1. FC Heidenheim",       short: "Heidenheim",       abbr: "FCH", colors: ["#C8102E", "#0A2C56"], file: "fc-heidenheim-logo-footylogos.png" },
      { slug: "kaiserslautern",  name: "1. FC Kaiserslautern",   short: "Kaiserslautern",   abbr: "FCK", colors: ["#C8102E", "#FFFFFF"], file: "fc-kaiserslautern-logo-footylogos.png" },
      { slug: "nuernberg",       name: "1. FC Nürnberg",         short: "Nürnberg",         abbr: "FCN", colors: ["#8B1538", "#000000"], file: "fc-nurnberg-logo-footylogos.png" },
      { slug: "stpauli",         name: "FC St. Pauli",           short: "St. Pauli",        abbr: "FCS", colors: ["#5B3A29", "#FFFFFF"], file: "fc-st-pauli-logo-footylogos.png" },
      { slug: "hannover",        name: "Hannover 96",            short: "Hannover 96",      abbr: "H96", colors: ["#00843D", "#000000"], file: "hannover-96-logo-footylogos.png" },
      { slug: "hertha",          name: "Hertha BSC",             short: "Hertha BSC",       abbr: "BSC", colors: ["#004B9B", "#FFFFFF"], file: "hertha-bsc-logo-footylogos.png" },
      { slug: "kiel",            name: "Holstein Kiel",          short: "Holstein Kiel",    abbr: "KSV", colors: ["#00447C", "#E2001A"], file: "holstein-kiel-logo-footylogos.png" },
      { slug: "karlsruhe",       name: "Karlsruher SC",          short: "Karlsruhe",        abbr: "KSC", colors: ["#0057A8", "#FFFFFF"], file: "karlsruher-sc-logo-footylogos.png" },
      { slug: "greutherfuerth",  name: "SpVgg Greuther Fürth",   short: "Greuther Fürth",   abbr: "SGF", colors: ["#00612E", "#FFFFFF"], file: "spvgg-greuther-furth-logo-footylogos.png" },
      { slug: "darmstadt",       name: "SV Darmstadt 98",        short: "Darmstadt 98",     abbr: "SVD", colors: ["#003C78", "#FFFFFF"], file: "sv-darmstadt-98-logo-footylogos.png" },
      { slug: "bochum",          name: "VfL Bochum",             short: "Bochum",           abbr: "VFL", colors: ["#004C9E", "#FFFFFF"], file: "vfl-bochum-logo-footylogos.png" },
      { slug: "osnabrueck",      name: "VfL Osnabrück",          short: "Osnabrück",        abbr: "OSN", colors: ["#6A1B6E", "#FFFFFF"], file: "vfl-osnabruck-logo-footylogos.png" },
      { slug: "wolfsburg",       name: "VfL Wolfsburg",          short: "Wolfsburg",        abbr: "WOB", colors: ["#65B32E", "#FFFFFF"], file: "vfl-wolfsburg-logo-footylogos.png" },
    ]
  },

  legenden: {
    label: "Legenden",
    folder: "logos/Legenden",
    promptLabel: "Wer ist das?",
    completeText: "Du kennst jetzt alle Fußball-Legenden!",
    clubs: [
      {
        slug: "beckenbauer", name: "Franz Beckenbauer", short: "Franz Beckenbauer",
        abbr: "FB", colors: ["#DC052D", "#0C1C3D"], file: "beckenbauer.png",
        facts: "Dieser Spieler kommt aus Deutschland und wird „der Kaiser” genannt. Er spielte fast seine ganze Karriere für den FC Bayern München und wurde 1974 mit Deutschland als Kapitän Weltmeister. Als Trainer gewann er den Titel 1990 sogar noch einmal."
      },
      {
        slug: "pele", name: "Pelé", short: "Pelé",
        abbr: "P", colors: ["#FCDF00", "#009739"], file: "pele.png",
        facts: "Dieser Spieler kommt aus Brasilien und gilt für viele als der beste Fußballer aller Zeiten. Fast seine ganze Karriere spielte er für den Verein FC Santos. Mit Brasilien wurde er dreimal Weltmeister: 1958, 1962 und 1970."
      },
      {
        slug: "ronaldinho", name: "Ronaldinho", short: "Ronaldinho",
        abbr: "R10", colors: ["#A50044", "#004D98"], file: "ronaldinho.png",
        facts: "Dieser Spieler kommt aus Brasilien und ist berühmt für seine Tricks und sein Lächeln auf dem Platz. Er spielte unter anderem für den FC Barcelona. Mit Brasilien wurde er 2002 Weltmeister, und 2005 wurde er zum besten Fußballer der Welt gewählt."
      },
      {
        slug: "walter", name: "Fritz Walter", short: "Fritz Walter",
        abbr: "FW", colors: ["#DD0000", "#000000"], file: "walter.webp",
        facts: "Dieser Spieler kommt aus Deutschland und blieb sein ganzes Leben lang bei einem einzigen Verein: dem 1. FC Kaiserslautern. Als Kapitän führte er die deutsche Nationalmannschaft 1954 zum ersten deutschen Weltmeistertitel, dem berühmten „Wunder von Bern”."
      },
      {
        slug: "klose", name: "Miroslav Klose", short: "Miroslav Klose",
        abbr: "MK", colors: ["#0C1C3D", "#DD0000"], file: "klose.png",
        facts: "Dieser Spieler kommt aus Deutschland und ist der beste Torschütze in der Geschichte der Fußball-Weltmeisterschaften. Er spielte unter anderem für Werder Bremen und den FC Bayern München. Mit 16 WM-Toren stellte er 2014 einen neuen Rekord auf, im selben Jahr wurde er mit Deutschland Weltmeister."
      },
      {
        slug: "messi", name: "Lionel Messi", short: "Lionel Messi",
        abbr: "M10", colors: ["#75AADB", "#FFFFFF"], file: "messi.png",
        facts: "Dieser Spieler kommt aus Argentinien und gewann den Ballon d'Or, die Auszeichnung für den besten Fußballer der Welt, rekordverdächtige achtmal. Fast seine ganze Karriere spielte er für den FC Barcelona. Mit Argentinien wurde er 2022 endlich Weltmeister."
      },
      {
        slug: "ronaldo", name: "Cristiano Ronaldo", short: "Cristiano Ronaldo",
        abbr: "CR7", colors: ["#FF0000", "#046A38"], file: "ronaldo.png",
        facts: "Dieser Spieler kommt aus Portugal und gewann den Ballon d'Or fünfmal. Er spielte unter anderem für Manchester United, Real Madrid und Juventus Turin und wurde fünfmal Champions-League-Sieger. Mit Portugal gewann er 2016 die Europameisterschaft."
      },
      {
        slug: "beckham", name: "David Beckham", short: "David Beckham",
        abbr: "DB7", colors: ["#0033A0", "#DA291C"], file: "beckham.png",
        facts: "Dieser Spieler kommt aus England und ist berühmt für seine präzisen Freistöße und Flanken. Er spielte unter anderem für Manchester United und Real Madrid und gewann 1999 mit Manchester United gleich drei große Titel in einem Jahr."
      },
      {
        slug: "buffon", name: "Gianluigi Buffon", short: "Gianluigi Buffon",
        abbr: "GB", colors: ["#0066CC", "#FFFFFF"], file: "buffon.png",
        facts: "Dieser Spieler kommt aus Italien und war einer der besten Torhüter der Fußballgeschichte. Fast seine gesamte Karriere spielte er für Juventus Turin. Mit Italien wurde er 2006 Weltmeister."
      },
      {
        slug: "maradona", name: "Diego Maradona", short: "Diego Maradona",
        abbr: "DM", colors: ["#75AADB", "#FFFFFF"], file: "maradona.png",
        facts: "Dieser Spieler kommt aus Argentinien und gilt für viele als einer der größten Fußballer aller Zeiten. Er spielte unter anderem für den FC Barcelona und den SSC Neapel. Mit Argentinien wurde er 1986 Weltmeister und schoss dabei das berühmte „Jahrhunderttor” gegen England."
      },
    ]
  }
};
