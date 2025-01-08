//client\src\layouts\Table\TableLayout.tsx
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SidebarButtonClose } from "@/components/Sidebar/SidebarComponents/SidebarButton";
const TableLayout = ({ children }: { children: React.ReactNode }) => {
  console.log("TableLayout rendering");

  return (
    <div className="min-h-screen">
      <div className="flex">
        <SidebarButtonClose />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default TableLayout;
