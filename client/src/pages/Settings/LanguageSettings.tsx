import { useLanguage } from "@/contexts/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/types/language.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export const LanguageSettings = () => {
  console.log("LanguageSettings rendering");

  const { appLanguage, invoiceLanguage, setAppLanguage, setInvoiceLanguage, translate } = useLanguage();
  console.log("Language context values:", { appLanguage, invoiceLanguage });

  const [translations, setTranslations] = useState({
    settings: "",
    languageSettings: "",
    appLanguage: "",
    invoiceLanguage: ""
  });

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        console.log("Loading translations...");
        const [settings, langSettings, appLang, invLang] = await Promise.all([translate("Settings"), translate("Language Settings"), translate("App Language"), translate("Invoice Language")]);

        console.log("Translations loaded:", { settings, langSettings, appLang, invLang });

        setTranslations({
          settings,
          languageSettings: langSettings,
          appLanguage: appLang,
          invoiceLanguage: invLang
        });
      } catch (error) {
        console.error("Error loading translations:", error);
        // Use fallback values
        setTranslations({
          settings: "Settings",
          languageSettings: "Language Settings",
          appLanguage: "App Language",
          invoiceLanguage: "Invoice Language"
        });
      }
    };

    loadTranslations();
  }, [translate]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{translations.settings}</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{translations.languageSettings}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{translations.appLanguage}</Label>
              <Select value={appLanguage} onValueChange={value => setAppLanguage(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{translations.invoiceLanguage}</Label>
              <Select value={invoiceLanguage} onValueChange={value => setInvoiceLanguage(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
