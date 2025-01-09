import { useLanguage } from "@/contexts/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/types/language.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

export const LanguageSettings = () => {
  const { t } = useTranslation();
  const { appLanguage, invoiceLanguage, setAppLanguage, setInvoiceLanguage } = useLanguage();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t("settings")}</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("languageSettings")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{t("appLanguage")}</Label>
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
              <Label>{t("invoiceLanguage")}</Label>
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
