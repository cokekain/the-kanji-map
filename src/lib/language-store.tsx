"use client";

import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type Language = "en" | "vi";

// Store language preference in localStorage
export const languageAtom = atomWithStorage<Language>("language", "en");

export function useLanguage() {
  return useAtom(languageAtom);
}
