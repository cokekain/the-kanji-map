"use client";

import * as React from "react";
import { joyoList } from "@/../data/joyo";
import { jinmeiyoList } from "@/../data/jinmeiyo";
import { KanjiStrokeAnimation } from "./kanji-animation";
import { useLanguage } from "@/lib/language-store";

interface Props {
  kanjiInfo: KanjiInfo | null;
  graphData: BothGraphData | null;
  strokeAnimation: string | null;
  screen?: "mobile" | "desktop";
}

// Helper function to make the clip-path id unique
const makeSvgUnique = (svgContent: string, screen: string): string => {
  // Replace all occurrences of id="something" and href="#something" to make them unique
  return svgContent
    .replace(/id="(\w+)"/g, `id="$1-${screen}"`) // Update ids
    .replace(/href="#(\w+)"/g, `href="#$1-${screen}"`) // Update modern href references
    .replace(/xlink:href="#(\w+)"/g, `xlink:href="#$1-${screen}"`) // Update legacy xlink:href references
    .replace(/clip-path="url\(#(\w+)\)"/g, `clip-path="url(#$1-${screen})"`); // Update clip-path references
};

export const Kanji = ({
  kanjiInfo,
  graphData,
  strokeAnimation,
  screen,
}: Props) => {
  const [language] = useLanguage();

  return (
    <div className="min-h-[330px] relative size-full overflow-hidden grid grid-rows-[36px_100px_1fr] grid-cols-[125px_1fr]">
      <div>
        <h3 className="text-lg font-extrabold">Kanji</h3>
      </div>
      <div className="p-2 w-full h-full overflow-hidden text-sm leading-6 row-span-3">
        {kanjiInfo && joyoList?.includes(kanjiInfo.id) && (
          <p>
            <strong>Jōyō kanji</strong>
            {kanjiInfo?.jishoData?.taughtIn && (
              <span>
                , Taught in <strong>{kanjiInfo?.jishoData?.taughtIn}</strong>
              </span>
            )}
          </p>
        )}
        {kanjiInfo && jinmeiyoList?.includes(kanjiInfo.id) && (
          <p>Jinmeiyō kanji, used in names</p>
        )}

        {kanjiInfo?.jishoData?.jlptLevel && (
          <p>
            JLPT level: <strong>{kanjiInfo?.jishoData?.jlptLevel}</strong>
          </p>
        )}
        {kanjiInfo?.jishoData?.newspaperFrequencyRank && (
          <p>
            <strong>{kanjiInfo?.jishoData?.newspaperFrequencyRank}</strong> of
            2500 most used kanji in newspapers
          </p>
        )}
        {kanjiInfo?.jishoData?.strokeCount && (
          <p>
            Stroke count: <strong>{kanjiInfo?.jishoData?.strokeCount}</strong>
          </p>
        )}
        {kanjiInfo?.jishoData?.meaning && (
          <>
            <p>
              Meaning: <strong>{kanjiInfo?.jishoData?.meaning}</strong>
            </p>
          </>
        )}
        {kanjiInfo?.jishoData?.kunyomi && (
          <>
            <p>
              Kunyomi: <strong>{kanjiInfo.jishoData.kunyomi.join(", ")}</strong>
            </p>
          </>
        )}
        {kanjiInfo?.jishoData?.onyomi && (
          <>
            <p>
              Onyomi: <strong>{kanjiInfo.jishoData.onyomi.join(", ")}</strong>
            </p>
          </>
        )}
        {language === "vi" && kanjiInfo?.hanviet && kanjiInfo.hanviet.length > 0 && (
          <>
            <p className="font-sans">
              Hán Việt: <strong>{kanjiInfo.hanviet.join(", ")}</strong>
            </p>
          </>
        )}
        {language === "vi" && kanjiInfo?.vietnameseMeaning && kanjiInfo.vietnameseMeaning.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold font-sans">Nghĩa tiếng Việt:</p>
            <div className="pl-2 text-primary text-[13px] leading-[1.6] font-sans">
              {kanjiInfo.vietnameseMeaning.map((meaning, index) => (
                <p key={index} className="mb-2">
                  {meaning}
                </p>
              ))}
            </div>
          </div>
        )}
        {language === "vi" && (kanjiInfo?.jlpt || kanjiInfo?.frequency || kanjiInfo?.grade) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {kanjiInfo.jlpt && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary">
                JLPT N{kanjiInfo.jlpt}
              </span>
            )}
            {kanjiInfo.frequency && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-secondary/50 text-foreground">
                Tần suất: #{kanjiInfo.frequency}
              </span>
            )}
            {kanjiInfo.grade && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-muted text-foreground">
                Cấp {kanjiInfo.grade}
              </span>
            )}
          </div>
        )}

        {graphData?.noOutLinks?.links && (
          <>
            <p>
              {graphData.noOutLinks.links.filter(
                (link: any) => link.target === kanjiInfo?.id
              ).length > 0 && "Composition: "}
              {graphData.noOutLinks.links
                .filter((link: any) => link.target === kanjiInfo?.id)
                .map((link: any) => link.source)
                .map((comp: any, index: number) => (
                  <span key={index}>{comp} </span>
                ))}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col items-center justify-center w-full h-full overflow-hidden [grid-area:'main']">
        <h1 className="text-6xl leading-tight sm:text-5xl">{kanjiInfo?.id}</h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full overflow-hidden">
        {strokeAnimation && (
          <KanjiStrokeAnimation
            svgContent={makeSvgUnique(strokeAnimation, screen ?? "unknown")}
            strokeCount={kanjiInfo?.jishoData?.strokeCount}
          />
        )}
      </div>
    </div>
  );
};
