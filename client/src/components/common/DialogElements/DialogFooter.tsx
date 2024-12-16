//client\src\components\common\DialogElements\DialogFooter.tsx
import { Button } from "@/components/ui/button";
import { DialogFooter as Footer } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DialogFooterProps = {
  isLoading?: boolean | undefined;
  label: string;
  type?: "submit" | "reset" | "button" | undefined;
  formName: string;
  className?: string;
  disabled?: boolean;
};

const DialogFooter = ({ label, type, formName, disabled, className }: DialogFooterProps) => {
  return (
    <Footer>
      <Button disabled={disabled} type={type} form={formName} className={cn("bg-blue-600 hover:bg-blue-800 font-semibold w-full border-none", className)} variant="outline">
        {label}
      </Button>
    </Footer>
  );
};

export default DialogFooter;
