// Add Vietnamese Hán Việt readings to searchlist
import fs from "fs";
import path from "path";

interface SearchEntry {
  k: string; // Kanji character
  r: string; // Reading (Kunyomi)
  m: string; // Meaning
  g: number; // Group
  hv?: string; // Hán Việt reading
}

const hanvietMappings: Record<string, string[]> = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "hanviet.json"), "utf8")
);

const searchListPath = path.join(process.cwd(), "data", "searchlist.json");
const searchList: SearchEntry[] = JSON.parse(
  fs.readFileSync(searchListPath, "utf8")
);

console.log(`Processing ${searchList.length} entries in searchlist...`);

let updatedCount = 0;

for (const entry of searchList) {
  const kanji = entry.k;

  if (hanvietMappings[kanji]) {
    entry.hv = hanvietMappings[kanji].join(", ");
    updatedCount++;

    if (updatedCount <= 10) {
      console.log(`  ✓ ${kanji}: ${entry.hv}`);
    }
  }
}

fs.writeFileSync(searchListPath, JSON.stringify(searchList, null, 2), "utf8");

console.log(`\nCompleted!`);
console.log(`  Updated: ${updatedCount} entries`);
console.log(`  Skipped (no Hán Việt data): ${searchList.length - updatedCount} entries`);
