// Add Vietnamese Hán Việt readings to existing kanji data files
import fs from "fs";
import path from "path";

const hanvietMappings: Record<string, string[]> = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "hanviet.json"), "utf8")
);

const kanjiDir = path.join(process.cwd(), "data", "kanji");
const kanjiFiles = fs.readdirSync(kanjiDir).filter((f) => f.endsWith(".json"));

let updatedCount = 0;
let skippedCount = 0;

console.log(`Processing ${kanjiFiles.length} kanji files...`);

for (const file of kanjiFiles) {
  const filePath = path.join(kanjiDir, file);
  const kanjiData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const kanji = kanjiData.id;

  if (hanvietMappings[kanji]) {
    kanjiData.hanviet = hanvietMappings[kanji];
    fs.writeFileSync(filePath, JSON.stringify(kanjiData, null, 2));
    updatedCount++;

    if (updatedCount <= 10) {
      console.log(`  ✓ ${kanji}: ${hanvietMappings[kanji].join(", ")}`);
    }
  } else {
    skippedCount++;
  }
}

console.log(`\nCompleted!`);
console.log(`  Updated: ${updatedCount} files`);
console.log(`  Skipped (no Hán Việt data): ${skippedCount} files`);
