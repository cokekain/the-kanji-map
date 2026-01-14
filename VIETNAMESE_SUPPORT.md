# Vietnamese Language Support (Hán Việt)

This document describes the Vietnamese language support added to The Kanji Map.

## Overview

Vietnamese language support has been added, displaying **Hán Việt** readings for kanji characters. Hán Việt (漢越) is the Vietnamese pronunciation system for Chinese characters, similar to Japanese On'yomi readings.

## Data Source

Vietnamese readings are sourced from: https://github.com/duongnamphuong/Kanji

- **Coverage**: 2,231 kanji characters have Hán Việt readings
- **Format**: Vietnamese pronunciations with proper diacritical marks (e.g., "nhất", "đinh", "thất")

## Implementation

### 1. Data Files

- **`/data/hanviet.json`**: Master mapping of kanji characters to their Hán Việt readings
  - Format: `{ "kanji": ["reading1", "reading2"] }`
  - Example: `{ "一": ["nhất"], "与": ["dữ", "dự"] }`

### 2. Type Definitions

Updated `global.d.ts`:
```typescript
type KanjiInfo = {
  id: string;
  kanjialiveData?: any;
  jishoData?: KanjiParseResult | null;
  hanviet?: string[]; // Added for Vietnamese support
};
```

### 3. Preprocessing Scripts

- **`preprocess/4_add_hanviet.ts`**: Merges Hán Việt data into individual kanji JSON files
- **`preprocess/5_add_hanviet_to_searchlist.ts`**: Adds Hán Việt to search index

Run these scripts after updating the main data:
```bash
npx tsx preprocess/4_add_hanviet.ts
npx tsx preprocess/5_add_hanviet_to_searchlist.ts
```

### 4. Language State Management

- **`src/lib/language-store.tsx`**: Jotai atom for language selection with localStorage persistence
- Supported languages: English ("en"), Vietnamese ("vi")

### 5. UI Components

#### Language Switcher (`src/components/language-switcher.tsx`)
- Dropdown menu in header
- Shows flag emoji and language name
- Persists selection to localStorage

#### Kanji Display (`src/components/kanji.tsx`)
- Displays Hán Việt reading when Vietnamese language is selected
- Shows after Onyomi reading
- Format: "Hán Việt: **nhất**"

#### Search (`src/components/search-input.tsx`)
- Filters by Hán Việt when Vietnamese is selected
- Displays Hán Việt in search results (highlighted in primary color)
- Shows below kunyomi, above meaning

## Usage

1. **Switch Language**: Click the language dropdown in the header (🇬🇧/🇻🇳)
2. **View Kanji**: Navigate to any kanji page - Hán Việt reading appears in the info panel
3. **Search**: Type Hán Việt readings in the search box (e.g., "nhất" finds "一")

## Examples

| Kanji | Hán Việt | English Meaning |
|-------|----------|-----------------|
| 一 | nhất | one |
| 二 | nhị | two |
| 三 | tam | three |
| 四 | tứ | four |
| 五 | ngũ | five |
| 六 | lục | six |
| 七 | thất | seven |
| 八 | bát | eight |
| 九 | cửu | nine |
| 十 | thập | ten |

## Notes

- Hán Việt readings are **pronunciations**, not translations
- Some kanji have multiple Hán Việt readings (e.g., "与" → "dữ, dự")
- Not all kanji have Hán Việt data (2,231 out of 6,611 total)
- English meanings remain unchanged - Vietnamese speakers can use English meanings alongside Hán Việt pronunciations

## Future Enhancements

Potential improvements:
- Add Vietnamese translations for meanings (in addition to Hán Việt readings)
- Add Vietnamese radical names
- Translate UI labels to Vietnamese
- Add Vietnamese example words that use these kanji
