"use client";

import * as React from "react";
import { useLanguage, type Language } from "@/lib/language-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages: { value: Language; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
];

export function LanguageSwitcher() {
  const [language, setLanguage] = useLanguage();

  const currentLanguage = languages.find((lang) => lang.value === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span>{currentLanguage?.flag}</span>
          <span className="hidden sm:inline">{currentLanguage?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => setLanguage(lang.value)}
            className="gap-2"
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
            {language === lang.value && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
