export type LanguageCode = "en" | "bg" | "ro" | "ru" | "tr" | "pl" | "nl" | "de";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "bg", name: "Bulgarian", nativeName: "Български" },
  { code: "ro", name: "Romanian", nativeName: "Română" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "de", name: "German", nativeName: "Deutsch" }
];
