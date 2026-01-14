import * as fs from "fs";
import * as path from "path";

// Load KANJIDIC Vietnamese data
const kanjiBank1 = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../kanjidic_vietnamese/kanji_bank_1.json"),
    "utf8"
  )
);

const kanjiBank2 = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../kanjidic_vietnamese/kanji_bank_2.json"),
    "utf8"
  )
);

// Combine both banks
const allKanjidicEntries = [...kanjiBank1, ...kanjiBank2];

// Create a map for quick lookup: kanji -> entry
const kanjidicMap = new Map();
for (const entry of allKanjidicEntries) {
  const kanji = entry[0]; // First element is the kanji character
  kanjidicMap.set(kanji, entry);
}

console.log(
  `Loaded ${allKanjidicEntries.length.toLocaleString()} entries from KANJIDIC Vietnamese`
);

// Parse Vietnamese content from meanings array
const extractVietnameseMeaning = (meanings: string[]): string[] | null => {
  const vietnameseMeanings = meanings
    .filter(
      (m) =>
        m.includes("<tc>") || // Vietnamese content marker
        m.includes("①") || // Vietnamese definition format
        m.includes("(văn)") || // Vietnamese "văn" marker
        m.includes("(đph)") || // Vietnamese "đại phương" marker
        /[\u00C0-\u1EF9]/.test(m) // Vietnamese diacritics
    )
    .map((m) => {
      // Remove markup tags
      let clean = m
        .replace(/<[^>]+>/g, "")
        .replace(/\[b\]/g, "")
        .replace(/\[\/b\]/g, "");

      // Extract Vietnamese definitions (after # symbol)
      const parts = clean.split("#");

      // If there's content after #, use that; otherwise use the whole cleaned string
      if (parts.length > 1) {
        return parts.slice(1).join(" ").trim();
      }

      return clean.trim();
    })
    .filter((m) => m.length > 0);

  return vietnameseMeanings.length > 0 ? vietnameseMeanings : null;
};

// Extract Hán Việt readings from the vietnamese field
const extractHanvietReadings = (vietnameseField: string): string[] | null => {
  // Vietnamese field format: "ai1 Ai アイ"
  // We want the capitalized Vietnamese letters (e.g., "Ai")
  // Vietnamese letters can have diacritics and are typically capitalized

  const parts = vietnameseField.split(/\s+/);
  const hanvietReadings: string[] = [];

  for (const part of parts) {
    // Check if it's Vietnamese (has Vietnamese diacritics or is Latin letters, but not pinyin numbers or katakana)
    if (
      /^[A-ZĂÂĐÊÔƠƯa-zăâđêôơư\u00C0-\u1EF9]+$/.test(part) && // Vietnamese/Latin characters
      !/^\d/.test(part) && // Not starting with number (not pinyin)
      !/^[ァ-ヴ]+$/.test(part) && // Not katakana
      part.length > 1 && // More than 1 character
      /[A-ZĂÂĐÊÔƠƯ\u00C0-\u1EF9]/.test(part) // Has uppercase or Vietnamese diacritics
    ) {
      hanvietReadings.push(part.toLowerCase());
    }
  }

  return hanvietReadings.length > 0 ? hanvietReadings : null;
};

// Process all kanji files
const kanjiDir = path.join(__dirname, "../data/kanji");
const files = fs.readdirSync(kanjiDir).filter((f) => f.endsWith(".json"));

let processedCount = 0;
let vietnameseMeaningsAdded = 0;
let hanvietAdded = 0;
let jlptAdded = 0;
let frequencyAdded = 0;
let gradeAdded = 0;

console.log(`\nProcessing ${files.length.toLocaleString()} kanji files...\n`);

for (const file of files) {
  const filePath = path.join(kanjiDir, file);

  // Read the kanji file
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const kanji = data.id;

  // Look up in KANJIDIC
  const kanjidicEntry = kanjidicMap.get(kanji);

  if (kanjidicEntry) {
    let updated = false;

    // Structure: [kanji, vietnamese, kunyomi, tags, meanings, stats]
    const [, vietnameseField, , , meanings, stats] = kanjidicEntry;

    // Extract Vietnamese meanings
    const vietnameseMeaning = extractVietnameseMeaning(meanings);
    if (vietnameseMeaning) {
      data.vietnameseMeaning = vietnameseMeaning;
      vietnameseMeaningsAdded++;
      updated = true;
    }

    // Extract additional Hán Việt readings if we don't have any
    if (!data.hanviet || data.hanviet.length === 0) {
      const hanvietReadings = extractHanvietReadings(vietnameseField);
      if (hanvietReadings) {
        data.hanviet = hanvietReadings;
        hanvietAdded++;
        updated = true;
      }
    }

    // Extract metadata
    if (stats.jlpt) {
      data.jlpt = stats.jlpt;
      jlptAdded++;
      updated = true;
    }

    if (stats.freq) {
      data.frequency = stats.freq;
      frequencyAdded++;
      updated = true;
    }

    if (stats.grade) {
      data.grade = stats.grade;
      gradeAdded++;
      updated = true;
    }

    // Write back if updated
    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      processedCount++;
    }
  }
}

console.log("=== Processing Complete ===\n");
console.log(`Total files processed: ${processedCount.toLocaleString()}`);
console.log(`\nData added:`);
console.log(`  Vietnamese meanings: ${vietnameseMeaningsAdded.toLocaleString()}`);
console.log(`  Hán Việt readings: ${hanvietAdded.toLocaleString()}`);
console.log(`  JLPT levels: ${jlptAdded.toLocaleString()}`);
console.log(`  Frequency rankings: ${frequencyAdded.toLocaleString()}`);
console.log(`  Grade levels: ${gradeAdded.toLocaleString()}`);

// Show some examples
console.log("\n=== Sample Results ===\n");

const sampleKanji = ["哀", "娃", "阿", "一", "愛"];
for (const k of sampleKanji) {
  const filePath = path.join(kanjiDir, `${k}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    console.log(`${k}:`);
    if (data.hanviet) {
      console.log(`  Hán Việt: ${data.hanviet.join(", ")}`);
    }
    if (data.vietnameseMeaning) {
      console.log(`  Vietnamese meanings:`);
      data.vietnameseMeaning.forEach((m: string, i: number) => {
        const preview = m.length > 80 ? m.substring(0, 80) + "..." : m;
        console.log(`    ${i + 1}. ${preview}`);
      });
    }
    if (data.jlpt) {
      console.log(`  JLPT: N${data.jlpt}`);
    }
    if (data.frequency) {
      console.log(`  Frequency: #${data.frequency}`);
    }
    if (data.grade) {
      console.log(`  Grade: ${data.grade}`);
    }
    console.log("");
  }
}
