import { useLanguage } from "@/context/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/types/language.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import SidebarDesktop from "@/components/Sidebar/SidebarDesktop/SidebarDesktop";
import SidebarMobile from "@/components/Sidebar/SidebarMobile/SidebarMobile";

export const LanguageSettings = () => {
  const { t } = useTranslation();
  const { appLanguage, setAppLanguage } = useLanguage();

  return (
    <div className="flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r">
          <div className="flex h-full flex-col gap-2">
            <div className="flex h-14 items-center border-b px-3 font-semibold">
              <span className="text-lg">ApexCraft</span>
            </div>
            <SidebarDesktop />
          </div>
        </aside>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <div className="flex h-14 items-center gap-4 border-b px-4">
          <SidebarMobile />
          <span className="font-semibold">ApexCraft</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:pl-56">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
