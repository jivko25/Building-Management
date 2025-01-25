import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  console.log("Rendering 404 page");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-2xl text-muted-foreground mb-8">{t("Page Not Found")}</p>
      <Button onClick={() => navigate("/")} className="px-6 py-2">
        {t("Go Home")}
      </Button>
    </div>
  );
};

export default NotFoundPage;
