import * as fs from "fs";
import * as path from "path";

// Clean Vietnamese meanings to make them more readable
const cleanVietnameseMeaning = (meanings: string[]): string[] => {
  return meanings.map((meaning) => {
    let cleaned = meaning;

    // Remove pinyin/romanization in square brackets (e.g., [chéng], [zhěng])
    cleaned = cleaned.replace(/\s*\[[^\]]+\]\s*/g, " ");

    // Remove Chinese pinyin patterns with numbers (e.g., "chéng", "zhěng")
    // These are followed by numbered definitions, so we want to keep those
    cleaned = cleaned.replace(/^[a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]+\s+/i, "");

    // Remove standalone pinyin words at the start (words before first ①)
    const firstNumberedDef = cleaned.indexOf("①");
    if (firstNumberedDef > 0) {
      const beforeNumbered = cleaned.substring(0, firstNumberedDef);
      // If the text before ① is mostly Latin characters (pinyin), remove it
      const latinRatio = (beforeNumbered.match(/[a-z]/gi) || []).length / beforeNumbered.length;
      if (latinRatio > 0.5) {
        cleaned = cleaned.substring(firstNumberedDef);
      }
    }

    // Clean up multiple spaces
    cleaned = cleaned.replace(/\s+/g, " ");

    // Trim
    cleaned = cleaned.trim();

    return cleaned;
  }).filter(m => m.length > 0);
};

// Process all kanji files
const kanjiDir = path.join(__dirname, "../data/kanji");
const files = fs.readdirSync(kanjiDir).filter((f) => f.endsWith(".json"));

let processedCount = 0;
let cleanedCount = 0;

console.log(`Processing ${files.length.toLocaleString()} kanji files...\n`);

for (const file of files) {
  const filePath = path.join(kanjiDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (data.vietnameseMeaning && data.vietnameseMeaning.length > 0) {
    const originalMeanings = data.vietnameseMeaning;
    const cleanedMeanings = cleanVietnameseMeaning(originalMeanings);

    // Only update if cleaning actually changed something
    if (JSON.stringify(cleanedMeanings) !== JSON.stringify(originalMeanings)) {
      data.vietnameseMeaning = cleanedMeanings;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      cleanedCount++;
    }
    processedCount++;
  }
}

console.log("=== Cleaning Complete ===\n");
console.log(`Files with Vietnamese meanings: ${processedCount.toLocaleString()}`);
console.log(`Files cleaned: ${cleanedCount.toLocaleString()}`);
console.log(`Files unchanged: ${(processedCount - cleanedCount).toLocaleString()}`);

// Show some examples
console.log("\n=== Sample Results ===\n");

const sampleKanji = ["丞", "愛", "一", "哀"];
for (const k of sampleKanji) {
  const filePath = path.join(kanjiDir, `${k}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (data.vietnameseMeaning) {
      console.log(`${k}:`);
      data.vietnameseMeaning.forEach((m: string, i: number) => {
        const preview = m.length > 120 ? m.substring(0, 120) + "..." : m;
        console.log(`  ${preview}`);
      });
      console.log("");
    }
  }
}
