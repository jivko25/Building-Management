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
    debug: false, //console logs for i18n
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
  })
  .then(() => {
    console.log("i18n initialized successfully");
    console.log("Current language:", i18n.language);
    console.log("Available languages:", i18n.languages);
  });

export default i18n;
