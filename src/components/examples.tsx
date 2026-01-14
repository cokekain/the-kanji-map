"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { CirclePlayIcon } from "lucide-react";
import { useLanguage } from "@/lib/language-store";
import hanvietData from "@/../data/hanviet.json";

export const Examples = ({ kanjiInfo }: { kanjiInfo: KanjiInfo | null }) => {
  const [language] = useLanguage();

  const playSound = (url: string) => {
    const audio = new Audio(url);
    void audio.play();
  };

  // Convert Japanese kanji text to Vietnamese readings
  const toVietnameseReading = (text: string): string => {
    const chars = text.split('');
    const readings: string[] = [];

    for (const char of chars) {
      const hanviet = (hanvietData as Record<string, string[]>)[char];
      if (hanviet && hanviet.length > 0) {
        readings.push(hanviet[0]); // Use first reading
      } else {
        readings.push(char); // Keep original if no Vietnamese reading
      }
    }

    return readings.join(' ');
  };

  const highlightKanji = (text: string) => {
    if (!kanjiInfo) return;
    const textArray = text?.split(kanjiInfo.id);
    return (
      <span>
        {textArray.map((item, index) => (
          <React.Fragment key={index}>
            {item}
            {index !== textArray.length - 1 && <b>{kanjiInfo?.id}</b>}
          </React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <div className="size-full grid grid-rows-[36px_1fr] p-4 mb-14">
      <div>
        <h3 className="text-lg font-extrabold">Examples</h3>
      </div>
      <div>
        {/* KANJIALIVE With AUDIO */}
        {kanjiInfo?.kanjialiveData?.examples && (
          <h5 className="text-foreground/50 text-sm my-2">
            Examples with audio
          </h5>
        )}
        {kanjiInfo?.kanjialiveData?.examples?.map(
          (example: any, index: number) => {
            const vietnameseReading = language === "vi" ? toVietnameseReading(example?.japanese) : null;
            return (
              <div
                className="flex justify-between align-end odd:bg-muted rounded-lg items-center pl-2"
                key={index}
              >
                <div className="flex flex-col py-1">
                  <div>
                    {highlightKanji(example?.japanese)}
                    &nbsp;&nbsp;&nbsp;
                    {example?.meaning?.english}
                  </div>
                  {vietnameseReading && (
                    <div className="text-primary text-sm font-sans">
                      {vietnameseReading}
                    </div>
                  )}
                </div>
                <Button
                  aria-label="Play sound"
                  variant="link"
                  size="icon"
                  onClick={() =>
                    example && example.audio && playSound(example?.audio?.mp3)
                  }
                >
                  <CirclePlayIcon className="size-5" />
                </Button>
              </div>
            );
          }
        )}
        {/* JISHO */}
        {kanjiInfo?.jishoData?.onyomiExamples &&
          kanjiInfo?.jishoData?.onyomiExamples?.length !== 0 && (
            <h5 className="text-foreground/50 text-sm my-2">Onyomi Examples</h5>
          )}
        {kanjiInfo?.jishoData?.onyomiExamples?.map(
          (onExample: any, index: number) => {
            const vietnameseReading = language === "vi" ? toVietnameseReading(onExample?.example) : null;
            return (
              <div
                key={index}
                className="flex justify-between align-end odd:bg-muted rounded-lg items-center p-2"
              >
                <div className="flex flex-col">
                  <div>
                    {highlightKanji(onExample?.example)}
                    {!vietnameseReading && (
                      <>{"  "}（{onExample?.reading}）{"  "}</>
                    )}
                    {onExample?.meaning}
                  </div>
                  {vietnameseReading && (
                    <div className="text-primary text-sm font-sans">
                      {vietnameseReading}
                    </div>
                  )}
                </div>
              </div>
            );
          }
        )}
        {kanjiInfo?.jishoData?.kunyomiExamples &&
          kanjiInfo?.jishoData?.kunyomiExamples?.length !== 0 && (
            <h5 className="text-foreground/50 text-sm my-2">
              Kunyomi Examples
            </h5>
          )}
        {kanjiInfo?.jishoData?.kunyomiExamples?.map(
          (kunExample: any, index: number) => {
            const vietnameseReading = language === "vi" ? toVietnameseReading(kunExample?.example) : null;
            return (
              <div
                key={index}
                className="flex justify-between align-end odd:bg-muted rounded-lg items-center p-2"
              >
                <div className="flex flex-col">
                  <div>
                    {highlightKanji(kunExample?.example)}
                    {!vietnameseReading && (
                      <>{"  "}（{kunExample?.reading}）{"  "}</>
                    )}
                    {kunExample?.meaning}
                  </div>
                  {vietnameseReading && (
                    <div className="text-primary text-sm font-sans">
                      {vietnameseReading}
                    </div>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};
