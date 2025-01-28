//client\src\components\Sidebar\SidebarComponents\SidebarUserDropdown.tsx
import { PopoverContent } from "@/components/ui/popover";
import { Link, useNavigate } from "react-router-dom";
import SidebarButton from "./SidebarButton";
import { sidebarUserItems } from "./sidebarItems";
import { Separator } from "@/components/ui/separator";
// import { useTheme } from "@/context/ThemeContext";
// import { Switch } from "@/components/ui/switch";
import { PopoverClose } from "@radix-ui/react-popover";
// import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/config";
const SidebarUserDropdown = () => {
  // const { theme, setTheme } = useTheme();
  // const [isChecked, setIsChecked] = useState<boolean>(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  console.log("Current translation key 'signOut':", t("signOut"));
  console.log("Current translation key 'settings':", t("settings"));
  console.log("Current language:", i18n.language);

  const handleLogoutClick = async () => {
    await logout();
  };

  // const themeToggleHandler = () => {
  //   if (theme === "dark") {
  //     setTheme("light");
  //   } else {
  //     setTheme("dark");
  //   }
  // };

  const handleItemClick = (label: string, href: string) => {
    if (label === t("signOut")) {
      handleLogoutClick();
    } else if (label === t("settings")) {
      navigate(href);
    }
  };

  return (
    <PopoverContent className="w-[180px] p-0">
      <>
        {/* Theme button is off */}
        {/* <div className="flex items-center py-2">
          {theme === "dark" ? <Moon className="h-[1.2rem] w-[1.9rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> : <Sun className="h-[1.2rem] w-[1.9rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />}
          <span className="text-sm pl-1 pr-6">{theme === "dark" ? t("darkMode") : t("lightMode")}</span>
          <PopoverClose asChild>
            <Switch checked={isChecked} onCheckedChange={setIsChecked} onClick={themeToggleHandler} id="dark-mode" />
          </PopoverClose>
        </div> */}
        <Separator />
        {sidebarUserItems.links.map((link, index) => (
          <PopoverClose key={index} asChild>
            <Link to={link.href}>
              <SidebarButton className="w-full p-1.5 text-sm" size="sm" icon={link.icon} onClick={() => handleItemClick(t(link.label), link.href)}>
                {t(link.label)}
              </SidebarButton>
            </Link>
          </PopoverClose>
        ))}
      </>
    </PopoverContent>
  );
};

export default SidebarUserDropdown;
