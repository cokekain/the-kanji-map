# KANJIDIC Vietnamese Data Analysis

## Overview

The `kanjidic_vietnamese` folder contains **10,355 kanji entries** from the KANJIDIC2 database with Vietnamese translations and detailed metadata. This is a Yomichan dictionary format export specifically designed for Vietnamese learners of Japanese.

## Data Structure

Each entry follows this format:
```javascript
[
  kanji,          // [0] The kanji character
  vietnamese,     // [1] Vietnamese readings (Hán Việt + Chinese pinyin)
  kunyomi,        // [2] Japanese kun'yomi reading
  tags,           // [3] Tags (jouyou/jinmeiyou)
  meanings,       // [4] Array of English + Vietnamese definitions
  stats           // [5] Object with 36 metadata fields
]
```

### Example Entry (哀):
```javascript
[
  "哀",
  "ai1 Ai アイ",
  "あわ.れ あわ.れむ かな.しい",
  "jouyou",
  [
    "pathetic",
    "grief",
    "sorrow",
    "pathos",
    "pity",
    "sympathize",
    "ai (9n)<tc> # ai [āi] <tvc> ① Thương. ② Không có mẹ gọi là [b]ai[/b]. ..."
  ],
  {
    "grade": "8",
    "jlpt": "1",
    "freq": "1715",
    "strokes": "7",
    ...
  }
]
```

## Key Findings

### 1. Vietnamese Meanings (Definitions) ⭐ **MAJOR VALUE**

- **Coverage**: 8,646 entries (83.5%) have Vietnamese definitions
- **Content**: Detailed Vietnamese meanings, not just pronunciations
- **Format**: Includes:
  - Direct Vietnamese translations
  - Usage examples with Vietnamese compound words
  - Etymology and historical context in Vietnamese
  - Different senses numbered ①②③
  - Literary usage marked as (văn)
  - Regional usage marked as (đph)

**Coverage for Our Kanji**:
- Jōyō: 1,947 / 2,136 (91.2%) have Vietnamese meanings
- Jinmeiyō: 762 / 863 (88.3%) have Vietnamese meanings

### 2. Metadata Fields (36 total)

Available reference codes and indices:
- `grade`: School grade level (1-10)
- `jlpt`: JLPT level (1-5)
- `freq`: Frequency ranking (lower = more common)
- `strokes`: Stroke count
- `heisig`, `heisig6`: Remembering the Kanji indices
- `henshall`, `henshall3`: A Guide to Remembering Japanese Characters
- `kodansha_compact`: Kodansha Compact Kanji Guide
- `nelson_c`, `nelson_n`: Nelson dictionaries
- `skip`: SKIP classification system
- `moro`: Morohashi Daikanwajiten index
- Plus 20+ more dictionary references

### 3. Coverage Statistics

- **Total entries**: 10,355 kanji
- **Overlap with our database**: 6,495 / 6,612 (98.2%)
- **Missing Hán Việt readings we could add**: 2,740 kanji

## Comparison with Current Implementation

### What We Have Now:
- ✅ Hán Việt readings (pronunciations): 3,759 kanji (56.9%)
- ✅ Vietnamese readings in examples
- ✅ Vietnamese labels in 2D/3D graphs
- ❌ No Vietnamese meanings/definitions
- ❌ No JLPT/frequency metadata

### What KANJIDIC Vietnamese Offers:
- ✅ Vietnamese definitions: 8,646 kanji (83.5% of KANJIDIC entries)
- ✅ Rich metadata (JLPT, frequency, dictionary indices)
- ✅ Additional Hán Việt readings: 2,740 more kanji
- ✅ Usage examples in Vietnamese context

## Recommendations

### Priority 1: Add Vietnamese Meanings (High Impact) ⭐⭐⭐

**Value**: Transforms the app from "pronunciation helper" to "full Vietnamese dictionary"

**Implementation**:
1. Parse Vietnamese definitions from meanings array
2. Add `vietnameseMeaning?: string[]` field to KanjiInfo type
3. Display in kanji info panel when language === "vi"
4. Clean up formatting (remove markup tags like `<tc>`, `[b]`, etc.)
5. Format numbered definitions properly

**Expected Coverage**:
- 91.2% of Jōyō kanji
- 88.3% of Jinmeiyō kanji
- Much more useful than English meanings for Vietnamese learners

**Example Output**:
```
哀 (ai)
Vietnamese Meaning:
① Thương (sympathize)
② Buồn (sad, grief)
③ Không có mẹ gọi là ai (orphaned from mother)
```

### Priority 2: Add JLPT/Frequency Metadata (Medium Impact) ⭐⭐

**Value**: Helps learners prioritize which kanji to study

**Implementation**:
1. Extract `jlpt`, `freq`, `grade` fields from stats
2. Add to kanji JSON files
3. Display badges in kanji info panel
4. Add filtering in search: "Show only JLPT N3", "Sort by frequency"

**Use Cases**:
- "I need to learn JLPT N2 kanji" → Filter shows only N2 kanji
- "What are the most common kanji?" → Sort by frequency
- "Show beginner kanji" → Filter by grade 1-3

### Priority 3: Fill Missing Hán Việt Readings (Low Impact) ⭐

**Value**: Incremental improvement to reading coverage

**Implementation**:
- Parse Vietnamese readings from field [1]
- Extract Hán Việt (uppercase Vietnamese letters)
- Add to 2,740 kanji currently without readings

**Note**: Unihan already covers most important kanji, so this is nice-to-have

## Sample Vietnamese Definitions

### 娃 (oa, wá)
```
① Gái đẹp (beautiful woman)
② Tục gọi trẻ con là "oa oa" (colloquially refers to children)
③ Động vật mới đẻ: 豬娃 Lợn con (newborn animals: piglet)
```

### 阿 (a, á)
```
① Cái đống lớn, cái gò to (large mound, big hill)
② Tựa - nương tựa được (support, rely on)
③ A dua (flatter, fawn upon)
④ Bờ bên nước (riverbank)
⑤ Tiếng đặt ở trước câu: 阿哥 Anh ơi! (prefix: Brother!)
```

## Technical Considerations

### Data Format Challenges:
1. **Mixed content**: Meanings array contains both English and Vietnamese
2. **Markup**: Vietnamese content uses special tags `<tc>`, `<tvc>`, `[b]...[/b]`
3. **Parsing**: Need to extract and clean Vietnamese definitions
4. **File size**: Adding definitions will increase JSON file sizes

### Recommended Data Structure:
```typescript
type KanjiInfo = {
  id: string;
  kanjialiveData?: any;
  jishoData?: KanjiParseResult | null;
  hanviet?: string[];
  vietnameseMeaning?: string[];  // NEW: Array of definition lines
  jlpt?: string;                  // NEW: "1" to "5"
  frequency?: string;             // NEW: Ranking number (lower = more common)
  grade?: string;                 // NEW: School grade level
};
```

## Implementation Steps

### Step 1: Extract Vietnamese Meanings
```javascript
// Parse Vietnamese content from meanings array
const extractVietnameseMeaning = (meanings) => {
  const vietnameseMeanings = meanings
    .filter(m => m.includes('<tc>') || /[\u00C0-\u1EF9]/.test(m))
    .map(m => {
      // Remove markup tags
      let clean = m
        .replace(/<[^>]+>/g, '')
        .replace(/\[b\]/g, '')
        .replace(/\[\/b\]/g, '');

      // Extract Vietnamese definitions (after # symbol)
      const parts = clean.split('#');
      return parts.slice(1).join(' ').trim();
    });

  return vietnameseMeanings;
};
```

### Step 2: Create Preprocessing Script
- Read kanjidic_vietnamese JSON files
- For each kanji in our database:
  - Extract Vietnamese meanings
  - Extract JLPT, frequency, grade
  - Update kanji JSON file
- Update searchlist.json

### Step 3: Update UI Components
- Modify [kanji.tsx](src/components/kanji.tsx) to display Vietnamese meanings
- Add metadata badges (JLPT, frequency)
- Add search filters for JLPT/grade

## Conclusion

The `kanjidic_vietnamese` folder contains a **treasure trove** of Vietnamese linguistic data that can dramatically improve the app for Vietnamese learners. The most valuable addition would be the **Vietnamese definitions** (91% coverage of Jōyō kanji), which would make this a true Vietnamese-Japanese kanji dictionary, not just a pronunciation guide.

**Estimated Impact**:
- **High value**: Vietnamese meanings → Transforms user experience
- **Medium value**: JLPT/frequency metadata → Improves learning workflow
- **Low value**: Additional Hán Việt readings → Incremental improvement

**Recommended Next Action**: Implement Vietnamese meanings extraction and display as Priority 1 feature.
