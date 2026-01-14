# Vietnamese Font Display Fix

## Issue

Vietnamese text was displaying with distorted diacritics (tone marks). Characters like "đ", "ư", "ơ" and tones like "á", "ả", "ã" were not rendering properly because the default font (Noto Sans JP) doesn't have optimal Vietnamese character support.

### Examples of the Problem:
- "đình chức" was showing as "dinh chuc" (missing diacritics)
- Tone marks were appearing incorrectly or missing entirely

## Solution

Added **Noto Sans** font family which has comprehensive Vietnamese character support, while keeping Noto Sans JP for Japanese text.

## Changes Made

### 1. Layout Font Configuration ([src/app/layout.tsx](src/app/layout.tsx))

**Added Noto Sans with Vietnamese subset:**
```typescript
import { Noto_Sans_JP, Noto_Sans } from "next/font/google";

const notoSans = Noto_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],  // Vietnamese subset!
  display: "swap",
  preload: true,
  variable: "--font-sans",
  adjustFontFallback: false,
});
```

**Updated HTML class to include both fonts:**
```typescript
className={`${notoSans.variable} ${notoSansJp.variable} ${radicalsFont.variable}`}
```

### 2. Component Updates

**Kanji Component ([src/components/kanji.tsx](src/components/kanji.tsx:91-107))**
- Added `font-sans` class to Hán Việt reading display
- Added `font-sans` class to Vietnamese meanings section
- Added `font-sans` class to Vietnamese meanings label

**Examples Component ([src/components/examples.tsx](src/components/examples.tsx))**
- Added `font-sans` class to all Vietnamese reading displays (3 locations)
- Ensures character-by-character readings display correctly

## Font Stack Strategy

The app now uses a multi-font strategy:

1. **Noto Sans** (`--font-sans`): Vietnamese and Latin text
   - Full Vietnamese diacritic support
   - Used for all Vietnamese content

2. **Noto Sans JP** (`--font-sans-jp`): Japanese text
   - Optimized for Japanese characters
   - Used for Japanese content

3. **Japanese Radicals** (`--font-radicals`): Radical characters
   - Custom font for special radical glyphs

## CSS Variables

```css
--font-sans: Noto Sans (Vietnamese + Latin)
--font-sans-jp: Noto Sans JP (Japanese)
--font-radicals: JapaneseRadicals-Regular
```

## Typography Improvements

In addition to the font fix, Vietnamese text also has improved typography:

- **Font size**: `13px` for comfortable reading
- **Line height**: `1.6` for proper spacing with diacritics
- **Margin**: `mb-2` for separation between multiple definitions
- **Font class**: `font-sans` to explicitly use Vietnamese-compatible font

## Result

Vietnamese text now displays correctly with:
- ✅ All diacritics rendering properly (đ, ă, â, ê, ô, ơ, ư)
- ✅ All tone marks displaying correctly (à, á, ả, ã, ạ, etc.)
- ✅ Clean, readable typography
- ✅ Consistent display across all Vietnamese content

### Before:
```
dinh chuc    (missing diacritics)
```

### After:
```
đình chức    (perfect display)
```

## Files Modified

1. [src/app/layout.tsx](src/app/layout.tsx) - Added Noto Sans font
2. [src/components/kanji.tsx](src/components/kanji.tsx) - Applied font-sans class
3. [src/components/examples.tsx](src/components/examples.tsx) - Applied font-sans class

---

**Date**: 2026-01-14
**Status**: ✅ Complete
