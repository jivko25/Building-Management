import { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageCode } from "@/types/language.types";

interface LanguageContextType {
  appLanguage: LanguageCode;
  invoiceLanguage: LanguageCode;
  setAppLanguage: (lang: LanguageCode) => void;
  setInvoiceLanguage: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  console.log("Current i18n language:", i18n.language);

  const [appLanguage, setAppLang] = useState<LanguageCode>(() => {
    const savedLang = localStorage.getItem("appLanguage") as LanguageCode;
    return savedLang || "en";
  });

  const [invoiceLanguage, setInvoiceLang] = useState<LanguageCode>(() => {
    return (localStorage.getItem("invoiceLanguage") as LanguageCode) || "en";
  });

  useEffect(() => {
    console.log("Changing language to:", appLanguage);
    i18n.changeLanguage(appLanguage);
  }, [appLanguage, i18n]);

  const setAppLanguage = (lang: LanguageCode) => {
    console.log("Setting app language to:", lang);
    setAppLang(lang);
    localStorage.setItem("appLanguage", lang);
  };

  const setInvoiceLanguage = (lang: LanguageCode) => {
    setInvoiceLang(lang);
    localStorage.setItem("invoiceLanguage", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        appLanguage,
        invoiceLanguage,
        setAppLanguage,
        setInvoiceLanguage
      }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
