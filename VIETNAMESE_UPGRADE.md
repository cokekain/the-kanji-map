# Vietnamese Coverage Upgrade - Unicode Unihan Integration

## Summary

Successfully integrated the official **Unicode Unihan Database** to dramatically improve Vietnamese (Hán Việt) reading coverage.

## Results

### Overall Coverage
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Total Coverage** | 2,231 kanji (33.7%) | **3,759 kanji (56.9%)** | **+1,528 kanji (+68.5%)** |
| Characters in DB | 6,612 | 6,612 | - |

### Jōyō Kanji (常用漢字)
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Coverage** | 1,950 (91.3%) | **2,046 (95.8%)** | **+96 kanji** |
| Missing | 186 | 90 | **-96 kanji** |

### Jinmeiyō Kanji (人名用漢字)
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Coverage** | 45 (5.2%) | **425 (49.2%)** | **+380 kanji** |
| Missing | 818 | 438 | **-380 kanji** |

## Data Source

**Unicode Unihan Database v17.0.0**
- Source: https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip
- File: `Unihan_Readings.txt`
- Field: `kVietnamese`
- Total Vietnamese readings: 8,306 characters
- Applied to project: 3,759 kanji

## Key Improvements

1. **Jōyō Coverage**: Now at **95.8%** - nearly complete coverage of daily-use kanji
2. **Jinmeiyō Coverage**: Jumped from 5.2% to **49.2%** - massive improvement for name-use kanji
3. **Overall Coverage**: From 33.7% to **56.9%** - well over half of all kanji now have Vietnamese readings

## Remaining Gaps

### Missing Jōyō Kanji (90 total)
Most are:
- Recently added to Jōyō list
- Uncommon or specialized characters
- May not have standardized Vietnamese readings

Sample: 挨 嵐 萎 椅 彙 茨 唄 鬱 媛 艶 岡 臆 苛 楷 顎 葛 釜 韓 畿 嗅

### Missing Jinmeiyō Kanji (438 total)
Many are:
- Rare name-use characters
- Historical or variant forms
- Not commonly used in Vietnamese contexts

## Technical Details

### Data Merge Process
1. Downloaded Unicode Unihan database (Unihan.zip)
2. Extracted Vietnamese readings from `Unihan_Readings.txt`
3. Parsed 8,306 `kVietnamese` entries
4. Merged with existing data from duongnamphuong/Kanji database
5. Updated 3,759 kanji JSON files
6. Updated search index with new readings

### Data Quality
- **Original source**: 2,232 characters (duongnamphuong/Kanji)
- **Unihan source**: 8,306 characters
- **Merged total**: 9,128 unique characters in hanviet.json
- **Conflicts resolved**: 239 characters had readings from both sources - merged all unique readings
- **New additions**: 6,896 characters added from Unihan

### File Updates
- `data/hanviet.json`: Updated with 9,128 character mappings
- `data/kanji/*.json`: 3,759 files updated with `hanviet` field
- `data/searchlist.json`: 3,759 entries updated with Vietnamese search support

## Usage Impact

Vietnamese learners can now:
- ✅ See Vietnamese readings for **95.8%** of all Jōyō kanji
- ✅ See Vietnamese readings for **49.2%** of all Jinmeiyō kanji
- ✅ Search by Vietnamese readings for 3,759 kanji
- ✅ View Vietnamese in 2D and 3D graphs
- ✅ Access comprehensive Vietnamese support for daily study

## Credits

- **Unicode Consortium**: Unihan Database
- **duongnamphuong**: Initial Vietnamese kanji database
- **Unicode Standard**: Authoritative source for CJK character data
