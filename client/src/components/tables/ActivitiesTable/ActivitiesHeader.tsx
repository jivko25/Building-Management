//client\src\components\tables\ActivitiesTable\ActivitiesHeader.tsx
import TableHeader, { HeaderItems } from "@/components/common/TableElements/TableHeader";
import { useTranslation } from "react-i18next";

const ActivitiesHeader = () => {
  const { t } = useTranslation();

  const activityHeaders: HeaderItems[] = [
    {
      key: "activity",
      label: t("Activity"),
      width: "w-20rem",
      align: "left"
    },
    {
      key: "options",
      label: t("Options"),
      width: "w-12.5rem",
      align: "right"
    }
  ];

  return <TableHeader headers={activityHeaders} />;
};

export default ActivitiesHeader;
