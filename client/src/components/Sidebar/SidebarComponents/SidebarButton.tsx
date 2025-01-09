//client\src\components\Sidebar\SidebarComponents\SidebarButton.tsx
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

interface SidebarButtonProps extends ButtonProps {
  icon?: LucideIcon;
}

const SidebarButton = ({ icon: Icon, className, children, ...props }: SidebarButtonProps) => {
  return (
    <Button variant="ghost" className={cn("gap-2 justify-start", className)} {...props}>
      {Icon && <Icon size={20} />}
      {children}
    </Button>
  );
};

export default SidebarButton;

export const SidebarButtonClose = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{/* Your button content */}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogClose asChild>
          <div className="cursor-pointer">{/* Your close button content */}</div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
