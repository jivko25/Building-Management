//client\src\layouts\Home\LayoutHomepage.tsx
import LayoutHeader from "@/layouts/Header/LayoutHeader";

type LayoutHomepageProps = {
  children: React.ReactNode;
};

const LayoutHomepage = ({ children }: LayoutHomepageProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <LayoutHeader />

      <div className="flex-1">{children}</div>
    </div>
  );
};

export default LayoutHomepage;
