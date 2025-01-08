import { createContext, useContext, useEffect, useState } from "react";
import { LanguageCode } from "@/types/language.types";

interface LanguageContextType {
  appLanguage: LanguageCode;
  invoiceLanguage: LanguageCode;
  setAppLanguage: (lang: LanguageCode) => void;
  setInvoiceLanguage: (lang: LanguageCode) => void;
  translate: (text: string) => Promise<string>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("LanguageProvider initializing");

  const [appLanguage, setAppLanguage] = useState<LanguageCode>(() => {
    const savedLang = localStorage.getItem("appLanguage") as LanguageCode;
    console.log("Initial app language:", savedLang || "en");
    return savedLang || "en";
  });

  const [invoiceLanguage, setInvoiceLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem("invoiceLanguage") as LanguageCode) || "en";
  });

  const [isLoading, setIsLoading] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const translate = async (text: string): Promise<string> => {
    if (!text) return text;

    const cacheKey = `${text}_${appLanguage}`;
    if (translations[cacheKey]) {
      return translations[cacheKey];
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          targetLanguage: appLanguage
        }),
        credentials: "include"
      });

      const data = await response.json();
      setTranslations(prev => ({ ...prev, [cacheKey]: data.translatedText }));
      return data.translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  useEffect(() => {
    localStorage.setItem("appLanguage", appLanguage);
  }, [appLanguage]);

  useEffect(() => {
    localStorage.setItem("invoiceLanguage", invoiceLanguage);
  }, [invoiceLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        appLanguage,
        invoiceLanguage,
        setAppLanguage,
        setInvoiceLanguage,
        translate,
        isLoading
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
