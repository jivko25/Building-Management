import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

console.log("Initializing i18n configuration");

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "bg", "ro", "ru", "tr", "pl", "nl", "de"],
    debug: true,
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json"
    },
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
