// Ligen/Kategorien & ihre Einträge (Vereine oder – bei "legenden" – Spieler).
// Jeder Eintrag hat ein "file": der Dateiname des Bildes im jeweiligen
// Ordner unter logos/ (siehe "folder" pro Kategorie).
// "short": angezeigter Name (offizieller Vereinsname) UND Standard-Text
// für die Sprachausgabe, sofern kein "tts" gesetzt ist.
// "tts": optionale abweichende Vorlage für die Sprachausgabe (z. B.
// "Hamburger Äss Fau" statt "Hamburger SV", damit die TTS-Engine es
// nicht wie das englische Wort "Hamburger" ausspricht).
// Single Point of Truth für alle short/tts/facts-Werte: scripts/tts-review.csv
// Farben werden nur für die Platzhalter-Embleme benutzt (falls ein Bild fehlt).
// "facts": optionaler Text, der bei Rundenstart vorgelesen wird (aktuell nur
// bei "legenden" genutzt) – die Hinweise, an denen man die Person erkennt.
// "discoverable": true -> taucht im Entdecken-Modus (Wappen-Sammlung) auf.
const LEAGUES = {
  bundesliga: {
    label: "Bundesliga",
    folder: "logos/Bundesliga",
    promptLabel: "Welcher Verein ist das?",
    completeText: "Du kennst jetzt alle Bundesliga-Wappen!",
    discoverable: true,
    clubs: [
      { slug: "bayern", name: "FC Bayern München", short: "FC Bayern München", abbr: "FCB", colors: ["#DC052D", "#0C1C3D"], file: "bayern.png" },
      { slug: "dortmund", name: "Borussia Dortmund", short: "Borussia Dortmund", abbr: "BVB", colors: ["#FDE100", "#000000"], file: "dortmund.png" },
      { slug: "leipzig", name: "RB Leipzig", short: "RB Leipzig", abbr: "RBL", colors: ["#DD0741", "#FFFFFF"], file: "leipzig.png" },
      { slug: "stuttgart", name: "VfB Stuttgart", short: "VfB Stuttgart", abbr: "VfB", colors: ["#E32219", "#FFFFFF"], file: "stuttgart.png" },
      { slug: "hoffenheim", name: "TSG 1899 Hoffenheim", short: "TSG 1899 Hoffenheim", abbr: "TSG", colors: ["#1C63B7", "#FFFFFF"], file: "hoffenheim.png" },
      { slug: "leverkusen", name: "Bayer 04 Leverkusen", short: "Bayer 04 Leverkusen", abbr: "B04", colors: ["#E32219", "#000000"], file: "leverkusen.png" },
      { slug: "freiburg", name: "SC Freiburg", short: "SC Freiburg", abbr: "SCF", colors: ["#000000", "#E30613"], file: "freiburg.png" },
      { slug: "frankfurt", name: "Eintracht Frankfurt", short: "Eintracht Frankfurt", abbr: "SGE", colors: ["#E1000F", "#000000"], file: "frankfurt.png" },
      { slug: "augsburg", name: "FC Augsburg", short: "FC Augsburg", abbr: "FCA", colors: ["#BA3733", "#00953D"], file: "augsburg.png" },
      { slug: "mainz", name: "1. FSV Mainz 05", short: "1. FSV Mainz 05", tts: "Erster FSV Mainz 05", abbr: "M05", colors: ["#C3141E", "#FFFFFF"], file: "mainz.png" },
      { slug: "union-berlin", name: "1. FC Union Berlin", short: "1. FC Union Berlin", tts: "Erster FC Union Berlin", abbr: "FCU", colors: ["#EB1923", "#FFCC00"], file: "union-berlin.png" },
      { slug: "gladbach", name: "Borussia Mönchengladbach", short: "Borussia Mönchengladbach", abbr: "BMG", colors: ["#000000", "#00953D"], file: "gladbach.png" },
      { slug: "hamburg", name: "Hamburger SV", short: "Hamburger SV", tts: "Hamburger Äss Fau", abbr: "HSV", colors: ["#00224F", "#FFFFFF"], file: "hamburg.png" },
      { slug: "koeln", name: "1. FC Köln", short: "1. FC Köln", tts: "Erster FC Köln", abbr: "FCK", colors: ["#ED1C24", "#FFFFFF"], file: "koeln.png" },
      { slug: "bremen", name: "SV Werder Bremen", short: "SV Werder Bremen", abbr: "SVW", colors: ["#009036", "#FFFFFF"], file: "bremen.png" },
      { slug: "schalke", name: "FC Schalke 04", short: "FC Schalke 04", abbr: "S04", colors: ["#004C9B", "#FFFFFF"], file: "schalke.png" },
      { slug: "elversberg", name: "SV Elversberg", short: "SV Elversberg", abbr: "SVE", colors: ["#000000", "#1C63B7"], file: "elversberg.png" },
      { slug: "paderborn", name: "SC Paderborn 07", short: "SC Paderborn 07", abbr: "SCP", colors: ["#00509F", "#000000"], file: "paderborn.png" },
    ]
  },

  "2bundesliga": {
    label: "2. Bundesliga",
    folder: "logos/2. Bundesliga",
    promptLabel: "Welcher Verein ist das?",
    completeText: "Du kennst jetzt alle Wappen der 2. Bundesliga!",
    discoverable: true,
    clubs: [
      { slug: "magdeburg", name: "1. FC Magdeburg", short: "1. FC Magdeburg", tts: "Erster FC Magdeburg", abbr: "FCM", colors: ["#004B93", "#FFFFFF"], file: "1-fc-magdeburg-logo-footylogos.png" },
      { slug: "bielefeld", name: "Arminia Bielefeld", short: "Arminia Bielefeld", abbr: "DSC", colors: ["#000000", "#4A90D9"], file: "arminia-bielefeld-logo-footylogos.png" },
      { slug: "dresden", name: "Dynamo Dresden", short: "Dynamo Dresden", abbr: "SGD", colors: ["#F7CF00", "#000000"], file: "dynamo-dresden-logo-footylogos.png" },
      { slug: "braunschweig", name: "Eintracht Braunschweig", short: "Eintracht Braunschweig", abbr: "EBS", colors: ["#F6A800", "#0A2B6B"], file: "eintracht-braunschweig-logo-footylogos.png" },
      { slug: "cottbus", name: "Energie Cottbus", short: "Energie Cottbus", abbr: "FCE", colors: ["#E2001A", "#FFFFFF"], file: "energie-cottbus-logo-footylogos.png" },
      { slug: "heidenheim", name: "1. FC Heidenheim", short: "1. FC Heidenheim", tts: "Erster FC Heidenheim", abbr: "FCH", colors: ["#C8102E", "#0A2C56"], file: "fc-heidenheim-logo-footylogos.png" },
      { slug: "kaiserslautern", name: "1. FC Kaiserslautern", short: "1. FC Kaiserslautern", tts: "Erster FC Kaiserslautern", abbr: "FCK", colors: ["#C8102E", "#FFFFFF"], file: "fc-kaiserslautern-logo-footylogos.png" },
      { slug: "nuernberg", name: "1. FC Nürnberg", short: "1. FC Nürnberg", tts: "Erster FC Nürnberg", abbr: "FCN", colors: ["#8B1538", "#000000"], file: "fc-nurnberg-logo-footylogos.png" },
      { slug: "stpauli", name: "FC St. Pauli", short: "FC St. Pauli", tts: "FC Sankt Pauli", abbr: "FCS", colors: ["#5B3A29", "#FFFFFF"], file: "fc-st-pauli-logo-footylogos.png" },
      { slug: "hannover", name: "Hannover 96", short: "Hannover 96", tts: "Hannover sechs und neunzig", abbr: "H96", colors: ["#00843D", "#000000"], file: "hannover-96-logo-footylogos.png" },
      { slug: "hertha", name: "Hertha BSC", short: "Hertha BSC", abbr: "BSC", colors: ["#004B9B", "#FFFFFF"], file: "hertha-bsc-logo-footylogos.png" },
      { slug: "kiel", name: "Holstein Kiel", short: "Holstein Kiel", abbr: "KSV", colors: ["#00447C", "#E2001A"], file: "holstein-kiel-logo-footylogos.png" },
      { slug: "karlsruhe", name: "Karlsruher SC", short: "Karlsruher SC", abbr: "KSC", colors: ["#0057A8", "#FFFFFF"], file: "karlsruher-sc-logo-footylogos.png" },
      { slug: "greutherfuerth", name: "SpVgg Greuther Fürth", short: "SpVgg Greuther Fürth", tts: "Spielvereinigung Greuther Fürth", abbr: "SGF", colors: ["#00612E", "#FFFFFF"], file: "spvgg-greuther-furth-logo-footylogos.png" },
      { slug: "darmstadt", name: "SV Darmstadt 98", short: "SV Darmstadt 98", tts: "SV Darmstadt acht und neunzig", abbr: "SVD", colors: ["#003C78", "#FFFFFF"], file: "sv-darmstadt-98-logo-footylogos.png" },
      { slug: "bochum", name: "VfL Bochum", short: "VfL Bochum", abbr: "VFL", colors: ["#004C9E", "#FFFFFF"], file: "vfl-bochum-logo-footylogos.png" },
      { slug: "osnabrueck", name: "VfL Osnabrück", short: "VfL Osnabrück", abbr: "OSN", colors: ["#6A1B6E", "#FFFFFF"], file: "vfl-osnabruck-logo-footylogos.png" },
      { slug: "wolfsburg", name: "VfL Wolfsburg", short: "VfL Wolfsburg", tts: "Fau Äff L Wolfsburg", abbr: "WOB", colors: ["#65B32E", "#FFFFFF"], file: "vfl-wolfsburg-logo-footylogos.png" },
    ]
  },

  "3liga": {
    label: "3. Liga",
    folder: "logos/3. Liga",
    promptLabel: "Welcher Verein ist das?",
    completeText: "Du kennst jetzt alle Wappen der 3. Liga!",
    discoverable: true,
    clubs: [
      { slug: "duisburg", name: "MSV Duisburg", short: "MSV Duisburg", abbr: "MSV", colors: ["#0060A9", "#000000"], file: "msv-duisburg-logo-footylogos.png" },
      { slug: "saarbruecken", name: "1. FC Saarbrücken", short: "1. FC Saarbrücken", tts: "Erster FC Saarbrücken", abbr: "FCS", colors: ["#F4C300", "#0057A8"], file: "1-fc-saarbrucken-logo-footylogos.png" },
      { slug: "wuerzburg", name: "Würzburger Kickers", short: "Würzburger Kickers", abbr: "WÜK", colors: ["#E2001A", "#000000"], file: "wurzburger-kickers-logo-footylogos.png" },
      { slug: "aachen", name: "Alemannia Aachen", short: "Alemannia Aachen", abbr: "AAC", colors: ["#FFD400", "#00205B"], file: "alemannia-aachen-logo-footylogos.png" },
      { slug: "muenster", name: "Preußen Münster", short: "Preußen Münster", abbr: "SCP", colors: ["#000000", "#FFFFFF"], file: "preussen-munster-logo-footylogos.png" },
      { slug: "rostock", name: "Hansa Rostock", short: "Hansa Rostock", abbr: "FCH", colors: ["#00549F", "#E2001A"], file: "hansa-rostock-logo-footylogos.png" },
      { slug: "mannheim", name: "SV Waldhof Mannheim", short: "SV Waldhof Mannheim", abbr: "SVW", colors: ["#004A99", "#FFFFFF"], file: "waldhof-mannheim-logo-footylogos.png" },
      { slug: "regensburg", name: "SSV Jahn Regensburg", short: "SSV Jahn Regensburg", abbr: "JAH", colors: ["#004B93", "#FFFFFF"], file: "jahn-regensburg-logo-footylogos.png" },
      { slug: "hoffenheim-ii", name: "TSG 1899 Hoffenheim II", short: "TSG 1899 Hoffenheim II", tts: "TSG 1899 Hoffenheim zwei", abbr: "TS2", colors: ["#1C63B7", "#FFFFFF"], file: "hoffenheim-ii.png" },
      { slug: "koeln-viktoria", name: "Viktoria Köln", short: "Viktoria Köln", abbr: "VIK", colors: ["#E2001A", "#000000"], file: "viktoria-koln-logo-footylogos.png" },
      { slug: "stuttgart-ii", name: "VfB Stuttgart II", short: "VfB Stuttgart II", tts: "VfB Stuttgart zwei", abbr: "VF2", colors: ["#E32219", "#FFFFFF"], file: "stuttgart-ii.png" },
      { slug: "meppen", name: "SV Meppen", short: "SV Meppen", abbr: "SVM", colors: ["#00539B", "#FFFFFF"], file: "sv-meppen-logo-footylogos.png" },
      { slug: "grossaspach", name: "SG Sonnenhof Großaspach", short: "SG Sonnenhof Großaspach", abbr: "SGS", colors: ["#00843D", "#FFFFFF"], file: "sg-sonnenhof-grossaspach-logo-footylogos.png" },
      { slug: "essen", name: "Rot-Weiss Essen", short: "Rot-Weiss Essen", abbr: "RWE", colors: ["#E2001A", "#FFFFFF"], file: "rot-weiss-essen-logo-footylogos.png" },
      { slug: "ingolstadt", name: "FC Ingolstadt 04", short: "FC Ingolstadt 04", abbr: "FCI", colors: ["#C8102E", "#FFFFFF"], file: "fc-ingolstadt-logo-footylogos.png" },
      { slug: "koeln-fortuna", name: "SC Fortuna Köln", short: "SC Fortuna Köln", abbr: "SCF", colors: ["#E2001A", "#FFFFFF"], file: "fortuna-koln-logo-footylogos.png" },
      { slug: "havelse", name: "TSV Havelse", short: "TSV Havelse", abbr: "HAV", colors: ["#00843D", "#FFFFFF"], file: "tsv-havelse-logo-footylogos.png" },
      { slug: "duesseldorf", name: "Fortuna Düsseldorf", short: "Fortuna Düsseldorf", abbr: "F95", colors: ["#E2001A", "#FFFFFF"], file: "fortuna-dusseldorf-logo-footylogos.png" },
      { slug: "verl", name: "SC Verl", short: "SC Verl", tts: "SC Wärl", abbr: "SCV", colors: ["#004B93", "#FFFFFF"], file: "sc-verl-logo-footylogos.png" },
      { slug: "wiesbaden", name: "SV Wehen Wiesbaden", short: "SV Wehen Wiesbaden", abbr: "SVWW", colors: ["#004B93", "#E2001A"], file: "sv-wehen-wiesbaden-logo-footylogos.png" },
    ]
  },

  international: {
    label: "International",
    folder: "logos/International",
    promptLabel: "Welcher Verein ist das?",
    completeText: "Du kennst jetzt alle internationalen Top-Vereine!",
    discoverable: true,
    clubs: [
      { slug: "ac-milan", name: "Associazione Calcio Milan", short: "AC Milan", abbr: "ACM", colors: ["#FB090B", "#000000"], file: "ac-milan-logo-footylogos.png" },
      { slug: "ajax", name: "AFC Ajax", short: "Ajax Amsterdam", abbr: "AJA", colors: ["#D2122E", "#FFFFFF"], file: "ajax-logo-1991-2025-footylogos.png" },
      { slug: "arsenal", name: "Arsenal Football Club", short: "FC Arsenal", abbr: "ARS", colors: ["#EF0107", "#FFFFFF"], file: "arsenal-logo-footylogos.png" },
      { slug: "atletico-madrid", name: "Club Atlético de Madrid", short: "Atlético Madrid", abbr: "ATM", colors: ["#CB3524", "#FFFFFF"], file: "atletico-madrid-logo-footylogos.png" },
      { slug: "chelsea", name: "Chelsea Football Club", short: "FC Chelsea", abbr: "CHE", colors: ["#034694", "#FFFFFF"], file: "chelsea-logo-footylogos.png" },
      { slug: "barcelona", name: "Futbol Club Barcelona", short: "FC Barcelona", abbr: "FCB", colors: ["#A50044", "#004D98"], file: "fc-barcelona-logo-footylogos.png" },
      { slug: "basel", name: "Fußballclub Basel 1893", short: "FC Basel", abbr: "BAS", colors: ["#DA291C", "#003DA5"], file: "fc-basel-logo-footylogos.png" },
      { slug: "fenerbahce", name: "Fenerbahçe Spor Kulübü", short: "Fenerbahçe Istanbul", abbr: "FEN", colors: ["#FFED00", "#00296B"], file: "fenerbahce-logo-footylogos.png" },
      { slug: "feyenoord", name: "Feyenoord Rotterdam", short: "Feyenoord Rotterdam", abbr: "FEY", colors: ["#EE1C25", "#FFFFFF"], file: "feyenoord-logo-footylogos.png" },
      { slug: "galatasaray", name: "Galatasaray Spor Kulübü", short: "Galatasaray Istanbul", abbr: "GAL", colors: ["#A6192E", "#FDB913"], file: "galatasaray-logo-footylogos.png" },
      { slug: "inter-miami", name: "Inter Miami Club de Fútbol", short: "Inter Miami CF", abbr: "MIA", colors: ["#F7B5CD", "#231F20"], file: "inter-miami-logo-footylogos.png" },
      { slug: "inter-mailand", name: "Football Club Internazionale Milano", short: "Inter Mailand", abbr: "INT", colors: ["#010E80", "#000000"], file: "inter-milan-logo-footylogos.png" },
      { slug: "juventus", name: "Juventus Football Club", short: "Juventus Turin", abbr: "JUV", colors: ["#000000", "#FFFFFF"], file: "juventus-logo-footylogos.png" },
      { slug: "la-galaxy", name: "Los Angeles Galaxy", short: "LA Galaxy", abbr: "LAG", colors: ["#00245D", "#8CC63F"], file: "la-galaxy-logo-footylogos.png" },
      { slug: "liverpool", name: "Liverpool Football Club", short: "FC Liverpool", abbr: "LIV", colors: ["#C8102E", "#F6EB61"], file: "liverpool-fc-logo-footylogos.png" },
      { slug: "manchester-city", name: "Manchester City Football Club", short: "Manchester City", abbr: "MCI", colors: ["#6CABDD", "#1C2C5B"], file: "manchester-city-logo-footylogos.png" },
      { slug: "manchester-united", name: "Manchester United Football Club", short: "Manchester United", abbr: "MUN", colors: ["#DA291C", "#FBE122"], file: "manchester-united-logo-footylogos.png" },
      { slug: "lyon", name: "Olympique Lyonnais", short: "Olympique Lyon", abbr: "OL", colors: ["#00285E", "#FFFFFF"], file: "olympique-lyonnais-logo-footylogos.png" },
      { slug: "psg", name: "Paris Saint-Germain Football Club", short: "Paris Saint-Germain", abbr: "PSG", colors: ["#004170", "#DA291C"], file: "paris-saint-germain-psg-logo-footylogos.png" },
      { slug: "psv", name: "Philips Sport Vereniging", short: "PSV Eindhoven", abbr: "PSV", colors: ["#ED1C24", "#FFFFFF"], file: "psv-eindhoven-logo-footylogos.png" },
      { slug: "rapid-wien", name: "Sportklub Rapid Wien", short: "SK Rapid Wien", abbr: "RAP", colors: ["#005B31", "#FFFFFF"], file: "rapid-wien-logo-footylogos.png" },
      { slug: "real-madrid", name: "Real Madrid Club de Fútbol", short: "Real Madrid", abbr: "RMA", colors: ["#FEBE10", "#00529F"], file: "real-madrid-logo-footylogos.png" },
      { slug: "salzburg", name: "Fußballclub Red Bull Salzburg", short: "FC Red Bull Salzburg", abbr: "RBS", colors: ["#D50032", "#FFFFFF"], file: "red-bull-salzburg-logo-footylogos.png" },
      { slug: "vancouver-whitecaps", name: "Vancouver Whitecaps Football Club", short: "Vancouver Whitecaps FC", abbr: "VAN", colors: ["#001E62", "#A9D3F5"], file: "vancouver-whitecaps-logo-footylogos.png" },
    ]
  },

  legenden: {
    label: "Legenden",
    folder: "logos/Legenden",
    promptLabel: "Wer ist das?",
    completeText: "Du kennst jetzt alle Fußball-Legenden!",
    cropPosition: "top",
    clubs: [
      { slug: "beckenbauer", name: "Franz Beckenbauer", short: "Franz Beckenbauer", abbr: "FB", colors: ["#DC052D", "#0C1C3D"], file: "beckenbauer.png",
        facts: "Dieser Spieler kommt aus Deutschland und wird „der Kaiser” genannt. Er spielte fast seine ganze Karriere für den FC Bayern München und wurde 1974 mit Deutschland als Kapitän Weltmeister. Als Trainer gewann er den Titel 1990 sogar noch einmal." },
      { slug: "pele", name: "Pelé", short: "Pelé", abbr: "P", colors: ["#FCDF00", "#009739"], file: "pele.png",
        facts: "Dieser Spieler kommt aus Brasilien und gilt für viele als der beste Fußballer aller Zeiten. Fast seine ganze Karriere spielte er für den Verein FC Santos. Mit Brasilien wurde er dreimal Weltmeister: 1958, 1962 und 1970." },
      { slug: "ronaldinho", name: "Ronaldinho", short: "Ronaldinho", abbr: "R10", colors: ["#A50044", "#004D98"], file: "ronaldinho.png",
        facts: "Dieser Spieler kommt aus Brasilien und ist berühmt für seine Tricks und sein Lächeln auf dem Platz. Er spielte unter anderem für den FC Barcelona. Mit Brasilien wurde er 2002 Weltmeister, und 2005 wurde er zum besten Fußballer der Welt gewählt." },
      { slug: "walter", name: "Fritz Walter", short: "Fritz Walter", abbr: "FW", colors: ["#DD0000", "#000000"], file: "walter.webp",
        facts: "Dieser Spieler kommt aus Deutschland und blieb sein ganzes Leben lang bei einem einzigen Verein: dem 1. FC Kaiserslautern. Als Kapitän führte er die deutsche Nationalmannschaft 1954 zum ersten deutschen Weltmeistertitel, dem berühmten „Wunder von Bern”." },
      { slug: "klose", name: "Miroslav Klose", short: "Miroslav Klose", abbr: "MK", colors: ["#0C1C3D", "#DD0000"], file: "klose.png",
        facts: "Dieser Spieler kommt aus Deutschland und ist der beste Torschütze in der Geschichte der Fußball-Weltmeisterschaften. Er spielte unter anderem für Werder Bremen und den FC Bayern München. Mit 16 WM-Toren stellte er 2014 einen neuen Rekord auf, im selben Jahr wurde er mit Deutschland Weltmeister." },
      { slug: "messi", name: "Lionel Messi", short: "Lionel Messi", abbr: "M10", colors: ["#75AADB", "#FFFFFF"], file: "messi.webp",
        facts: "Dieser Spieler kommt aus Argentinien und gewann den Ballon d'Or, die Auszeichnung für den besten Fußballer der Welt, rekordverdächtige achtmal. Fast seine ganze Karriere spielte er für den FC Barcelona. Mit Argentinien wurde er 2022 endlich Weltmeister." },
      { slug: "ronaldo", name: "Cristiano Ronaldo", short: "Cristiano Ronaldo", abbr: "CR7", colors: ["#FF0000", "#046A38"], file: "ronaldo.png",
        facts: "Dieser Spieler kommt aus Portugal und gewann den Ballon d'Or fünfmal. Er spielte unter anderem für Manchester United, Real Madrid und Juventus Turin und wurde fünfmal Champions-League-Sieger. Mit Portugal gewann er 2016 die Europameisterschaft." },
      { slug: "beckham", name: "David Beckham", short: "David Beckham", abbr: "DB7", colors: ["#0033A0", "#DA291C"], file: "beckham.png",
        facts: "Dieser Spieler kommt aus England und ist berühmt für seine präzisen Freistöße und Flanken. Er spielte unter anderem für Manchester United und Real Madrid und gewann 1999 mit Manchester United gleich drei große Titel in einem Jahr." },
      { slug: "buffon", name: "Gianluigi Buffon", short: "Gianluigi Buffon", abbr: "GB", colors: ["#0066CC", "#FFFFFF"], file: "buffon.webp",
        facts: "Dieser Spieler kommt aus Italien und war einer der besten Torhüter der Fußballgeschichte. Fast seine gesamte Karriere spielte er für Juventus Turin. Mit Italien wurde er 2006 Weltmeister." },
      { slug: "maradona", name: "Diego Maradona", short: "Diego Maradona", abbr: "DM", colors: ["#75AADB", "#FFFFFF"], file: "maradona.png",
        facts: "Dieser Spieler kommt aus Argentinien und gilt für viele als einer der größten Fußballer aller Zeiten. Er spielte unter anderem für den FC Barcelona und den SSC Neapel. Mit Argentinien wurde er 1986 Weltmeister und schoss dabei das berühmte „Jahrhunderttor” gegen England." },
    ]
  }
};
